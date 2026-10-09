import { describe, expect, test } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import type { PlayerId, PlayerPrompt } from "@tcg/cyberpunk-engine";

import { actionToInteractionSubmission } from "./actionToInteraction";

describe("actionToInteractionSubmission", () => {
  test("sends a pass for an optional MaxTac AV trigger", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTrigger",
        chooserId: "p1",
        payload: {
          canPass: true,
          options: [
            {
              triggerId: "maxtac-play",
              sourceCardId: "maxtac-1",
              sourcePlayerId: "p1",
              abilityIndex: 0,
              abilityText: "You may swap a friendly Gig with a rival Gig.",
              cardName: "MaxTac AV",
              optional: true,
            },
          ],
        },
      },
    };
    const view = buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 7, prompt });

    expect(
      actionToInteractionSubmission(
        { type: "resolveTrigger", pass: true, as: "p1" as PlayerId },
        view,
      ),
    ).toMatchObject({
      actionId: "resolveTrigger",
      values: { pass: true },
    });
  });

  test("serializes resolveScry with protocol input ids", () => {
    const view: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 7,
      status: "choosing",
      actions: [
        {
          id: "resolveScry",
          requestId: "cyberpunk:7:resolveScry",
          intent: "order-cards",
          text: { key: "cyberpunk.choice.scry" },
          enabled: true,
          inputs: [
            {
              kind: "option-selection",
              id: "destinationZone",
              text: { key: "cyberpunk.choice.scry.destination" },
              min: 0,
              max: 1,
              options: [{ id: "hand", text: { key: "hand" }, enabled: true }],
            },
            {
              kind: "entity-selection",
              id: "selectedCardIds",
              text: { key: "cyberpunk.choice.scry.selectedCards" },
              role: "source",
              entityKinds: ["card"],
              min: 0,
              max: 1,
              ordered: false,
              candidates: [
                {
                  entity: { kind: "card", instanceId: "card-1" },
                  enabled: true,
                },
              ],
            },
          ],
        },
      ],
    };

    expect(
      actionToInteractionSubmission(
        {
          type: "resolveScry",
          destinations: [{ zone: "hand", cardIds: ["card-1"] }],
        },
        view,
      ),
    ).toMatchObject({
      actionId: "resolveScry",
      values: {
        destinationZone: "hand",
        selectedCardIds: ["card-1"],
      },
    });
  });

  test("serializes activateAbility with the string abilityIndex option id", () => {
    const view: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 7,
      status: "choosing",
      actions: [
        {
          id: "activateAbility",
          requestId: "cyberpunk:7:activateAbility",
          intent: "choose-option",
          text: { key: "cyberpunk.move.activateAbility" },
          enabled: true,
          inputs: [
            {
              kind: "entity-selection",
              id: "cardId",
              text: { key: "cyberpunk.input.source" },
              role: "source",
              entityKinds: ["card"],
              min: 1,
              max: 1,
              ordered: false,
              candidates: [{ entity: { kind: "card", instanceId: "legend-1" }, enabled: true }],
            },
            {
              kind: "option-selection",
              id: "abilityIndex",
              text: { key: "cyberpunk.input.ability" },
              min: 1,
              max: 1,
              options: [{ id: "0", text: { key: "cyberpunk.ability.index" }, enabled: true }],
            },
          ],
        },
      ],
    };

    expect(
      actionToInteractionSubmission(
        { type: "activateAbility", cardId: "legend-1", abilityIndex: 0 },
        view,
      ),
    ).toMatchObject({
      actionId: "activateAbility",
      values: { cardId: "legend-1", abilityIndex: "0" },
    });
  });

  test("serializes declining an optional target prompt", () => {
    const view: EngineInteractionView = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 8,
      status: "choosing",
      actions: [
        {
          id: "resolveEffectTarget",
          requestId: "cyberpunk:8:resolveEffectTarget",
          intent: "choose-targets",
          text: { key: "cyberpunk.choice.effectTarget" },
          enabled: true,
          inputs: [
            {
              kind: "entity-selection",
              id: "targetIds",
              text: { key: "cyberpunk.input.targets" },
              role: "target",
              entityKinds: ["card"],
              required: false,
              min: 0,
              max: 1,
              ordered: false,
              candidates: [{ entity: { kind: "card", instanceId: "legend-1" }, enabled: true }],
            },
            {
              kind: "boolean",
              id: "pass",
              text: { key: "cyberpunk.input.pass" },
              required: false,
              trueText: { key: "cyberpunk.choice.pass" },
              falseText: { key: "cyberpunk.choice.continue" },
            },
          ],
        },
      ],
    };

    expect(
      actionToInteractionSubmission(
        { type: "resolveEffectTarget", pass: true, as: "p1" as PlayerId },
        view,
      ),
    ).toMatchObject({
      actionId: "resolveEffectTarget",
      values: { pass: true, targetIds: [] },
    });
  });
});
