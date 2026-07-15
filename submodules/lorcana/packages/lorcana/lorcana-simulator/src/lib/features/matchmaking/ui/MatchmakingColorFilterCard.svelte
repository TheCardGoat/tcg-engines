<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '$lib/design-system/primitives/card';
  import { cn } from '$lib/utils.js';
  import { getInkSymbolUrl } from '@/features/simulator/model/asset-urls.js';
  import {
    LORCANA_INK,
    LORCANA_INK_NAMES,
    type LorcanaInkName,
  } from '@/features/simulator/model/lorcana-colors.js';
  import {
    SURFACE_CARD_CLASS,
    EYEBROW_CLASS,
  } from './matchmaking-lobby.constants.js';
  import Info from '@lucide/svelte/icons/info';
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import * as Tooltip from '$lib/design-system/primitives/tooltip/index.js';

  /** Bitmask mapping: amber=1, amethyst=2, emerald=4, ruby=8, sapphire=16, steel=32 */
  const INK_BITS: Record<LorcanaInkName, number> = {
    amber: 1,
    amethyst: 2,
    emerald: 4,
    ruby: 8,
    sapphire: 16,
    steel: 32,
  };

  interface Props {
    preferredColors: number;
    excludedColors: number;
    strength: 'required' | 'preferred';
    disabled: boolean;
    onUpdate: (
      preferred: number,
      excluded: number,
      strength: 'required' | 'preferred',
    ) => void;
  }

  let { preferredColors, excludedColors, strength, disabled, onUpdate }: Props =
    $props();

  let expanded = $state(false);

  function inkLabel(ink: LorcanaInkName): string {
    return ink.charAt(0).toUpperCase() + ink.slice(1);
  }

  function hasBit(mask: number, ink: LorcanaInkName): boolean {
    return (mask & INK_BITS[ink]) !== 0;
  }

  function countBits(mask: number): number {
    if (mask < 0) return 0;
    let n = 0;
    let m = mask;
    while (m) {
      n += m & 1;
      m >>= 1;
    }
    return n;
  }

  function togglePreferred(ink: LorcanaInkName): void {
    if (disabled) return;
    let next = preferredColors;
    if (hasBit(next, ink)) {
      next &= ~INK_BITS[ink];
    } else {
      if (countBits(next) >= 2) {
        // Remove the lowest set bit to make room
        next &= next - 1;
      }
      next |= INK_BITS[ink];
    }
    onUpdate(next, excludedColors, strength);
  }

  function toggleExcluded(ink: LorcanaInkName): void {
    if (disabled) return;
    let next = excludedColors;
    if (hasBit(next, ink)) {
      next &= ~INK_BITS[ink];
    } else {
      if (countBits(next) >= 2) {
        next &= next - 1;
      }
      next |= INK_BITS[ink];
    }
    onUpdate(preferredColors, next, strength);
  }

  function setStrength(s: 'required' | 'preferred'): void {
    if (disabled) return;
    onUpdate(preferredColors, excludedColors, s);
  }

  const hasAnyPreference = $derived(preferredColors > 0 || excludedColors > 0);

  // Auto-expand when preferences are set from outside (e.g. restored from state)
  $effect(() => {
    if (hasAnyPreference) expanded = true;
  });
</script>

<!-- Collapsed / trigger row -->
<button
  type="button"
  class="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
  onclick={() => {
    expanded = !expanded;
  }}
  aria-expanded={expanded}
