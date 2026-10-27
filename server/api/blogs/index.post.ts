import { randomUUID } from "node:crypto";
import { parseDataset, type Blog } from "../../../shared/dataset";
import { generateCopy } from "../../utils/blogs";
export default defineEventHandler(async (event) => {
  if (Number(getHeader(event, "content-length") || 0) > 2_100_000)
    throw createError({
      statusCode: 413,
      statusMessage: "CSV must be smaller than 2 MB",
    });
  const parts = await readMultipartFormData(event);
  const file = parts?.find((p) => p.name === "file");
  const industry =
    parts
      ?.find((p) => p.name === "industry")
      ?.data.toString()
      .trim() || "";
  if (
    !file ||
    file.data.length > 2_000_000 ||
    !/^[\p{L}\p{N} &-]{2,60}$/u.test(industry)
  )
    throw createError({
      statusCode: 400,
      statusMessage:
        "Choose a CSV under 2 MB and an industry name (2-60 letters, numbers, spaces, & or hyphens).",
    });
  let companies;
  try {
    companies = parseDataset(file.data.toString("utf8"));
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: (error as Error).message,
    });
  }
  let copy;
  try {
    copy = await generateCopy(industry, companies);
  } catch (error) {
    console.error("Report generation failed:", error);
    throw createError({
      statusCode: 502,
      statusMessage:
        "AI generation failed. Check Ollama is running, the configured model is installed, and retry. No page was saved.",
    });
  }
  const slug = `${
    industry
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "industry"
  }-${randomUUID().slice(0, 8)}`;
  const blog: Blog = {
    slug,
    industry,
    companies,
    copy,
    createdAt: new Date().toISOString(),
    source: (file.filename || "Uploaded CSV").slice(0, 150),
    generator: `Ollama / ${useRuntimeConfig().ollamaModel}`,
  };
  await useStorage("data").setItem(`blogs:${slug}`, blog);
  setResponseStatus(event, 201);
  return { slug };
});
