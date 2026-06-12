import { describe, expect, it } from "vite-plus/test";
import { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import type { PlayerPrompt } from "@tcg/cyberpunk-engine";
import {
  buildCyberpunkInteractionView,
  cyberpunkSubmissionToPayload,
} from "./interaction-protocol";

describe("Cyberpunk interaction protocol adapter", () => {
  it("projects native available moves into protocol actions", () => {
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        { moveId: "passPhase", inputSpec: { type: "none" } },
        {
          moveId: "attackUnit",
          inputSpec: { type: "selectPair", fromCandidates: ["a1"], toCandidates: ["d1"] },
        },
      ],
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 4, prompt }),
    );

    expect(parsed.status).toBe("ready");
    expect(parsed.actions.map((action) => action.id)).toEqual(["passPhase", "attackUnit"]);
    expect(parsed.actions[1]?.inputs).toMatchObject([
      { kind: "entity-selection", id: "attackerId", role: "from" },
      { kind: "entity-selection", id: "defenderId", role: "to" },
    ]);
  });

  it("projects a gain-gig choice as a die selection", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: { type: "gainGig", chooserId: "p1", payload: { allowedDieIds: ["d6"] } },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 7, prompt }),
    );

    expect(parsed.status).toBe("choosing");
    expect(parsed.actions[0]).toMatchObject({ id: "gainGig", intent: "custom" });
    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      id: "dieId",
      entityKinds: ["die"],
    });
  });

  it("projects effect target choices with source card metadata", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "effectTarget",
          targetKind: "card",
          min: 1,
          max: 2,
          eligibleIds: ["target_1", "target_2"],
          source: {
            cardId: "source_1",
            definitionId: "program_1",
            displayName: "Program",
            cardType: "program",
          },
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 10, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({
      id: "resolveEffectTarget",
      source: { kind: "card", instanceId: "source_1" },
    });
    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      id: "targetIds",
      min: 1,
      max: 2,
      candidates: [
        { entity: { kind: "card", instanceId: "target_1" } },
        { entity: { kind: "card", instanceId: "target_2" } },
      ],
    });
  });

  it("projects playable gear attach targets into protocol inputs", () => {
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        {
          moveId: "playCard",
          inputSpec: {
            type: "playCard",
            candidates: [
              { cardId: "gear_without_target", attachTargets: [] },
              { cardId: "gear_with_target", attachTargets: ["unit_1"] },
              { cardId: "program_without_target" },
            ],
          },
        },
      ],
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 8, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({ id: "playCard", enabled: true });
    expect(parsed.actions[0]?.inputs).toMatchObject([
      {
        kind: "entity-selection",
        id: "cardId",
        candidates: [
          { entity: { instanceId: "gear_with_target" } },
          { entity: { instanceId: "program_without_target" } },
        ],
      },
      {
        kind: "entity-selection",
        id: "attachToId",
        role: "target",
        candidates: [{ entity: { instanceId: "unit_1" } }],
      },
    ]);
  });

  it("marks play-card unavailable when every gear candidate has no attach target", () => {
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        {
          moveId: "playCard",
          inputSpec: {
            type: "playCard",
            candidates: [{ cardId: "gear_without_target", attachTargets: [] }],
          },
        },
      ],
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 9, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({ id: "playCard", enabled: false });
    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      id: "cardId",
      candidates: [],
    });
  });

  it("preserves activate-ability card pairings in option metadata", () => {
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        {
          moveId: "activateAbility",
          inputSpec: {
            type: "selectAbility",
            candidates: [
              { cardId: "card_a", abilityIndex: 1 },
              { cardId: "card_b", abilityIndex: 0 },
            ],
          },
        },
      ],
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 11, prompt }),
    );

    expect(parsed.actions[0]?.inputs[1]).toMatchObject({
      kind: "option-selection",
      id: "abilityIndex",
      options: [
        { id: "1", text: { params: { cardId: "card_a", index: 1 } } },
        { id: "0", text: { params: { cardId: "card_b", index: 0 } } },
      ],
    });
  });

  it("translates protocol submissions back to native command args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 1,
      stateVersion: 3,
      requestId: "cyberpunk:3:attackUnit",
      actionId: "attackUnit",
      values: { attackerId: "a1", defenderId: "d1" },
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "attackUnit",
      payload: { attackerId: "a1", defenderId: "d1" },
    });
  });

  it("translates resolveAttack pass submissions back to native command args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 1,
      stateVersion: 3,
      requestId: "cyberpunk:3:resolveAttack",
      actionId: "resolveAttack",
      values: { pass: true },
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveAttack",
      payload: { pass: true },
    });
  });

  it("defaults missing resolveAttack pass submissions to false", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 1,
      stateVersion: 3,
      requestId: "cyberpunk:3:resolveAttack",
      actionId: "resolveAttack",
      values: {},
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveAttack",
      payload: { pass: false },
    });
  });
});
