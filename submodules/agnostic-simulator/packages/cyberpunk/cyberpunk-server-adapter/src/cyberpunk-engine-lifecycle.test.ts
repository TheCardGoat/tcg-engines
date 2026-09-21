import { describe, expect, it } from "vite-plus/test";
import { theHeistRetailStarterDeckJackieWellesPourOneOutForMe } from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  createMockUnit,
  getDefinition,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import type { CardsMaps } from "@tcg/shared/game-adapter";
import { cyberpunkServerAdapter } from "./adapter.js";
import { CyberpunkServerEngine } from "./cyberpunk-server-engine.js";
import {
  cyberpunkCreateServerEngine,
  cyberpunkRestoreEngine,
  cyberpunkSerializeEngine,
} from "./cyberpunk-engine-lifecycle.js";

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

  it("resolves accent-folded deck slugs to their retail canonical", async () => {
    const engine = await cyberpunkCreateServerEngine({
      gameSlug: "cyberpunk",
      seed: "folded-slug-regression",
      player1Id: "server_player_1",
      player2Id: "server_player_2",
      cardsMaps: foldedSlugCardsMaps(),
    });

    expect(getDefinition("gilded-maton")?.slug).toBe("gilded-maton");
    // Deck rows saved before slugs were accent-folded store the legacy mangled id.
    expect(getDefinition("gilded-mato-n")?.slug).toBe("gilded-maton");

    const state = engine.getState() as {
      G: { players: Record<string, { zones: { deck: string[] } }> };
    };
    const mainDeckCount = Object.values(state.G.players).reduce(
      (sum, player) => sum + player.zones.deck.length,
      0,
    );
    expect(mainDeckCount).toBe(2);
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

  it("persists the current-turn checkpoint across an authoritative restore", async () => {
    const unit = createMockUnit({ name: "Checkpoint Unit", cost: 0 });
    const fixture = CyberpunkTestEngine.createWithFixture({ hand: [unit], deck: 10 });
    const handAtTurnStart = structuredClone(fixture.getState().G.players[P1]!.zones.hand);

    fixture.playCard(unit, { as: P1 });
    const live = new CyberpunkServerEngine(fixture.getLocalEngine());
    const snapshot = cyberpunkSerializeEngine(live, { cardInstances: {}, owners: {} });
    const restored = await cyberpunkRestoreEngine(snapshot, {
      gameSlug: "cyberpunk",
      seed: "checkpoint-restore",
      player1Id: "p1",
      player2Id: "p2",
    });

    expect(restored.canUndoToTurnStart?.("p1")).toBe(true);
    const result = restored.undoToTurnStart?.("p1", {
      gameId: "checkpoint-game",
      sourceAuthority: "server",
    });

    expect(result?.success).toBe(true);
    const state = restored.getState() as MatchState;
    expect(state.G.players[P1]!.zones.field).toHaveLength(0);
    expect(state.G.players[P1]!.zones.hand).toEqual(handAtTurnStart);
    expect(state.ctx.stateID).toBe(2);
  });

  it("does not invent a turn-start checkpoint for a legacy mid-turn snapshot", async () => {
    const fixture = CyberpunkTestEngine.createWithFixture({
      hand: [createMockUnit({ name: "Legacy Unit", cost: 0 })],
      deck: 10,
    });
    const restored = await cyberpunkRestoreEngine(
      {
        gameSlug: "cyberpunk",
        state: structuredClone(fixture.getState()),
        historyLength: 0,
        cardsMaps: { cardInstances: {}, owners: {} },
      },
      {
        gameSlug: "cyberpunk",
        seed: "legacy-checkpoint",
        player1Id: "p1",
        player2Id: "p2",
      },
    );

    expect(restored.canUndoToTurnStart?.("p1")).toBe(false);
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

function foldedSlugCardsMaps(): CardsMaps {
  return {
    owners: {
      server_player_1: ["p1_maton"],
      server_player_2: ["p2_maton"],
    },
    cardInstances: {
      p1_maton: "gilded-maton",
      p2_maton: "gilded-maton",
    },
  };
}
