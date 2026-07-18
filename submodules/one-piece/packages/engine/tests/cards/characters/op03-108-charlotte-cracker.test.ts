import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03CharlotteCracker108,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-108 Charlotte Cracker", () => {
  test("trashes a hand card to play the resolving physical card from Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [eb01Doma005, eb01Fourtricks025], life: [op03CharlotteCracker108] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const crackerId = engine.findCardInZone("north", "life", op03CharlotteCracker108);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Cracker's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.characters.some((card) => card?.instanceId === crackerId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the Trigger cost without playing the physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [eb01Doma005], life: [op03CharlotteCracker108] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const crackerId = engine.findCardInZone("north", "life", op03CharlotteCracker108);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(crackerId);
    expect(view.players.north.hand).toHaveLength(1);
    expect(view.players.north.characters.some((card) => card?.instanceId === crackerId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! x1 and fewer Life, gains +1000 power and Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03CharlotteCracker108, attachedDon: 1, playedOnTurn: 0 }],
        life: [eb01Doma005],
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const crackerId = engine.findCardInZone("south", "character", op03CharlotteCracker108);
    const cracker = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === crackerId);
    expect(cracker?.power).toBe(7000);

    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(crackerId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });

  test("at equal Life, does not gain the permanent power or Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03CharlotteCracker108, attachedDon: 1, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { life: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const crackerId = engine.findCardInZone("south", "character", op03CharlotteCracker108);
    const cracker = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === crackerId);
    expect(cracker?.power).toBe(6000);

    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(crackerId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});
