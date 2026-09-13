import { describe, expect, it } from "vite-plus/test";
import { getPlayGameConfig, type CardsMaps } from "@tcg/shared/game-adapter";
import type { GundamG, MatchState, PlayerId } from "@tcg/gundam-engine";
import {
  gundamCreateServerEngine,
  gundamRestoreEngine,
  gundamSerializeEngine,
  remintGundamPresentation,
} from "./gundam-engine-lifecycle.js";
import { GundamServerEngine } from "./gundam-server-engine.js";

// A main-deck card whose id, cardNumber, and canonicalId all match. Used for
// the 50-card main deck so the test isolates the Resource split behavior.
const MAIN_CARD_ID = "ST03-005";
// The legal Gundam Resource card. Its printing id ("R-001_p6") differs from
// its cardNumber/canonicalId ("R-001") — exactly the shape that broke the old
// id-only catalog lookup. Using it here is the regression for the reported bug.
const RESOURCE_CANONICAL_ID = "R-001";

/**
 * Section-tagged cardsMaps, mirroring what the platform now produces when a
 * Gundam deck version is flattened with deckVersionRuntimeCards + sectionId.
 */
function sectionedCardsMaps(
  playerIds: readonly string[],
  mainCardId: string = MAIN_CARD_ID,
): CardsMaps {
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = {};
  const instanceSections: Record<string, string> = {};
  for (const playerId of playerIds) {
    const instanceIds: string[] = [];
    for (let i = 0; i < 50; i++) {
      const instanceId = `${playerId}_unit_${i}`;
      cardInstances[instanceId] = mainCardId;
      instanceSections[instanceId] = "main";
      instanceIds.push(instanceId);
    }
    for (let i = 0; i < 10; i++) {
      const instanceId = `${playerId}_resource_${i}`;
      cardInstances[instanceId] = RESOURCE_CANONICAL_ID;
      instanceSections[instanceId] = "resource";
      instanceIds.push(instanceId);
    }
    owners[playerId] = instanceIds;
  }
  return { cardInstances, owners, instanceSections };
}

/**
 * Legacy untagged cardsMaps (no instanceSections). Used to prove the
 * canonicalized catalog fallback now resolves R-001 too.
 */
function legacyCardsMaps(playerIds: readonly string[]): CardsMaps {
  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = {};
  for (const playerId of playerIds) {
    const instanceIds: string[] = [];
    for (let i = 0; i < 50; i++) {
      const instanceId = `${playerId}_unit_${i}`;
      cardInstances[instanceId] = MAIN_CARD_ID;
      instanceIds.push(instanceId);
    }
    // Resource entries carry the canonical id "R-001", not the printing id.
    for (let i = 0; i < 10; i++) {
      const instanceId = `${playerId}_resource_${i}`;
      cardInstances[instanceId] = RESOURCE_CANONICAL_ID;
      instanceIds.push(instanceId);
    }
    owners[playerId] = instanceIds;
  }
  return { cardInstances, owners };
}

describe("gundamCreateServerEngine — section-tagged decks", () => {
  it("routes 50 main + 10 R-001 resources into the correct zones via section tags", async () => {
    const engine = await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "seed-sectioned-r001",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: sectionedCardsMaps(["p1", "p2"]),
    });

    expect(engine).toBeInstanceOf(GundamServerEngine);
    const state = (engine as GundamServerEngine).engine.getState();

    for (const playerId of ["p1", "p2"]) {
      expect(state.ctx.zones.public.zoneSummaries[`deck:${playerId}`]?.count).toBe(50);
      expect(state.ctx.zones.public.zoneSummaries[`resourceDeck:${playerId}`]?.count).toBe(10);
      expect(state.ctx.zones.private.zoneCards[`deck:${playerId}`]).toHaveLength(50);
      expect(state.ctx.zones.private.zoneCards[`resourceDeck:${playerId}`]).toHaveLength(10);
    }
  });

  it("throws when a section-tagged cardsMaps has instances with no resolvable section", async () => {
    const cardsMaps: CardsMaps = {
      cardInstances: { p1_main_0: MAIN_CARD_ID, p1_orphan_0: "GD01-002" },
      owners: { p1: ["p1_main_0", "p1_orphan_0"], p2: [] },
      instanceSections: { p1_main_0: "main" },
    };

    await expect(
      gundamCreateServerEngine({
        gameSlug: "gundam",
        seed: "seed-rejected",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps,
      }),
    ).rejects.toThrow(/without a resolvable deck section/);
  });
});

