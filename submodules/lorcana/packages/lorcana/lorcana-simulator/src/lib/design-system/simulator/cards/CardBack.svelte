<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import { AspectRatio } from "$lib/design-system/primitives/aspect-ratio/index.js";
  import type { ImageFormat } from "$lib/design-system/simulator/cards/card-image-format.js";
  import { maybeUseLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import { resolveLorcanaCardBack } from "@/features/simulator/model/player-visual-settings.js";
  import { getCdnFallbackUrl } from "$lib/config/public-url-config.js";

  interface CardBackProps {
    // Sizing
    displayWidth: number;
    displayHeight: number;
    useContainerSize?: boolean;
    imageFormat?: ImageFormat;

    // Visual states
    isGhost?: boolean;
    isPlayable?: boolean;
    isExerted?: boolean;
    ownerId?: string | null;
    cardBackSrc?: string;
    cardBackSquareSrc?: string;
    cardBackId?: string;

    // Aspect ratio
    aspectRatio?: number;
  }

  let {
    displayWidth,
    displayHeight,
    useContainerSize = false,
    imageFormat = "full",
    isGhost = false,
    isPlayable = false,
    isExerted = false,
    ownerId,
    cardBackSrc,
    cardBackSquareSrc,
    cardBackId,
    aspectRatio = 63 / 88,
  }: CardBackProps = $props();

  const board = maybeUseLorcanaBoardPresenter();
  const resolvedCardBack = $derived.by(() => {
    if (cardBackSrc) {
      return {
        id: cardBackId ?? cardBackSrc,
        src: cardBackSrc,
        artOnlySrc: cardBackSquareSrc ?? cardBackSrc,
      };
    }

    if (ownerId && board) {
      return board.getPlayerVisualSettingsByOwnerId(ownerId).cardBack;
    }

    return resolveLorcanaCardBack();
  });
  const backImageSrc = $derived(
    imageFormat === "art_only" ? resolvedCardBack.artOnlySrc : resolvedCardBack.src,
  );
  const isArtOnlyFallback = $derived(
    imageFormat === "art_only" && resolvedCardBack.artOnlySrc === resolvedCardBack.src,
  );
</script>

<div
  class="card-back relative overflow-hidden shadow-lg"
  class:card-back--playable={isPlayable}
  class:card-back--exerted={isExerted}
  class:opacity-50={isGhost}
  style:width={useContainerSize ? `var(--zone-card-width, ${displayWidth}px)` : `${displayWidth}px`}
  style:height={useContainerSize ? `var(--zone-card-height, ${displayHeight}px)` : `${displayHeight}px`}
  role="img"
  aria-label={m["sim.card.faceDownAria"]({})}
  data-card-back-id={resolvedCardBack.id}
  data-owner-id={ownerId}
>
  <AspectRatio ratio={aspectRatio} class="w-full h-full">
    <img
      src={backImageSrc}
      alt={m["sim.card.backAlt"]({})}
      class="card-back__image w-full h-full object-cover"
      class:card-back__image--art-only-fallback={isArtOnlyFallback}
      loading="lazy"
      data-card-back-src={backImageSrc}
      onerror={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        const fallback = getCdnFallbackUrl(img.src);
        if (fallback) img.src = fallback;
      }}
    />
  </AspectRatio>

  {#if isPlayable}
    <div class="playable-indicator"></div>
  {/if}
</div>

<style>
  .card-back {
    border-radius: 8px;
    border: 2px solid rgba(100, 150, 200, 0.3);
    background: radial-gradient(circle at 50% 50%, #1e4a6e 0%, #0f2847 60%, #061220 100%);
    transform-origin: center center;
    transition: transform 150ms ease-out, box-shadow 150ms ease-out, filter 150ms ease-out;
  }

  .card-back__image {
    object-position: center;
  }

  .card-back--playable {
    box-shadow: 0 0 18px rgba(250, 204, 21, 0.38);
  }

  .card-back--exerted {
    transform: rotate(20deg) scale(0.96);
    border-color: rgba(245, 158, 11, 0.45);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(245, 158, 11, 0.14),
      inset 0 -8px 16px rgba(245, 158, 11, 0.18);
  }

  .playable-indicator {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 8px;
    height: 8px;
    background: #facc15;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(250, 204, 21, 0.88);
    animation: playable-pulse 2s ease-in-out infinite;
    z-index: 10;
  }

  @keyframes playable-pulse {
    0%,
    100% {
      opacity: 0.6;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .playable-indicator {
      animation: none;
    }
  }
</style>
