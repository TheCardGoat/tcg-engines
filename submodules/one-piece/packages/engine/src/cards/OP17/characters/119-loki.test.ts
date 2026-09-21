import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op17Loki119 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-119 Loki", () => {
  test("K.O.s opposing Characters up to a total cost of 4 without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op17Loki119],
        activeDon: op17Loki119.cost,
        trash: [],
      },
      {
        character: [
          { card: eb01Doma005 }, // cost 1
          { cardId: "OP13-013" }, // cost 1 — both fit under the total cap
        ],
        activeDon: 3,
      },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");
    const activeDonBefore = engine.getView("south").players.south.activeDon;

    engine.playCard(op17Loki119, "south");

    // Both together cost 2 — within the total of 4 — so both are selectable.
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. choice.");
    const candidates = ko.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(domaId);
    expect(candidates).toContain(higumaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId, higumaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(domaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(higumaId);
    // The effect K.O. costs no DON!! — only Loki's own printed cost was paid.
    expect(view.players.south.activeDon).toBe(activeDonBefore - 6);
    expect(view.prompts).toHaveLength(0);
  });

  test("never exceeds the total cost of 4", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op17Loki119], activeDon: op17Loki119.cost },
      {
        character: [
          { cardId: "OP16-095" }, // cost 2
          { cardId: "OP16-096" }, // cost 8 — over the cap alone
        ],
        activeDon: 3,
      },
    );
    const luffyId = engine.findCardInZone("north", "character", "OP16-095");
    const yamatoId = engine.findCardInZone("north", "character", "OP16-096");

    engine.playCard(op17Loki119, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected the K.O. choice.");
    const candidates = ko.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(luffyId);
    expect(candidates).toContain(yamatoId);
    // Only the cost-2 Luffy fits under the total of 4.
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.cardId)).toContain("OP16-096");
    expect(view.players.north.trash.map((card) => card.cardId)).toContain("OP16-095");
    expect(view.prompts).toHaveLength(0);
  });

  test("gains +3000 power during the opponent's turn and costs 12 more", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op17Loki119 }], activeDon: 6 },
      { activeDon: 3 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lokiPower = () =>
      engine.getView("south").players.south.characters.find((c) => c?.cardId === op17Loki119.id)
        ?.power;
    const lokiCost = () =>
      engine.getView("south").players.south.characters.find((c) => c?.cardId === op17Loki119.id)
        ?.cost;

    // On the opponent's turn: base 8000 + 3000, and a +12 cost.
    expect(lokiPower()).toBe(11000);
    expect(lokiCost()).toBe(18);

    engine.endTurn("north");
    expect(lokiPower()).toBe(8000);
  });
});
