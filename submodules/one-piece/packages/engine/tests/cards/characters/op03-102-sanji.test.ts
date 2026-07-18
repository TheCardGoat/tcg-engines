import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Sanji102 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveLifeChoice(position: "top" | "bottom") {
  const engine = OnePieceTestEngine.create(
    {
      character: [{ card: op03Sanji102, attachedDon: 2, playedOnTurn: 0 }],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018],
    },
    {},
    { firstPlayer: "north", activeSeat: "south" },
  );
  const sanjiId = engine.findCardInZone("south", "character", op03Sanji102);
  const lifeBeforePayment = [...engine.getState().players.south.life];
  const expectedHandId = position === "top" ? lifeBeforePayment[0]! : lifeBeforePayment.at(-1)!;
  const deckTopId = engine.getState().players.south.deck[0]!;

  engine.declareAttack(sanjiId, engine.leader("north"), "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

  const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
  expect(cost?.kind).toBe("chooseOption");
  if (cost?.kind !== "chooseOption") throw new Error("Expected Sanji's Life position choice.");
  expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
  engine.resolveDecision("effectCostAddLifeToHand", { optionId: position }, "south");

  const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
  expect(addLife?.kind).toBe("chooseOption");
  if (addLife?.kind !== "chooseOption")
    throw new Error("Expected Sanji's Life replacement choice.");
  expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
  engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

  const view = engine.getView("south");
  expect(view.players.south.hand.map((card) => card.instanceId)).toContain(expectedHandId);
  expect(engine.getState().players.south.life[0]).toBe(deckTopId);
  expect(view.prompts).toHaveLength(0);
}

describe("OP03-102 Sanji", () => {
  test("may add top Life to hand before replenishing from the deck", () => {
    proveLifeChoice("top");
  });

  test("may add bottom Life to hand before replenishing from the deck", () => {
    proveLifeChoice("bottom");
  });

  test("may decline without moving Life or deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Sanji102, attachedDon: 2, playedOnTurn: 0 }],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { deck: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op03Sanji102);
    const deckBefore = [...engine.getState().players.south.deck];
    const lifeBefore = [...engine.getState().players.south.life];

    engine.declareAttack(sanjiId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not offer its Life exchange with fewer than two attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Sanji102, attachedDon: 1, playedOnTurn: 0 }],
        deck: [eb01MountainGod018, eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { deck: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op03Sanji102);
    const handBefore = engine.getView("south").players.south.hand.length;

    engine.declareAttack(sanjiId, engine.leader("north"), "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(handBefore);
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
