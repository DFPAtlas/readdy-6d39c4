import assert from "node:assert/strict";
import test from "node:test";
import {
  councilInitials,
  councilLogoSrc,
  formatCouncilType,
} from "../lib/councils";

test("council types render for all UK nations", () => {
  assert.equal(formatCouncilType("london_borough"), "London Borough");
  assert.equal(formatCouncilType("metropolitan"), "Metropolitan District");
  assert.equal(formatCouncilType("scottish_council"), "Scottish Council");
  assert.equal(formatCouncilType("welsh_council"), "Welsh Principal Council");
  assert.equal(formatCouncilType("ni_district"), "NI District Council");
  assert.equal(formatCouncilType("something_new"), "Council");
  assert.equal(formatCouncilType(null), "Council");
});

test("logo URLs are limited to Wikimedia Commons file paths and sized", () => {
  const base = "https://commons.wikimedia.org/wiki/Special:FilePath/";
  assert.equal(
    councilLogoSrc(`${base}Bury_Council_logo_2023.svg`, 96),
    `${base}Bury_Council_logo_2023.svg?width=96`,
  );
  assert.equal(
    councilLogoSrc(`${base}The_Highland_Council_(2019).svg`, 128),
    `${base}The_Highland_Council_(2019).svg?width=128`,
  );
  assert.equal(councilLogoSrc(`${base}x.svg`, 4000), `${base}x.svg?width=512`);
  for (const bad of [
    null,
    "",
    "https://attacker.example/logo.svg",
    "javascript:alert(1)",
    `${base}`,
    `${base}a.svg?width=9999`,
    `${base}a b.svg`,
    `${base}a"onerror=x.svg`,
  ])
    assert.equal(councilLogoSrc(bad, 96), null);
});

test("initials skip generic council words", () => {
  assert.equal(councilInitials("London Borough of Barking and Dagenham"), "BD");
  assert.equal(councilInitials("Belfast City Council"), "B");
  assert.equal(councilInitials("Newry, Mourne and Down District Council"), "NM");
  assert.equal(councilInitials("Council"), "C");
});
