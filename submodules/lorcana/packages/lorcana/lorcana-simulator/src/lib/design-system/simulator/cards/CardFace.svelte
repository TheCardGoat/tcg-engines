<script lang="ts">
import { createEventDispatcher } from "svelte";
import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
import type { LorcanaCardSnapshot } from "$lib/lorcana-simulator";
import { m } from "$lib/i18n/messages.js";
import CardImage from "$lib/design-system/simulator/cards/CardImage.svelte";
import type { ImageFormat } from "$lib/design-system/simulator/cards/card-image-format.js";
import CardGrantSourceBadges from "@/design-system/simulator/cards/CardGrantSourceBadges.svelte";
import CardTagStrip from "@/design-system/simulator/cards/CardTagStrip.svelte";
import {
	getLorcanaCardTagGroups,
	type LorcanaCardStatBadge,
} from "./card-tags.js";

type CardSize =
	| "micro"
	| "tiny"
	| "small"
	| "small-plus"
	| "medium"
	| "large"
	| "x-large";

interface CardFaceProps {
	// Card data
	card?: LorcanaCardSnapshot;

	// Sizing
	displayWidth: number;
	displayHeight: number;
	useContainerSize?: boolean;
	size?: CardSize;
	imageFormat?: ImageFormat;
	aspectRatio: number;

	// Visual states
	isSelected?: boolean;
	isExerted?: boolean;
	isGhost?: boolean;
	isDraggable?: boolean;
	isPlayable?: boolean;
	isValidTarget?: boolean;
	isInvalidTarget?: boolean;
	isBanishedPreview?: boolean;
	isQuesting?: boolean;
	isDrying?: boolean;
	damage?: number;
	tagCollapseMode?: "none" | "hover-stack";
	hideSupplementalBadges?: boolean;
	/** Suppress the overlay stat pills. Used when stats are rendered
	 * externally (e.g. in play-zone bands above/below the card). */
	hideStatBadges?: boolean;
}

let {
	card,
	displayWidth,
	displayHeight,
	useContainerSize = false,
	size = "medium",
	imageFormat = "full",
	aspectRatio,
	isSelected = false,
	isExerted = false,
	isGhost = false,
	isDraggable = false,
	isPlayable = false,
	isValidTarget = false,
	isInvalidTarget = false,
	isBanishedPreview = false,
	isQuesting = false,
	isDrying = false,
	damage = 0,
	tagCollapseMode = "none",
	hideSupplementalBadges = false,
	hideStatBadges = false,
}: CardFaceProps = $props();

// Image loading state
let imageLoaded = $state(false);
let imageError = $state(false);
let isHovering = $state(false);
const dispatch = createEventDispatcher<{
	pointerenter: { event: MouseEvent };
	pointerleave: void;
	select: { event: MouseEvent };
	contextmenu: { event: MouseEvent };
}>();

function getCost(): string {
  if (card?.playCost !== undefined) {
    return String(card.playCost);
  }
	if (card?.cost !== undefined) {
		return String(card.cost);
	}
	if (card?.definitionId) {
		const match = card.definitionId.match(/-(\d+)$/);
		return match ? match[1] : "0";
	}
	return "0";
}

function getCardLabel(): string {
	return card?.label ?? m["sim.card.unknown"]({});
}

function handleMouseEnter(event: MouseEvent) {
	if (!isGhost) {
		isHovering = true;
	}
	dispatch("pointerenter", { event });
}

function handleMouseLeave() {
	isHovering = false;
	dispatch("pointerleave");
}

function handleClick(event: MouseEvent) {
	dispatch("select", { event });
}

function handleContextMenu(event: MouseEvent) {
	event.preventDefault();
	dispatch("contextmenu", { event });
}

function handleImageLoad() {
	imageLoaded = true;
}

function handleImageError() {
	imageError = true;
}

function getBadgeToneClass(tone: LorcanaCardStatBadge["tone"]): string {
	switch (tone) {
		case "success":
			return "border-emerald-400/35 bg-emerald-500/16 text-emerald-100";
		case "warning":
			return "border-amber-400/35 bg-amber-500/18 text-amber-50";
		default:
			return "border-sky-400/35 bg-sky-500/16 text-sky-100";
	}
}

