import { describe, expect, it } from "vite-plus/test";
import { theHeistRetailStarterDeckJackieWellesPourOneOutForMe } from "@tcg/cyberpunk-cards";
import { getDefinition } from "@tcg/cyberpunk-engine";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { cyberpunkServerAdapter } from "./adapter.js";
import { cyberpunkCreateServerEngine } from "./cyberpunk-engine-lifecycle.js";

const JACKIE = theHeistRetailStarterDeckJackieWellesPourOneOutForMe;

describe("cyberpunk engine lifecycle", () => {
  it("registers a catalog that accepts slug setup and UUID state lookups", async () => {
    await cyberpunkCreateServerEngine({
      gameSlug: "cyberpunk",
      seed: "catalog-lookup-regression",
      player1Id: "server_player_1",
      player2Id: "server_player_2",
      cardsMaps: cardsMaps(),
    });

    expect(getDefinition(JACKIE.id).slug).toBe(JACKIE.slug);
  });

  it("translates universal dynamic time control into Cyberpunk clock state", async () => {
    const engine = await cyberpunkCreateServerEngine({
      gameSlug: "cyberpunk",
      seed: "dynamic-clock-regression",
      player1Id: "server_player_1",
      player2Id: "server_player_2",
      cardsMaps: cardsMaps(),
      timeControl: {
        mode: "dynamic",
        initialReserveMs: 180_000,
        turnPassBonusMs: 60_000,
        perActionBonusMs: 5_000,
        extras: {
          reserveCapMs: 180_000,
          resetTimeOnSkipMs: 0,
          graceMs: 15_000,
          maxDecisionTimeMs: 180_000,
        },
      },
    });

    const state = engine.getState() as {
      ctx: {
        timeControl?: { mode: string; config?: Record<string, unknown> };
        clockState?: Record<string, { reserveMsRemaining: number; isOnClock?: boolean }>;
      };
    };

    expect(state.ctx.timeControl).toMatchObject({
      mode: "dynamic",
      config: {
        initialReserveMs: 180_000,
        reserveCapMs: 180_000,
        perActionBonusMs: 5_000,
        perTurnPassBonusMs: 60_000,
        resetTimeOnSkipMs: 0,
        graceMs: 15_000,
        maxDecisionTimeMs: 180_000,
      },
    });
    expect(Object.values(state.ctx.clockState ?? {})).toHaveLength(2);
    expect(Object.values(state.ctx.clockState ?? {})).toContainEqual(
      expect.objectContaining({ reserveMsRemaining: 180_000, isOnClock: true }),
    );
  });

  it("exposes engine and cards runtime fingerprints", () => {
    const fingerprint = cyberpunkServerAdapter.getRuntimeFingerprint?.();

    expect(fingerprint?.game).toBe("cyberpunk");
    expect(fingerprint?.runtimeHash).toMatch(/^[0-9a-f]{8}\.[0-9a-f]{8}$/);
    expect(fingerprint?.engine?.hash).toMatch(/^[0-9a-f]{8}$/);
    expect(fingerprint?.cards?.hash).toMatch(/^[0-9a-f]{8}$/);
  });
});

function cardsMaps(): CardsMaps {
  return {
    owners: {
      server_player_1: ["p1_v", "p1_jackie", "p1_viktor", "p1_tbug"],
      server_player_2: ["p2_v", "p2_jackie", "p2_viktor", "p2_tbug"],
    },
    cardInstances: {
      p1_v: "v-corporate-exile",
      p1_jackie: JACKIE.slug,
      p1_viktor: "viktor-vektor-sit-down-and-relax",
      p1_tbug: "t-bug-amateur-philosopher",
      p2_v: "v-corporate-exile",
      p2_jackie: JACKIE.slug,
      p2_viktor: "viktor-vektor-sit-down-and-relax",
      p2_tbug: "t-bug-amateur-philosopher",
    },
  };
}