describe("gundamCreateServerEngine — legacy untagged decks", () => {
  it("resolves R-001 resources through the canonicalized catalog fallback", async () => {
    const engine = await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "seed-legacy-r001",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: legacyCardsMaps(["p1", "p2"]),
    });

    const state = (engine as GundamServerEngine).engine.getState();

    // The reported bug: R-001 (canonical) failed the id-only catalog lookup,
    // so resources landed in the main deck (deck=60, resourceDeck=0). The
    // canonicalized catalog now resolves R-001, so the split is correct.
    for (const playerId of ["p1", "p2"]) {
      expect(state.ctx.zones.public.zoneSummaries[`deck:${playerId}`]?.count).toBe(50);
      expect(state.ctx.zones.public.zoneSummaries[`resourceDeck:${playerId}`]?.count).toBe(10);
    }
  });
});

describe("gundamCreateServerEngine — time control", () => {
  it("translates the Gundam matchmaking policy into native dynamic clock state", async () => {
    const engine = await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "dynamic-clock-regression",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: sectionedCardsMaps(["p1", "p2"]),
      timeControl: getPlayGameConfig("gundam").timeControl.matchmaking,
    });

    const state = (engine as GundamServerEngine).engine.getState();
    expect(state.ctx.time).toMatchObject({
      mode: "dynamic",
      running: true,
      activePlayerID: "p1",
      config: {
        initialReserveMs: 180_000,
        reserveCapMs: 180_000,
        perActionBonusMs: 5_000,
        perTurnPassBonusMs: 60_000,
        resetTimeOnSkipMs: 0,
        graceMs: 15_000,
        maxDecisionTimeMs: 180_000,
      },
      players: {
        p1: { reserveMsRemaining: 180_000 },
        p2: { reserveMsRemaining: 180_000 },
      },
    });
  });

  it("keeps mode none clockless", async () => {
    const engine = await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "clockless-regression",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: sectionedCardsMaps(["p1", "p2"]),
      timeControl: { mode: "none" },
    });

    expect((engine as GundamServerEngine).engine.getState().ctx.time).toEqual({ mode: "none" });
  });

  it("rejects unsupported and malformed time-control configurations", async () => {
    const input = {
      gameSlug: "gundam" as const,
      seed: "invalid-clock-regression",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: sectionedCardsMaps(["p1", "p2"]),
    };

    await expect(
      gundamCreateServerEngine({
        ...input,
        timeControl: { mode: "chess", initialReserveMs: 60_000 },
      }),
    ).rejects.toThrow('Supported modes: "none", "dynamic"');
    await expect(
      gundamCreateServerEngine({
        ...input,
        timeControl: {
          mode: "dynamic",
          initialReserveMs: 60_000,
          extras: { reserveCapMs: -1 },
        },
      }),
    ).rejects.toThrow('extra "reserveCapMs" must be a finite non-negative number');
  });
});

