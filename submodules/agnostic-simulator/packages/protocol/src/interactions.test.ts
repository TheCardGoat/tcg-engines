import { describe, expect, test } from "vite-plus/test";
import {
  EngineInteractionView,
  EntitySelectionInput,
  INTERACTION_PROTOCOL_VERSION,
  InteractionSubmission,
  NumberInput,
  OptionSelectionInput,
  OrderingInput,
  actionsForEntity,
  buildInteractionSubmission,
  buildInteractionSubmissionForActionId,
  entityCandidatesForAction,
  validateInteractionSubmission,
  type EngineInteractionView as EngineInteractionViewType,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmissionValidationIssueCode,
} from "./interactions";

const actorId = "player_one";

describe("engine interaction protocol", () => {
  test("represents a Lorcana-style play card action with instance-id candidates", () => {
    const view = buildView([
      fromLorcanaAvailableMove({
        moveId: "playCard",
        selectableCardIds: ["card_1", "card_2"],
      }),
    ]);

    const parsed = EngineInteractionView.parse(view);

    expect(parsed.actions[0]?.intent).toBe("play-card");
    expect(parsed.actions[0]?.text).toEqual({ key: "lorcana.move.playCard" });
    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      id: "cardId",
      min: 1,
      max: 1,
      candidates: [
        { entity: { kind: "card", instanceId: "card_1" }, enabled: true },
        { entity: { kind: "card", instanceId: "card_2" }, enabled: true },
      ],
    });
  });

  test("represents Lorcana-style single and multi target prompts", () => {
    const singleTarget = fromLorcanaTargetPrompt({
      requestId: "target_1",
      sourceCardId: "source_1",
      cardCandidateIds: ["target_1"],
      minSelections: 1,
      maxSelections: 1,
      ordered: false,
    });
    const multiTarget = fromLorcanaTargetPrompt({
      requestId: "target_2",
      sourceCardId: "source_2",
      cardCandidateIds: ["target_2", "target_3"],
      minSelections: 1,
      maxSelections: 2,
      ordered: true,
    });

    const parsed = EngineInteractionView.parse(buildView([singleTarget, multiTarget]));

    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      min: 1,
      max: 1,
      ordered: false,
    });
    expect(parsed.actions[1]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      min: 1,
      max: 2,
      ordered: true,
    });
  });

  test("represents Lorcana-style slotted location plus character targeting", () => {
    const parsed = EngineInteractionView.parse(
      buildView([
        fromLorcanaSlottedTargetPrompt({
          requestId: "slot_1",
          sourceCardId: "source_1",
          slots: [
            { id: "location", role: "location", candidateIds: ["location_1"] },
            { id: "character", role: "target", candidateIds: ["character_1", "character_2"] },
          ],
        }),
      ]),
    );

    expect(parsed.actions[0]?.inputs).toMatchObject([
      { kind: "entity-selection", id: "location", role: "location" },
      { kind: "entity-selection", id: "character", role: "target" },
    ]);
  });

  test("represents Lorcana-style optional, choice, and ordering prompts", () => {
    const parsed = EngineInteractionView.parse(
      buildView([
        fromLorcanaOptionalPrompt("optional_1"),
        fromLorcanaChoicePrompt("choice_1", ["mode_0", "mode_1"]),
        fromLorcanaOrderingPrompt("ordering_1", ["card_1", "card_2"]),
      ]),
    );

    expect(
      parsed.actions.map(
        (action: import("./interactions").InteractionAction) => action.inputs[0]?.kind,
      ),
    ).toEqual(["boolean", "option-selection", "ordering"]);
  });

  test("rejects literal label fields so display copy must use translation keys", () => {
    const withLabel = {
      ...buildView([
        {
          ...fromLorcanaOptionalPrompt("optional_1"),
          label: "Accept?",
        } as unknown as import("./interactions").InteractionAction,
      ]),
    };

    expect(() => EngineInteractionView.parse(withLabel)).toThrow();
  });

  test("rejects unknown game slugs", () => {
    expect(() =>
      EngineInteractionView.parse({ ...buildView([]), gameSlug: "not-a-game" }),
    ).toThrow();
  });

  test("rejects impossible selection bounds", () => {
    const input = {
      kind: "entity-selection",
      id: "targets",
      role: "target",
      text: { key: "lorcana.prompt.chooseTargets.targets" },
      entityKinds: ["card"],
      min: 2,
      max: 1,
      ordered: false,
      candidates: [
        { entity: { kind: "card", instanceId: "target_1" }, enabled: true },
        { entity: { kind: "card", instanceId: "target_2" }, enabled: true },
      ],
    };

    expect(() => EntitySelectionInput.parse(input)).toThrow();
    expect(() =>
      OptionSelectionInput.parse({ ...baseOptionSelectionInput(), min: 2, max: 1 }),
    ).toThrow();
    expect(() => OrderingInput.parse({ ...baseOrderingInput(), min: 2, max: 1 })).toThrow();
    expect(() => NumberInput.parse({ ...baseNumberInput(), min: 5, max: 3 })).toThrow();
  });

  test("rejects selection bounds that exceed enabled candidates", () => {
    expect(() =>
      EntitySelectionInput.parse({
        ...baseEntitySelectionInput(),
        min: 2,
        max: 2,
        candidates: [
          { entity: { kind: "card", instanceId: "target_1" }, enabled: true },
          {
            entity: { kind: "card", instanceId: "target_2" },
            enabled: false,
            disabledText: { key: "lorcana.prompt.target.disabled" },
          },
        ],
      }),
    ).toThrow();
    expect(() =>
      OptionSelectionInput.parse({
        ...baseOptionSelectionInput(),
        min: 2,
        max: 2,
        options: [
          { id: "mode_0", text: { key: "lorcana.prompt.choice.mode_0" }, enabled: true },
          {
            id: "mode_1",
            text: { key: "lorcana.prompt.choice.mode_1" },
            enabled: false,
            disabledText: { key: "lorcana.prompt.choice.disabled" },
          },
        ],
      }),
    ).toThrow();
    expect(() =>
      OrderingInput.parse({
        ...baseOrderingInput(),
        min: 2,
        max: 2,
        candidates: [
          { entity: { kind: "card", instanceId: "card_1" }, enabled: true },
          {
            entity: { kind: "card", instanceId: "card_2" },
            enabled: false,
            disabledText: { key: "lorcana.prompt.orderCards.disabled" },
          },
        ],
      }),
    ).toThrow();
  });

  test("finds protocol actions for a card without native prompt details", () => {
    const playCard = fromLorcanaAvailableMove({
      moveId: "playCard",
      selectableCardIds: ["card_1", "card_2"],
    });
    const targetPrompt = fromLorcanaTargetPrompt({
      requestId: "target_1",
      sourceCardId: "source_1",
      cardCandidateIds: ["card_2", "card_3"],
      minSelections: 1,
      maxSelections: 1,
      ordered: false,
    });
    const view = EngineInteractionView.parse(buildView([playCard, targetPrompt]));

    expect(
      actionsForEntity(view, { kind: "card", instanceId: "card_2" }).map(
        (a: import("./interactions").InteractionAction) => a.id,
      ),
    ).toEqual(["move:playCard", "target_1:choose-targets"]);
    expect(
      entityCandidatesForAction(targetPrompt, { role: "target", entityKind: "card" }).map(
        (candidate: import("./interactions").EntityCandidate) => candidate.entity.instanceId,
      ),
    ).toEqual(["card_2", "card_3"]);
  });

  test("builds a protocol submission from a projected action", () => {
    const view = EngineInteractionView.parse(
      buildView([
        fromLorcanaAvailableMove({
          moveId: "playCard",
          selectableCardIds: ["card_1"],
        }),
      ]),
    );
    const action = view.actions[0]!;

    expect(
      buildInteractionSubmission({
        view,
        action,
        values: { cardId: "card_1" },
        correlationId: "corr_1",
      }),
    ).toEqual({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values: { cardId: "card_1" },
      correlationId: "corr_1",
    });
  });

  test("builds a protocol submission by action id", () => {
    const view = EngineInteractionView.parse(
      buildView([
        fromLorcanaAvailableMove({
          moveId: "passTurn",
          selectableCardIds: [],
        }),
      ]),
    );

    expect(
      buildInteractionSubmissionForActionId({
        view,
        actionId: "move:passTurn",
      }),
    ).toMatchObject({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      actionId: "move:passTurn",
    });
    expect(
      buildInteractionSubmissionForActionId({
        view,
        actionId: "missing",
      }),
    ).toBeNull();
  });

  test("round-trips a UI submission without Lorcana-native payload knowledge", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 7,
      requestId: "target_1",
      actionId: "target_1:choose-targets",
      values: {
        targets: ["target_1", "target_2"],
      },
      correlationId: "correlation_1",
    });

    expect(submission.values).toEqual({ targets: ["target_1", "target_2"] });
  });

  test("validates a correct submission against the current action inputs", () => {
    const view = EngineInteractionView.parse(
      buildView([
        fromLorcanaSlottedTargetPrompt({
          requestId: "slot_1",
          sourceCardId: "source_1",
          slots: [
            { id: "location", role: "location", candidateIds: ["location_1"] },
            { id: "character", role: "target", candidateIds: ["character_1"] },
          ],
        }),
      ]),
    );
    const action = view.actions[0]!;
    const submission = buildInteractionSubmission({
      view,
      action,
      values: {
        location: "location_1",
        character: "character_1",
      },
    });

    expect(validateInteractionSubmission(view, submission)).toMatchObject({
      ok: true,
      action,
    });
  });

  test("rejects stale state versions, stale request ids, disabled actions, and unknown actions", () => {
    const view = EngineInteractionView.parse(
      buildView([
        {
          ...fromLorcanaAvailableMove({ moveId: "passTurn", selectableCardIds: [] }),
          enabled: false,
        },
      ]),
    );

    expectInvalidCodes(
      view,
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: 6,
        requestId: "move:passTurn",
        actionId: "move:passTurn",
        values: {},
      },
      ["stale_state", "action_disabled"],
    );
    expectInvalidCodes(
      view,
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: 7,
        requestId: "old_request",
        actionId: "move:passTurn",
        values: {},
      },
      ["stale_request", "action_disabled"],
    );
    expectInvalidCodes(
      view,
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: 7,
        requestId: "missing",
        actionId: "missing",
        values: {},
      },
      ["action_unavailable"],
    );
  });

  test("rejects unknown value keys and missing required values", () => {
    const view = EngineInteractionView.parse(
      buildView([
        fromLorcanaAvailableMove({
          moveId: "playCard",
          selectableCardIds: ["card_1"],
        }),
      ]),
    );
    const action = view.actions[0]!;

    expectInvalidCodes(
      view,
      buildInteractionSubmission({
        view,
        action,
        values: { extra: "card_1" },
      }),
      ["unknown_value", "missing_value"],
    );
  });

  test("rejects invalid entity selections", () => {
    const view = EngineInteractionView.parse(
      buildView([
        fromLorcanaTargetPrompt({
          requestId: "target_1",
          sourceCardId: "source_1",
          cardCandidateIds: ["target_1", "target_2"],
          minSelections: 1,
          maxSelections: 2,
          ordered: false,
        }),
      ]),
    );
    const action = view.actions[0]!;
    const withDisabledCandidate = EngineInteractionView.parse({
      ...view,
      actions: [
        {
          ...action,
          inputs: [
            {
              ...(action.inputs[0] as Extract<InteractionInput, { kind: "entity-selection" }>),
              max: 1,
              candidates: [
                { entity: { kind: "card", instanceId: "target_1" }, enabled: true },
                { entity: { kind: "card", instanceId: "target_2" }, enabled: false },
              ],
            },
          ],
        },
      ],
    });
    const disabledAction = withDisabledCandidate.actions[0]!;

    expectInvalidCodes(
      view,
      buildInteractionSubmission({
        view,
        action,
        values: { targets: 1 },
      }),
      ["invalid_value_type"],
    );
    expectInvalidCodes(
      view,
      buildInteractionSubmission({
        view,
        action,
        values: { targets: [] },
      }),
      ["selection_count_out_of_bounds"],
    );
    expectInvalidCodes(
      view,
      buildInteractionSubmission({
        view,
        action,
        values: { targets: ["target_1", "target_1"] },
      }),
      ["duplicate_selection"],
    );
    expectInvalidCodes(
      withDisabledCandidate,
      buildInteractionSubmission({
        view: withDisabledCandidate,
        action: disabledAction,
        values: { targets: ["target_2"] },
      }),
      ["candidate_unavailable"],
    );
  });

  test("rejects invalid option, boolean, number, and ordering values", () => {
    const view = EngineInteractionView.parse(
      buildView([
        {
          id: "mixed",
          requestId: "mixed",
          intent: "choose-option",
          text: { key: "test.mixed" },
          enabled: true,
          inputs: [
            {
              ...baseOptionSelectionInput(),
              options: [
                { id: "mode_0", text: { key: "mode.0" }, enabled: true },
                { id: "mode_1", text: { key: "mode.1" }, enabled: false },
              ],
            },
            { ...baseNumberInput(), step: 1 },
            {
              kind: "boolean",
              id: "confirm",
              text: { key: "test.confirm" },
              trueText: { key: "test.confirm.yes" },
              falseText: { key: "test.confirm.no" },
            },
            {
              ...baseOrderingInput(),
              min: 2,
              max: 2,
              candidates: [
                { entity: { kind: "card", instanceId: "card_1" }, enabled: true },
                { entity: { kind: "card", instanceId: "card_2" }, enabled: true },
              ],
            },
          ],
        },
      ]),
    );
    const action = view.actions[0]!;

    expectInvalidCodes(
      view,
      buildInteractionSubmission({
        view,
        action,
        values: {
          choiceIndex: "mode_1",
          amount: 4,
          confirm: "yes",
          orderedCards: ["card_1", "card_1"],
        },
      }),
      ["option_unavailable", "number_out_of_bounds", "invalid_value_type", "duplicate_selection"],
    );
    expectInvalidCodes(
      view,
      buildInteractionSubmission({
        view,
        action,
        values: {
          choiceIndex: "mode_0",
          amount: 2,
          confirm: true,
          orderedCards: "card_1",
        },
      }),
      ["invalid_value_type"],
    );
    expectInvalidCodes(
      view,
      buildInteractionSubmission({
        view,
        action,
        values: {
          choiceIndex: "mode_0",
          amount: 1.5,
          confirm: true,
          orderedCards: ["card_1", "card_2"],
        },
      }),
      ["number_step_mismatch"],
    );
  });
});

