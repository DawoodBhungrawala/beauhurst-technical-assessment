<script setup lang="ts">
const { data: blogs } = await useFetch("/api/blogs");
useSeoMeta({
  title: "UK industry reports & company rankings | Beauhurst",
  description:
    "Explore company fundraising rankings and insights from industry datasets, or generate a new industry report from a CSV.",
});
</script>
<template>
  <main>
    <section class="hero">
      <div class="eyebrow">THE INDUSTRY EDIT</div>
      <h1>Big ideas.<br />Backed by data<span class="accent">.</span></h1>
      <p class="lead">
        A closer look at the companies shaping UK industries. Explore the
        rankings, uncover the patterns, and follow the funding.
      </p>
      <NuxtLink to="/create" class="text-link"
        >Turn your dataset into a report
        <span aria-hidden="true">↗</span></NuxtLink
      >
      <div class="hero-mark" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i>
      </div>
    </section>
    <section class="section">
      <div class="section-heading">
        <h2>The latest insights</h2>
        <span
          >{{ blogs?.length }}
          {{ blogs?.length === 1 ? "report" : "reports" }}</span
        >
      </div>
      <div class="cards">
        <NuxtLink
          v-for="blog in blogs"
          :key="blog.slug"
          :to="`/blog/${blog.slug}`"
          class="report-card"
          ><div class="card-art" aria-hidden="true">
            <span>{{ blog.industry.slice(0, 1).toUpperCase() }}</span>
            <div class="bars"><i></i><i></i><i></i><i></i></div>
          </div>
          <div class="card-body">
            <div class="eyebrow">
              {{ blog.industry }} · {{ blog.count }} COMPANIES
            </div>
            <h3>{{ blog.title }}</h3>
            <p>{{ blog.description }}</p>
            <span class="text-link">Explore the report ↗</span>
          </div></NuxtLink
        >
      </div>
    </section>
  </main>
</template>
