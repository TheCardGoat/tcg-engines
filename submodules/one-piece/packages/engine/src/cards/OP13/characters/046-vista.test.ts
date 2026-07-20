import {
  op01Shanks120,
  op04GumGumRedRoc056,
  op13Curiel044,
  op13EdwardNewgate042,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Vista046 } from "../../../../../cards/src/cards/OP13/characters/046-vista.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-046 Vista", () => {
  test("deals two Life damage with Double Attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op13Vista046, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const vistaId = engine.findCardInZone("south", "character", op13Vista046);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(vistaId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });

  test("trashes a filtered hand card instead of battle K.O., then cannot replace opponent-effect removal again that turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Vista046, rested: true, playedOnTurn: 0 }],
        hand: [op13Curiel044, op13EdwardNewgate042, op01Shanks120],
      },
      {
        character: [{ card: op01Shanks120, playedOnTurn: 0 }],
        hand: [op04GumGumRedRoc056],
        activeDon: op04GumGumRedRoc056.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vistaId = engine.findCardInZone("south", "character", op13Vista046);
    const eligibleId = engine.findCardInZone("south", "hand", op13Curiel044);
    const excludedId = engine.findCardInZone("south", "hand", op01Shanks120);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(attackerId, vistaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const trash = engine.pendingDecision("battleKoReplacement", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Vista's replacement payment.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(trash.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("battleKoReplacement", { selectedIds: [eligibleId] }, "south");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(vistaId);

    engine.playCard(op04GumGumRedRoc056, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [vistaId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(vistaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may replace its first opponent-effect removal of the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13Vista046], hand: [op13Curiel044, op13EdwardNewgate042, op01Shanks120] },
      { hand: [op04GumGumRedRoc056], activeDon: op04GumGumRedRoc056.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vistaId = engine.findCardInZone("south", "character", op13Vista046);
    const paidId = engine.findCardInZone("south", "hand", op13Curiel044);

    engine.playCard(op04GumGumRedRoc056, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [vistaId] }, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Vista's replacement payment.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(paidId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paidId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(vistaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.prompts).toHaveLength(0);
  });
});