type LorcanaAvailableMove = {
  moveId: "playCard" | "putCardIntoInkwell" | "passTurn" | "concede";
  selectableCardIds: string[];
};

type LorcanaTargetPrompt = {
  requestId: string;
  sourceCardId: string;
  cardCandidateIds: string[];
  minSelections: number;
  maxSelections: number;
  ordered: boolean;
};

type LorcanaSlottedTargetPrompt = {
  requestId: string;
  sourceCardId: string;
  slots: {
    id: string;
    role: Extract<EntitySelectionRoleForTest, "location" | "target">;
    candidateIds: string[];
  }[];
};

type EntitySelectionRoleForTest = Extract<InteractionInput, { kind: "entity-selection" }>["role"];

function buildView(actions: InteractionAction[]): EngineInteractionViewType {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "lorcana",
    actorId,
    stateVersion: 7,
    status: actions.length > 0 ? "ready" : "idle",
    actions,
  };
}

function baseEntitySelectionInput(): Extract<InteractionInput, { kind: "entity-selection" }> {
  return {
    kind: "entity-selection",
    id: "targets",
    role: "target",
    text: { key: "lorcana.prompt.chooseTargets.targets" },
    entityKinds: ["card"],
    min: 1,
    max: 1,
    ordered: false,
    candidates: [{ entity: { kind: "card", instanceId: "target_1" }, enabled: true }],
  };
}

