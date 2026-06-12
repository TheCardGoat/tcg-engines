<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import * as Dialog from '$lib/design-system/primitives/dialog/index.js';
  import { Button } from '$lib/design-system/primitives/button';
  import { cn } from '$lib/utils.js';
  import type { MatchmakingStatus } from '../state/matchmaking-queue.svelte.js';

  import CheckCircle from '@lucide/svelte/icons/check-circle-2';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import Maximize from '@lucide/svelte/icons/maximize-2';
  import Swords from '@lucide/svelte/icons/swords';
  import Timer from '@lucide/svelte/icons/timer';
  import X from '@lucide/svelte/icons/x';

  interface Props {
    open: boolean;
    matchId: string | null;
    gameId: string | null;
    queueStatus: MatchmakingStatus;
    elapsedLabel: string;
    remainingLabel: string;
    progressPercent: number;
    selfAccepted: boolean;
    opponentAccepted: boolean;
    acceptTimeRemainingMs: number;
    matchCountdown: number | null;
    onAcceptMatch: () => void;
    onDeclineMatch: () => void;
    onSkipCountdown: () => void;
    onClose: () => void;
  }

  let {
    open = $bindable(false),
    matchId,
    gameId,
    queueStatus,
    elapsedLabel,
    remainingLabel,
    progressPercent,
    selfAccepted,
    opponentAccepted,
    acceptTimeRemainingMs,
    matchCountdown,
    onAcceptMatch,
    onDeclineMatch,
    onSkipCountdown,
    onClose,
  }: Props = $props();

  let iframeLoaded = $state(false);

  const spectatorUrl = $derived(
    matchId && gameId
      ? `/matches/${matchId}/games/${gameId}?spectate&embed=true`
      : null,
  );

  // Reset loading state when game changes
  $effect(() => {
    if (gameId) {
      iframeLoaded = false;
    }
  });

  function handleOpenFullScreen(): void {
    if (matchId && gameId) {
      window.open(
        `/matches/${matchId}/games/${gameId}?spectate`,
        '_blank',
      );
    }
  }

  const acceptSeconds = $derived(Math.ceil(acceptTimeRemainingMs / 1000));

  const isQueued = $derived(queueStatus === 'queued');
  const isMatchReady = $derived(queueStatus === 'match_ready');
  const isMatchFound = $derived(queueStatus === 'match_found');

  const headerAccentClass = $derived(
    isMatchReady
      ? 'border-b-amber-500/40 bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.04] to-transparent'
      : isMatchFound
        ? 'border-b-emerald-500/40 bg-gradient-to-r from-emerald-500/[0.08] via-emerald-500/[0.04] to-transparent'
        : 'border-b-white/[0.06] bg-white/[0.02]',
  );
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) onClose(); }}>
  <Dialog.Portal>
    <Dialog.Overlay class="bg-black/80 backdrop-blur-sm" />

    <DialogPrimitive.Content
      class="fixed inset-3 z-50 flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950 shadow-2xl shadow-black/60 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:scale-95 data-[state=open]:scale-100 duration-200 sm:inset-6 lg:inset-x-[5vw] lg:inset-y-[5vh]"
    >
      <!-- Header -->
      <div
        class={cn(
          'flex shrink-0 items-center gap-3 border-b px-4 py-3 transition-colors duration-300',
          headerAccentClass,
        )}
      >
        <!-- Queue status (left) -->
        <div class="flex min-w-0 flex-1 items-center gap-3">
          {#if isQueued}
            <div class="flex items-center gap-2.5">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full animate-ping rounded-full bg-sky-400 opacity-60"></span>
                <span class="relative inline-flex size-2 rounded-full bg-sky-400"></span>
              </span>
              <span class="text-sm font-medium text-sky-200">Searching</span>
              <span class="text-xs tabular-nums text-slate-500">{elapsedLabel}</span>
            </div>

            <div class="hidden h-1.5 max-w-32 flex-1 overflow-hidden rounded-full bg-white/[0.06] sm:block">
              <div
                class="h-full rounded-full bg-sky-400/50 transition-all duration-1000"
                style="width: {progressPercent}%"
              ></div>
            </div>
          {:else if isMatchReady}
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <Swords class="size-4 text-amber-400" aria-hidden="true" />
                <span class="text-sm font-semibold text-amber-200">Match Found</span>
              </div>

              <div class="hidden items-center gap-1.5 sm:flex">
                <div class={cn(
                  'size-2 rounded-full transition-colors',
                  selfAccepted ? 'bg-emerald-400' : 'bg-white/20',
                )}></div>
                <div class={cn(
                  'size-2 rounded-full transition-colors',
                  opponentAccepted ? 'bg-emerald-400' : 'bg-white/20',
                )}></div>
              </div>

              <div class="flex items-center gap-1.5 text-xs text-amber-300/70">
                <Timer class="size-3" aria-hidden="true" />
                <span class="tabular-nums" aria-live="polite">{acceptSeconds}s</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                class="h-8 border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/5"
                onclick={onDeclineMatch}
              >
                Decline
              </Button>
              <Button
                size="sm"
                class="h-8 bg-amber-600 text-xs text-white hover:bg-amber-500"
                disabled={selfAccepted}
                onclick={onAcceptMatch}
              >
                {#if selfAccepted}
                  <Loader class="mr-1.5 size-3 animate-spin" />
                  Accepted
                {:else}
                  <CheckCircle class="mr-1.5 size-3" />
                  Accept
                {/if}
              </Button>
            </div>
          {:else if isMatchFound}
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2.5">
                <CheckCircle class="size-4 text-emerald-400" aria-hidden="true" />
                <span class="text-sm font-semibold text-emerald-200">Match Ready</span>
              </div>

              {#if matchCountdown !== null}
                <span class="inline-flex size-7 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15 text-sm font-bold tabular-nums text-emerald-200" aria-live="polite">
                  {matchCountdown}
                </span>
              {/if}
            </div>

            <Button
              size="sm"
              class="h-8 bg-emerald-600 text-xs text-white hover:bg-emerald-500"
              onclick={onSkipCountdown}
            >
              <Swords class="mr-1.5 size-3" />
              Join now
            </Button>
          {:else}
            <span class="text-sm text-slate-500">Spectating</span>
          {/if}
        </div>

        <!-- Right actions -->
        <div class="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
            onclick={handleOpenFullScreen}
          >
            <Maximize class="size-3.5" aria-hidden="true" />
            <span class="hidden sm:inline">Full screen</span>
          </button>

          <DialogPrimitive.Close
            class="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-300"
          >
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
      </div>

      <!-- Match ready alert banner — only shown when match_ready for extra visibility -->
      {#if isMatchReady && !selfAccepted}
        <div class="flex items-center justify-center gap-3 border-b border-amber-500/20 bg-amber-500/[0.06] px-4 py-2 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            class="h-8 border-white/10 bg-transparent text-xs text-slate-300 hover:bg-white/5"
            onclick={onDeclineMatch}
          >
            Decline
          </Button>
          <Button
            size="sm"
            class="h-8 bg-amber-600 text-xs text-white hover:bg-amber-500"
            onclick={onAcceptMatch}
          >
            <CheckCircle class="mr-1.5 size-3" />
            Accept
          </Button>
        </div>
      {/if}

      <!-- Spectator iframe body -->
      <div class="relative flex-1 overflow-hidden">
        {#if spectatorUrl}
          {#key gameId}
            <iframe
              src={spectatorUrl}
              title="Spectating live game"
              class="size-full border-0"
              allow="autoplay"
              onload={() => { iframeLoaded = true; }}
            ></iframe>
          {/key}

          <!-- Loading overlay -->
          {#if !iframeLoaded}
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950">
              <Loader class="size-6 animate-spin text-slate-500" />
              <p class="text-sm text-slate-500">Loading game...</p>
            </div>
          {/if}
        {:else}
          <div class="flex size-full items-center justify-center">
            <p class="text-sm text-slate-500">No game selected</p>
          </div>
        {/if}
      </div>

      <!-- Queue progress bar at bottom for queued state -->
      {#if isQueued}
        <div class="h-0.5 w-full bg-white/[0.04]">
          <div
            class="h-full bg-sky-400/40 transition-all duration-1000"
            style="width: {progressPercent}%"
          ></div>
        </div>
      {/if}
    </DialogPrimitive.Content>
  </Dialog.Portal>
</Dialog.Root>
