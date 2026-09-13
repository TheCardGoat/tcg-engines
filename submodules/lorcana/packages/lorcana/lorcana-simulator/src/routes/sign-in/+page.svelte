<script lang="ts">
  import { Button } from '$lib/design-system/primitives/button';
  import { m } from '$lib/i18n/messages.js';
  import { page } from '$app/state';
  import { env } from '$env/dynamic/public';
  import { resolvePlatformMatchmakingReturnUrl } from '$lib/navigation/platform-matchmaking-url.js';
</script>

<svelte:head>
  <title>{m['sim.auth.signIn.errorTitle']({})}</title>
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
  <section
    class="w-full max-w-md space-y-5 rounded-xl border border-border bg-card p-6 text-center shadow-lg"
    aria-labelledby="auth-error-title"
  >
    <div class="space-y-2">
      <h1 id="auth-error-title" class="text-2xl font-semibold">
        {m['sim.auth.signIn.errorTitle']({})}
      </h1>
      <p class="text-sm text-muted-foreground" role="alert">
        {m['sim.auth.signIn.errorDescription']({})}
      </p>
    </div>

    <Button
      class="w-full"
      href={resolvePlatformMatchmakingReturnUrl(page.url, env.PUBLIC_PLATFORM_MATCHMAKING_URL)}
    >
      {m['sim.auth.signIn.tryAgain']({})}
    </Button>
  </section>
</main>
