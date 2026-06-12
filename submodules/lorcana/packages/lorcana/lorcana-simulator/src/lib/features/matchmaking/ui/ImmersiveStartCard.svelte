<script lang="ts">
  import { Button } from "$lib/design-system/primitives/button";
  import Download from "@lucide/svelte/icons/download";
  import Loader from "@lucide/svelte/icons/loader-circle";
  import Maximize from "@lucide/svelte/icons/maximize";
  import Share from "@lucide/svelte/icons/share";
  import Smartphone from "@lucide/svelte/icons/smartphone";
  import type { ImmersiveCapabilities } from "@/features/immersive/immersive-capabilities.js";
  import type { ImmersiveStartOutcome } from "@/features/immersive/immersive-state.svelte.js";
  import type { InstallNudgeVariant } from "@/features/matchmaking/state/install-nudge.svelte.js";

  interface ImmersiveProps {
    isStandalone: boolean;
    canRequestFullscreen: boolean;
    capabilities: ImmersiveCapabilities;
    startInBrowser: () => ImmersiveStartOutcome;
    startExperience: () => Promise<ImmersiveStartOutcome>;
  }

  interface InstallNudgeProps {
    shouldShow: boolean;
    variant: InstallNudgeVariant;
    installing: boolean;
    promptInstall: () => Promise<unknown>;
    dismissForAWeek: () => void;
  }

  interface Props {
    immersive: ImmersiveProps;
    installNudge?: InstallNudgeProps;
    onStart?: () => void;
  }

  let { immersive, installNudge, onStart }: Props = $props();

  const showInstallSection = $derived(installNudge?.shouldShow && !immersive.isStandalone);

  async function handleStartExperience(): Promise<void> {
    await immersive.startExperience();
    onStart?.();
  }

  function handleStartInBrowser(): void {
    immersive.startInBrowser();
    onStart?.();
  }

  async function handleInstallPrompt(): Promise<void> {
    await installNudge?.promptInstall();
  }
</script>

<section
  class="immersive-start-card relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(9,16,33,0.98)_55%,rgba(24,24,27,0.96))] px-4 py-4 shadow-[0_32px_90px_-54px_rgba(2,6,23,1)] sm:px-5"
>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_28%)]"
    aria-hidden="true"
  ></div>

  <div class="relative mx-auto flex w-full max-w-5xl flex-col gap-4">
    {#if immersive.isStandalone}
      <div class="flex items-start gap-3">
        <div class="rounded-full border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
          <Smartphone class="size-5" aria-hidden="true" />
        </div>
        <div class="space-y-1">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-emerald-300/80">
            Standalone active
          </p>
          <h2 class="text-balance text-2xl font-semibold text-white sm:text-[2rem]">
            Continue to Lobby
          </h2>
          <p class="text-sm leading-6 text-slate-300">
            Home screen launch detected
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row">
        <Button
          class="h-12 min-w-40 touch-manipulation rounded-full bg-emerald-400 px-6 text-[0.95rem] font-semibold text-slate-950 shadow-[0_16px_44px_-24px_rgba(52,211,153,0.95)] hover:bg-emerald-300"
          onclick={handleStartInBrowser}
        >
          Continue to Lobby
        </Button>
      </div>
    {:else}
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-2">
          <p class="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-sky-200/80">
            {#if immersive.canRequestFullscreen}
              Optional fullscreen
            {:else}
              Start playing
            {/if}
          </p>
          <div class="space-y-1">
            <h2 class="text-balance text-2xl font-semibold text-white sm:text-[2rem]">
              Open lobby now
            </h2>
          </div>
        </div>

        <div class="rounded-full border border-white/10 bg-white/6 p-3 text-sky-100 shadow-[0_10px_30px_-24px_rgba(125,211,252,0.9)]">
          <Maximize class="size-5" aria-hidden="true" />
        </div>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row">
        {#if immersive.canRequestFullscreen}
          <Button
            class="h-12 min-w-40 touch-manipulation rounded-full bg-sky-400 px-6 text-[0.95rem] font-semibold text-slate-950 shadow-[0_16px_44px_-24px_rgba(56,189,248,0.95)] hover:bg-sky-300"
            onclick={handleStartExperience}
          >
            <Maximize class="mr-2 size-4" aria-hidden="true" />
            Try Fullscreen
          </Button>
        {/if}

        <Button
          class="h-12 min-w-40 touch-manipulation rounded-full border border-white/12 bg-white/6 px-6 text-[0.95rem] font-semibold text-white hover:bg-white/10"
          onclick={handleStartInBrowser}
          variant="outline"
        >
          Continue in Browser
        </Button>
      </div>

      {#if showInstallSection}
        <div class="mt-2 border-t border-white/8 pt-4">
          {#if installNudge?.variant === "ios-safari"}
            <div class="flex items-start gap-3">
              <div class="rounded-full border border-white/10 bg-white/6 p-2.5 text-sky-100">
                <Share class="size-4" aria-hidden="true" />
              </div>
              <div class="space-y-2">
                <p class="text-sm font-semibold text-white">
                  Install for one-tap return
                </p>
                <div class="flex flex-wrap gap-2 text-xs text-slate-200/85">
                  <span class="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                    1. Tap Share
                  </span>
                  <span class="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
                    2. Add to Home Screen
                  </span>
                </div>
              </div>
            </div>
          {:else if installNudge?.variant === "native"}
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="rounded-full border border-white/10 bg-white/6 p-2.5 text-sky-100">
                  <Download class="size-4" aria-hidden="true" />
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-white">Install Lorcanito</p>
                  <p class="text-xs text-slate-400">
                    Get one-tap launch and faster load times.
                  </p>
                </div>
              </div>

              <Button
                class="h-10 shrink-0 touch-manipulation rounded-full bg-sky-400 px-5 text-sm font-semibold text-slate-950 hover:bg-sky-300"
                disabled={installNudge.installing}
                onclick={handleInstallPrompt}
              >
                {#if installNudge.installing}
                  <Loader class="mr-2 size-4 animate-spin" />
                {/if}
                Install app
              </Button>
            </div>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</section>
