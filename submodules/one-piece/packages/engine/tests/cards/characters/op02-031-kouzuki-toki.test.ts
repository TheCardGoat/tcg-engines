import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Yamato121, op02KouzukiToki031 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-031 Kouzuki Toki", () => {
  test("gains Blocker from a Character with the alternate rules name Kouzuki Oden", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02KouzukiToki031, op01Yamato121] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const toki = engine.findCardInZone("south", "character", op02KouzukiToki031);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01Doma005),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(toki);
  });

  test("does not gain Blocker without Kouzuki Oden", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02KouzukiToki031] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01Doma005),
      engine.leader("south"),
      "north",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
