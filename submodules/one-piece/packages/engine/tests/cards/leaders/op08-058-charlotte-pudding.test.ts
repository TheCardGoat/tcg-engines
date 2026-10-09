import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08CharlottePudding058 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP08-058 Charlotte Pudding", () => {
  test("turns the top two Life face-up and adds the chosen rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08CharlottePudding058,
        life: [eb01Doma005, eb01MountainGod018],
        donDeckCount: 1,
      },
      {},
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const lifeIds = [...engine.getState().players.south.life];

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Pudding's DON!! count choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(lifeIds.every((instanceId) => engine.getState().cards[instanceId]?.faceUp)).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08CharlottePudding058,
        life: [eb01Doma005, eb01MountainGod018],
        donDeckCount: 1,
      },
      {},
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each([0, 1])(
    "FAQ: face-up top-two position%s cannot be replaced by deeper facedown Life",
    (index) => {
      const life = ["ST02-012", "ST02-006", "ST15-002", "ST04-003"].map((cardId, i) => ({
        cardId,
        faceUp: i === index,
        publicKnowledge: i === index,
      }));
      const e = OnePieceTestEngine.create({ leaderCardId: "OP08-058", life, donDeckCount: 10 });
      const before = e.getView("south").players.south.life;
      e.asSouth().attack(e.leader("south"), e.leader("north"));
      expect(e.getView("south").players.south.life).toEqual(before);
      expect(e.getView("south").players.south.restedDon).toBe(0);
      expect(e.getView("south").players.south.donDeckCount).toBe(10);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("paying face-up cost permits zero optional DON addition", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP08-058",
      life: ["ST02-012", "ST02-006", "ST15-002"],
      donDeckCount: 10,
    });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(
      e
        .getView("north")
        .players.south.life.slice(0, 2)
        .map((c) => c.cardId),
    ).toEqual(["ST02-012", "ST02-006"]);
    expect(e.getView("north").players.south.life[2]?.cardId).toBeNull();
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.donDeckCount).toBe(10);
  });
});
