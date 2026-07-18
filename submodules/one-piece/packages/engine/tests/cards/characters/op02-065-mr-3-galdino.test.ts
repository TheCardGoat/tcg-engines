import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Mr3Galdino065 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-065 Mr.3 (Galdino)", () => {
  test("blocks publicly during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02Mr3Galdino065], hand: [eb01Doma005] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const galdino = engine.findCardInZone("south", "character", op02Mr3Galdino065);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01Doma005),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("battleBlocker", { selectedIds: [galdino] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === galdino)?.rested).toBe(
      true,
    );
  });

  test("may trash a hand card to ready itself at the end of its controller's turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op02Mr3Galdino065, rested: true }],
      hand: [eb01Doma005],
    });
    const galdino = engine.findCardInZone("south", "character", op02Mr3Galdino065);
    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === galdino)?.rested).toBe(
      false,
    );
    expect(view.players.south.trash).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the end-of-turn cost and remains rested", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op02Mr3Galdino065, rested: true }],
      hand: [eb01Doma005],
    });
    const galdino = engine.findCardInZone("south", "character", op02Mr3Galdino065);
    engine.endTurn("south");
    const optional = engine.pendingDecision("effectOptional", "south").steps[0];
    expect(optional?.kind).toBe("confirm");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === galdino)
        ?.rested,
    ).toBe(true);
  });
});