describe("gundamCreateServerEngine — presentation remint", () => {
  it("rewrites platform instance ids onto engine instance ids and keeps setup slots", async () => {
    const cardsMaps = sectionedCardsMaps(["p1", "p2"]);
    cardsMaps.presentation = {
      printingIdByInstanceId: {
        p1_unit_0: "ST03-005_p1",
        p1_resource_0: "R-001_p6",
      },
      printingIdBySetupSlotByOwnerId: {
        p1: { "ex-base": "EXBP-001_p1", "ex-resource": "EXRP-003" },
        p2: { "ex-base": "EXBP-001", "ex-resource": "EXRP-003" },
      },
    };

    await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "seed-presentation-remint",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    });

    expect(cardsMaps.presentation?.printingIdByInstanceId["p1_deck_ST03-005_0"]).toBe(
      "ST03-005_p1",
    );
    expect(cardsMaps.presentation?.printingIdByInstanceId["p1_resourceDeck_R-001_0"]).toBe(
      "R-001_p6",
    );
    expect(cardsMaps.presentation?.printingIdByInstanceId.p1_unit_0).toBeUndefined();
    expect(cardsMaps.presentation?.printingIdBySetupSlotByOwnerId?.p1["ex-base"]).toBe(
      "EXBP-001_p1",
    );
  });

  it("stamps reminted printings onto the viewer projection and exposes them as resources", async () => {
    const cardsMaps = sectionedCardsMaps(["p1", "p2"]);
    cardsMaps.presentation = {
      printingIdByInstanceId: { p1_unit_0: "ST03-005_p1" },
      printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-001_p1" } },
    };
    const engine = (await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "seed-presentation-view",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    })) as GundamServerEngine;

    const resources = engine.getViewerResources({ role: "replay" }) as {
      cardsMaps?: { presentation?: { printingIdByInstanceId?: Record<string, string> } };
    };
    expect(resources.cardsMaps?.presentation?.printingIdByInstanceId["p1_deck_ST03-005_0"]).toBe(
      "ST03-005_p1",
    );

    const context = { gameId: "presentation-view", sourceAuthority: "server" as const };
    expect(engine.dispatch("chooseFirstPlayer", "p1", { playerId: "p1" }, context).success).toBe(
      true,
    );
    expect(engine.dispatch("alterHand", "p1", { wantsRedraw: false }, context).success).toBe(true);
    expect(engine.dispatch("alterHand", "p2", { wantsRedraw: false }, context).success).toBe(true);

    const view = engine.getViewerState({ role: "spectator" }) as {
      zones: {
        zones: Record<
          string,
          {
            cards: Array<{
              instanceId: string;
              definition?: { selectedPrintingId?: string } | null;
            }>;
          }
        >;
      };
    };
    const setupBase = Object.values(view.zones.zones)
      .flatMap((zone) => zone.cards)
      .find((card) => card.instanceId === "ex-base-token:p1");
    expect(setupBase?.definition?.selectedPrintingId).toBe("EXBP-001_p1");
  });

  it("resolves parallel booster setup printings instead of falling back to the default", async () => {
    const cardsMaps = sectionedCardsMaps(["p1", "p2"]);
    cardsMaps.presentation = {
      printingIdByInstanceId: {},
      printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXB-001_p5" } },
    };
    const engine = (await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "seed-setup-parallel-printing",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    })) as GundamServerEngine;

    const context = { gameId: "setup-parallel-printing", sourceAuthority: "server" as const };
    expect(engine.dispatch("chooseFirstPlayer", "p1", { playerId: "p1" }, context).success).toBe(
      true,
    );
    expect(engine.dispatch("alterHand", "p1", { wantsRedraw: false }, context).success).toBe(true);
    expect(engine.dispatch("alterHand", "p2", { wantsRedraw: false }, context).success).toBe(true);

    const view = engine.getViewerState({ role: "spectator" }) as {
      zones: {
        zones: Record<
          string,
          {
            cards: Array<{
              instanceId: string;
              definition?: { selectedPrintingId?: string } | null;
            }>;
          }
        >;
      };
    };
    const setupBase = Object.values(view.zones.zones)
      .flatMap((zone) => zone.cards)
      .find((card) => card.instanceId === "ex-base-token:p1");
    expect(setupBase?.definition?.selectedPrintingId).toBe("EXB-001_p5");
  });

  it("hides unrevealed deck instances from player resources but keeps them for replay", async () => {
    const cardsMaps = sectionedCardsMaps(["p1", "p2"]);
    cardsMaps.presentation = {
      printingIdByInstanceId: { p1_unit_0: "ST03-005_p1", p2_unit_0: "ST03-005_p2" },
    };
    const engine = (await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "seed-resources-privacy",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    })) as GundamServerEngine;

    const playerResources = engine.getViewerResources({ role: "player", actorId: "p1" }) as {
      cardsMaps?: {
        cardInstances?: Record<string, string>;
        presentation?: { printingIdByInstanceId?: Record<string, string> };
      };
    };
    // At creation every deck card is still hidden, so the player bag carries
    // no deck instance ids — even the player's own deck — and no presentation
    // entries for them. (The lifecycle remints p2_unit_0 onto the engine
    // instance id p2_deck_ST03-005_0.)
    expect(
      Object.keys(playerResources.cardsMaps?.cardInstances ?? {}).some((id) =>
        id.includes("_deck_"),
      ),
    ).toBe(false);
    expect(
      playerResources.cardsMaps?.presentation?.printingIdByInstanceId?.["p2_deck_ST03-005_0"],
    ).toBe(undefined);

    // The replay bag is recorded at version 0 for post-match playback, where
    // the full overlay must survive before anything is revealed.
    const replayResources = engine.getViewerResources({ role: "replay" }) as {
      cardsMaps?: { presentation?: { printingIdByInstanceId?: Record<string, string> } };
    };
    expect(
      replayResources.cardsMaps?.presentation?.printingIdByInstanceId?.["p2_deck_ST03-005_0"],
    ).toBe("ST03-005_p2");
  });

  it("keeps already-reminted engine keys so restore does not drop presentation", () => {
    const reminted = remintGundamPresentation({
      cardInstances: { "p1-ST03-005-0": "ST03-005" },
      owners: { p1: ["p1-ST03-005-0"] },
      instanceSections: { "p1-ST03-005-0": "main" },
      presentation: {
        printingIdByInstanceId: { "p1_deck_ST03-005_0": "ST03-005_p1" },
        printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-001_p1" } },
      },
    });

    expect(reminted).toEqual({
      printingIdByInstanceId: { "p1_deck_ST03-005_0": "ST03-005_p1" },
      printingIdBySetupSlotByOwnerId: { p1: { "ex-base": "EXBP-001_p1" } },
    });
  });
});

