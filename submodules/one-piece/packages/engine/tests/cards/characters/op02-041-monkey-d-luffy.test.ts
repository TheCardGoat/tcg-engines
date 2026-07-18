import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02Franky039,
  op02MonkeyDLuffy041,
  op02RoronoaZoro043,
  op13Gordon024,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-041 Monkey.D.Luffy", () => {
  test("plays a cost-4-or-less FILM or Straw Hat Crew Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02MonkeyDLuffy041, op13Gordon024, op02RoronoaZoro043, eb01Doma005, op02Franky039],
      activeDon: op02MonkeyDLuffy041.cost,
    });
    const filmId = engine.findCardInZone("south", "hand", op13Gordon024);
    const strawHatId = engine.findCardInZone("south", "hand", op02RoronoaZoro043);
    const unrelatedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const wrongCostId = engine.findCardInZone("south", "hand", op02Franky039);

    engine.playCard(op02MonkeyDLuffy041, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Luffy's play choice.");
    const candidateIds = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toContain(filmId);
    expect(candidateIds).toContain(strawHatId);
    expect(candidateIds).not.toContain(unrelatedId);
    expect(candidateIds).not.toContain(wrongCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [strawHatId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === strawHatId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and redirects an opposing Character attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [{ card: op02MonkeyDLuffy041, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const luffyId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Luffy's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(luffyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [luffyId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