>
  <div class="flex items-center gap-2.5 min-w-0">
    <div class="flex gap-0.5 shrink-0" aria-hidden="true">
      {#each LORCANA_INK_NAMES as ink}
        <img
          src={getInkSymbolUrl(ink)}
          alt=""
          aria-hidden="true"
          class={cn(
            'size-4 shrink-0 object-contain transition-opacity',
            hasBit(preferredColors, ink)
              ? 'opacity-100'
              : hasBit(excludedColors, ink)
                ? 'opacity-30 grayscale'
                : 'opacity-40',
          )}
        />
      {/each}
    </div>
    <div class="min-w-0">
      <p class="text-sm font-medium text-slate-200 leading-none">
        Opponent Color Filter
        {#if hasAnyPreference}
          <span
            class="ml-1.5 rounded-full bg-sky-500/20 px-1.5 py-0.5 text-[0.65rem] font-semibold text-sky-300"
          >
            {countBits(preferredColors) + countBits(excludedColors)} active
          </span>
        {/if}
      </p>
      <p class="mt-0.5 text-xs text-slate-500">
        {hasAnyPreference
          ? (strength === 'required' ? 'Required' : 'Suggested') + ''
          : 'Optional · Quick match only'}
      </p>
    </div>
  </div>
  <div class="flex items-center gap-2 shrink-0">
    <Tooltip.Root delayDuration={120}>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <span
            class="text-slate-500 hover:text-slate-300 transition-colors"
            onclick={(e) => e.stopPropagation()}
            {...props}
          >
            <Info class="size-3.5" aria-hidden="true" />
            <span class="sr-only">Color preference info</span>
          </span>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="top"
        class="max-w-60 border border-white/15 bg-slate-950/98 px-2.5 py-1.5 text-xs text-slate-100 shadow-xl"
      >
        Filter which ink colors you face. Suggested preferences relax after 60 s
        if no compatible opponent is found.
      </Tooltip.Content>
    </Tooltip.Root>
    <ChevronDown
      class={cn(
        'size-4 text-slate-400 transition-transform duration-200',
        expanded && 'rotate-180',
      )}
      aria-hidden="true"
    />
  </div>
</button>

{#if expanded}
  <CardContent class="space-y-5 pt-0">
    <!-- Play against section -->
    <div class="space-y-2">
      <p class={cn(EYEBROW_CLASS, 'text-slate-400')}>Play against</p>
      <p class="text-xs text-slate-500">
        Select up to 2 ink colors you want to face.
      </p>
      <div class="flex flex-wrap gap-2">
        {#each LORCANA_INK_NAMES as ink}
          {@const isSelected = hasBit(preferredColors, ink)}
          {@const isBlockedByExclude = hasBit(excludedColors, ink)}
          {@const hex = LORCANA_INK[ink].hex}
          <button
            type="button"
            disabled={disabled || isBlockedByExclude}
            onclick={() => togglePreferred(ink)}
            class={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-all',
              isSelected
                ? 'border-transparent text-white shadow-[0_0_10px_0_var(--ink-color)]'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-white',
              isBlockedByExclude && 'cursor-not-allowed opacity-30',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            style={isSelected
              ? `background-color: ${hex}40; border-color: ${hex}80; --ink-color: ${hex}60;`
              : ''}
            aria-pressed={isSelected}
            title={inkLabel(ink)}
          >
            <img
              src={getInkSymbolUrl(ink)}
              alt=""
              aria-hidden="true"
              class="size-4 shrink-0 object-contain"
              width="16"
              height="16"
            />
            <span>{inkLabel(ink)}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Avoid section -->
    <div class="space-y-2">
      <p class={cn(EYEBROW_CLASS, 'text-slate-400')}>Avoid</p>
      <p class="text-xs text-slate-500">
        Select up to 2 ink colors you want to avoid.
      </p>
      <div class="flex flex-wrap gap-2">
        {#each LORCANA_INK_NAMES as ink}
          {@const isSelected = hasBit(excludedColors, ink)}
          {@const isBlockedByPrefer = hasBit(preferredColors, ink)}
          {@const hex = LORCANA_INK[ink].hex}
          <button
            type="button"
            disabled={disabled || isBlockedByPrefer}
            onclick={() => toggleExcluded(ink)}
            class={cn(
              'flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-all',
              isSelected
                ? 'border-rose-500/60 bg-rose-500/15 text-rose-200'
                : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-white',
              isBlockedByPrefer && 'cursor-not-allowed opacity-30',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            aria-pressed={isSelected}
            title={inkLabel(ink)}
          >
            <img
              src={getInkSymbolUrl(ink)}
              alt=""
              aria-hidden="true"
              class="size-4 shrink-0 object-contain"
              width="16"
              height="16"
            />
            <span>{inkLabel(ink)}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Strength toggle -->
    {#if hasAnyPreference}
      <div class="space-y-2">
        <p class={cn(EYEBROW_CLASS, 'text-slate-400')}>Preference type</p>
        <div
          class="inline-flex rounded-full border border-white/10 bg-black/35 p-1"
          role="group"
          aria-label="Preference strength"
        >
          <button
            type="button"
            class={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              strength === 'preferred'
                ? 'bg-white text-slate-950'
                : 'text-slate-300 hover:bg-white/8 hover:text-white',
            )}
            {disabled}
            onclick={() => setStrength('preferred')}
          >
            Suggested
          </button>
          <button
            type="button"
            class={cn(
              'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              strength === 'required'
                ? 'bg-white text-slate-950'
                : 'text-slate-300 hover:bg-white/8 hover:text-white',
            )}
            {disabled}
            onclick={() => setStrength('required')}
          >
            Required
          </button>
        </div>
        <p class="text-xs text-slate-500">
          {#if strength === 'preferred'}
            Preferences are relaxed after 60 s if no matching opponent is found.
          {:else}
            Required preferences are never relaxed — wait times may be longer.
          {/if}
        </p>
      </div>
    {/if}

    <!-- Clear button -->
    {#if hasAnyPreference && !disabled}
      <button
        type="button"
        onclick={() => onUpdate(0, 0, strength)}
        class="text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
      >
        Clear preferences
      </button>
    {/if}
  </CardContent>
{/if}
