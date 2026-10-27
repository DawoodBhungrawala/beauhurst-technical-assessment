# Assessment audit

Audited against the supplied Graduate/Junior Web Developer assessment on 27 October 2026.

| Requirement | Implementation and evidence |
| --- | --- |
| Nuxt.js | Nuxt 4 with Vue and TypeScript; production build and typecheck pass. |
| Responsive blog | Shared report template; responsive grid, mobile layout and horizontally scrollable ranking table. Browser reviewed at the available narrow viewport. |
| SEO title, introduction, headings, meta description | Supplied fintech report includes these; uploaded reports receive structured AI copy and metadata. |
| All 100 supplied companies | Exact supplied CSV included; parser test verifies 100 rows. Initial production HTML was checked for 100 table rows. |
| Statistics and insights | Total, mean, median, funding concentration, region counts; exact fintech total £622,301,270 and median £4,146,786 verified. |
| Server rendering and technical SEO | Table and copy in initial HTML; canonical URL, Article JSON-LD, Open Graph metadata, sitemap and robots.txt. |
| Simple CSV upload | `/create`: industry field, CSV chooser, validation, loading state and actionable errors. |
| LLM copy generation | Real local Ollama requests using JSON schema output; tested with the supplied 100-company CSV and fictional healthtech CSV. |
| Automatic new page using shared template | Successful POST saves a report and returns its unique slug; form redirects to it without a rebuild. |
| Updated title, metadata, statistics and ranking | All read from the saved uploaded report; statistics calculated from the uploaded companies. |
| Reusable across industries | Industry input and schema-based parsing, independent of fintech. Healthtech sample verified; input contract documented. |
| GitHub repository | Private repository under DawoodBhungrawala; reviewers must be granted access. |
| Working page and reusable workflow | Available locally through DDEV; generated sample survives a Nuxt restart. |
| README with approach, setup and tools | Included, with native Node and DDEV setup, Ollama requirements, limits and AI disclosure. |
| Live demonstration | App is ready for rehearsal; the actual interview demonstration remains for the candidate. |
| Free tools only | App stack and local model require no paid API. Candidate must verify their actual coding-assistant access met the brief's free-option rule. |

## Practical limitations to explain

- Generated prose is a draft. The small local model can make unsupported claims or misunderstand regional comparisons despite schema validation and grounding instructions. Deterministic table/statistics are authoritative; review prose before sharing. Schema validation verifies shape, not factual accuracy.
- New CSVs need `Company` and `Total Raised` headers and GBP amounts. Similar datasets with different column names need normalization; arbitrary schema mapping is not implemented or required by the stated brief.
- The supplied fintech report intentionally uses editorial seed copy, so a fresh checkout can display a useful page without running a model. New uploads require real successful LLM generation.
- Ollama must be running and its configured model downloaded before the demonstration. The tested OrbStack setup can reach the localhost-only host model; other Docker providers may need native Node development.
- Local filesystem persistence supports this single-instance demo. Authentication, queues, cloud storage and production scaling are outside the brief's requested prototype scope.
- The DDEV address is local. A public deployment is not one of the listed deliverables.

## Before submitting

1. Ensure the recruitment team can access the private repository.
2. Confirm compliance with the free coding-assistant condition and accurately disclose the assistance used.
3. Rehearse uploading a new-industry CSV and explain the parser, calculations, LLM call, storage and SSR template.
4. Review AI prose and be prepared to discuss the limitations above. No job outcome or assessor acceptance is guaranteed by this checklist.
