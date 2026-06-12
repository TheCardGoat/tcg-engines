import { describe, expect, it } from "vite-plus/test";

import { asPlayerId } from "@tcg/gundam-engine";

import { SAMPLE_DECKS, buildGundamCardCatalog } from "../data/sample-decks/index.ts";
import { DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "./dev-runtime.ts";
import { createMatchFromDecks } from "./match-factory.ts";

const catalog = buildGundamCardCatalog();

/**
 * Read the number of cards in a private zone from the raw state —
 * the dev-runtime doesn't expose a zone-count helper at the view
 * level, and pulling in `filterMatchView` here would couple the test
 * to projection details we don't care about.
 */
function zoneCount(
  runtime: ReturnType<typeof createMatchFromDecks>["runtime"],
  zone: string,
  playerId: string,
): number {
  const state = runtime.getState();
  return state.ctx.zones.private.zoneCards[`${zone}:${playerId}`]?.length ?? 0;
}

describe("createMatchFromDecks", () => {
  it("lands in the choose-first-player phase (no skipToMainPhase shortcut)", () => {
    const dev = createMatchFromDecks({
      playerDeck: SAMPLE_DECKS["ef-starter"],
      opponentDeck: SAMPLE_DECKS["seed-aggro"],
      opponentStrategy: "pass-only",
      catalog,
    });
    expect(dev.runtime.getState().ctx.status.phase).toBe("choose-first-player");
    dev.bot?.dispose();
  });

  it("seeds 50 cards in each main deck and 10 in each resource deck", () => {
    const dev = createMatchFromDecks({
      playerDeck: SAMPLE_DECKS["ef-starter"],
      opponentDeck: SAMPLE_DECKS["gd01-mixed"],
      opponentStrategy: "pass-only",
      catalog,
    });

    expect(zoneCount(dev.runtime, "deck", DEV_PLAYER_ONE)).toBe(50);
    expect(zoneCount(dev.runtime, "deck", DEV_PLAYER_TWO)).toBe(50);
    expect(zoneCount(dev.runtime, "resourceDeck", DEV_PLAYER_ONE)).toBe(10);
    expect(zoneCount(dev.runtime, "resourceDeck", DEV_PLAYER_TWO)).toBe(10);

    dev.bot?.dispose();
  });

  it("advances to the mulligan phase after chooseFirstPlayer", () => {
    const dev = createMatchFromDecks({
      playerDeck: SAMPLE_DECKS["ef-starter"],
      opponentDeck: SAMPLE_DECKS["seed-aggro"],
      opponentStrategy: "pass-only",
      catalog,
      seed: "test-mulligan",
    });

    const result = dev.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "chooseFirstPlayer",
        prevStateID: dev.runtime.getState().ctx._stateID,
        actorRole: "player",
        args: { playerId: DEV_PLAYER_ONE },
      },
      asPlayerId(DEV_PLAYER_ONE),
    );
    expect(result.success, JSON.stringify(result)).toBe(true);

    const state = dev.runtime.getState();
    expect(state.ctx.status.phase).toBe("mulligan");
    // After mulligan enter, each player has been dealt 5 cards.
    expect(zoneCount(dev.runtime, "hand", DEV_PLAYER_ONE)).toBe(5);
    expect(zoneCount(dev.runtime, "hand", DEV_PLAYER_TWO)).toBe(5);
    expect(zoneCount(dev.runtime, "deck", DEV_PLAYER_ONE)).toBe(45);
    expect(zoneCount(dev.runtime, "deck", DEV_PLAYER_TWO)).toBe(45);

    dev.bot?.dispose();
  });

  it("exposes a bot handle (noop under SSR, real handle otherwise)", () => {
    const dev = createMatchFromDecks({
      playerDeck: SAMPLE_DECKS["ef-starter"],
      opponentDeck: SAMPLE_DECKS["seed-aggro"],
      opponentStrategy: "greedy-legal",
      catalog,
    });
    expect(dev.bot).toBeDefined();
    // Tests run in a non-SSR vitest env, so the strategy name is real.
    expect(dev.bot?.getStrategyName()).toBe("greedy-legal");
    dev.bot?.dispose();
  });

  it("resolves the opponentStrategy id to the matching strategy", () => {
    const passOnly = createMatchFromDecks({
      playerDeck: SAMPLE_DECKS["ef-starter"],
      opponentDeck: SAMPLE_DECKS["seed-aggro"],
      opponentStrategy: "pass-only",
      catalog,
    });
    expect(passOnly.bot?.getStrategyName()).toBe("pass-only");
    passOnly.bot?.dispose();
  });

  it("uses the seed for deterministic shuffling (equal seeds → equal opening hands)", () => {
    const a = createMatchFromDecks({
      playerDeck: SAMPLE_DECKS["ef-starter"],
      opponentDeck: SAMPLE_DECKS["seed-aggro"],
      opponentStrategy: "pass-only",
      catalog,
      seed: "same-seed",
    });
    const b = createMatchFromDecks({
      playerDeck: SAMPLE_DECKS["ef-starter"],
      opponentDeck: SAMPLE_DECKS["seed-aggro"],
      opponentStrategy: "pass-only",
      catalog,
      seed: "same-seed",
    });

    a.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "chooseFirstPlayer",
        prevStateID: a.runtime.getState().ctx._stateID,
        actorRole: "player",
        args: { playerId: DEV_PLAYER_ONE },
      },
      asPlayerId(DEV_PLAYER_ONE),
    );
    b.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "chooseFirstPlayer",
        prevStateID: b.runtime.getState().ctx._stateID,
        actorRole: "player",
        args: { playerId: DEV_PLAYER_ONE },
      },
      asPlayerId(DEV_PLAYER_ONE),
    );

    const handA = a.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
    const handB = b.runtime.getState().ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];

    // Instance IDs differ (they include a module counter). Compare the
    // resolved card numbers so the assertion survives counter drift.
    const idsToCardNumbers = (
      runtime: ReturnType<typeof createMatchFromDecks>["runtime"],
      ids: readonly string[],
    ): string[] =>
      ids.map((instanceId) => {
        const defId = runtime
          .getStaticResources()
          .cardsMaps.instances.get(instanceId)?.definitionId;
        return defId ?? "<unknown>";
      });

    expect(idsToCardNumbers(a.runtime, handA)).toEqual(idsToCardNumbers(b.runtime, handB));

    a.bot?.dispose();
    b.bot?.dispose();
  });
});
