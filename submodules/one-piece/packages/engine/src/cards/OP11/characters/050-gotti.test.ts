import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11CaponeGangBege048, op11Vito042 } from "@tcg/op-cards";
import { op11Gotti050 } from "../../../../../cards/src/cards/OP11/characters/050-gotti.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function attackingGottiEngine() {
  return OnePieceTestEngine.create(
    {
      character: [{ card: op11Gotti050, playedOnTurn: 0 }],
      hand: [op11Vito042, eb01Doma005],
    },
    { character: [op11CaponeGangBege048] },
    { firstPlayer: "north", activeSeat: "south" },
  );
}

function activateGotti(engine: OnePieceTestEngine) {
  const gottiId = engine.findCardInZone("south", "character", op11Gotti050);
  const costId = engine.findCardInZone("south", "hand", op11Vito042);
  const excludedCostId = engine.findCardInZone("south", "hand", eb01Doma005);

  engine.declareAttack(gottiId, engine.leader("north"), "south");
  const optional = engine.pendingDecision("effectOptional", "south").steps[0];
  expect(optional?.kind).toBe("confirm");
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

  const view = engine.getView("south");
  expect(view.players.south.trash.map((card) => card.instanceId)).toContain(costId);
  expect(view.players.south.hand.map((card) => card.instanceId)).toContain(excludedCostId);
}

describe("OP11-050 Gotti", () => {
  test("pays the filtered hand cost, then may return an eligible Character to its owner's hand", () => {
    const engine = attackingGottiEngine();
    const targetId = engine.findCardInZone("north", "character", op11CaponeGangBege048);

    activateGotti(engine);

    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Gotti's destination choice.");
    expect(choice.options.map((option) => option.label)).toEqual(["returnToHand", "returnToDeck"]);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Gotti's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may instead place the selected Character at the bottom of its owner's deck", () => {
    const engine = attackingGottiEngine();
    const targetId = engine.findCardInZone("north", "character", op11CaponeGangBege048);

    activateGotti(engine);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(targetId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
