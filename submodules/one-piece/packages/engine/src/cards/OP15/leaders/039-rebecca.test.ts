import { describe, expect, test } from "vite-plus/test";
import { op04Kyros082 } from "../../../../../cards/src/cards/characters/op04-082-kyros.ts";
import { op06Sai088 } from "../../../../../cards/src/cards/characters/op06-088-sai.ts";
import { op15Rebecca039 } from "../../../../../cards/src/cards/leaders/op15-039-rebecca.ts";

import { getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

describe("OP15-039 Rebecca", () => {
  test("cannot attack", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Rebecca039, activeDon: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    const failure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.leader("south"),
      targetId: engine.leader("north"),
    });
    expect(failure.reason).toBeTruthy();
  });

  test("rests this Leader, returns a Dressrosa Character, and plays a cost-3 Dressrosa from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Rebecca039,
        character: [op04Kyros082],
        hand: [op06Sai088],
        activeDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kyrosId = engine.findCardInZone("south", "character", op04Kyros082);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Rebecca's play choice.");
    const playCandidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(playCandidates).toContain(kyrosId);
    expect(playCandidates).toHaveLength(2);
    const playedId = playCandidates.find((candidateId) => candidateId !== kyrosId)!;
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader?.rested).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(kyrosId);
    expect(
      view.players.south.characters.some(
        (card) => card?.instanceId === playedId && card.rested === false,
      ),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("cannot activate without a Dressrosa Character to return", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Rebecca039, hand: [op06Sai088], activeDon: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    const legal = getLegalCommands(engine.getState(), "south").some(
      (command) => command.type === "activateEffect" && command.sourceId === engine.leader("south"),
    );
    expect(legal).toBe(false);
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-039", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-039"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
