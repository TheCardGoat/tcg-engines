import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op11LetSCrashThisWedding060,
  op11MonkeyDLuffy040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function resolveWeddingSearch(engine: OnePieceTestEngine, seat: "north" | "south") {
  const selectedId = engine.findCardInZone(seat, "deck", eb01TonyTonyChopper006);
  const excludedId = engine.findCardInZone(seat, "deck", op11LetSCrashThisWedding060);
  const revealedIds = engine.getState().players[seat].deck.slice(0, 5);
  const decision = engine.pendingDecision("effectSearchSelection", seat);
  const step = decision.steps[0];
  expect(step?.kind).toBe("selectEntity");
  if (step?.kind !== "selectEntity") throw new Error("Expected a Straw Hat Crew search.");
  expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
  expect(step.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(false);
  engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, seat);
  engine.resolveDecision(
    "effectSearchRemainderOrder",
    { selectedIds: revealedIds.filter((id) => id !== selectedId).reverse() },
    seat,
  );
  return selectedId;
}

describe("OP11-060 Let's Crash This Wedding!!!", () => {
  test("Main with a multicolored Leader finds an included Straw Hat Crew type but not itself", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11MonkeyDLuffy040,
      hand: [op11LetSCrashThisWedding060],
      deck: [
        eb01TonyTonyChopper006,
        op11LetSCrashThisWedding060,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 1,
    });

    engine.playCard(op11LetSCrashThisWedding060);
    const selectedId = resolveWeddingSearch(engine, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates the same Main search without paying its Event cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op11MonkeyDLuffy040,
        life: [op11LetSCrashThisWedding060],
        deck: [
          eb01TonyTonyChopper006,
          op11LetSCrashThisWedding060,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
        ],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const selectedId = resolveWeddingSearch(engine, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
