# Industry Insights — Beauhurst technical assessment

A Nuxt 4 app that turns company CSVs into server-rendered industry reports. Includes the supplied 100-company fintech dataset, a reusable report template, exact fundraising calculations, and local AI copy generation using Ollama.

## Run locally

Requires Node 22+ and npm. All app dependencies and the local model are free; no paid API is required.

```sh
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:3000. The supplied fintech report works immediately. To generate additional reports, install [Ollama](https://ollama.com), then run:

```sh
ollama pull llama3.2:3b
ollama serve
```

The desktop Ollama app may already be serving; do not start a second server. Visit `/create`, enter an industry (e.g. Healthtech), and upload your CSV. The model needs a few GB of disk and sufficient RAM. Allow up to three minutes per generation. If your machine requires a smaller model, set `NUXT_OLLAMA_MODEL` to a model you have pulled. All inference runs locally. The CSV facts sent to the model include company names, regions and aggregate statistics.

## DDEV setup

Requires DDEV and a running Docker provider (e.g. OrbStack or Docker Desktop).

```sh
ddev start
ddev install
ddev restart
ddev launch
```

Nuxt runs as a DDEV daemon on port 3000 and is routed to https://beauhurst.ddev.site. The first start may show an unavailable app until dependencies are installed and DDEV is restarted. Node 22 is configured and no database container is needed.

Ollama runs on your host at localhost:11434. DDEV uses `http://host.docker.internal:11434`; this reaches the localhost-only Ollama server through OrbStack on the tested machine. Other Docker providers may not bridge host loopback. If connection fails, use native npm development to keep inference on localhost.

DDEV environment values are in `.ddev/config.yaml`. For a different local model update `NUXT_OLLAMA_MODEL` there and restart DDEV.

## CSV contract

Required headers (case-insensitive): `Company`, `Total Raised`. Amounts are GBP numbers, optionally prefixed with £ and comma-separated (CSV-quote amounts containing commas). Rejects missing/negative/invalid amounts, duplicate company names, malformed CSV, empty datasets, more than 1,000 companies, and files over 2 MB. Blank optional categories become “Not specified”.

Optional: `Region`, `Stage`, `Employees`, `Description`, `Website`, `Industries`. Extra columns are ignored. Only HTTP/HTTPS company links are displayed. A fictional three-company sample is available at `/example.csv`; use it for a new-industry demonstration, not as real market data.

## Approach

- `shared/dataset.ts`: Papa Parse normalization, validation, descending fundraising sort, totals, mean, median, region counts and top-ten share. Numbers are computed in code, never delegated to AI.
- `server/utils/blogs.ts`: provided fintech seed and Ollama prompt. The initial report has clearly labelled editorial seed copy, so reviewers can open it without a model installed. New uploads always require successful real LLM generation; there is no fake AI fallback.
- `POST /api/blogs`: validates multipart upload, requests structured JSON, validates the response with Zod, then saves a report using Nitro filesystem storage. A failed model request does not create a report.
- `app/pages/blog/[slug].vue`: shared SSR template, complete table in initial HTML, filter, metadata, canonical URL and Article JSON-LD. Dynamic sitemap and robots.txt include saved reports. Vue escapes copy and CSV text. No model HTML is rendered.
- `.data/`: ignored local persistence. Reports survive app restarts. Deploy with a writable persistent volume, one instance, and set `NUXT_PUBLIC_SITE_URL` to the real site origin. DDEV uses its own origin.
- Raw fintech data is in `data/fintech.csv`; `data/fintech-source.json` is a bundled copy for production. If replacing the source, update both.

## Verify and demonstrate

```sh
npm test
npm run typecheck
npm run build
npm start
```

1. Open `/blog/uk-fintech-fundraising`; inspect its 100 companies and computed insights.
2. Use View Source or `curl` to confirm company rows, metadata and JSON-LD exist before JavaScript executes.
3. Start Ollama, visit `/create`, upload a new industry dataset and wait for the redirect.
4. Check the new title, meta description, calculations, full ranking and stable URL.
5. Refresh the URL or restart Nuxt; the saved report is still available.
6. Try an invalid amount or missing header to demonstrate validation.

## Scope and tradeoffs

This is a small assessment demo, not a production CMS. No authentication, upload queue, rate limits, editorial approval UI or multi-instance database is included. Run upload functionality locally during the interview; do not expose an unauthenticated generation endpoint publicly. Large model responses can time out; errors are shown and the user can retry. JSON schema checks structure, not factual accuracy: review AI prose before publication. Dataset cells are treated as untrusted facts in the prompt, but prompt instructions cannot guarantee perfect model behaviour. Statistics and table remain deterministic.

The supplied dataset has no as-of date and does not establish complete coverage of the UK fintech market. The report makes these limitations explicit. Google Fonts enhance typography; system sans-serif remains usable offline.

## Tools and AI disclosure

Nuxt, Vue, TypeScript, Nitro filesystem storage, Papa Parse, Zod, Node test runner, DDEV, and Ollama. OpenAI Codex assisted with implementation and documentation. The brief encourages AI-assisted coding **using free options**: verify that your actual Codex access complies before submission, and do not claim unaided authorship. Review and understand the implementation so you can explain and modify it at interview. No AI-detector evasion is attempted.

## Submission

Create a GitHub repository, push these source files and the lockfile, and share its URL with the recruitment team. Do not upload `.env`, `.data`, `node_modules`, or build output. No repository was created automatically by this project.

## Verification performed

Verified on 27 October 2026: four dataset tests pass, Nuxt typecheck passes, production build passes. Production HTML includes all 100 fintech table rows, meta description, canonical link and Article JSON-LD. Verified a real Ollama-generated three-company sample through DDEV, browser filtering, persisted page retrieval after restarting Nuxt, and inclusion in the dynamic sitemap. The seed totals are £622,301,270 combined and £4,146,786 median fundraising.
