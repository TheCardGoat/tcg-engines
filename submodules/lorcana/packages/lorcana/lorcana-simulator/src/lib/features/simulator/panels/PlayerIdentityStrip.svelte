<script lang="ts">
  import SmartphoneIcon from "@lucide/svelte/icons/smartphone";
  import CircleDashedIcon from "@lucide/svelte/icons/circle-dashed";
  import TrophyIcon from "@lucide/svelte/icons/trophy";
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import { rankDisplayFromBracket } from "@/features/simulator/model/rank-display.js";

  interface PlayerIdentityStripProps {
    displayName: string | null;
    bracketId?: string | null;
    mmr?: number | null;
    isMobile?: boolean;
    compact?: boolean;
  }

  let {
    displayName,
    bracketId = null,
    mmr = null,
    isMobile = false,
    compact = false,
  }: PlayerIdentityStripProps = $props();

  const rank = $derived(rankDisplayFromBracket(bracketId));
  const isPlacement = $derived(rank?.bracketId === "placement");
  const mmrLabel = $derived(
    isPlacement ? "Placement" : Number.isFinite(mmr) ? `${Math.round(mmr ?? 0)} MMR` : null,
  );
  const hasVisibleContent = $derived(Boolean(displayName || rank || mmrLabel || isMobile));
</script>

{#if hasVisibleContent}
  <div
    class={`inline-flex min-w-0 items-center gap-1.5 rounded-full border border-white/12 bg-slate-950/88 text-[0.68rem] font-semibold text-slate-100 shadow-lg shadow-black/25 backdrop-blur ${compact ? "px-1.5 py-0.5" : "px-2 py-1"}`}
  >
  {#if displayName}
    <span class="max-w-32 truncate text-slate-100">{displayName}</span>
  {/if}

  {#if rank}
    <Tooltip.Root delayDuration={120}>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <span
            class="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/8"
            aria-label={`${rank.label} bracket`}
            {...props}
          >
            {#if rank.iconSrc}
              <img src={rank.iconSrc} alt="" class="size-4 rounded-full object-contain" />
            {:else}
              <CircleDashedIcon class="size-3.5 text-sky-200" aria-hidden="true" />
            {/if}
          </span>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="top"
        sideOffset={6}
        class="rounded-lg border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
      >
        {rank.label}
      </Tooltip.Content>
    </Tooltip.Root>
  {/if}

  {#if mmrLabel}
    <span class="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[0.62rem] text-amber-100 ring-1 ring-inset ring-amber-300/20">
      <TrophyIcon class="size-3 text-amber-300" aria-hidden="true" />
      <span>{mmrLabel}</span>
    </span>
  {/if}

  {#if isMobile}
    <Tooltip.Root delayDuration={120}>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <span
            class="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-sky-300/20 bg-sky-400/10 text-sky-100"
            aria-label="Playing on mobile"
            {...props}
          >
            <SmartphoneIcon class="size-3.5" aria-hidden="true" />
          </span>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="top"
        sideOffset={6}
        class="max-w-48 rounded-lg border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
      >
        Playing on mobile. They may miss chat more easily.
      </Tooltip.Content>
    </Tooltip.Root>
  {/if}
  </div>
{/if}