function baseOptionSelectionInput(): Extract<InteractionInput, { kind: "option-selection" }> {
  return {
    kind: "option-selection",
    id: "choiceIndex",
    text: { key: "lorcana.prompt.choice.option" },
    min: 1,
    max: 1,
    options: [{ id: "mode_0", text: { key: "lorcana.prompt.choice.mode_0" }, enabled: true }],
  };
}

function baseNumberInput(): Extract<InteractionInput, { kind: "number" }> {
  return {
    kind: "number",
    id: "amount",
    text: { key: "lorcana.prompt.amount" },
    min: 1,
    max: 3,
  };
}

function baseOrderingInput(): Extract<InteractionInput, { kind: "ordering" }> {
  return {
    kind: "ordering",
    id: "orderedCards",
    text: { key: "lorcana.prompt.orderCards.cards" },
    entityKind: "card",
    min: 1,
    max: 1,
    candidates: [{ entity: { kind: "card", instanceId: "card_1" }, enabled: true }],
  };
}

function fromLorcanaAvailableMove(move: LorcanaAvailableMove): InteractionAction {
  const intentByMove = {
    playCard: "play-card",
    putCardIntoInkwell: "resource-card",
    passTurn: "pass",
    concede: "concede",
  } as const satisfies Record<LorcanaAvailableMove["moveId"], InteractionAction["intent"]>;

  return {
    id: `move:${move.moveId}`,
    requestId: `move:${move.moveId}`,
    intent: intentByMove[move.moveId],
    text: { key: `lorcana.move.${move.moveId}` },
    enabled: true,
    inputs:
      move.selectableCardIds.length === 0
        ? []
        : [
            {
              kind: "entity-selection",
              id: "cardId",
              role: "source",
              text: { key: `lorcana.move.${move.moveId}.selectCard` },
              entityKinds: ["card"],
              min: 1,
              max: 1,
              ordered: false,
              candidates: move.selectableCardIds.map((instanceId) => ({
                entity: { kind: "card", instanceId },
                enabled: true,
              })),
            },
          ],
  };
}

