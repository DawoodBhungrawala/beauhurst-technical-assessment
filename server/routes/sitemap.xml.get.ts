import { seedBlog } from "../utils/blogs";
import type { Blog } from "../../shared/dataset";
const escapeXml = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
export default defineEventHandler(async (event) => {
  const store = useStorage("data");
  const saved = await Promise.all(
    (await store.getKeys("blogs:")).map((key) => store.getItem<Blog>(key)),
  );
  const origin = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
  const paths = [
    "/",
    ...[await seedBlog(), ...saved.filter((b): b is Blog => !!b)].map(
      (blog) => `/blog/${blog.slug}`,
    ),
  ];
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(origin + path)}</loc></url>`).join("")}</urlset>`;
});
