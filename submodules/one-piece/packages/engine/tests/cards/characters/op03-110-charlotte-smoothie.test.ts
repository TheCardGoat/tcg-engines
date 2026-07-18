import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op03CharlotteOpera106,
  op03CharlotteSmoothie110,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveLifeChoice(position: "top" | "bottom") {
  const engine = OnePieceTestEngine.create(
    {
      character: [{ card: op03CharlotteSmoothie110, playedOnTurn: 0 }],
      life: [eb01Doma005, eb01Fourtricks025],
    },
    { character: [{ card: op03CharlotteOpera106, rested: true, playedOnTurn: 0 }] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const smoothieId = engine.findCardInZone("south", "character", op03CharlotteSmoothie110);
  const targetId = engine.findCardInZone("north", "character", op03CharlotteOpera106);
  const lifeBeforePayment = [...engine.getState().players.south.life];
  const expectedHandId = position === "top" ? lifeBeforePayment[0]! : lifeBeforePayment.at(-1)!;

  engine.declareAttack(smoothieId, targetId, "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

  const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
  expect(cost?.kind).toBe("chooseOption");
  if (cost?.kind !== "chooseOption") throw new Error("Expected Smoothie's Life position choice.");
  expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
  engine.resolveDecision("effectCostAddLifeToHand", { optionId: position }, "south");

  const view = engine.getView("south");
  expect(view.players.south.hand.map((card) => card.instanceId)).toContain(expectedHandId);
  expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
  expect(view.prompts).toHaveLength(0);
}

describe("OP03-110 Charlotte Smoothie", () => {
  test("may add top Life to hand and gain enough battle power to K.O. a 6000-power Character", () => {
    proveLifeChoice("top");
  });

  test("may add bottom Life to hand and gain enough battle power to K.O. a 6000-power Character", () => {
    proveLifeChoice("bottom");
  });

  test("may decline without moving Life or gaining battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03CharlotteSmoothie110, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: op03CharlotteOpera106, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const smoothieId = engine.findCardInZone("south", "character", op03CharlotteSmoothie110);
    const targetId = engine.findCardInZone("north", "character", op03CharlotteOpera106);
    const lifeBefore = [...engine.getState().players.south.life];

    engine.declareAttack(smoothieId, targetId, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === targetId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
