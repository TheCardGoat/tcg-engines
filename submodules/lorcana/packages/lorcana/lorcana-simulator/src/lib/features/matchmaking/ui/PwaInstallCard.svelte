<script lang="ts">
  import { Button } from "$lib/design-system/primitives/button";
  import Download from "@lucide/svelte/icons/download";
  import Loader from "@lucide/svelte/icons/loader-circle";
  import Share from "@lucide/svelte/icons/share";
  import type {
    BeforeInstallPromptChoiceResult,
    InstallNudgeVariant,
  } from "@/features/matchmaking/state/install-nudge.svelte.js";

  interface PwaInstallCardProps {
    installNudge: {
      shouldShow: boolean;
      variant: InstallNudgeVariant;
      installing: boolean;
      promptInstall: () => Promise<BeforeInstallPromptChoiceResult | null>;
      dismissForAWeek: () => void;
    };
  }

  let { installNudge }: PwaInstallCardProps = $props();

  const heading = $derived(
    installNudge.variant === "ios-safari"
      ? "Add to your home screen"
      : "Install Lorcanito",
  );

  const helperMessage = $derived(
    installNudge.variant === "ios-safari"
      ? "Get one-tap access to the simulator. Tap Share, then choose Add to Home Screen."
      : "Get one-tap launch, an app-like experience, and faster load times on your phone.",
  );

  async function handleInstallPrompt(): Promise<void> {
    await installNudge.promptInstall();
  }

  function handleDismiss(): void {
    installNudge.dismissForAWeek();
  }
</script>

<section
  class="pwa-install-card relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(9,16,33,0.98)_55%,rgba(24,24,27,0.96))] px-4 py-4 shadow-[0_32px_90px_-54px_rgba(2,6,23,1)] sm:px-5"
>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_28%)]"
    aria-hidden="true"
  ></div>

  <div class="relative mx-auto flex w-full max-w-5xl flex-col gap-4">
    <div class="flex items-start justify-between gap-3">
      <div class="space-y-2">
        <p class="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-sky-200/80">
          Get the app
        </p>
        <div class="space-y-1">
          <h2 class="text-balance text-2xl font-semibold text-white sm:text-[2rem]">
            {heading}
          </h2>
          <p class="max-w-2xl text-sm leading-6 text-slate-300 sm:text-[0.95rem]">
            {helperMessage}
          </p>
        </div>
      </div>

      <div class="rounded-full border border-white/10 bg-white/6 p-3 text-sky-100 shadow-[0_10px_30px_-24px_rgba(125,211,252,0.9)]">
        {#if installNudge.variant === "ios-safari"}
          <Share class="size-5" />
        {:else}
          <Download class="size-5" />
        {/if}
      </div>
    </div>

    {#if installNudge.variant === "ios-safari"}
      <div class="flex flex-wrap gap-2 text-xs text-slate-200/85">
        <span class="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">1. Tap Share</span>
        <span class="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">2. Add to Home Screen</span>
      </div>
    {/if}

    <div class="flex flex-col gap-2 sm:flex-row">
      {#if installNudge.variant === "native"}
        <Button
          class="h-12 min-w-40 touch-manipulation rounded-full bg-sky-400 px-6 text-[0.95rem] font-semibold text-slate-950 shadow-[0_16px_44px_-24px_rgba(56,189,248,0.95)] hover:bg-sky-300"
          disabled={installNudge.installing}
          onclick={handleInstallPrompt}
        >
          {#if installNudge.installing}
            <Loader class="mr-2 size-4 animate-spin" />
          {/if}
          Install app
        </Button>
      {/if}

      <Button
        class="h-12 min-w-40 touch-manipulation rounded-full border border-white/12 bg-white/6 px-6 text-[0.95rem] font-semibold text-white hover:bg-white/10"
        disabled={installNudge.installing}
        onclick={handleDismiss}
        variant="outline"
      >
        Maybe later
      </Button>
    </div>
  </div>
</section>
