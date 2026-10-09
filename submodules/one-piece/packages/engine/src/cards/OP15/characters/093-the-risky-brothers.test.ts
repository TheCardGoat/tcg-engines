import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15TheRiskyBrothers093 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const FILLER = "OP13-013";

function createEngine(trashCount: number) {
  return OnePieceTestEngine.create(
    {
      character: [
        { card: op15TheRiskyBrothers093 },
        { cardId: "OP16-095", rested: false, playedOnTurn: 0 },
      ],
      trash: Array.from({ length: trashCount }, () => FILLER),
      activeDon: 3,
    },
    { character: [{ card: eb01Doma005, rested: true }] },
  );
}

describe("OP15-093 The Risky Brothers", () => {
  test("self-trash reaches fifteen and grants a newly played Luffy Rush: Character, not Leader attacks", () => {
    let engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP05-001",
        character: [op15TheRiskyBrothers093],
        hand: ["OP16-095"],
        trash: Array.from({ length: 14 }, () => FILLER),
        activeDon: 2,
      },
      { leaderCardId: "ST01-001", character: [{ card: eb01Doma005, rested: true }], hand: [] },
    );
    engine.asSouth().play("OP16-095");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const brothersId = engine.findCardInZone("south", "character", op15TheRiskyBrothers093);
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");
    const opponent = engine.findCardInZone("north", "character", eb01Doma005);
    const beforeGrant = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: luffyId,
      targetId: opponent,
    });
    engine = OnePieceTestEngine.fromState(beforeGrant.state);

    engine.activateEffect(brothersId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const grant = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (grant?.kind !== "selectEntity") throw new Error("Expected the grant target.");
    expect(grant.candidates.map((candidate) => candidate.ref.id)).toEqual([luffyId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash.map((card) => card.cardId)).toContain(op15TheRiskyBrothers093.id);
    // The granted "Slash" attribute is player-visible on the buffed card.
    const luffyCard = view.characters.find((c) => c?.instanceId === luffyId);
    expect(luffyCard?.attribute).toContain("slash");
    const leaderAttack = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: luffyId,
      targetId: engine.leader("north"),
    });
    engine = OnePieceTestEngine.fromState(leaderAttack.state);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === luffyId)
        ?.rested,
    ).toBe(false);
    engine.asSouth().attack(luffyId, opponent);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === luffyId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === luffyId)
        ?.attribute,
    ).not.toContain("slash");
  });

  test("checks the trash threshold after paying the self-trash cost", () => {
    const engine = createEngine(14);
    const brothersId = engine.findCardInZone("south", "character", op15TheRiskyBrothers093);
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");

    engine.activateEffect(brothersId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");

    expect(engine.getView("south").players.south.trash).toHaveLength(15);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === luffyId)
        ?.attribute,
    ).toContain("slash");
  });
  test("declining the self-trash leaves the Character and trash untouched", () => {
    const engine = createEngine(15);
    const brothersId = engine.findCardInZone("south", "character", op15TheRiskyBrothers093);
    const trashBefore = engine.getView("south").players.south.trash.length;

    engine.activateEffect(brothersId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.trash.length).toBe(trashBefore);
    expect(view.characters.map((card) => card?.instanceId)).toContain(brothersId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
