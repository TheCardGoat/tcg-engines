import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op11Pedro057 } from "../../../../../cards/src/cards/OP11/characters/057-pedro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function attackPedro(engine: OnePieceTestEngine) {
  engine.declareAttack(
    engine.findCardInZone("north", "character", eb01MountainGod018),
    engine.leader("south"),
    "north",
  );
}

describe("OP11-057 Pedro", () => {
  test("gains Blocker at four hand cards or fewer but not at five", () => {
    const eligible = OnePieceTestEngine.create(
      { character: [op11Pedro057], hand: Array.from({ length: 4 }, () => eb01Doma005) },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pedroId = eligible.findCardInZone("south", "character", op11Pedro057);
    attackPedro(eligible);
    const blocker = eligible.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Pedro's conditional Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pedroId);

    const ineligible = OnePieceTestEngine.create(
      { character: [op11Pedro057], hand: Array.from({ length: 5 }, () => eb01Doma005) },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    attackPedro(ineligible);
    expect(() => ineligible.pendingDecision("battleBlocker", "south")).toThrow();
  });
});
