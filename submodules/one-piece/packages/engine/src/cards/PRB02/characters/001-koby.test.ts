import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op11Koby001,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02Koby001 } from "../../../../../cards/src/cards/PRB02/characters/001-koby.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("PRB02-001 Koby", () => {
  test("on the opponent's turn gains power with an included Navy Leader trait only", () => {
    const matching = OnePieceTestEngine.create(
      { leaderCardId: op11Koby001, character: [prb02Koby001] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const matchingId = matching.findCardInZone("south", "character", prb02Koby001);

    expect(
      matching
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === matchingId)?.power,
    ).toBe(6000);
    matching.endTurn("north");
    expect(
      matching
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === matchingId)?.power,
    ).toBe(5000);

    const nonmatching = OnePieceTestEngine.create(
      { leaderCardId: op01RoronoaZoro001, character: [prb02Koby001] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const nonmatchingId = nonmatching.findCardInZone("south", "character", prb02Koby001);
    const view = nonmatching.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === nonmatchingId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking K.O.s one eligible opposing Character then draws at six cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02Koby001, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025],
      },
      { character: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kobyId = engine.findCardInZone("south", "character", prb02Koby001);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(kobyId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Koby's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(ineligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.south).toMatchObject({ handCount: 7, deckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("at six cards still draws after selecting no optional K.O. target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02Koby001, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025],
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kobyId = engine.findCardInZone("south", "character", prb02Koby001);
    const ineligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(kobyId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(ineligibleId);
    expect(view.players.south).toMatchObject({ handCount: 7, deckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("at seven cards may select no K.O. target and does not draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02Koby001, playedOnTurn: 0 }],
        hand: [
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
          eb01Doma005,
        ],
        deck: [eb01Fourtricks025],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kobyId = engine.findCardInZone("south", "character", prb02Koby001);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const handBefore = engine.getView("south").players.south.handCount;

    engine.declareAttack(kobyId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: handBefore, deckCount: 1 });
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
