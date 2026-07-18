import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Issho078 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-078 Issho", () => {
  test("its controller chooses two opaque cards from an opponent hand of six", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Issho078], activeDon: op03Issho078.cost },
      { hand: Array.from({ length: 6 }, () => eb01Doma005) },
    );
    const hiddenIds = [...engine.getState().players.north.hand];
    engine.playCard(op03Issho078, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Issho's opaque hand choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    expect(trash.candidates).toHaveLength(6);
    expect(trash.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining(hiddenIds),
    );
    expect(trash.candidates.every((candidate) => candidate.publicInfo === undefined)).toBe(true);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );
    expect(engine.getView("south").players.north).toMatchObject({ handCount: 4 });
    expect(engine.getView("north").players.north.trash).toHaveLength(2);
  });

  test("does not trash an opponent hand below six cards", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Issho078], activeDon: op03Issho078.cost },
      { hand: Array.from({ length: 5 }, () => eb01Doma005) },
    );

    engine.playCard(op03Issho078, "south");

    const view = engine.getView("south");
    expect(view.players.north.handCount).toBe(5);
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! attached reduces all opposing costs only during its controller's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op03Issho078, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(2);
    engine.endTurn("south");
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(5);
  });

  test("without attached DON!! leaves opponent costs unchanged", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Issho078] },
      { character: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(3);
  });
});
