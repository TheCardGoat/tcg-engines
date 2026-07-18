import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op10Issho023,
  op11IMGonnaBeANavyOfficer099,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function resolveNavySearch(engine: OnePieceTestEngine, seat: "north" | "south") {
  const selectedId = engine.findCardInZone(seat, "deck", op10Issho023);
  const excludedId = engine.findCardInZone(seat, "deck", op11IMGonnaBeANavyOfficer099);
  const decision = engine.pendingDecision("effectSearchSelection", seat);
  const step = decision.steps[0];
  expect(step?.kind).toBe("selectEntity");
  if (step?.kind !== "selectEntity") throw new Error("Expected a Navy search choice.");
  expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
  expect(step.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(false);
  engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, seat);
  return selectedId;
}

describe("OP11-099 I'm Gonna Be a Navy Officer!!!", () => {
  test("Main finds an included Navy type, excludes itself, and trashes the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11IMGonnaBeANavyOfficer099],
      deck: [op10Issho023, op11IMGonnaBeANavyOfficer099, eb01Doma005],
      activeDon: 1,
    });
    const remainderIds = engine
      .getState()
      .players.south.deck.slice(0, 3)
      .filter((id) => engine.getState().cards[id]?.cardId !== op10Issho023.id);

    engine.playCard(op11IMGonnaBeANavyOfficer099);
    const selectedId = resolveNavySearch(engine, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(remainderIds),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates the same Main search without paying the Event cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op11IMGonnaBeANavyOfficer099],
        deck: [
          op10Issho023,
          op11IMGonnaBeANavyOfficer099,
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
    const selectedId = resolveNavySearch(engine, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
