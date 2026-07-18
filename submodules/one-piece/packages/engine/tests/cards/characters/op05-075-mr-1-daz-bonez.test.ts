import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Mr1DazBonez063,
  op04MissMerrychristmasDrophy067,
  op05Mr1DazBonez075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-075 Mr.1 (Daz.Bonez)", () => {
  test("on an opponent's attack returns DON!! to play an included Baroque Works Character once", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Mr1DazBonez063, op04MissMerrychristmasDrophy067, eb01Doma005],
        character: [op05Mr1DazBonez075],
        activeDon: 2,
        life: 2,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = engine
      .getView("north")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));
    const eligibleId = engine.findCardInZone("south", "hand", op02Mr1DazBonez063);
    const highCostId = engine.findCardInZone("south", "hand", op04MissMerrychristmasDrophy067);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.declareAttack(attackers[0]!, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Daz Bonez's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    engine.declareAttack(attackers[1]!, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    expect(engine.getView("south").players.south.activeDon).toBe(1);
  });

  test("may decline without returning DON!! or playing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Mr1DazBonez063],
        character: [op05Mr1DazBonez075],
        activeDon: 2,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handId = engine.findCardInZone("south", "hand", op02Mr1DazBonez063);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.south.characters.some((card) => card?.instanceId === handId)).toBe(false);
  });
});
