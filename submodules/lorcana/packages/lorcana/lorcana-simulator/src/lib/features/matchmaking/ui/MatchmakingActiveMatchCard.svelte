<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/design-system/primitives/card";
  import { m } from "$lib/i18n/messages.js";
  import { cn } from "$lib/utils.js";
  import { EYEBROW_CLASS, SURFACE_CARD_CLASS } from "./matchmaking-lobby.constants.js";
  import AlertCircle from "@lucide/svelte/icons/alert-circle";
  import CheckCircle from "@lucide/svelte/icons/check-circle-2";
  import Loader from "@lucide/svelte/icons/loader-circle";
  import Swords from "@lucide/svelte/icons/swords";
  import X from "@lucide/svelte/icons/x";

  interface Props {
    activeMatchId: string | null;
    forfeiting: boolean;
    forfeitSuccess: boolean;
    onRejoinMatch: () => void | Promise<void>;
    onForfeitMatch: () => void | Promise<void>;
  }

  let {
    activeMatchId,
    forfeiting,
    forfeitSuccess,
    onRejoinMatch,
    onForfeitMatch,
  }: Props = $props();

  let confirmingForfeit = $state(false);
</script>

{#if activeMatchId}
  <Card class={cn(SURFACE_CARD_CLASS, "border-amber-500/30 bg-amber-500/10")}>
    <CardHeader class="space-y-2 pb-3">
      <p class={cn(EYEBROW_CLASS, "text-amber-100/80")}>
        {m["sim.matchmaking.activeMatch.eyebrow"]({})}
      </p>
      <CardTitle class="flex items-center gap-2 text-xl tracking-tight text-amber-50">
        <AlertCircle class="size-5 text-amber-300" aria-hidden="true" />
        {m["sim.matchmaking.queue.blocked.activeMatch"]({})}
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <p class="text-sm leading-6 text-amber-100/85">
        {m["sim.matchmaking.activeMatch.description"]({})}
      </p>

      {#if forfeitSuccess}
        <div class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-200">
          <CheckCircle class="size-4 text-emerald-400" aria-hidden="true" />
          {m["sim.matchmaking.activeMatch.forfeitSuccess"]({})}
        </div>
      {:else if forfeiting}
        <div class="inline-flex items-center gap-1.5 text-sm font-medium text-amber-200/80">
          <Loader class="size-4 animate-spin" aria-hidden="true" />
          {m["sim.matchmaking.activeMatch.forfeiting"]({})}
        </div>
      {:else}
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onclick={onRejoinMatch}
            class="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-500/30"
          >
            <Swords class="size-4" aria-hidden="true" />
            {m["sim.matchmaking.activeMatch.returnToMatch"]({})}
          </button>

          {#if confirmingForfeit}
            <span class="inline-flex flex-wrap items-center gap-1.5 text-sm text-rose-200">
              {m["sim.matchmaking.activeMatch.confirmForfeit"]({})}
              <button
                type="button"
                onclick={() => {
                  confirmingForfeit = false;
                  onForfeitMatch();
                }}
                class="rounded-lg bg-rose-500/25 px-2.5 py-1 text-sm font-medium text-rose-100 transition-colors hover:bg-rose-500/40"
              >
                {m["sim.matchmaking.activeMatch.confirmForfeitCta"]({})}
              </button>
              <button
                type="button"
                onclick={() => {
                  confirmingForfeit = false;
                }}
                class="rounded-lg bg-white/10 px-2.5 py-1 text-sm font-medium text-slate-300 transition-colors hover:bg-white/15"
              >
                {m["sim.matchmaking.activeMatch.cancelForfeit"]({})}
              </button>
            </span>
          {:else}
            <button
              type="button"
              onclick={() => {
                confirmingForfeit = true;
              }}
              class="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-rose-500/15 px-4 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/25"
            >
              <X class="size-4" aria-hidden="true" />
              {m["sim.matchmaking.activeMatch.quitMatch"]({})}
            </button>
          {/if}
        </div>
      {/if}
    </CardContent>
  </Card>
{/if}
