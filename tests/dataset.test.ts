import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseDataset, statistics } from "../shared/dataset";
test("assessment contains 100 correctly ranked companies and exact totals", () => {
  const companies = parseDataset(readFileSync("data/fintech.csv", "utf8"));
  assert.equal(companies.length, 100);
  assert.equal(statistics(companies).total, 622301270);
  assert.equal(statistics(companies).median, 4146786);
  assert.equal(companies[0]?.name, "Nevis");
  assert.equal(companies[0]?.raised, 30314247);
  assert.ok(
    companies.every((c, i) => !i || companies[i - 1]!.raised >= c.raised),
  );
});
test("quoted currency, BOM, case-insensitive headers, sorting and safe URLs", () => {
  const c = parseDataset(
    '\uFEFFcompany,TOTAL RAISED,Website\nB,"£1,000",javascript:alert(1)\nA,3000,https://example.com',
  );
  assert.equal(c[0]?.name, "A");
  assert.equal(c[1]?.website, "");
  assert.deepEqual(
    [statistics(c).total, statistics(c).median, statistics(c).mean],
    [4000, 2000, 2000],
  );
});
test("reject missing headers, malformed money, empty input and duplicate names", () => {
  for (const csv of [
    "Name,Amount\nA,1",
    "Company,Total Raised\nA,nope",
    "Company,Total Raised\nA,-5",
    "Company,Total Raised",
    "Company,Total Raised\nA,1\na,2",
  ])
    assert.throws(() => parseDataset(csv));
});
test("odd medians and zero funding do not produce invalid statistics", () => {
  const s = statistics(parseDataset("Company,Total Raised\nA,0\nB,0\nC,0"));
  assert.equal(s.median, 0);
  assert.equal(s.topTenShare, 0);
});
