import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05NefeltariVivi086 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function blockerIsOffered(trashCount: number) {
  const engine = OnePieceTestEngine.create(
    { character: [op05NefeltariVivi086], trash: Array(trashCount).fill(eb01Doma005) },
    { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
    { firstPlayer: "south", activeSeat: "north" },
  );
  const viviId = engine.findCardInZone("south", "character", op05NefeltariVivi086);
  engine.declareAttack(
    engine.findCardInZone("north", "character", eb01MountainGod018),
    engine.leader("south"),
    "north",
  );
  const prompt = engine
    .getState()
    .promptQueue.find(
      (candidate) =>
        candidate.status === "pending" && candidate.resolutionContext?.intent === "battleBlocker",
    );
  return { engine, viviId, prompt };
}

describe("OP05-086 Nefeltari Vivi", () => {
  test("is a Blocker with 10 or more trash cards", () => {
    const { engine, viviId, prompt } = blockerIsOffered(10);
    expect(prompt?.options.map((option) => option.id)).toContain(viviId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("is not a Blocker after trash falls to 9", () => {
    const { prompt } = blockerIsOffered(9);
    expect(prompt).toBeUndefined();
  });
});
