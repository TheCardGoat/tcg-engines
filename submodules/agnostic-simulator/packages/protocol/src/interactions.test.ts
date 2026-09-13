import { describe, expect, test } from "vite-plus/test";
import {
  EngineInteractionView,
  EntityAllocationInput,
  EntityRef,
  EntityPartitionInput,
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
} from "./interactions.js";

const actorId = "player_one";

describe("engine interaction protocol", () => {
  test("preserves private candidate rendering identity and authoritative location", () => {
    expect(
      EntityRef.parse({
        kind: "card",
        instanceId: "deck-card-1",
        definitionId: "wtr-009",
        ownerId: actorId,
        zoneId: `${actorId}:deck`,
      }),
    ).toEqual({
      kind: "card",
      instanceId: "deck-card-1",
      definitionId: "wtr-009",
      ownerId: actorId,
      zoneId: `${actorId}:deck`,
    });
  });

  test("rejects protocol v1 views after the clean v2 break", () => {
    expect(EngineInteractionView.safeParse({ ...buildView([]), protocolVersion: 1 }).success).toBe(
      false,
    );
  });

  test("validates exhaustive entity partitions and preserves route order", () => {
    const action = partitionAction("exhaustive");
    const view = buildView([action]);
    const submission = buildInteractionSubmission({
      view,
      action,
      values: { partition: { tutor: ["card-a"], top: ["card-c", "card-b"] } },
    });

    expect(validateInteractionSubmission(view, submission)).toEqual({ ok: true, action });
    expect(submission.values.partition).toEqual({
      tutor: ["card-a"],
      top: ["card-c", "card-b"],
    });
    expect(entityCandidatesForAction(action)).toHaveLength(3);
  });

  test("rejects incomplete, duplicated, and ineligible partition assignments", () => {
    const action = partitionAction("exhaustive");
    const view = buildView([action]);
    const submission = buildInteractionSubmission({
      view,
      action,
      values: { partition: { tutor: ["card-b"], top: ["card-b"] } },
    });
    const result = validateInteractionSubmission(view, submission);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected invalid partition");
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "candidate_unavailable",
        "duplicate_selection",
        "partition_incomplete",
      ]),
    );
  });

  test("accepts an empty partition when the remainder is automatic", () => {
    const action = partitionAction("remainder-automatic");
    const view = buildView([action]);
    const submission = buildInteractionSubmission({
      view,
      action,
      values: { partition: {} },
    });
    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
  });

  test("matches an exact option selection in conditional requirements", () => {
    const action: InteractionAction = {
      id: "variant-choice",
      requestId: "variant-choice:1",
      intent: "choose-option",
      text: { key: "Choose a variant" },
      enabled: true,
      inputs: [
        {
          kind: "option-selection",
          id: "variant",
          text: { key: "Variant" },
          required: true,
          min: 1,
          max: 1,
          options: ["reorder", "starcall"].map((id) => ({ id, text: { key: id } })),
        },
        {
          kind: "option-selection",
          id: "starcall-card",
          text: { key: "Starcall card" },
          required: false,
          requiredWhen: [{ all: [{ inputId: "variant", value: ["starcall"] }] }],
          min: 1,
          max: 1,
          options: [{ id: "card-a", text: { key: "Card A" } }],
        },
      ],
    };
    const view = buildView([action]);

    expect(
      validateInteractionSubmission(
        view,
        buildInteractionSubmission({ view, action, values: { variant: ["reorder"] } }),
      ).ok,
    ).toBe(true);
    expectInvalidCodes(
      view,
      buildInteractionSubmission({ view, action, values: { variant: ["starcall"] } }),
      ["missing_value"],
    );
  });

  test("validates bounded entity allocations without encoding an answer option", () => {
    const allocation = EntityAllocationInput.parse({
      kind: "entity-allocation",
      id: "damage",
      text: { key: "Distribute 3 damage" },
      required: true,
      role: "target",
      entityKinds: ["card"],
      totalMin: 3,
      totalMax: 3,
      candidates: ["card-a", "card-b"].map((instanceId) => ({
        entity: { kind: "card", instanceId },
        enabled: true,
        min: 0,
        max: 3,
      })),
    });
    const action: InteractionAction = {
      id: "allocate-damage",
      requestId: "allocation:1",
      intent: "choose-targets",
      text: { key: "Allocate damage" },
      enabled: true,
      inputs: [allocation],
    };
    const view = buildView([action]);

    expect(
      validateInteractionSubmission(
        view,
        buildInteractionSubmission({
          view,
          action,
          values: { damage: { "card-a": 1, "card-b": 2 } },
        }),
      ).ok,
    ).toBe(true);
    expectInvalidCodes(
      view,
      buildInteractionSubmission({ view, action, values: { damage: { "card-a": 4 } } }),
      ["number_out_of_bounds", "selection_count_out_of_bounds"],
    );
  });

  test("rejects malformed partition schemas", () => {
    const input = partitionAction("exhaustive").inputs[0]!;
    if (input.kind !== "entity-partition") throw new Error("Expected partition input");

    expect(() =>
      EntityPartitionInput.parse({
        ...input,
        candidates: [input.candidates[0], input.candidates[0]],
      }),
    ).toThrow();
    expect(() =>
      EntityPartitionInput.parse({
        ...input,
        routes: [input.routes[0], input.routes[0]],
      }),
    ).toThrow();
    expect(() =>
      EntityPartitionInput.parse({
        ...input,
        routes: [{ ...input.routes[0], candidateIds: ["unknown-card"] }],
      }),
    ).toThrow();
    expect(() =>
      EntityPartitionInput.parse({
        ...input,
        assignment: "remainder-automatic",
      }),
    ).toThrow();
  });

  test("rejects unknown and disabled partition candidates", () => {
    const action = partitionAction("exhaustive");
    const input = action.inputs[0]!;
    if (input.kind !== "entity-partition") throw new Error("Expected partition input");
    const disabledAction: InteractionAction = {
      ...action,
      inputs: [
        {
          ...input,
          candidates: input.candidates.map((candidate) =>
            candidate.entity.instanceId === "card-c" ? { ...candidate, enabled: false } : candidate,
          ),
        },
      ],
    };
    const view = buildView([disabledAction]);
    const submission = buildInteractionSubmission({
      view,
      action: disabledAction,
      values: { partition: { tutor: ["card-a"], top: ["card-b", "card-c", "unknown"] } },
    });

    const result = validateInteractionSubmission(view, submission);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected invalid partition");
    expect(result.issues.filter((issue) => issue.code === "candidate_unavailable")).toHaveLength(2);
  });

  test("applies conditional destination bounds after optional extraction", () => {
    const action = partitionAction("exhaustive");
    const input = action.inputs[0]!;
    if (input.kind !== "entity-partition") throw new Error("Expected partition input");
    const boundedAction: InteractionAction = {
      ...action,
      inputs: [
        {
          ...input,
          routes: [
            input.routes[0]!,
            { ...input.routes[1]!, minWhenRemainingAtLeast: { count: 1, min: 1 } },
          ],
        },
      ],
    };
    const view = buildView([boundedAction]);
    const invalid = buildInteractionSubmission({
      view,
      action: boundedAction,
      values: { partition: { tutor: ["card-a"] } },
    });
    const valid = buildInteractionSubmission({
      view,
      action: boundedAction,
      values: { partition: { tutor: ["card-a"], top: ["card-c", "card-b"] } },
    });

    expect(validateInteractionSubmission(view, invalid).ok).toBe(false);
    expect(validateInteractionSubmission(view, valid).ok).toBe(true);
  });
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

  test("publishes observer-safe effect progress without candidates or tentative selections", () => {
    const parsed = EngineInteractionView.parse({
      ...buildView([]),
      status: "waiting",
      resolution: {
        actingPlayerId: "player_two",
        pendingCount: 3,
        currentEffect: {
          id: "effect_1",
          text: { key: "gundam.effect.current", params: { label: "Kamille Bidan — When Linked" } },
        },
        currentStep: {
          index: 1,
          count: 2,
          text: { key: "gundam.effect.step" },
          requirement: {
            kind: "entity-selection",
            text: { key: "gundam.choice.targets" },
            required: true,
            min: 1,
            max: 1,
          },
        },
      },
    });

    expect(parsed.resolution).toMatchObject({
      actingPlayerId: "player_two",
      pendingCount: 3,
      currentStep: { index: 1, count: 2 },
    });
    expect(JSON.stringify(parsed.resolution)).not.toContain("candidates");
    expect(JSON.stringify(parsed.resolution)).not.toContain("selected");
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

  test("accepts an adapter marker for an implicit option selection", () => {
    expect(
      OptionSelectionInput.parse({ ...baseOptionSelectionInput(), implicit: true }).implicit,
    ).toBe(true);
  });

  test("accepts semantic search presentation with contextual suggestions", () => {
    const input = OptionSelectionInput.parse({
      ...baseOptionSelectionInput(),
      presentation: {
        kind: "search",
        label: { key: "Card name" },
        placeholder: { key: "Type a card name" },
        confirmLabel: { key: "Use this name" },
        description: { key: "Search every legal name or use a visible suggestion." },
        resultLimit: 12,
        suggestionGroups: [
          { id: "your-hand", text: { key: "In your hand" }, optionIds: ["name:snatch"] },
        ],
      },
    });

    expect(input.presentation).toMatchObject({
      kind: "search",
      resultLimit: 12,
      suggestionGroups: [{ id: "your-hand", optionIds: ["name:snatch"] }],
    });
  });

  test("accepts direct option presentation with an explicit zero-choice outcome", () => {
    const input = OptionSelectionInput.parse({
      ...baseOptionSelectionInput(),
      min: 0,
      presentation: {
        kind: "direct",
        emptyText: { key: "Take 5 arcane damage" },
      },
    });

    expect(input.presentation).toEqual({
      kind: "direct",
      emptyText: { key: "Take 5 arcane damage" },
    });
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
        automation: { kind: "no-valid-action" },
        correlationId: "corr_1",
      }),
    ).toEqual({
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values: { cardId: "card_1" },
      automation: { kind: "no-valid-action" },
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

  test("requires a dependent input only when its selected branch is active", () => {
    const view = EngineInteractionView.parse(
      buildView([
        {
          id: "deploy",
          requestId: "deploy",
          intent: "play-card",
          text: { key: "test.deploy" },
          enabled: true,
          inputs: [
            {
              kind: "option-selection",
              id: "mode",
              text: { key: "test.deploy.mode" },
              min: 1,
              max: 1,
              options: [
                { id: "ordinary", text: { key: "test.deploy.ordinary" }, enabled: true },
                { id: "alternate", text: { key: "test.deploy.alternate" }, enabled: true },
              ],
            },
            {
              ...baseEntitySelectionInput(),
              required: false,
              requiredWhen: [{ all: [{ inputId: "mode", value: "alternate" }] }],
            },
          ],
        },
      ]),
    );
    const action = view.actions[0]!;

    expect(
      validateInteractionSubmission(
        view,
        buildInteractionSubmission({ view, action, values: { mode: ["ordinary"] } }),
      ).ok,
    ).toBe(true);
    expectInvalidCodes(
      view,
      buildInteractionSubmission({ view, action, values: { mode: ["alternate"] } }),
      ["missing_value"],
    );
    expect(
      validateInteractionSubmission(
        view,
        buildInteractionSubmission({
          view,
          action,
          values: { mode: ["alternate"], targets: ["target_1"] },
        }),
      ).ok,
    ).toBe(true);
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

function partitionAction(assignment: "exhaustive" | "remainder-automatic"): InteractionAction {
  return {
    id: "partition-cards",
    requestId: "partition:1",
    intent: "order-cards",
    text: { key: "test.partition" },
    enabled: true,
    inputs: [
      EntityPartitionInput.parse({
        kind: "entity-partition",
        id: "partition",
        text: { key: "test.partition.cards" },
        candidateSetText: { key: "test.partition.candidates", params: { label: "Your Hand" } },
        required: true,
        entityKind: "card",
        candidates: ["card-a", "card-b", "card-c"].map((instanceId) => ({
          entity: { kind: "card", instanceId },
          enabled: true,
        })),
        routes: [
          {
            id: "tutor",
            text: { key: "test.partition.tutor" },
            kind: "extract",
            ordered: false,
            min: 0,
            max: 1,
            candidateIds: ["card-a"],
          },
          {
            id: "top",
            text: { key: "test.partition.top" },
            kind: "destination",
            ordered: true,
            min: 0,
            max: 3,
          },
        ],
        assignment,
        ...(assignment === "remainder-automatic"
          ? { remainderText: { key: "test.partition.automatic" } }
          : {}),
      }),
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
