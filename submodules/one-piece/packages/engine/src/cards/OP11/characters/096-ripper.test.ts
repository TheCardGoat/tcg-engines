import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op11Bogard093, op11Ripper096, op11Shirley104 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function blockerCandidates(engine: OnePieceTestEngine) {
  engine.declareAttack(
    engine.findCardInZone("north", "character", eb01MountainGod018),
    engine.leader("south"),
    "north",
  );
  const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
  if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker choice.");
  return blocker.candidates.map((candidate) => candidate.ref.id);
}

describe("OP11-096 Ripper", () => {
  test("gains Blocker while another black Navy Character is in play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Ripper096, op11Bogard093, op11Shirley104] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ripperId = engine.findCardInZone("south", "character", op11Ripper096);

    expect(blockerCandidates(engine)).toContain(ripperId);
  });

  test("does not gain Blocker from itself or a non-black Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Ripper096, op11Shirley104] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ripperId = engine.findCardInZone("south", "character", op11Ripper096);
    const shirleyId = engine.findCardInZone("south", "character", op11Shirley104);
    const candidates = blockerCandidates(engine);

    expect(candidates).toContain(shirleyId);
    expect(candidates).not.toContain(ripperId);
  });
});
