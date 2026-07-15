<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import type { ChallengePreviewResult } from "@tcg/lorcana-engine";
  import type {BoardLocalRect} from "@/features/simulator/animations/board-move-animations.js";

  interface Point {
    x: number;
    y: number;
  }

  interface ChallengeAimOverlayProps {
    width: number;
    height: number;
    sourceRect: BoardLocalRect | null;
    targetPoint: Point | null;
    lockedTargetRect?: BoardLocalRect | null;
    preview?: ChallengePreviewResult | null;
  }

  let {
    width,
    height,
    sourceRect,
    targetPoint,
    lockedTargetRect = null,
    preview = null,
  }: ChallengeAimOverlayProps = $props();

  const sourcePoint = $derived.by<Point | null>(() =>
    sourceRect
      ? {
          x: sourceRect.centerX,
          y: sourceRect.centerY,
        }
      : null,
  );
  const isLocked = $derived(lockedTargetRect !== null);
  const geometry = $derived.by(() => {
    if (!sourcePoint || !targetPoint) {
      return null;
    }

    const dx = targetPoint.x - sourcePoint.x;
    const dy = targetPoint.y - sourcePoint.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) {
      return null;
    }

    const normalX = -dy / distance;
    const normalY = dx / distance;
    const arcHeight = Math.min(distance * (isLocked ? 0.12 : 0.08), isLocked ? 42 : 26);
    const controlPoint = {
      x: sourcePoint.x + dx / 2 + normalX * arcHeight,
      y: sourcePoint.y + dy / 2 + normalY * arcHeight,
    };
    const path = `M ${sourcePoint.x} ${sourcePoint.y} Q ${controlPoint.x} ${controlPoint.y} ${targetPoint.x} ${targetPoint.y}`;

    const pointAt = (progress: number, offset = 0): Point => {
      const inverse = 1 - progress;
      const baseX =
        inverse * inverse * sourcePoint.x +
        2 * inverse * progress * controlPoint.x +
        progress * progress * targetPoint.x;
      const baseY =
        inverse * inverse * sourcePoint.y +
        2 * inverse * progress * controlPoint.y +
        progress * progress * targetPoint.y;
      return {
        x: baseX + normalX * offset,
        y: baseY + normalY * offset,
      };
    };

    return {
      path,
      distance,
      sourceBadgePoint: pointAt(0.24, -18),
      targetBadgePoint: pointAt(0.78, 18),
      sourceBanishPoint: pointAt(0.1, -34),
      targetBanishPoint: pointAt(0.9, 34),
    };
  });

  function badgeStyle(point: Point | null): string | undefined {
    if (!point) {
      return undefined;
    }

    return `left:${point.x}px;top:${point.y}px;transform:translate(-50%, -50%);`;
  }
</script>

{#if geometry}
  <div
    class="pointer-events-none absolute inset-0 z-30 overflow-visible"
    aria-label={m["sim.challengePreview.aria"]({})}
    data-locked={isLocked ? "true" : "false"}
  >
    <svg
      class="absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <marker
          id="challenge-aim-arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="8.5"
          refY="5"
          orient="auto"
        >
          <path
            d="M 0 1 L 8.5 5 L 0 9 Q 2.8 5 0 1"
            class={isLocked ? "fill-amber-300" : "fill-sky-300"}
          ></path>
        </marker>
      </defs>

      <path
        d={geometry.path}
        class="fill-none stroke-slate-950/55"
        stroke-linecap="round"
        stroke-width={isLocked ? 14 : 10}
      ></path>
      <path
        d={geometry.path}
        class={isLocked ? "fill-none stroke-amber-300/95" : "fill-none stroke-sky-300/90"}
        stroke-linecap="round"
        stroke-width={isLocked ? 8 : 5}
        marker-end="url(#challenge-aim-arrowhead)"
      ></path>
      <path
        d={geometry.path}
        class={isLocked ? "fill-none stroke-amber-100/60" : "fill-none stroke-sky-100/45"}
        stroke-dasharray={isLocked ? undefined : "10 10"}
        stroke-linecap="round"
        stroke-width="2"
      ></path>
    </svg>

    {#if preview}
      <div
        class={[
          "absolute rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white",
          preview.defenderDamageIsReduced
            ? "border-sky-200/50 bg-sky-500/92 shadow-[0_10px_24px_rgba(14,165,233,0.35)]"
            : "border-emerald-200/50 bg-emerald-500/92 shadow-[0_10px_24px_rgba(16,185,129,0.35)]",
        ].join(" ")}
        style={badgeStyle(geometry.targetBadgePoint)}
      >
        {m["sim.challengePreview.deal"]({})} {preview.attackerDamageDealt}{preview.defenderDamageIsReduced ? " 🛡" : ""}
      </div>

      {#if preview.defenderKind === "character"}
        <div
          class={[
            "absolute rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white",
            preview.attackerDamageIsReduced
              ? "border-sky-200/50 bg-sky-500/92 shadow-[0_10px_24px_rgba(14,165,233,0.35)]"
              : "border-rose-200/45 bg-rose-500/92 shadow-[0_10px_24px_rgba(244,63,94,0.32)]",
          ].join(" ")}
          style={badgeStyle(geometry.sourceBadgePoint)}
        >
          {m["sim.challengePreview.take"]({})} {preview.defenderDamageDealt}{preview.attackerDamageIsReduced ? " 🛡" : ""}
        </div>
      {/if}

      {#if preview.attackerWouldBeBanished && preview.defenderKind === "character"}
        <div
          class="absolute rounded-full border border-slate-100/20 bg-slate-950/85 px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.2em] text-amber-100 shadow-[0_10px_28px_rgba(15,23,42,0.45)]"
          style={badgeStyle(geometry.sourceBanishPoint)}
        >
          {m["sim.challengePreview.banished"]({})}
        </div>
      {/if}

      {#if preview.defenderWouldBeBanished}
        <div
          class="absolute rounded-full border border-slate-100/20 bg-slate-950/85 px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.2em] text-amber-100 shadow-[0_10px_28px_rgba(15,23,42,0.45)]"
          style={badgeStyle(geometry.targetBanishPoint)}
        >
          {m["sim.challengePreview.banished"]({})}
        </div>
      {/if}
    {/if}
  </div>
{/if}
