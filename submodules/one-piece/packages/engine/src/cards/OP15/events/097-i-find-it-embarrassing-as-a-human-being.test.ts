import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-097 I Find It Embarrassing as a Human Being", () => {
  test("[Main] with 10+ trash cards stops a base-cost-5-or-less Character from attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-097"],
        trash: Array.from({ length: 10 }, () => "OP13-013"),
        activeDon: 1,
      },
      {
        character: [{ cardId: "OP13-013", rested: false, attachedDon: 1 }, "OP16-003"],
        activeDon: 5,
      },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-097");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the cannot-attack target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    engine.endTurn("south");
    expect(() => engine.asNorth().attack("OP13-013", engine.asSouth().leader())).toThrow();
  });

  test("base cost 8 Characters are not eligible", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-097"],
        trash: Array.from({ length: 10 }, () => "OP13-013"),
        activeDon: 1,
      },
      { character: [{ cardId: "OP16-003", rested: false, attachedDon: 1 }], activeDon: 5 },
    );

    engine.playCard("OP15-097");

    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP16-003",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
