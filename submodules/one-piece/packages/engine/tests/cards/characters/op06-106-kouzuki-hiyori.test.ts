import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Inazuma022,
  eb01MountainGod018,
  op06KouzukiHiyori106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveLifeExchange(position: "top" | "bottom") {
  const engine = OnePieceTestEngine.create({
    hand: [op06KouzukiHiyori106, eb01Doma005],
    life: [eb01MountainGod018, eb01Inazuma022],
    activeDon: op06KouzukiHiyori106.cost,
  });
  const lifeBefore = [...engine.getState().players.south.life];
  const expectedHandId = position === "top" ? lifeBefore[0]! : lifeBefore.at(-1)!;
  const handTargetId = engine.findCardInZone("south", "hand", eb01Doma005);

  engine.playCard(op06KouzukiHiyori106, "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

  const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
  expect(cost?.kind).toBe("chooseOption");
  if (cost?.kind !== "chooseOption") throw new Error("Expected Hiyori's Life payment.");
  expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
  engine.resolveDecision("effectCostAddLifeToHand", { optionId: position }, "south");

  const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
  if (target?.kind !== "selectEntity") throw new Error("Expected Hiyori's hand target.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
    expect.arrayContaining([handTargetId, expectedHandId]),
  );
  engine.resolveDecision("effectTargetSelection", { selectedIds: [handTargetId] }, "south");

  const view = engine.getView("south");
  expect(view.players.south.hand.map((card) => card.instanceId)).toContain(expectedHandId);
  expect(engine.getState().players.south.life[0]).toBe(handTargetId);
  expect(view.players.south.lifeCount).toBe(2);
  expect(view.prompts).toHaveLength(0);
}

describe("OP06-106 Kouzuki Hiyori", () => {
  test("may take top Life before adding a hand card to top Life", () => {
    proveLifeExchange("top");
  });

  test("may take bottom Life before adding a hand card to top Life", () => {
    proveLifeExchange("bottom");
  });

  test("may decline without moving Life or another hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06KouzukiHiyori106, eb01Doma005],
      life: [eb01MountainGod018, eb01Inazuma022],
      activeDon: op06KouzukiHiyori106.cost,
    });
    const lifeBefore = [...engine.getState().players.south.life];
    const handTargetId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op06KouzukiHiyori106, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      handTargetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
