import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";
import type { CardInstanceId, ChallengePreviewResult } from "@tcg/lorcana-engine";

const sourceRect = {
  x: 60,
  y: 220,
  width: 120,
  height: 168,
  centerX: 120,
  centerY: 304,
};

const lockedTargetRect = {
  x: 520,
  y: 48,
  width: 120,
  height: 168,
  centerX: 580,
  centerY: 132,
};

const basePreview: ChallengePreviewResult = {
  attackerId: "attacker-1" as CardInstanceId,
  defenderId: "defender-1" as CardInstanceId,
  defenderKind: "character",
  attackerCurrentDamage: 0,
  defenderCurrentDamage: 1,
  attackerNextDamage: 3,
  defenderNextDamage: 6,
  attackerWillpower: 3,
  defenderWillpower: 6,
  attackerDamageDealt: 5,
  defenderDamageDealt: 3,
  attackerWouldBeBanished: true,
  defenderWouldBeBanished: true,
  attackerDamageIsReduced: false,
  defenderDamageIsReduced: false,
};

describe("ChallengeAimOverlay", () => {
  it("stays hidden when it does not have a target point", async () => {
    const { default: ChallengeAimOverlay } =
      await import("@/features/simulator/board/ChallengeAimOverlay.svelte");
    const { body } = render(ChallengeAimOverlay, {
      props: {
        width: 800,
        height: 600,
        sourceRect,
        targetPoint: null,
      },
    });

    expect(body).not.toContain("data-locked");
    expect(body).not.toContain("challenge-aim-arrowhead");
  });

  it("renders an unlocked cursor-follow arrow without combat badges", async () => {
    const { default: ChallengeAimOverlay } =
      await import("@/features/simulator/board/ChallengeAimOverlay.svelte");
    const { body } = render(ChallengeAimOverlay, {
      props: {
        width: 800,
        height: 600,
        sourceRect,
        targetPoint: { x: 320, y: 210 },
      },
    });

    expect(body).toContain('data-locked="false"');
    expect(body).toContain("challenge-aim-arrowhead");
    expect(body).toContain('markerWidth="10"');
    expect(body).toContain('markerHeight="10"');
    expect(body).not.toContain("Deal");
    expect(body).not.toContain("Banished");
  });

  it("renders locked challenge badges and banish markers when preview is lethal", async () => {
    const { default: ChallengeAimOverlay } =
      await import("@/features/simulator/board/ChallengeAimOverlay.svelte");
    const { body } = render(ChallengeAimOverlay, {
      props: {
        width: 800,
        height: 600,
        sourceRect,
        targetPoint: {
          x: lockedTargetRect.centerX,
          y: lockedTargetRect.centerY,
        },
        lockedTargetRect,
        preview: basePreview,
      },
    });

    expect(body).toContain('data-locked="true"');
    expect(body).toContain("Deal 5");
    expect(body).toContain("Take 3");
    expect(body).toContain("Banished");
  });

  it("omits return damage badges for location defenders", async () => {
    const { default: ChallengeAimOverlay } =
      await import("@/features/simulator/board/ChallengeAimOverlay.svelte");
    const { body } = render(ChallengeAimOverlay, {
      props: {
        width: 800,
        height: 600,
        sourceRect,
        targetPoint: {
          x: lockedTargetRect.centerX,
          y: lockedTargetRect.centerY,
        },
        lockedTargetRect,
        preview: {
          ...basePreview,
          defenderKind: "location",
          defenderDamageDealt: 0,
          attackerWouldBeBanished: false,
        },
      },
    });

    expect(body).toContain("Deal 5");
    expect(body).not.toContain("Take 0");
  });
});
