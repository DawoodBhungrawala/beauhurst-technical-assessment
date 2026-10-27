<template>
  <div>
    <header class="site-header">
      <NuxtLink to="/" class="brand"
        >beauhurst<span> / insights</span></NuxtLink
      >
      <nav aria-label="Main navigation">
        <NuxtLink to="/">Industry reports</NuxtLink
        ><NuxtLink to="/create" class="button small"
          >Create a report <span aria-hidden="true">↗</span></NuxtLink
        >
      </nav>
    </header>
    <NuxtPage />
    <footer>
      <span class="brand">beauhurst</span>
      <p>Company data. A clearer perspective.</p>
      <small>Technical assessment · Independent demonstration</small>
    </footer>
  </div>
</template>
