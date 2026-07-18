import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Inazuma022,
  eb01MountainGod018,
  op06Kawamatsu103,
  op06KouzukiHiyori106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function proveLifePosition(position: "top" | "bottom") {
  const engine = OnePieceTestEngine.create(
    {
      hand: [eb01Doma005, eb01Inazuma022, eb01MountainGod018],
      character: [{ card: op06Kawamatsu103, playedOnTurn: 0 }, op06KouzukiHiyori106, eb01Doma005],
      life: [eb01MountainGod018],
    },
    {},
    { firstPlayer: "north", activeSeat: "south" },
  );
  const kawamatsuId = engine.findCardInZone("south", "character", op06Kawamatsu103);
  const hiyoriId = engine.findCardInZone("south", "character", op06KouzukiHiyori106);
  const nonzeroId = engine.findCardInZone("south", "character", eb01Doma005);
  const discardIds = [
    engine.findCardInZone("south", "hand", eb01Doma005),
    engine.findCardInZone("south", "hand", eb01Inazuma022),
  ];

  engine.declareAttack(kawamatsuId, engine.leader("north"), "south");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

  const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
  expect(payment).toMatchObject({ kind: "payCost", min: 2, max: 2 });
  if (payment?.kind !== "payCost") throw new Error("Expected Kawamatsu's hand payment.");
  expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
    expect.arrayContaining(discardIds),
  );
  engine.resolveDecision("effectCostTrashFromHand", { selectedIds: discardIds }, "south");

  const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
  if (target?.kind !== "selectEntity") throw new Error("Expected Kawamatsu's Life target.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([hiyoriId]);
  expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonzeroId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [hiyoriId] }, "south");

  const placement = engine.pendingDecision("effectLifePosition", "south").steps[0];
  expect(placement?.kind).toBe("chooseOption");
  if (placement?.kind !== "chooseOption") throw new Error("Expected top-or-bottom Life choice.");
  expect(placement.options.map((option) => option.id)).toEqual(["top", "bottom"]);
  engine.resolveDecision("effectLifePosition", { optionId: position }, "south");

  const life = engine.getState().players.south.life;
  expect(position === "top" ? life[0] : life.at(-1)).toBe(hiyoriId);
  expect(engine.getState().cards[hiyoriId]?.faceUp).toBe(true);
  expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
    expect.arrayContaining(discardIds),
  );
}

describe("OP06-103 Kawamatsu", () => {
  test("trashes 2 hand cards and adds a 0-power Character to top Life face-up", () => {
    proveLifePosition("top");
  });

  test("trashes 2 hand cards and adds a 0-power Character to bottom Life face-up", () => {
    proveLifePosition("bottom");
  });

  test("may decline without trashing cards or moving a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Inazuma022],
        character: [{ card: op06Kawamatsu103, playedOnTurn: 0 }, op06KouzukiHiyori106],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kawamatsuId = engine.findCardInZone("south", "character", op06Kawamatsu103);
    const hiyoriId = engine.findCardInZone("south", "character", op06KouzukiHiyori106);

    engine.declareAttack(kawamatsuId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(2);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(hiyoriId);
    expect(view.players.south.trash).toHaveLength(0);
  });
});
