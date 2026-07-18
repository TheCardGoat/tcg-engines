import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03CharlotteChiffon109,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveLifeChoice(position: "top" | "bottom") {
  const engine = OnePieceTestEngine.create({
    hand: [op03CharlotteChiffon109],
    life: [eb01Doma005, eb01Fourtricks025],
    deck: [eb01MountainGod018],
    activeDon: op03CharlotteChiffon109.cost,
  });
  const lifeBeforePayment = [...engine.getState().players.south.life];
  const expectedTrashId = position === "top" ? lifeBeforePayment[0]! : lifeBeforePayment.at(-1)!;
  const deckTopId = engine.getState().players.south.deck[0]!;

  engine.playCard(op03CharlotteChiffon109, "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

  const cost = engine.pendingDecision("effectCostTrashLife", "south").steps[0];
  expect(cost?.kind).toBe("chooseOption");
  if (cost?.kind !== "chooseOption") throw new Error("Expected Chiffon's Life position choice.");
  expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
  engine.resolveDecision("effectCostTrashLife", { optionId: position }, "south");

  const addLife = engine.pendingDecision("effectAddToLifeFromDeck", "south").steps[0];
  expect(addLife?.kind).toBe("chooseOption");
  if (addLife?.kind !== "chooseOption")
    throw new Error("Expected Chiffon's Life replacement choice.");
  expect(addLife.options.map((option) => option.id)).toEqual(["0", "1"]);
  engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

  const view = engine.getView("south");
  expect(view.players.south.trash.map((card) => card.instanceId)).toContain(expectedTrashId);
  expect(engine.getState().players.south.life[0]).toBe(deckTopId);
  expect(view.prompts).toHaveLength(0);
}

describe("OP03-109 Charlotte Chiffon", () => {
  test("may trash top Life before replenishing from the deck", () => {
    proveLifeChoice("top");
  });

  test("may trash bottom Life before replenishing from the deck", () => {
    proveLifeChoice("bottom");
  });

  test("may decline without moving Life or deck cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03CharlotteChiffon109],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018],
      activeDon: op03CharlotteChiffon109.cost,
    });
    const lifeBefore = [...engine.getState().players.south.life];
    const deckBefore = [...engine.getState().players.south.deck];

    engine.playCard(op03CharlotteChiffon109, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