describe("gundamRestoreEngine", () => {
  it("restores command and log histories alongside undo checkpoints", async () => {
    const cardsMaps = sectionedCardsMaps(["p1", "p2"]);
    const created = (await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "restore-history",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    })) as GundamServerEngine;
    const context = { gameId: "restore-history", sourceAuthority: "server" as const };
    expect(created.dispatch("chooseFirstPlayer", "p1", { playerId: "p1" }, context).success).toBe(
      true,
    );

    const before = created.engine.getRuntime();
    const snapshot = gundamSerializeEngine(created, cardsMaps);
    const restored = (await gundamRestoreEngine(snapshot, {
      gameSlug: "gundam",
      seed: "restore-history",
      player1Id: "p1",
      player2Id: "p2",
    })) as GundamServerEngine;
    const after = restored.engine.getRuntime();

    expect(after.getCommandHistory()).toEqual(before.getCommandHistory());
    expect(after.getMoveHistory()).toEqual(before.getMoveHistory());
    expect(after.getMoveLogHistory()).toEqual(before.getMoveLogHistory());
    expect(after.getGameLogHistory()).toEqual(before.getGameLogHistory());
    expect(after.getPacketAnimationHistory()).toEqual(before.getPacketAnimationHistory());
  });

  it("hydrates the persisted MatchState instead of restarting at version 0", async () => {
    const cardsMaps = sectionedCardsMaps(["p1", "p2"]);
    const created = await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "restore-seed",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    });
    const snapshot = gundamSerializeEngine(created, cardsMaps);

    // Simulate the state after chooseFirstPlayer + the mulligan draw: version
    // bumped, five cards moved from deck to hand.
    const advanced = structuredClone(snapshot.state) as MatchState;
    advanced.ctx._stateID = 1;
    const drawn = advanced.ctx.zones.private.zoneCards["deck:p1"]!.splice(0, 5);
    advanced.ctx.zones.private.zoneCards["hand:p1"] = drawn;
    advanced.ctx.zones.public.zoneSummaries["deck:p1"]!.count = 45;
    advanced.ctx.zones.public.zoneSummaries["hand:p1"] = { revision: 1, count: 5 };
    snapshot.state = advanced;

    const restored = await gundamRestoreEngine(snapshot, {
      gameSlug: "gundam",
      seed: "restore-seed",
      player1Id: "p1",
      player2Id: "p2",
    });

    const engine = (restored as GundamServerEngine).engine;
    const state = engine.getState();
    expect(engine.getStateID()).toBe(1);
    expect(state.ctx.zones.public.zoneSummaries["hand:p1"]?.count).toBe(5);
    expect(state.ctx.zones.public.zoneSummaries["deck:p1"]?.count).toBe(45);
    expect(state.ctx.zones.private.zoneCards["hand:p1"]).toEqual(drawn);
  });

  it("restores the setup EX Resource definition after a snapshot round trip", async () => {
    const cardsMaps = sectionedCardsMaps(["p1", "p2"], "ST03-005");
    const created = await gundamCreateServerEngine({
      gameSlug: "gundam",
      seed: "restore-ex-resource",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    });
    const serverEngine = created as GundamServerEngine;
    const context = { gameId: "restore-ex-resource", sourceAuthority: "server" as const };

    expect(
      serverEngine.dispatch("chooseFirstPlayer", "p1", { playerId: "p1" }, context).success,
    ).toBe(true);
    expect(serverEngine.dispatch("alterHand", "p1", { wantsRedraw: false }, context).success).toBe(
      true,
    );
    expect(serverEngine.dispatch("alterHand", "p2", { wantsRedraw: false }, context).success).toBe(
      true,
    );

    const tokenId = "ex-resource-token:p2";
    expect(
      serverEngine.engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId),
    ).toMatchObject({ type: "resource", cardNumber: "EXR-001" });

    const snapshot = gundamSerializeEngine(created, cardsMaps);
    const persisted = snapshot.state as MatchState<GundamG>;
    const legacyEffectTokenId = "ex_resource_token_7";
    const resourceZone = persisted.ctx.zones.private.zoneCards["resourceArea:p2"]!;
    resourceZone.push(legacyEffectTokenId);
    persisted.ctx.zones.private.cardIndex[legacyEffectTokenId] = {
      zoneKey: "resourceArea:p2",
      index: resourceZone.length - 1,
      ownerID: "p2" as PlayerId,
      controllerID: "p2" as PlayerId,
    };
    persisted.ctx.zones.private.cardMeta[legacyEffectTokenId] = {
      isToken: true,
      tokenDefinitionId: "EXRP-003",
    };
    persisted.ctx.zones.public.zoneSummaries["resourceArea:p2"]!.count += 1;
    persisted.ctx.zones.public.zoneSummaries["resourceArea:p2"]!.revision += 1;
    const inlineTokenId = "token_test_unit_3";
    const battleZone = persisted.ctx.zones.private.zoneCards["battleArea:p2"]!;
    battleZone.push(inlineTokenId);
    persisted.ctx.zones.private.cardIndex[inlineTokenId] = {
      zoneKey: "battleArea:p2",
      index: battleZone.length - 1,
      ownerID: "p2" as PlayerId,
      controllerID: "p2" as PlayerId,
    };
    persisted.ctx.zones.private.cardMeta[inlineTokenId] = {
      isToken: true,
      tokenSpec: {
        name: "Test Unit",
        traits: ["test team"],
        ap: 2,
        hp: 3,
        deployState: "active",
        printedCardNumber: "T-001",
        keywordEffects: [{ keyword: "Blocker" }],
      },
    };
    persisted.ctx.zones.public.zoneSummaries["battleArea:p2"]!.count += 1;
    persisted.ctx.zones.public.zoneSummaries["battleArea:p2"]!.revision += 1;

    const restored = (await gundamRestoreEngine(snapshot, {
      gameSlug: "gundam",
      seed: "restore-ex-resource",
      player1Id: "p1",
      player2Id: "p2",
    })) as GundamServerEngine;

    expect(restored.engine.getState().ctx.zones.private.cardMeta[tokenId]).toMatchObject({
      isToken: true,
      tokenDefinitionId: "EXR-001",
    });
    expect(
      restored.engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId),
    ).toMatchObject({ type: "resource", cardNumber: "EXR-001" });
    expect(restored.engine.getState().G.eventCounters.exResourceToken).toBe(7);
    expect(
      restored.engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(inlineTokenId),
    ).toMatchObject({
      type: "unit",
      name: "Test Unit",
      cardNumber: "T-001",
      ap: 2,
      hp: 3,
      printings: [{ imageUrl: "" }],
      effect: "-",
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const restoredState = restored.engine.getState();
    restoredState.ctx.status.gameSegment = "game";
    restoredState.ctx.status.phase = "main-phase";
    restoredState.ctx.status.turnPlayer = "p2" as PlayerId;
    restoredState.ctx.status.activePlayer = "p2" as PlayerId;
    const unitId = restoredState.ctx.zones.private.zoneCards["hand:p2"]![0]!;

    expect(
      restored.dispatch(
        "deployUnit",
        "p2",
        { cardId: unitId, paymentResourceIds: [tokenId] },
        context,
      ).success,
    ).toBe(true);
    expect(restored.engine.getState().ctx.zones.private.zoneCards["resourceArea:p2"]).not.toContain(
      tokenId,
    );
    expect(restored.engine.getState().ctx.zones.private.cardIndex[tokenId]).toBeUndefined();
  });
});
