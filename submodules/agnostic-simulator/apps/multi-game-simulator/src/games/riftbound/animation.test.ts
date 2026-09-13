import { describe, expect, it } from "vitest";

import { riftboundActionToAnimationPlan } from "./animation";
import {
  createRiftboundClientMatchStateV1,
  reduceRiftboundClientMatchStateV1,
  type RiftboundClientMatchActionV1,
} from "./state";

function fixture() {
  return createRiftboundClientMatchStateV1(
    ["p1", "p2"],
    {
      cardInstances: { unit: "unit-card", deckCard: "deck-card" },
      owners: { p1: ["unit", "deckCard"], p2: [] },
    },
    {
      "unit-card": { name: "Real Unit", cardType: "Unit", domains: [] },
      "deck-card": { name: "Real Draw", cardType: "Unit", domains: [] },
    },
  );
}

function planFor(action: RiftboundClientMatchActionV1) {
  const fromState = fixture();
  const toState = reduceRiftboundClientMatchStateV1(fromState, action);
  return riftboundActionToAnimationPlan({
    fromState,
    toState,
    action,
    viewerId: "p1",
    transitionId: action.actionId,
  });
}

const base = { actorId: "p1", actionId: "action", at: 1 } as const;

describe("Riftbound animation adapter", () => {
  it("maps real manual-tabletop actions without state-diff inference", () => {
    expect(
      planFor({ ...base, type: "rotate", cardId: "unit", rotation: 90 })?.steps[0],
    ).toMatchObject({
      type: "entityStateChange",
      change: "orientation",
      fromRotationDeg: 0,
      toRotationDeg: 90,
    });
    expect(
      planFor({ ...base, type: "set_counter", cardId: "unit", counter: "might", value: 3 })
        ?.steps[0],
    ).toMatchObject({
      type: "valueDelta",
      subject: { kind: "entity", id: "unit" },
      delta: 3,
      label: "might",
    });
    expect(
      planFor({
        ...base,
        type: "shuffle",
        ownerId: "p1",
        zone: "deck",
        order: ["unit", "deckCard"],
      })?.steps[0],
    ).toMatchObject({
      type: "randomization",
      at: { kind: "zone", id: "p1:deck" },
      kind: "shuffle",
    });
    expect(
      planFor({ ...base, type: "end_game", winnerId: "p1", reason: "concession" })?.steps[0],
    ).toMatchObject({
      type: "gameResult",
      outcome: "winner",
      winner: { kind: "player", id: "p1" },
    });
  });

  it("projects draw faces safely for the viewer", () => {
    const action = { ...base, type: "draw", ownerId: "p1", count: 1 } as const;
    const fromState = fixture();
    const toState = reduceRiftboundClientMatchStateV1(fromState, action);

    expect(
      riftboundActionToAnimationPlan({
        fromState,
        toState,
        action,
        viewerId: "p1",
        transitionId: "owner-draw",
      })?.steps[0],
    ).toMatchObject({
      type: "entityTransfer",
      sourceFace: "hidden",
      destinationFace: "public",
    });
    expect(
      riftboundActionToAnimationPlan({
        fromState,
        toState,
        action,
        viewerId: "p2",
        transitionId: "opponent-draw",
      })?.steps[0],
    ).toMatchObject({
      type: "entityTransfer",
      sourceFace: "hidden",
      destinationFace: "hidden",
    });
  });
});
