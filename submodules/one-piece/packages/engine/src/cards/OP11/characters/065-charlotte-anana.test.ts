import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op08CharlotteOven061 } from "@tcg/op-cards";
import { op11CharlotteAnana065 } from "../../../../../cards/src/cards/OP11/characters/065-charlotte-anana.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function attackAnana(engine: OnePieceTestEngine) {
  engine.declareAttack(
    engine.findCardInZone("north", "character", eb01MountainGod018),
    engine.leader("south"),
    "north",
  );
}

describe("OP11-065 Charlotte Anana", () => {
  test("gains Blocker only with another purple Big Mom Pirates Character", () => {
    const eligible = OnePieceTestEngine.create(
      { character: [op11CharlotteAnana065, op08CharlotteOven061] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ananaId = eligible.findCardInZone("south", "character", op11CharlotteAnana065);
    attackAnana(eligible);
    const blocker = eligible.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Anana's conditional Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(ananaId);

    const ineligible = OnePieceTestEngine.create(
      { character: [op11CharlotteAnana065] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    attackAnana(ineligible);
    expect(() => ineligible.pendingDecision("battleBlocker", "south")).toThrow();
  });
});
