import { describe, expect, it } from "vitest";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";

import { mapDropToAction, type DropContext } from "./dropMapping";

function buildContext(
  attachTargets: string[],
  source: { cardId: string; cardType: "gear" | "unit" | "legend" | "program" } = {
    cardId: "gear_1",
    cardType: "gear",
  },
): DropContext {
  return {
    humanSide: "player",
    humanZones: {
      hand: [source],
    },
    interactionView: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 1,
      status: "ready",
      actions: [
        {
          id: "playCard",
          requestId: "playCard-1",
          intent: "play-card",
          text: { key: "cyberpunk.move.playCard" },
          enabled: true,
          inputs: [
            {
              id: "cardId",
              kind: "entity-selection",
              role: "source",
              entityKinds: ["card"],
              text: { key: "cyberpunk.move.playCard.card" },
              min: 1,
              max: 1,
              ordered: false,
              candidates: [
                {
                  entity: { kind: "card", instanceId: source.cardId, ownerId: "p1" },
                  enabled: true,
                },
              ],
            },
            {
              id: "attachToId",
              kind: "entity-selection",
              role: "target",
              entityKinds: ["card"],
              text: { key: "cyberpunk.move.playCard.attachTo" },
              min: 0,
              max: 1,
              ordered: false,
              candidates: attachTargets.map((instanceId) => ({
                entity: { kind: "card", instanceId, ownerId: "p1" },
                enabled: true,
              })),
            },
          ],
        },
      ],
    } satisfies EngineInteractionView,
  };
}

function buildAttackContext(attackerEnabled = true): DropContext {
  return {
    humanSide: "player",
    humanZones: { hand: [] },
    interactionView: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 1,
      status: "ready",
      actions: [
        {
          id: "attackRival",
          requestId: "attackRival-1",
          intent: "attack",
          text: { key: "cyberpunk.move.attackRival" },
          enabled: true,
          inputs: [
            {
              id: "attackerId",
              kind: "entity-selection",
              role: "attacker",
              entityKinds: ["card"],
              text: { key: "cyberpunk.move.attackRival.attacker" },
              min: 1,
              max: 1,
              ordered: false,
              candidates: [
                {
                  entity: { kind: "card", instanceId: "unit_1", ownerId: "p1" },
                  enabled: attackerEnabled,
                },
              ],
            },
          ],
        },
      ],
    } satisfies EngineInteractionView,
  };
}

function buildGoSoloContext(legendEnabled = true): DropContext {
  return {
    humanSide: "player",
    humanZones: { hand: [] },
    interactionView: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 1,
      status: "ready",
      actions: [
        {
          id: "goSolo",
          requestId: "goSolo-1",
          intent: "play-card",
          text: { key: "cyberpunk.move.goSolo" },
          enabled: true,
          inputs: [
            {
              id: "cardId",
              kind: "entity-selection",
              role: "source",
              entityKinds: ["card"],
              text: { key: "cyberpunk.move.goSolo.card" },
              min: 1,
              max: 1,
              ordered: false,
              candidates: [
                {
                  entity: { kind: "card", instanceId: "legend_1", ownerId: "p1" },
                  enabled: legendEnabled,
                },
              ],
            },
          ],
        },
      ],
    } satisfies EngineInteractionView,
  };
}

describe("mapDropToAction", () => {
  it("maps a payable GO SOLO Legend from the legend area onto the field", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-legendArea", index: 0, cardId: "legend_1" },
        target: { type: "zone", zone: "p-field" },
      },
      buildGoSoloContext(),
    );

    expect(action).toEqual({ type: "goSolo", cardId: "legend_1", as: "p1" });
  });

  it("rejects a GO SOLO drop when the Legend is not a legal payment candidate", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-legendArea", index: 0, cardId: "legend_1" },
        target: { type: "zone", zone: "p-field" },
      },
      buildGoSoloContext(false),
    );

    expect(action).toBeNull();
  });

  it("maps Gear from hand onto a legal friendly field host", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "gear_1", cardType: "gear" },
        target: { type: "card", zone: "p-field", index: 0, cardId: "unit_1" },
      },
      buildContext(["unit_1"]),
    );

    expect(action).toEqual({ type: "playCard", cardId: "gear_1", attachToId: "unit_1", as: "p1" });
  });

  it("plays a Program dropped on a rival card without submitting its later effect target", () => {
    const action = mapDropToAction(
      {
        source: {
          type: "card",
          zone: "p-hand",
          index: 0,
          cardId: "program_1",
          cardType: "program",
        },
        target: { type: "card", zone: "opp-field", index: 0, cardId: "rival_1" },
      },
      buildContext([], { cardId: "program_1", cardType: "program" }),
    );

    expect(action).toEqual({ type: "playCard", cardId: "program_1", as: "p1" });
  });

  it("maps Gear from hand onto a legal friendly legend-area host", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "gear_1", cardType: "gear" },
        target: { type: "card", zone: "p-legendArea", index: 0, cardId: "legend_1" },
      },
      buildContext(["legend_1"]),
    );

    expect(action).toEqual({
      type: "playCard",
      cardId: "gear_1",
      attachToId: "legend_1",
      as: "p1",
    });
  });

  it("rejects Gear drops onto a legend-area card that is not an attach target", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "gear_1", cardType: "gear" },
        target: { type: "card", zone: "p-legendArea", index: 0, cardId: "face_down_legend" },
      },
      buildContext(["legend_1"]),
    );

    expect(action).toBeNull();
  });

  it("does not treat a non-Gear hand card dropped onto a legend-area card as a play", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "unit_1", cardType: "unit" },
        target: { type: "card", zone: "p-legendArea", index: 0, cardId: "legend_1" },
      },
      buildContext([], { cardId: "unit_1", cardType: "unit" }),
    );

    expect(action).toBeNull();
  });

  it.each(["opp-pinfo", "opp-gigArea"])(
    "maps a legal field Unit dropped on %s to a rival attack",
    (zone) => {
      const action = mapDropToAction(
        {
          source: { type: "card", zone: "p-field", index: 0, cardId: "unit_1" },
          target: { type: "zone", zone },
        },
        buildAttackContext(),
      );

      expect(action).toEqual({ type: "attackRival", attackerId: "unit_1", as: "p1" });
    },
  );

  it("rejects an ineligible Unit dropped on the rival Gig area", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-field", index: 0, cardId: "unit_1" },
        target: { type: "zone", zone: "opp-gigArea" },
      },
      buildAttackContext(false),
    );

    expect(action).toBeNull();
  });
});
