import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { op10MonkeyDLuffy118 } from "../../../../../cards/src/cards/OP10/characters/118-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-118 Monkey.D.Luffy", () => {
  test("when attacking orders three trash cards as its cost before forcing an opposing discard", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10MonkeyDLuffy118, playedOnTurn: 0 }],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const luffyId = engine.findCardInZone("south", "character", op10MonkeyDLuffy118);
    const trashIds = [...engine.getState().players.south.trash];
    const submittedOrder = [trashIds[2]!, trashIds[0]!, trashIds[3]!];
    const discardedId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(luffyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 3, max: 3, ordered: true });
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: submittedOrder }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(submittedOrder);
    const view = engine.getView("south");
    expect(view.players.south.trash).toHaveLength(1);
    expect(view.players.north).toMatchObject({ handCount: 4 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("prevents the first opposing effect K.O. each turn but not the second", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10MonkeyDLuffy118] },
      {
        hand: [op12UrsaShock096, op12UrsaShock096],
        character: [op01Shanks120],
        activeDon: op12UrsaShock096.cost * 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const luffyId = engine.findCardInZone("south", "character", op10MonkeyDLuffy118);

    engine.playCard(op12UrsaShock096, "north");
    let target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ursa Shock's first target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(luffyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "north");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === luffyId),
    ).toBe(true);

    engine.playCard(op12UrsaShock096, "north");
    target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ursa Shock's second target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.prompts).toHaveLength(0);
  });
});
