<script lang="ts">
  import { onMount } from 'svelte';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import RefreshCw from '@lucide/svelte/icons/refresh-cw';
  import WifiOff from '@lucide/svelte/icons/wifi-off';
  import { Button } from '$lib/design-system/primitives/button';
  import { m } from '$lib/i18n/messages.js';

  let {
    error = false,
    onRetry,
    onBack,
  }: {
    error?: boolean;
    onRetry: () => void;
    onBack: () => void;
  } = $props();

  let delayed = $state(false);

  onMount(() => {
    if (error) return;
    const timeout = window.setTimeout(() => {
      delayed = true;
    }, 6_000);
    return () => window.clearTimeout(timeout);
  });
</script>

<section
  class="relative isolate grid h-full min-h-[22rem] place-items-center overflow-hidden px-4 py-8 text-slate-100"
  aria-live="polite"
  aria-busy={!error}
>
  <div
    class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,#020617_0%,#030712_100%)]"
  ></div>

  <div class="w-full max-w-md text-center">
    <div
      class:error-surface={Boolean(error)}
      class="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-blue-400/10 text-blue-200 shadow-[0_16px_40px_rgba(2,6,23,0.42)]"
    >
      {#if error}
        <WifiOff class="size-7 text-rose-200" aria-hidden="true" />
      {:else}
        <LoaderCircle class="size-7 animate-spin" aria-hidden="true" />
      {/if}
    </div>

    {#if error}
      <h1 class="text-balance text-2xl font-semibold tracking-[-0.02em] text-white">
        {m["sim.matchConnection.error.title"]({})}
      </h1>
      <p class="mx-auto mt-3 max-w-[38ch] text-pretty text-sm leading-6 text-slate-300">
        {m["sim.matchConnection.error.description"]({})}
      </p>
      <div class="mt-7 flex flex-col-reverse justify-center gap-3 sm:flex-row">
        <Button variant="outline" class="border-slate-700 bg-slate-950/40" onclick={onBack}>
          <ArrowLeft class="size-4" aria-hidden="true" />
          {m["sim.matchConnection.back"]({})}
        </Button>
        <Button class="bg-blue-400 text-slate-950 hover:bg-blue-300" onclick={onRetry}>
          <RefreshCw class="size-4" aria-hidden="true" />
          {m["sim.matchConnection.retry"]({})}
        </Button>
      </div>
    {:else}
      <h1 class="text-balance text-2xl font-semibold tracking-[-0.02em] text-white">
        {delayed
          ? m["sim.matchConnection.delayed.title"]({})
          : m["sim.matchConnection.loading.title"]({})}
      </h1>
      <p class="mx-auto mt-3 max-w-[40ch] text-pretty text-sm leading-6 text-slate-300">
        {delayed
          ? m["sim.matchConnection.delayed.description"]({})
          : m["sim.matchConnection.loading.description"]({})}
      </p>

      <div class="mx-auto mt-7 flex w-fit items-center gap-2 text-xs font-medium text-blue-200">
        <span class="relative flex size-2" aria-hidden="true">
          <span class="absolute inline-flex size-full animate-ping rounded-full bg-blue-300 opacity-60"></span>
          <span class="relative inline-flex size-2 rounded-full bg-blue-300"></span>
        </span>
        {m["sim.matchConnection.loading.status"]({})}
      </div>

      {#if delayed}
        <Button
          variant="ghost"
          class="mt-5 text-slate-300 hover:bg-slate-800/70 hover:text-white"
          onclick={onBack}
        >
          <ArrowLeft class="size-4" aria-hidden="true" />
          {m["sim.matchConnection.back"]({})}
        </Button>
      {/if}
    {/if}
  </div>
</section>

<style>
  .error-surface {
    background-color: rgb(251 113 133 / 0.1);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.animate-spin),
    :global(.animate-ping) {
      animation: none;
    }
  }
</style>