function groupEffectSources(cardSnapshot: LorcanaCardSnapshot | undefined) {
  const grouped = new Map<
    string,
    {
      sourceCardId: string;
      sourceLabel: string;
      sourceSet?: string;
      sourceCardNumber?: number;
      sourceInkType?: string[];
      grants: string[];
    }
  >();

  for (const effect of cardSnapshot?.activeEffects ?? []) {
    if (!effect.sourceCardId || !effect.sourceLabel) {
      continue;
    }

    const existing = grouped.get(effect.sourceCardId);
    if (existing) {
      if (!existing.grants.includes(effect.label)) {
        existing.grants.push(effect.label);
      }
      continue;
    }

    grouped.set(effect.sourceCardId, {
      sourceCardId: effect.sourceCardId,
      sourceLabel: effect.sourceLabel,
      sourceSet: effect.sourceSet,
      sourceCardNumber: effect.sourceCardNumber,
      sourceInkType: effect.sourceInkType,
      grants: [effect.label],
    });
  }

  return [...grouped.values()];
}

const tagGroups = $derived(
	card ? getLorcanaCardTagGroups(card) : { tags: [], statModifiers: [], statBadges: [] },
);
const cardTags = $derived(tagGroups.tags.filter((tag) => tag.id !== "damage"));
const statBadges = $derived(tagGroups.statBadges);
const effectSourceGroups = $derived(groupEffectSources(card));
// Corner stat badges scale with card size so they read at a glance on the
// larger play-zone cards without overwhelming tiny hand/inkwell variants.
const badgeSizeClass = $derived(
	size === "micro" || size === "tiny"
		? "h-5 w-5"
		: size === "small" || size === "small-plus"
			? "h-7 w-7"
			: "h-9 w-9",
);
const badgeValueClass = $derived(
	size === "micro" || size === "tiny"
		? "text-[0.56rem]"
		: size === "small" || size === "small-plus"
			? "text-[0.72rem]"
			: "text-[0.9rem]",
);
// Damage counter sits in the middle of the card. Upscale at readable sizes so
// players can see damage state without squinting.
const damageIndicatorClass = $derived(
	size === "micro" || size === "tiny"
		? "text-xs px-2 py-1"
		: size === "small" || size === "small-plus"
			? "text-base px-2.5 py-1"
			: "px-[0.6em] py-[0.3em]",
);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
        role="button"
        tabindex="0"
  class="card-face"
  class:card-face--selected={isSelected}
  class:card-face--exerted={isExerted}
  class:card-face--ghost={isGhost}
  class:card-face--draggable={isDraggable}
  class:card-face--playable={isPlayable}
  class:card-face--valid-target={isValidTarget}
  class:card-face--invalid-target={isInvalidTarget}
  class:card-face--questing={isQuesting}
  class:card-face--drying={isDrying}
  class:card-face--damaged={damage > 0}
  style:width={useContainerSize ? `var(--zone-card-width, ${displayWidth}px)` : `${displayWidth}px`}
  style:height={useContainerSize ? `var(--zone-card-height, ${displayHeight}px)` : `${displayHeight}px`}
  style:transform={isHovering && !isGhost ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"}
  data-card-id={card?.cardId}
  data-card-size={size}
  data-player-id={card?.ownerId}
  data-zone-id={card?.zoneId}
  onclick={handleClick}
  oncontextmenu={handleContextMenu}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  aria-label={m["sim.card.ariaLabel"]({ label: getCardLabel(), cost: getCost() })}
>
      <div
        class="card-frame w-full h-full relative overflow-hidden"
        class:grayscale={isBanishedPreview}
      >
      <!-- Card Art Area (fills entire card) -->
      <div class="absolute inset-0 flex items-center justify-center">
        {#if card?.set && card?.cardNumber}
          <!-- Real Card Image -->
          <div data-testid={`${card.set}-${card.cardNumber}-${imageFormat}`} class="card-image-wrapper absolute inset-0 z-[1]" class:loaded={imageLoaded}>
            <CardImage
              set={card.set}
              number={card.cardNumber}
              crop={imageFormat}
              alt={getCardLabel()}
              class="card-image w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        {/if}

        <!-- Placeholder (shown while loading, on error, or when no image) -->
        <div class="art-placeholder w-full h-full flex items-center justify-center p-2 border border-white/5" class:hidden={imageLoaded && !imageError}>
          <div class="flex flex-col items-center justify-center">
            <!-- Center: Card Name -->
            <div class="flex flex-col items-center text-center gap-[0.15rem] px-2">
              {#if getCardLabel().includes(" - ")}
                {@const [name, version] = getCardLabel().split(" - ")}
                <span class="text-[0.65rem] font-bold text-slate-200 leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{name}</span>
                <span class="text-[0.5rem] font-medium text-slate-400 italic leading-tight">{version}</span>
              {:else}
                <span class="text-[0.65rem] font-bold text-slate-200 leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{getCardLabel()}</span>
              {/if}
            </div>
          </div>
        </div>

        <!-- Questing Overlay -->
        {#if isQuesting}
          <div class="questing-overlay absolute inset-0 flex items-center justify-center bg-yellow-400/15">
            <span class="text-1.5rem text-yellow-400 [text-shadow:0_0_10px_rgba(255,215,0,0.8)] animate-quest-icon-spin">✦</span>
          </div>
        {/if}
      </div>

      <!-- Damage Counter (community-standard center overlay) -->
      {#if damage > 0}
        <div
          data-testid="card-face-damage-indicator"
          class={`damage-indicator absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-md bg-red-500/90 font-extrabold text-white shadow-[0_0_15px_rgba(239,68,68,0.6)] ${damageIndicatorClass}`}
        >
          <span>-{damage}</span>
        </div>
      {/if}

      <!-- Stat badges (top-right corner, stacked: strength → willpower → lore) -->
      {#if !hideStatBadges && statBadges.length > 0}
        <div
          data-testid="card-face-stat-badges"
          class="pointer-events-none absolute top-1.5 right-1.5 z-[21] flex flex-col items-end gap-1"
        >
          {#each statBadges as badge (badge.id)}
            <Tooltip.Root>
              <Tooltip.Trigger>
                {#snippet child({ props })}
                  <button
                    type="button"
                    {...props}
                    data-testid={`card-face-stat-badge-${badge.stat}`}
                    class={`pointer-events-auto relative flex items-center justify-center rounded-full border backdrop-blur-sm ${badgeSizeClass} ${getBadgeToneClass(badge.tone)}`}
                    aria-label={badge.label}
                  >
                    <img src={badge.iconUrl} alt="" class="absolute inset-0 m-auto h-full w-full opacity-75" />
                    <span class={`relative leading-none font-bold tabular-nums ${badgeValueClass}`}>
                      {badge.currentValue}
                    </span>
                  </button>
                {/snippet}
              </Tooltip.Trigger>
              <Tooltip.Content
                side="top"
                sideOffset={6}
                class="rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-1.5 text-[0.7rem] leading-snug text-slate-100 shadow-xl"
              >
                <div class="font-semibold">{badge.label}</div>
              </Tooltip.Content>
            </Tooltip.Root>
          {/each}
        </div>
      {/if}

      {#if !hideSupplementalBadges && cardTags.length > 0}
        <div
          data-testid="card-face-tag-strip"
          class="pointer-events-none absolute inset-x-1.5 bottom-1.5 z-20"
        >
          <CardTagStrip
            tags={cardTags}
            maxVisible={4}
            compact
            collapseMode={tagCollapseMode}
            class="justify-start"
          />
        </div>
      {/if}

    </div>

  <!-- Selection Indicator -->
  {#if isSelected}
    <div class="selection-indicator absolute -inset-1 border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)] pointer-events-none animate-selection-pulse z-20"></div>
  {/if}

  <!-- Playable Glow -->
  {#if isPlayable && !isValidTarget}
    <div class="playable-glow absolute -inset-0.5 pointer-events-none animate-playable-pulse"></div>
  {/if}

  <!-- Valid Target Indicator -->
  {#if isValidTarget && !isSelected}
    <div
      class="valid-target-indicator absolute -inset-1 pointer-events-none z-20"
      aria-hidden="true"
    ></div>
  {/if}

</div>

<style>
  .card-face {
    --card-bg: linear-gradient(135deg, #2a4365 0%, #1a365d 100%);
    --card-border: rgba(100, 150, 200, 0.4);
    --card-glow: rgba(100, 180, 255, 0.3);
    --selected-glow: rgba(245, 158, 11, 0.6);
    --playable-highlight: rgba(250, 204, 21, 0.95);
    --playable-glow: rgba(250, 204, 21, 0.58);
    --valid-target-highlight: rgba(56, 189, 248, 0.95);
    --valid-target-glow: rgba(56, 189, 248, 0.5);
    --questing-glow: rgba(255, 215, 0, 0.4);
    --card-corner-radius: 0.42rem;
    --card-overlay-radius: 0.58rem;

    position: relative;
    background: transparent;
    padding: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    will-change: transform;
    transition: transform 0.1s ease-out;
    container-type: size;
  }

  .card-face[data-card-size="tiny"],
  .card-face[data-card-size="micro"] {
    --card-corner-radius: 0.32rem;
    --card-overlay-radius: 0.46rem;
  }

  .card-frame {
    border-radius: var(--card-corner-radius);
    background: var(--card-bg);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition:
      filter 75ms ease-out,
      box-shadow 75ms ease-out,
      border-color 75ms ease-out;
  }

  .card-image-wrapper {
    border-radius: var(--card-corner-radius);
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  .card-image-wrapper.loaded {
    opacity: 1;
  }

  .card-image {
    border-radius: var(--card-corner-radius);
  }

  .art-placeholder {
    border-radius: var(--card-corner-radius);
    background:
      radial-gradient(ellipse at 30% 30%, rgba(100, 180, 255, 0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 70%, rgba(100, 255, 200, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, rgba(30, 60, 100, 0.5) 0%, rgba(20, 40, 70, 0.5) 100%);
    transition: opacity 0.3s ease-out;
  }

  .art-placeholder.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .questing-overlay,
  .selection-indicator,
  .playable-glow,
  .valid-target-indicator {
    border-radius: var(--card-overlay-radius);
  }

  /* STATE MODIFIERS */

  /* Hover State */
  .card-face:hover:not(.card-face--ghost) .card-frame {
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.4),
      0 0 20px var(--card-glow),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(100, 180, 255, 0.6);
  }

  /* Selected State */
  .card-face--selected .card-frame {
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.5),
      0 0 25px var(--selected-glow),
      inset 0 0 0 2px rgba(245, 158, 11, 0.9);
    border-color: #f59e0b;
  }

  .selection-indicator {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(251, 191, 36, 0.08));
  }

  /* Exerted State */
  .card-face--exerted {
    transform: rotate(20deg) scale(0.96) !important;
  }

  .card-face--exerted .card-frame {
    border-color: rgba(245, 158, 11, 0.5);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(245, 158, 11, 0.16),
      inset 0 -8px 16px rgba(245, 158, 11, 0.18);
  }

  /* Ghost State */
  .card-face--ghost {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Draggable State */
  .card-face--draggable {
    cursor: grab;
  }

  .card-face--draggable:active {
    cursor: grabbing;
  }

  /* Playable State */
  .card-face--playable .card-frame {
    border: 2px solid var(--playable-highlight);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 15px var(--playable-glow);
  }

  .playable-glow {
    background: linear-gradient(135deg, rgba(250, 204, 21, 0.28), rgba(245, 158, 11, 0.14));
    opacity: 0.78;
  }

  /* Valid Target State */
  .card-face--valid-target:not(.card-face--selected) .card-frame {
    border: 2px solid var(--valid-target-highlight);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 16px var(--valid-target-glow),
      inset 0 0 0 1px rgba(186, 230, 253, 0.65);
  }

  .valid-target-indicator {
    border: 2px dashed rgba(186, 230, 253, 0.95);
    box-shadow: 0 0 18px rgba(56, 189, 248, 0.42);
    animation: valid-target-breathe 1.6s ease-in-out infinite;
  }

  @keyframes valid-target-breathe {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  /* Questing State */
  .card-face--questing .card-frame {
    animation: questing-pulse 1s ease-in-out infinite;
  }

  @keyframes questing-pulse {
    0%,
    100% {
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 10px var(--questing-glow);
    }
    50% {
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.3),
        0 0 25px var(--questing-glow);
    }
  }

  /* Invalid Target State */
  .card-face--invalid-target .card-frame {
    filter: brightness(0.6) grayscale(0.4);
    border-color: rgba(248, 113, 113, 0.7);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 12px rgba(248, 113, 113, 0.45);
  }

  /* Damaged State */
  .card-face--damaged .card-frame {
    border-color: rgba(239, 68, 68, 0.5);
  }

  /* Drying State - requires ::after pseudo-element */
  .card-face--drying .card-frame::after {
    content: "";
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      rgba(148, 163, 184, 0.18),
      rgba(148, 163, 184, 0.18) 6px,
      rgba(148, 163, 184, 0.05) 6px,
      rgba(148, 163, 184, 0.05) 12px
    );
    pointer-events: none;
    z-index: 5;
  }

  /* Responsive damage indicator for medium and larger cards */
  .card-face[data-card-size="medium"] .damage-indicator,
  .card-face[data-card-size="large"] .damage-indicator,
  .card-face[data-card-size="x-large"] .damage-indicator {
    font-size: clamp(0.75rem, 6cqw, 1.5rem);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .card-face,
    .card-image-wrapper,
    .art-placeholder,
    .playable-glow,
    .valid-target-indicator,
    .selection-indicator,
    .questing-overlay span,
    .card-face--questing .card-frame,
    .damage-indicator {
      animation: none !important;
      transition: none !important;
    }
  }

</style>
