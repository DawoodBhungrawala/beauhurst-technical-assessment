<script setup lang="ts">
const industry = ref("");
const file = ref<File>();
const busy = ref(false);
const error = ref("");
useSeoMeta({
  title: "Create an industry report | Beauhurst",
  robots: "noindex, nofollow",
});
function select(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0];
}
async function submit() {
  error.value = "";
  if (!file.value) {
    error.value = "Please choose a CSV file.";
    return;
  }
  busy.value = true;
  const body = new FormData();
  body.append("file", file.value);
  body.append("industry", industry.value);
  try {
    const result = await $fetch("/api/blogs", { method: "POST", body });
    await navigateTo(`/blog/${result.slug}`);
  } catch (e: any) {
    error.value =
      e.data?.statusMessage || "Could not create the report. Please try again.";
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <main class="create-layout">
    <section>
      <div class="eyebrow">FROM DATA TO DISCOVERY</div>
      <h1>
        Your next industry report starts here<span class="accent">.</span>
      </h1>
      <p class="lead">
        Upload a company dataset. Get a new report with AI-written copy,
        calculated insights and a complete fundraising ranking.
      </p>
      <ol class="steps">
        <li>Choose your industry and CSV</li>
        <li>Local AI writes the introduction and analysis</li>
        <li>Your report is saved at its own shareable URL</li>
      </ol>
    </section>
    <form class="upload-panel" @submit.prevent="submit">
      <h2>Create a report</h2>
      <label for="industry">Industry name</label
      ><input
        id="industry"
        v-model="industry"
        placeholder="e.g. Healthtech"
        minlength="2"
        maxlength="60"
        required
        :disabled="busy"
      /><label for="csv">Company dataset</label>
      <div class="file-zone">
        <span aria-hidden="true">↥</span
        ><input
          id="csv"
          type="file"
          accept=".csv,text/csv"
          required
          :disabled="busy"
          @change="select"
        />
        <p>CSV · up to 2 MB · up to 1,000 companies</p>
      </div>
      <details>
        <summary>What should my CSV include?</summary>
        <p>
          Required headers: <strong>Company</strong> and
          <strong>Total Raised</strong>. Fundraising must be a non-negative GBP
          amount, such as £1,250,000 or 1250000. Optional: Region, Stage,
          Employees, Description, Website, Industries. Column names are
          case-insensitive. Companies are ranked automatically.
        </p>
        <a href="/example.csv" download>Download an example CSV</a>
      </details>
      <p class="notice">
        Uses your configured local Ollama model. Generation can take a few
        minutes. Review the generated copy before sharing.
      </p>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <button class="button" :disabled="busy">
        {{ busy ? "Writing your report…" : "Generate report ↗" }}
      </button>
      <p v-if="busy" role="status">
        Reading your data and generating copy. Keep this page open.
      </p>
    </form>
  </main>
</template>