function fromLorcanaTargetPrompt(prompt: LorcanaTargetPrompt): InteractionAction {
  return {
    id: `${prompt.requestId}:choose-targets`,
    requestId: prompt.requestId,
    intent: "choose-targets",
    text: { key: "lorcana.prompt.chooseTargets" },
    enabled: true,
    source: { kind: "card", instanceId: prompt.sourceCardId },
    inputs: [
      {
        kind: "entity-selection",
        id: "targets",
        role: "target",
        text: { key: "lorcana.prompt.chooseTargets.targets" },
        entityKinds: ["card"],
        min: prompt.minSelections,
        max: prompt.maxSelections,
        ordered: prompt.ordered,
        candidates: prompt.cardCandidateIds.map((instanceId) => ({
          entity: { kind: "card", instanceId },
          enabled: true,
        })),
      },
    ],
  };
}

function fromLorcanaSlottedTargetPrompt(prompt: LorcanaSlottedTargetPrompt): InteractionAction {
  return {
    id: `${prompt.requestId}:choose-slotted-targets`,
    requestId: prompt.requestId,
    intent: "choose-targets",
    text: { key: "lorcana.prompt.chooseSlottedTargets" },
    enabled: true,
    source: { kind: "card", instanceId: prompt.sourceCardId },
    inputs: prompt.slots.map((slot) => ({
      kind: "entity-selection",
      id: slot.id,
      role: slot.role,
      text: { key: `lorcana.prompt.slot.${slot.id}` },
      entityKinds: ["card"],
      min: 1,
      max: 1,
      ordered: false,
      candidates: slot.candidateIds.map((instanceId) => ({
        entity: { kind: "card", instanceId },
        enabled: true,
      })),
    })),
  };
}

