import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01MonkeyDLuffy024, op01Shanks120 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-024 Monkey.D.Luffy", () => {
  test("once per turn gives itself up to 2 rested DON!! cards", () => {
    const engine = OnePieceTestEngine.create({
      character: [op01MonkeyDLuffy024],
      restedDon: 2,
    });
    const luffyId = engine.findCardInZone("south", "character", op01MonkeyDLuffy024);

    engine.activateEffect(luffyId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Luffy's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === luffyId)?.attachedDon,
    ).toBe(2);
    expect(view.players.south.restedDon).toBe(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: luffyId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });

  test("with 2 DON!! attached, survives Strike battle K.O. but not Slash battle K.O.", () => {
    const strikeEngine = OnePieceTestEngine.create(
      {
        character: [{ card: op01MonkeyDLuffy024, attachedDon: 2, rested: true, playedOnTurn: 0 }],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedLuffyId = strikeEngine.findCardInZone("south", "character", op01MonkeyDLuffy024);
    const strikeAttackerId = strikeEngine.findCardInZone("north", "character", eb01MountainGod018);

    strikeEngine.declareAttack(strikeAttackerId, protectedLuffyId, "north");

    expect(
      strikeEngine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === protectedLuffyId),
    ).toBe(true);
    expect(
      strikeEngine.getView("south").players.south.trash.map((card) => card.instanceId),
    ).not.toContain(protectedLuffyId);

    const slashEngine = OnePieceTestEngine.create(
      {
        character: [{ card: op01MonkeyDLuffy024, attachedDon: 2, rested: true, playedOnTurn: 0 }],
      },
      {
        character: [{ card: op01Shanks120, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const unprotectedLuffyId = slashEngine.findCardInZone(
      "south",
      "character",
      op01MonkeyDLuffy024,
    );
    const slashAttackerId = slashEngine.findCardInZone("north", "character", op01Shanks120);

    slashEngine.declareAttack(slashAttackerId, unprotectedLuffyId, "north");

    expect(
      slashEngine.getView("south").players.south.trash.map((card) => card.instanceId),
    ).toContain(unprotectedLuffyId);
  });
});
