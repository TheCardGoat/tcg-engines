import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Kingbaum100 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveLifeChoice(position: "top" | "bottom") {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    { life: [op03Kingbaum100, eb01Doma005, eb01Fourtricks025] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
  const kingbaumId = engine.findCardInZone("north", "life", op03Kingbaum100);

  engine.declareAttack(attackerId, engine.leader("north"), "south");
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
  const lifeBeforePayment = [...engine.getState().players.north.life];
  const expectedTrashId = position === "top" ? lifeBeforePayment[0]! : lifeBeforePayment.at(-1)!;
  const cost = engine.pendingDecision("effectCostTrashLife", "north").steps[0];
  expect(cost?.kind).toBe("chooseOption");
  if (cost?.kind !== "chooseOption") throw new Error("Expected Kingbaum's Life position choice.");
  expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
  engine.resolveDecision("effectCostTrashLife", { optionId: position }, "north");

  const view = engine.getView("north");
  expect(view.players.north.trash.map((card) => card.instanceId)).toContain(expectedTrashId);
  expect(view.players.north.characters.some((card) => card?.instanceId === kingbaumId)).toBe(true);
  expect(view.prompts).toHaveLength(0);
}

describe("OP03-100 Kingbaum", () => {
  test("may trash the top Life card before playing itself from Trigger", () => {
    proveLifeChoice("top");
  });

  test("may trash the bottom Life card before playing itself from Trigger", () => {
    proveLifeChoice("bottom");
  });
});
