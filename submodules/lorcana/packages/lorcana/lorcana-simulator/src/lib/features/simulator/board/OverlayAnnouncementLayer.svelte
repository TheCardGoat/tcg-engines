<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import type { ResolvedOverlayAnnouncement } from "@/features/simulator/animations/overlay-announcement-animations.js";
  import { watchCssAnimation } from "@/features/simulator/animations/animation-shared.js";

  const board = useLorcanaBoardPresenter();
  const announcements = $derived(board.overlayAnnouncements);

  function onOverlayFinished(id: string): void {
    board.onOverlayAnnouncementFinished(id);
  }

  function getLabel(announcement: ResolvedOverlayAnnouncement): { title: string; subtitle: string } {
    if (announcement.kind === "turn-change" && announcement.turnChange) {
      const isOwner = announcement.turnChange.nextPlayerSide === board.ownerSide;
      return {
        title: m["sim.overlay.turnChange.title"]({ turnNumber: String(announcement.turnChange.turnNumber) }),
        subtitle: isOwner
          ? m["sim.overlay.turnChange.subtitle.you"]({})
          : m["sim.overlay.turnChange.subtitle.opponentFallback"]({}),
      };
    }

    if (announcement.kind === "concede" && announcement.concede) {
      const isOwner = announcement.concede.concedingSide === board.ownerSide;
      return {
        title: m["sim.overlay.concede.title"]({}),
        subtitle: isOwner
          ? m["sim.overlay.concede.subtitle.you"]({})
          : m["sim.overlay.concede.subtitle.opponent"]({}),
      };
    }

    if (announcement.kind === "mulligan" && announcement.mulligan) {
      const count = announcement.mulligan.mulliganCount;
      const isOwner = announcement.mulligan.actorSide === board.ownerSide;
      const subtitle = count > 0
        ? isOwner
          ? m["sim.overlay.mulligan.subtitle.swapped.you"]({ count: String(count) })
          : m["sim.overlay.mulligan.subtitle.swapped.opponent"]({ count: String(count) })
        : isOwner
          ? m["sim.overlay.mulligan.subtitle.kept.you"]({})
          : m["sim.overlay.mulligan.subtitle.kept.opponent"]({});
      return {
        title: m["sim.overlay.mulligan.title"]({}),
        subtitle,
      };
    }

    return { title: "", subtitle: "" };
  }
</script>

<div class="overlay-announcement-layer" aria-hidden="true">
  {#each announcements as announcement (announcement.id)}
    {@const label = getLabel(announcement)}
    <div
      class="overlay-announcement"
      class:overlay-announcement--turn-change={announcement.kind === "turn-change"}
      class:overlay-announcement--concede={announcement.kind === "concede"}
      class:overlay-announcement--mulligan={announcement.kind === "mulligan"}
      style="--overlay-duration:{announcement.durationMs}ms"
      use:watchCssAnimation={{ id: announcement.id, onFinished: onOverlayFinished }}
    >
      <div class="overlay-announcement__backdrop"></div>
      <div class="overlay-announcement__content">
        <div class="overlay-announcement__title">{label.title}</div>
        <div class="overlay-announcement__subtitle">{label.subtitle}</div>
      </div>
    </div>
  {/each}
</div>

<style>
  .overlay-announcement-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 30;
  }

  .overlay-announcement {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: overlay-announcement-lifecycle var(--overlay-duration, 900ms)
      cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .overlay-announcement__backdrop {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.25) 60%, transparent 100%);
  }

  .overlay-announcement__content {
    position: relative;
    text-align: center;
    color: white;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.4);
  }

  .overlay-announcement__title {
    font-size: 3.2rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    line-height: 1.1;
  }

  .overlay-announcement__subtitle {
    font-size: 1.4rem;
    font-weight: 500;
    opacity: 0.85;
    margin-top: 0.4rem;
    letter-spacing: 0.02em;
  }

  .overlay-announcement--concede .overlay-announcement__title {
    color: #ff6b6b;
    text-shadow: 0 2px 12px rgba(255, 80, 80, 0.5), 0 0 40px rgba(255, 80, 80, 0.2);
  }

  .overlay-announcement--mulligan .overlay-announcement__title {
    font-size: 2.4rem;
  }

  @keyframes overlay-announcement-lifecycle {
    0% {
      opacity: 0;
      transform: scale(0.92) translateY(18px);
    }
    18% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    70% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    100% {
      opacity: 0;
      transform: scale(1.03) translateY(-12px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .overlay-announcement {
      animation: none;
    }
  }
</style>
