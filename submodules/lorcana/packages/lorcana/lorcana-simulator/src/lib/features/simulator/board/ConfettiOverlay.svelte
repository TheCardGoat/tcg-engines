<script lang="ts">
  interface ConfettiOverlayProps {
    show?: boolean;
  }

  let { show = false }: ConfettiOverlayProps = $props();

  const COLORS = [
    "#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4",
    "#ff9ff3", "#54a0ff", "#ffeaa7", "#fd79a8", "#a29bfe",
  ];

  const PIECE_COUNT = 80;

  const pieces = Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 6,
    duration: 1.25 + Math.random() * 1.25,
    delay: Math.random() * 0.75,
    rotateStart: Math.random() * 360,
    rotateEnd: Math.random() * 720 - 360,
    swayFreq: 0.5 + Math.random() * 1.5,
    isRect: i % 3 !== 0,
  }));
</script>

{#if show}
  <div class="confetti-overlay" aria-hidden="true">
    {#each pieces as piece (piece.id)}
      <div
        class="confetti-piece"
        class:confetti-piece--circle={!piece.isRect}
        style="
          left: {piece.left}%;
          width: {piece.isRect ? piece.size : piece.size * 0.9}px;
          height: {piece.isRect ? piece.size * 0.4 : piece.size * 0.9}px;
          background: {piece.color};
          animation-duration: {piece.duration}s;
          animation-delay: {piece.delay}s;
          --rotate-start: {piece.rotateStart}deg;
          --rotate-end: {piece.rotateEnd}deg;
        "
      ></div>
    {/each}
  </div>
{/if}

<style>
  .confetti-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  }

  .confetti-piece {
    position: absolute;
    top: -10px;
    border-radius: 2px;
    animation: confetti-fall linear both;
    transform-origin: center center;
  }

  .confetti-piece--circle {
    border-radius: 50%;
  }

  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(var(--rotate-start));
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateY(110vh) rotate(var(--rotate-end));
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .confetti-overlay {
      display: none;
    }
  }
</style>
