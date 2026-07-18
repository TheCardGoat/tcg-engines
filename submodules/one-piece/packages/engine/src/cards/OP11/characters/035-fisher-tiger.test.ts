import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Hannyabal021,
  eb01MountainGod018,
  op11FisherTiger035,
  op11Ishilly025,
  op14eb04SilversRayleigh108,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-035 Fisher Tiger", () => {
  test("rests up to one opposing Character on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11FisherTiger035], activeDon: op11FisherTiger035.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const unselectedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op11FisherTiger035, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Fisher Tiger's rest target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === unselectedId)?.rested,
    ).toBe(false);
  });

  test("after an opponent-effect K.O., its controller rests DON!! and chooses a legal hand Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11FisherTiger035],
        hand: [op11Ishilly025, eb01Doma005],
        life: 3,
        activeDon: 1,
      },
      {
        leaderCardId: eb01Hannyabal021,
        hand: [op14eb04SilversRayleigh108],
        activeDon: op14eb04SilversRayleigh108.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fisherTigerId = engine.findCardInZone("south", "character", op11FisherTiger035);
    const legalId = engine.findCardInZone("south", "hand", op11Ishilly025);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04SilversRayleigh108, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [fisherTigerId] }, "north");
    const optional = engine.pendingDecision("effectOptional", "south");
    expect(optional.actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south");
    expect(play.actorId).toBe("south");
    const playStep = play.steps[0];
    if (playStep?.kind !== "selectEntity") throw new Error("Expected Fisher Tiger's hand choice.");
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([legalId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [legalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(fisherTigerId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(legalId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("a battle K.O. does not offer the opponent-effect recovery", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op11FisherTiger035, rested: true }],
        hand: [op11Ishilly025],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fisherTigerId = engine.findCardInZone("south", "character", op11FisherTiger035);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, fisherTigerId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(fisherTigerId);
    expect(view.players.south.hand.map((card) => card.cardId)).toContain(op11Ishilly025.id);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
