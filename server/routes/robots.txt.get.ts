export default defineEventHandler((event) => {
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return `User-agent: *\nAllow: /\nDisallow: /create\nDisallow: /api/\nSitemap: ${useRuntimeConfig().public.siteUrl.replace(/\/$/, "")}/sitemap.xml\n`;
});
