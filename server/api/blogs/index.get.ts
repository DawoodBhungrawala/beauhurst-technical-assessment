import { seedBlog } from "../../utils/blogs";
import type { Blog } from "../../../shared/dataset";
export default defineEventHandler(async () => {
  const storage = useStorage("data");
  const keys = await storage.getKeys("blogs:");
  const blogs = [
    await seedBlog(),
    ...(
      await Promise.all(keys.map((key) => storage.getItem<Blog>(key)))
    ).filter((b): b is Blog => !!b),
  ];
  return blogs.map(({ slug, industry, createdAt, copy, companies }) => ({
    slug,
    industry,
    createdAt,
    title: copy.title,
    description: copy.description,
    count: companies.length,
  }));
});
