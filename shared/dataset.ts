import Papa from "papaparse";
export interface Company {
  name: string;
  raised: number;
  region: string;
  stage: string;
  employees: string;
  description: string;
  website: string;
  industries: string;
}
export interface Copy {
  title: string;
  description: string;
  introduction: string;
  sections: { heading: string; body: string }[];
}
export interface Blog {
  slug: string;
  industry: string;
  createdAt: string;
  source: string;
  generator: string;
  companies: Company[];
  copy: Copy;
}
export const money = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
export function parseDataset(csv: string): Company[] {
  const parsed = Papa.parse<Record<string, string>>(
    csv.replace(/^\uFEFF/, ""),
    {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (h) => h.trim().toLowerCase(),
    },
  );
  if (parsed.errors.length)
    throw new Error(`CSV error: ${parsed.errors[0]?.message}`);
  const fields = parsed.meta.fields || [];
  if (!fields.includes("company") || !fields.includes("total raised"))
    throw new Error("CSV must include Company and Total Raised columns (GBP).");
  if (!parsed.data.length || parsed.data.length > 1000)
    throw new Error("Please provide between 1 and 1,000 company rows.");
  const names = new Set<string>();
  return parsed.data
    .map((row, i) => {
      const name = row.company?.trim() || "";
      const amount = (row["total raised"] || "")
        .trim()
        .replace(/^£/, "")
        .replaceAll(",", "");
      if (
        !name ||
        !/^\d+(\.\d{1,2})?$/.test(amount) ||
        !Number.isFinite(Number(amount))
      )
        throw new Error(
          `Row ${i + 2}: provide a company name and a non-negative GBP fundraising amount.`,
        );
      if (names.has(name.toLowerCase()))
        throw new Error(`Duplicate company: ${name}`);
      names.add(name.toLowerCase());
      let website = "";
      try {
        const url = new URL(row.website || "");
        if (["https:", "http:"].includes(url.protocol)) website = url.href;
      } catch {}
      return {
        name,
        raised: Number(amount),
        region: row.region?.trim() || "Not specified",
        stage: row.stage?.trim() || "Not specified",
        employees: row.employees?.trim() || "Not specified",
        description: (row.description || "").slice(0, 2000),
        website,
        industries: row.industries || "",
      };
    })
    .sort((a, b) => b.raised - a.raised || a.name.localeCompare(b.name));
}
export function statistics(companies: Company[]) {
  const total = companies.reduce((sum, c) => sum + c.raised, 0);
  const sorted = companies.map((c) => c.raised).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const regions = Object.entries(
    companies.reduce<Record<string, number>>((acc, c) => {
      acc[c.region] = (acc[c.region] || 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  return {
    count: companies.length,
    total,
    mean: total / companies.length,
    median:
      sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2,
    topTenShare: total
      ? (companies.slice(0, 10).reduce((s, c) => s + c.raised, 0) / total) * 100
      : 0,
    regions,
  };
}
