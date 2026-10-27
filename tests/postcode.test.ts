import assert from "node:assert/strict";
import test from "node:test";
import {
  areaCodesFrom,
  formatPostcode,
  matchCouncils,
  normalisePostcode,
  type CouncilRow,
} from "../supabase/functions/postcode-lookup/logic";
import { parseLookup, roleLabel } from "../lib/postcode-format";

const row = (slug: string, code: string): CouncilRow => ({
  slug,
  name: slug,
  council_type: "district",
  region: null,
  official_code: code,
  logo_url: null,
  logo_type: null,
});

test("postcodes are normalised before lookup and junk is rejected", () => {
  assert.equal(normalisePostcode(" sw1a 1aa "), "SW1A1AA");
  assert.equal(formatPostcode("SW1A1AA"), "SW1A 1AA");
  assert.equal(formatPostcode("M11AE"), "M1 1AE");
  for (const bad of ["", "not a postcode", "SW1A", "SW1A 1AA; drop", 42, null])
    assert.equal(normalisePostcode(bad), null);
});

test("ONS pseudo county codes mean a single-tier area", () => {
  assert.deepEqual(
    areaCodesFrom({ codes: { admin_district: "E09000033", admin_county: "E99999999" } }),
    { district: "E09000033", county: null },
  );
  assert.deepEqual(
    areaCodesFrom({ codes: { admin_district: "E07000240", admin_county: "E10000015" } }),
    { district: "E07000240", county: "E10000015" },
  );
  assert.equal(areaCodesFrom({ codes: { admin_district: "S99999999" } }), null);
  assert.equal(areaCodesFrom(null), null);
});

test("two-tier areas list the county first, then the district", () => {
  const out = matchCouncils({ district: "E07000240", county: "E10000015" }, [
    row("st-albans", "E07000240"),
    row("hertfordshire", "E10000015"),
    row("unrelated", "E06000001"),
  ]);
  assert.deepEqual(out.map((c) => [c.slug, c.role]), [
    ["hertfordshire", "county"],
    ["st-albans", "district"],
  ]);
  assert.equal("official_code" in out[0], false);
});

test("single-tier areas return one council", () => {
  const out = matchCouncils({ district: "S12000036", county: null }, [row("city-of-edinburgh", "S12000036")]);
  assert.deepEqual(out.map((c) => [c.slug, c.role]), [["city-of-edinburgh", "unitary"]]);
  assert.deepEqual(matchCouncils({ district: "E06000001", county: null }, []), []);
});

test("unexpected function replies fall back safely", () => {
  assert.deepEqual(parseLookup(null), { status: "unavailable" });
  assert.deepEqual(parseLookup({ status: "ok" }), { status: "unavailable" });
  assert.deepEqual(parseLookup({ status: "rate_limited" }), { status: "rate_limited" });
  assert.deepEqual(parseLookup({ status: "not_found", postcode: "ZZ99 9ZZ" }), {
    status: "not_found",
    postcode: "ZZ99 9ZZ",
  });
  assert.equal(roleLabel("unitary"), "Your council");
});
