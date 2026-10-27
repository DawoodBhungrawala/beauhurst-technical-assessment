<script setup lang="ts">
import { statistics, money } from "#shared/dataset";
const route = useRoute();
const { data: blog, error } = await useFetch(`/api/blogs/${route.params.slug}`);
if (error.value || !blog.value)
  throw createError({ statusCode: 404, statusMessage: "Report not found" });
const report = blog.value!;
const stats = statistics(report.companies);
const query = ref("");
const filtered = computed(() =>
  report.companies
    .map((company, index) => ({ ...company, rank: index + 1 }))
    .filter((c) =>
      `${c.name} ${c.region} ${c.description}`
        .toLowerCase()
        .includes(query.value.toLowerCase()),
    ),
);
const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
const canonical = `${site}/blog/${report.slug}`;
useSeoMeta({
  title: report.copy.title + " | Beauhurst",
  description: report.copy.description,
  ogTitle: report.copy.title,
  ogDescription: report.copy.description,
  ogType: "article",
  ogUrl: canonical,
  twitterCard: "summary",
});
useHead({
  link: [{ rel: "canonical", href: canonical }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: report.copy.title,
        description: report.copy.description,
        datePublished: report.createdAt,
        mainEntityOfPage: canonical,
        author: { "@type": "Organization", name: "Industry Insights demo" },
      }).replace(/</g, "\\u003c"),
    },
  ],
});
</script>
<template>
  <main v-if="blog">
    <section class="article-hero">
      <NuxtLink to="/" class="breadcrumb">Insights / Industry reports</NuxtLink>
      <div class="eyebrow">{{ report.industry }} · FUNDRAISING REPORT</div>
      <h1>{{ report.copy.title }}<span class="accent">.</span></h1>
      <p class="lead">{{ report.copy.introduction }}</p>
      <div class="article-meta">
        {{ report.source }} <span>·</span> {{ stats.count }} companies
        <span>·</span> GBP
      </div>
    </section>
    <section class="stats-grid" aria-label="Dataset statistics">
      <div>
        <span>Companies in the dataset</span><strong>{{ stats.count }}</strong>
      </div>
      <div>
        <span>Combined fundraising</span
        ><strong>{{ money(stats.total) }}</strong>
      </div>
      <div>
        <span>Median fundraising</span
        ><strong>{{ money(stats.median) }}</strong>
      </div>
      <div>
        <span>Top 10 share of funding</span
        ><strong>{{ stats.topTenShare.toFixed(1) }}%</strong>
      </div>
    </section>
    <div class="article-content">
      <article>
        <div class="eyebrow">BEHIND THE NUMBERS</div>
        <section
          v-for="section in report.copy.sections"
          :key="section.heading"
          class="copy-section"
        >
          <h2>{{ section.heading }}</h2>
          <p>{{ section.body }}</p>
        </section>
      </article>
      <aside class="region-panel">
        <h2>A regional snapshot</h2>
        <p>Companies by location</p>
        <div
          v-for="[region, count] in stats.regions"
          :key="region"
          class="region"
        >
          <div>
            <span>{{ region }}</span
            ><strong>{{ count }}</strong>
          </div>
          <meter
            :value="count"
            :max="stats.count"
            :aria-label="`${region}: ${count} companies`"
          />
        </div>
      </aside>
    </div>
    <section class="ranking section" id="rankings">
      <div class="section-heading">
        <div>
          <div class="eyebrow">THE COMPLETE PICTURE</div>
          <h2>The company ranking</h2>
        </div>
        <label class="search"
          >Search companies<input
            v-model="query"
            type="search"
            placeholder="Name, region or keyword"
        /></label>
      </div>
      <p class="table-note">
        Ranked by total fundraising, highest first. {{ filtered.length }} of
        {{ stats.count }} companies shown.
      </p>
      <div
        class="table-scroll"
        tabindex="0"
        role="region"
        aria-label="Company fundraising ranking"
      >
        <table>
          <caption class="sr-only">
            {{
              report.industry
            }}
            companies ranked by total fundraising in GBP
          </caption>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Company</th>
              <th scope="col">Region</th>
              <th scope="col">Stage</th>
              <th scope="col">Employees</th>
              <th scope="col" class="amount">Total raised</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="company in filtered" :key="company.name">
              <td class="rank">{{ String(company.rank).padStart(2, "0") }}</td>
              <th scope="row">
                <a
                  v-if="company.website"
                  :href="company.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ company.name }} <span aria-hidden="true">↗</span
                  ><span class="sr-only"> (opens in a new tab)</span></a
                ><span v-else>{{ company.name }}</span>
                <p>{{ company.description }}</p>
              </th>
              <td>{{ company.region }}</td>
              <td>
                <span class="tag">{{ company.stage }}</span>
              </td>
              <td>{{ company.employees }}</td>
              <td class="amount">{{ money(company.raised) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!filtered.length">No companies match your search.</p>
      </div>
    </section>
    <section class="methodology">
      <h2>About this report</h2>
      <p>
        Figures are calculated directly from the supplied CSV. Rankings use
        total fundraising in GBP, with alphabetical ordering for ties. Missing
        categories appear as “Not specified”. The median is the middle
        fundraising value (or the average of the middle two values). Top 10
        share uses up to ten companies.
      </p>
      <p>
        This is a selected dataset, not a complete market census. Fundraising is
        not valuation or revenue. No reporting date was supplied for the source
        data. Copy: {{ report.generator }}. Generated copy should be reviewed
        for accuracy.
      </p>
      <NuxtLink to="/create" class="text-link"
        >Explore another industry — create a report ↗</NuxtLink
      >
    </section>
  </main>
</template>
