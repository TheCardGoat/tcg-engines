import {
  eb01Doma005,
  eb01MountainGod018,
  op12Koushirou027,
  op09Shanks001,
  op14eb04ShachiPenguin006,
  op14eb04TrafalgarLawOp14001001,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04EustassCaptainKidOp14014014 } from "../../../../../cards/src/cards/OP14EB04/characters/014-eustass-captain-kid-op14-014.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe('OP14-014 Eustass"Captain"Kid', () => {
  test("with an included Supernovas Leader plays one selected red Character with 2000 power or less", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04TrafalgarLawOp14001001,
      hand: [
        op14eb04EustassCaptainKidOp14014014,
        op14eb04ShachiPenguin006,
        eb01Doma005,
        op12Koushirou027,
      ],
      activeDon: op14eb04EustassCaptainKidOp14014014.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op14eb04ShachiPenguin006);
    const highPowerId = engine.findCardInZone("south", "hand", eb01Doma005);
    const wrongColorId = engine.findCardInZone("south", "hand", op12Koushirou027);

    engine.playCard(op14eb04EustassCaptainKidOp14014014, "south");
    const decision = engine.pendingDecision("effectPlaySelection", "south");
    expect(decision.actorId).toBe("south");
    const play = decision.steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Kid's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(highPowerId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([highPowerId, wrongColorId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with an included Supernovas Leader may play no Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04TrafalgarLawOp14001001,
      hand: [op14eb04EustassCaptainKidOp14014014, op14eb04ShachiPenguin006],
      activeDon: op14eb04EustassCaptainKidOp14014014.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op14eb04ShachiPenguin006);

    engine.playCard(op14eb04EustassCaptainKidOp14014014, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Supernovas Leader does not offer or play an eligible Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      hand: [op14eb04EustassCaptainKidOp14014014, op14eb04ShachiPenguin006],
      activeDon: op14eb04EustassCaptainKidOp14014014.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op14eb04ShachiPenguin006);

    engine.playCard(op14eb04EustassCaptainKidOp14014014, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04EustassCaptainKidOp14014014], hand: [] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], hand: [] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kidId = engine.findCardInZone("south", "character", op14eb04EustassCaptainKidOp14014014);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south");
    expect(blocker.actorId).toBe("south");
    const choice = blocker.steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected Kid's Blocker choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(kidId);
    engine.resolveDecision("battleBlocker", { selectedIds: [kidId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kidId);
    expect(view.prompts).toHaveLength(0);
  });
});
