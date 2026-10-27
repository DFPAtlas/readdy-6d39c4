import assert from "node:assert/strict";
import test from "node:test";
import {
  councilHref,
  reviewHref,
  serviceHref,
  safeNext,
  validPostcode,
} from "../lib/navigation";
import { parseDraft } from "../lib/review-draft";
import { canonicalService } from "../lib/services";
test("unexported councils and service slugs use available query routes", () => {
  assert.equal(councilHref("barnet"), "/council-view?council=barnet");
  assert.equal(
    serviceHref("barnet", "council-tax"),
    "/council-service?council=barnet&service=council-tax",
  );
  assert.equal(
    reviewHref("barnet", "council-tax"),
    "/write-review?council=barnet&service=council-tax",
  );
});
test("sign-in returns only to same-site paths", () => {
  for (const value of [
    "https://attacker.example",
    "//attacker.example",
    "javascript:alert(1)",
    "/\\attacker.example",
    "/\n/attacker.example",
    null,
  ])
    assert.equal(safeNext(value), "/account");
  assert.equal(
    safeNext("/write-review?council=barnet&service=parking"),
    "/write-review?council=barnet&service=parking",
  );
});
test("draft recovery rejects expired, corrupt and invalid data", () => {
  const draft = {
    rating: 4,
    serviceId: "abc",
    title: "Road repairs",
    body: "The team repaired the road.",
    expiresAt: 100,
  };
  assert.deepEqual(parseDraft(JSON.stringify(draft), 99), draft);
  assert.equal(parseDraft(JSON.stringify(draft), 100), null);
  for (const raw of [
    "{}",
    "oops",
    null,
    JSON.stringify({ ...draft, rating: 9 }),
    JSON.stringify({ ...draft, body: 8 }),
  ])
    assert.equal(parseDraft(raw, 1), null);
});
test("postcode validation normalises user input without accepting arbitrary strings", () => {
  assert.equal(validPostcode(" sw1a 1aa "), true);
  assert.equal(validPostcode("EN11 8AA"), true);
  assert.equal(validPostcode("GIR 0AA"), true);
  assert.equal(validPostcode("not a postcode"), false);
});
test("legacy service links map to database service slugs", () => {
  assert.equal(canonicalService("waste"), "waste-recycling");
  assert.equal(canonicalService("education"), "education-schools");
  assert.equal(canonicalService("parking"), "parking");
});