function fromLorcanaOptionalPrompt(requestId: string): InteractionAction {
  return {
    id: `${requestId}:optional`,
    requestId,
    intent: "choose-option",
    text: { key: "lorcana.prompt.optional" },
    enabled: true,
    inputs: [
      {
        kind: "boolean",
        id: "resolveOptional",
        text: { key: "lorcana.prompt.optional.question" },
        trueText: { key: "lorcana.prompt.optional.accept" },
        falseText: { key: "lorcana.prompt.optional.decline" },
      },
    ],
  };
}

function fromLorcanaChoicePrompt(requestId: string, optionIds: string[]): InteractionAction {
  return {
    id: `${requestId}:choice`,
    requestId,
    intent: "choose-option",
    text: { key: "lorcana.prompt.choice" },
    enabled: true,
    inputs: [
      {
        kind: "option-selection",
        id: "choiceIndex",
        text: { key: "lorcana.prompt.choice.option" },
        min: 1,
        max: 1,
        options: optionIds.map((id) => ({
          id,
          text: { key: `lorcana.prompt.choice.${id}` },
          enabled: true,
        })),
      },
    ],
  };
}

function fromLorcanaOrderingPrompt(requestId: string, cardIds: string[]): InteractionAction {
  return {
    id: `${requestId}:ordering`,
    requestId,
    intent: "order-cards",
    text: { key: "lorcana.prompt.orderCards" },
    enabled: true,
    inputs: [
      {
        kind: "ordering",
        id: "orderedCards",
        text: { key: "lorcana.prompt.orderCards.cards" },
        entityKind: "card",
        min: cardIds.length,
        max: cardIds.length,
        candidates: cardIds.map((instanceId) => ({
          entity: { kind: "card", instanceId },
          enabled: true,
        })),
      },
    ],
  };
}

function expectInvalidCodes(
  view: EngineInteractionViewType,
  submission: InteractionSubmission,
  expectedCodes: InteractionSubmissionValidationIssueCode[],
): void {
  const result = validateInteractionSubmission(view, submission);
  expect(result.ok).toBe(false);
  if (result.ok) {
    throw new Error("Expected invalid interaction submission");
  }
  expect(
    result.issues.map((issue: { code: InteractionSubmissionValidationIssueCode }) => issue.code),
  ).toEqual(expectedCodes);
}
