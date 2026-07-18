import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07TrafalgarLawTr010,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

registerCards([op07TrafalgarLawTr010]);

describe("ST10-010 Trafalgar Law", () => {
  test("returns a DON!! and lets its controller choose 2 cards from an opponent's 7-card hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07TrafalgarLawTr010], activeDon: 5 },
      {
        hand: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
        ],
      },
    );
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op07TrafalgarLawTr010, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (discard?.kind !== "selectEntity") throw new Error("Expected Law's hand choice.");
    expect(
      discard.candidates.every((candidate) => candidate.ref.id.startsWith("hidden-card:")),
    ).toBe(true);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: discard.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.handCount).toBe(5);
    expect(view.players.north.trash).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may still pay the DON!! cost when the opponent has fewer than 7 cards", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07TrafalgarLawTr010], activeDon: 5 },
      { hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
    );
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op07TrafalgarLawTr010, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.handCount).toBe(3);
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("can block an attack on its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07TrafalgarLawTr010] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", op07TrafalgarLawTr010);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [lawId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(lawId);
    expect(view.prompts).toHaveLength(0);
  });
});
