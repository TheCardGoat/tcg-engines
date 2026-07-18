import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03BellMere051,
  op03UsoppSRubberBandOfDoom054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-051 Bell-mere", () => {
  test("with DON!! resolves the exact checked Life Trigger before damage effects", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03BellMere051, playedOnTurn: 0, attachedDon: 1 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      { life: [op03UsoppSRubberBandOfDoom054] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bellMereId = engine.findCardInZone("south", "character", op03BellMere051);
    const checkedLifeId = engine.findCardInZone("north", "life", op03UsoppSRubberBandOfDoom054);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(bellMereId, engine.leader("north"), "south");

    expect(engine.getState().cards[checkedLifeId]).toMatchObject({
      zone: "resolution",
      faceUp: true,
      publicKnowledge: true,
    });
    const lifeTriggerPrompt = engine
      .getState()
      .promptQueue.find(
        (prompt) =>
          prompt.status === "pending" && prompt.resolutionContext?.intent === "lifeTrigger",
      );
    expect(lifeTriggerPrompt?.sourceInstanceId).toBe(checkedLifeId);
    expect(engine.pendingDecision("lifeTrigger", "north").steps).toHaveLength(1);
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow(
      "Could not find a pending effectOptional prompt for south.",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");
    expect(engine.pendingDecision("effectOptional", "south").steps).toHaveLength(1);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 7);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline the damage trash and accept the three-card On K.O. trash", () => {
    const damageEngine = OnePieceTestEngine.create(
      {
        character: [{ card: op03BellMere051, playedOnTurn: 0, attachedDon: 1 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bellMereId = damageEngine.findCardInZone("south", "character", op03BellMere051);
    const damageDeckBefore = damageEngine.getView("south").players.south.deckCount;
    damageEngine.declareAttack(bellMereId, damageEngine.leader("north"), "south");
    damageEngine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(damageEngine.getView("south").players.south.deckCount).toBe(damageDeckBefore);

    const koEngine = OnePieceTestEngine.create(
      {
        character: [{ card: op03BellMere051, rested: true }],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koTargetId = koEngine.findCardInZone("south", "character", op03BellMere051);
    const attackerId = koEngine.findCardInZone("north", "character", eb01MountainGod018);
    const koDeckBefore = koEngine.getView("south").players.south.deckCount;
    koEngine.declareAttack(attackerId, koTargetId, "north");
    koEngine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(koEngine.getView("south").players.south.deckCount).toBe(koDeckBefore - 3);
  });

  test("does not offer the damage effect without attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03BellMere051, playedOnTurn: 0 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bellMereId = engine.findCardInZone("south", "character", op03BellMere051);
    engine.declareAttack(bellMereId, engine.leader("north"), "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
