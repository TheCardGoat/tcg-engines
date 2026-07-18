import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op12RoronoaZoro020,
  op12RoronoaZoro036,
  op12Tashigi031,
  op13TrafalgarLaw031,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-036 Roronoa Zoro", () => {
  test("is excluded from effects that would play it from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13TrafalgarLaw031, op12RoronoaZoro036, eb01Doma005],
      activeDon: op13TrafalgarLaw031.cost,
    });
    const zoroId = engine.findCardInZone("south", "hand", op12RoronoaZoro036);
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13TrafalgarLaw031, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Law's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(zoroId);
  });

  test("with a Slash Leader gains power and cannot be K.O.'d in battle by Slash attackers", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        character: [{ card: op12RoronoaZoro036, rested: true }],
      },
      { character: [{ card: op12Tashigi031, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zoroId = engine.findCardInZone("south", "character", op12RoronoaZoro036);
    const attackerId = engine.findCardInZone("north", "character", op12Tashigi031);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === zoroId)
        ?.power,
    ).toBe(6000);
    engine.declareAttack(attackerId, zoroId, "north");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(zoroId);
  });

  test("can be K.O.'d in battle by a non-Slash attacker", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op12RoronoaZoro020,
        character: [{ card: op12RoronoaZoro036, rested: true }],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zoroId = engine.findCardInZone("south", "character", op12RoronoaZoro036);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, zoroId, "north");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      zoroId,
    );
  });
});
