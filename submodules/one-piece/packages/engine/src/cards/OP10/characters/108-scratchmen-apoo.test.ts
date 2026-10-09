import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018 } from "@tcg/op-cards";
import { op10ScratchmenApoo108 } from "../../../../../cards/src/cards/characters/op10-108-scratchmen-apoo.ts";
import { op10Urouge101 } from "../../../../../cards/src/cards/characters/op10-101-urouge.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-108 Scratchmen Apoo", () => {
  test("gains Blocker with another yellow compound-trait Supernovas Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10ScratchmenApoo108, op10Urouge101] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const apooId = engine.findCardInZone("south", "character", op10ScratchmenApoo108);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Apoo's conditional Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(apooId);

    const life = engine.getView("south").players.south.lifeCount;
    engine.asSouth().chooseBlocker(apooId);
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(apooId);
  });
  test("another Apoo or a non-yellow Supernovas Character does not enable Blocker", () => {
    for (const companion of ["OP10-108", "ST02-010"]) {
      const e = OnePieceTestEngine.create(
        { character: ["OP10-108", companion] },
        {},
        { firstPlayer: "south", activeSeat: "north" },
      );
      const life = e.getView("south").players.south.lifeCount;
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
      expect(e.getView("south").prompts).toHaveLength(0);
    }
  });
});
