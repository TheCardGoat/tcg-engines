import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Koala042,
  op01NicoRobin017,
  op05BeloBetty002,
  op05Sabo007,
  op13MonkeyDLuffy001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-042 Koala", () => {
  test("gains +4 cost only with a Revolutionary Army Leader", () => {
    const matching = OnePieceTestEngine.create({
      leaderCardId: op05BeloBetty002,
      character: [eb03Koala042],
    });
    const matchingId = matching.findCardInZone("south", "character", eb03Koala042);
    expect(
      matching
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === matchingId)?.cost,
    ).toBe(8);

    const nonmatching = OnePieceTestEngine.create({
      leaderCardId: op13MonkeyDLuffy001,
      character: [eb03Koala042],
    });
    const nonmatchingId = nonmatching.findCardInZone("south", "character", eb03Koala042);
    expect(
      nonmatching
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === nonmatchingId)?.cost,
    ).toBe(4);
  });

  test("plays a Revolutionary Army Character other than Koala or a Nico Robin after opponent-turn K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb03Koala042, rested: true }],
        hand: [op05Sabo007, eb03Koala042],
        trash: [op01NicoRobin017, eb01Doma005],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koalaId = engine.findCardInZone("south", "character", eb03Koala042);
    const saboId = engine.findCardInZone("south", "hand", op05Sabo007);
    const excludedKoalaId = engine.findCardInZone("south", "hand", eb03Koala042);
    const robinId = engine.findCardInZone("south", "trash", op01NicoRobin017);
    const unrelatedId = engine.findCardInZone("south", "trash", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, koalaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Koala's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([saboId, robinId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedKoalaId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [robinId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(robinId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(koalaId);
    expect(view.prompts).toHaveLength(0);
  });
});
