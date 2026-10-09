import { describe, expect, it } from "vite-plus/test";
import {
  EngineInteractionView,
  InteractionSubmission,
  validateInteractionSubmission,
} from "@tcg/protocol";
import { CyberpunkTestEngine, P1, type PlayerPrompt } from "@tcg/cyberpunk-engine";
import {
  RawGatewayStateSyncMessageSchema,
  RawGatewayStateUpdateMessageSchema,
} from "@tcg/protocol/gateway";
import {
  buildCyberpunkInteractionView,
  cyberpunkSubmissionToPayload,
} from "./interaction-protocol.js";

describe("Cyberpunk interaction protocol adapter", () => {
  it("publishes and accepts passing an optional Play trigger", () => {
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
    const view = buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 72, prompt });
    expect(view.actions[0]?.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "boolean", id: "pass", required: false }),
      ]),
    );

    for (const [values, payload] of [
      [{ pass: true }, { pass: true }],
      [{ triggerId: "maxtac-play" }, { pass: false, triggerId: "maxtac-play" }],
    ] as const) {
      const submission = InteractionSubmission.parse({
        protocolVersion: 2,
        stateVersion: 72,
        requestId: view.actions[0]?.requestId,
        actionId: "resolveTrigger",
        values,
      });
      expect(validateInteractionSubmission(view, submission).ok).toBe(true);
      expect(cyberpunkSubmissionToPayload(submission)).toEqual({
        moveType: "resolveTrigger",
        payload,
      });
    }
  });

  it("projects an optional single Gig reroll as one direct keep-or-reroll decision", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "effectTarget",
          targetKind: "gig",
          min: 0,
          max: 1,
          eligibleIds: ["gig-1"],
          effect: { effect: "rerollGig", optional: true },
        },
      },
    };
    const view = buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 71, prompt });
    expect(view.actions[0]?.inputs[0]).toMatchObject({
      kind: "option-selection",
      id: "rerollDieIds",
      min: 0,
      max: 1,
      presentation: { kind: "direct", emptyText: { key: "Keep result" } },
      options: [{ id: "gig-1", text: { key: "Reroll Gig" }, enabled: true }],
    });

    for (const [values, payload] of [
      [{ rerollDieIds: [] }, { pass: true }],
      [{ rerollDieIds: ["gig-1"] }, { targetIds: ["gig-1"] }],
    ] as const) {
      const submission = InteractionSubmission.parse({
        protocolVersion: 2,
        stateVersion: 71,
        requestId: view.actions[0]?.requestId,
        actionId: "resolveEffectTarget",
        values,
      });
      expect(validateInteractionSubmission(view, submission).ok).toBe(true);
      expect(cyberpunkSubmissionToPayload(submission)).toEqual({
        moveType: "resolveEffectTarget",
        payload,
      });
    }
  });

  it.each([{ eligibleIds: [] }, { eligibleIds: ["target-1"] }])(
    "publishes optional target bounds that survive update and sync parsing: $eligibleIds",
    ({ eligibleIds }) => {
      const prompt: PlayerPrompt = {
        status: "choice",
        availableMoves: [],
        choice: {
          type: "chooseTarget",
          chooserId: "p1",
          payload: {
            type: "effectTarget",
            targetKind: "card",
            min: 0,
            max: 3,
            canDecline: true,
            eligibleIds,
          },
        },
      };
      const view = buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 70, prompt });
      const snapshot = {
        gameId: "game-1",
        stateVersion: 70,
        state: {},
        engineLogs: [],
        animationPlan: null,
        interactionView: view,
      };
      expect(
        RawGatewayStateSyncMessageSchema.safeParse({ ...snapshot, type: "state_sync" }).success,
      ).toBe(true);
      expect(
        RawGatewayStateUpdateMessageSchema.safeParse({
          ...snapshot,
          patches: [],
          type: "state_update",
        }).success,
      ).toBe(true);
      expect(view.actions[0]?.inputs[0]).toMatchObject({ min: 0, max: eligibleIds.length });
      expect(
        validateInteractionSubmission(view, {
          protocolVersion: 2,
          stateVersion: 70,
          requestId: "cyberpunk:70:resolveEffectTarget",
          actionId: "resolveEffectTarget",
          values: { targetIds: [] },
        }).ok,
      ).toBe(true);
    },
  );
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

  it("projects pass as disabled when must-attack blocks ending the turn", () => {
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        {
          moveId: "attackRival",
          inputSpec: { type: "selectCard", candidates: ["required_attacker"] },
        },
      ],
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p2", stateVersion: 12, prompt }),
    );

    expect(parsed.actions.map((action) => action.id)).toEqual(["attackRival", "passPhase"]);
    expect(parsed.actions[1]).toMatchObject({
      id: "passPhase",
      enabled: false,
      disabledText: {
        params: { label: "A Unit must attack before you can pass." },
      },
      inputs: [],
    });
  });

  it("does not project disabled pass during attack resolution windows", () => {
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [{ moveId: "resolveAttack", inputSpec: { type: "none" } }],
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p2", stateVersion: 13, prompt }),
    );

    expect(parsed.actions.map((action) => action.id)).toEqual(["resolveAttack"]);
  });

  it("projects engine-selected deck-search eligibility and dynamic-limit context", () => {
    const revealedCards = [9, 5, 5, 2].map((cost, index) => ({
      instanceId: `card-${index}`,
      definitionId: `definition-${index}`,
      cardName: `Card ${index}`,
      zone: "deck" as const,
      faceDown: false,
      spent: false,
      damage: 0,
      power: 0,
      effectivePower: 0,
      cost,
      type: "gear" as const,
      classifications: [],
      hasSellTag: false,
      attachedGearIds: [],
      attachedToId: null,
      hasLag: false,
      hasAttackedThisTurn: false,
      hasStolenGigThisTurn: false,
      grantedRules: [],
      keywords: [],
      triggerHints: [],
      abilityHints: [],
    }));
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "scry",
        chooserId: "p1",
        payload: {
          player: "p1",
          amount: 4,
          revealedCardIds: revealedCards.map((card) => card.instanceId),
          revealedCards,
          destinations: [
            {
              zone: "hand",
              min: 0,
              max: 2,
              reveal: true,
              eligibleCardIds: ["card-1", "card-3"],
              eligibilityLabel: "cost matching a friendly Gig value (2, 5)",
              selectionLimitContext: {
                kind: "basePlusPerCount",
                base: 1,
                multiplier: 1,
                matchCount: 2,
                countedTarget: {
                  selector: "gig",
                  controller: "friendly",
                  minValue: 1,
                  maxValue: 1,
                },
              },
            },
            {
              zone: "deckBottom",
              remainder: true,
              order: "random",
              eligibleCardIds: revealedCards.map((card) => card.instanceId),
            },
          ],
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 8, prompt }),
    );
    const action = parsed.actions[0];
    expect(action?.text.params).toMatchObject({
      eligibleCount: 2,
      eligibilityLabel: "cost matching a friendly Gig value (2, 5)",
      selectionLimitLabel: "2 friendly min Gigs allow 2 extra cards",
      destinationReveal: true,
      remainderZone: "deckBottom",
    });
    expect(action?.inputs[1]).toMatchObject({
      kind: "entity-selection",
      candidates: [{ enabled: false }, { enabled: true }, { enabled: false }, { enabled: true }],
    });
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

  it("keeps the current Gig value selectable for an up-to adjustment at a die boundary", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "adjustGig",
          dieId: "friendly-d4",
          currentValue: 1,
          maxFaceValue: 4,
          maxAmount: 3,
          direction: "decrease",
          chooseUpTo: true,
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 8, prompt }),
    );

    const action = parsed.actions[0];
    expect(action).toMatchObject({
      id: "resolveAdjustGig",
      source: { kind: "die", instanceId: "friendly-d4" },
    });
    expect(
      action?.inputs.find((input) => input.kind === "number" && input.id === "value"),
    ).toMatchObject({ min: 1, max: 1 });
  });

  it("projects Gig target and value as one atomic adjustment action", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "effectTarget",
          targetKind: "gig",
          min: 0,
          max: 1,
          eligibleIds: ["friendly-d6", "rival-d8"],
          selectedBindingId: "gig",
          adjustGig: {
            maxAmount: 1,
            direction: "either",
            chooseUpTo: true,
            effectIndex: 0,
          },
        },
      },
    };
    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 9, prompt }),
    );

    expect(parsed.actions).toHaveLength(1);
    expect(parsed.actions[0]).toMatchObject({ id: "resolveAdjustGig" });
    expect(parsed.actions[0]?.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "entity-selection",
          id: "dieId",
          candidates: [
            expect.objectContaining({ entity: { kind: "die", instanceId: "friendly-d6" } }),
            expect.objectContaining({ entity: { kind: "die", instanceId: "rival-d8" } }),
          ],
        }),
        expect.objectContaining({ kind: "number", id: "value" }),
        expect.objectContaining({ kind: "boolean", id: "pass" }),
      ]),
    );

    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 9,
      requestId: parsed.actions[0]?.requestId,
      actionId: "resolveAdjustGig",
      values: { dieId: "rival-d8", value: 5 },
    });
    expect(validateInteractionSubmission(parsed, submission).ok).toBe(true);
    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveAdjustGig",
      payload: { kind: "adjust", dieId: "rival-d8", value: 5 },
    });
  });

  it("projects trigger choices with ability text for user-facing prompts", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTrigger",
        chooserId: "p1",
        payload: {
          options: [
            {
              triggerId: "trigger-1",
              sourceCardId: "misty_1",
              sourcePlayerId: "p1",
              abilityIndex: 1,
              abilityText: "At the end of your turn, choose a card type.",
              cardName: "Misty Olszewski",
              optional: false,
              containsOptionalEffect: true,
              context: {
                kind: "gigRoll",
                dieId: "gig-d4",
                dieType: "d4",
                result: 4,
                origin: "gainGig",
              },
            },
          ],
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 7, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({
      id: "resolveTrigger",
      intent: "choose-option",
      inputs: [
        {
          kind: "option-selection",
          id: "triggerId",
          options: [
            {
              id: "trigger-1",
              text: {
                params: {
                  abilityText: "At the end of your turn, choose a card type.",
                  cardName: "Misty Olszewski",
                  sourceCardId: "misty_1",
                  optional: false,
                  containsOptionalEffect: true,
                  rollDieId: "gig-d4",
                  rollDieType: "d4",
                  rollResult: 4,
                  rollOrigin: "gainGig",
                },
              },
            },
          ],
        },
      ],
    });
    expect(parsed.resolution).toMatchObject({
      actingPlayerId: "p1",
      pendingCount: 1,
      currentEffect: {
        text: {
          params: {
            label: "Misty Olszewski — At the end of your turn, choose a card type.",
          },
        },
      },
      currentStep: {
        requirement: {
          kind: "option-selection",
          required: true,
          min: 1,
          max: 1,
        },
      },
    });
  });

  it("projects reveal destination choices as option selections", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "revealDestination",
        chooserId: "p2",
        payload: {
          player: "p1",
          destinations: ["hand", "trash"],
          revealedCardIds: ["card_1", "card_2"],
          revealedCards: [
            filteredCard("card_1", "definition_1"),
            filteredCard("card_2", "definition_2"),
          ],
          source: {
            cardId: "source_1",
            definitionId: "fool_on_the_hill",
            displayName: "Fool on the Hill",
            cardType: "program",
          },
          drawIfDestination: { destination: "trash", player: "p1", amount: 2 },
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p2", stateVersion: 14, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({
      id: "resolveRevealDestination",
      intent: "choose-option",
      source: { kind: "card", instanceId: "source_1" },
      text: {
        params: {
          destinationOwnerId: "p1",
          revealedCount: 2,
          revealedCardIds: "card_1,card_2",
          drawAmount: 2,
          sourceDisplayName: "Fool on the Hill",
        },
      },
    });
    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "option-selection",
      id: "destination",
      min: 1,
      max: 1,
      options: [{ id: "hand" }, { id: "trash" }],
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

  it("projects the native ordered Gig-copy constraint without card-name inference", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "effectTarget",
          targetKind: "gig",
          min: 2,
          max: 2,
          eligibleIds: ["friendly_gig", "rival_gig"],
          pairConstraint: "gig-copy-between-players",
          source: {
            cardId: "padre_1",
            definitionId: "padre",
            displayName: "Localized card name",
            cardType: "legend",
          },
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 11, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({
      id: "resolveEffectTarget",
      text: { params: { gigCopyPairConstraint: "gig-copy-between-players" } },
      inputs: [
        expect.objectContaining({
          kind: "entity-selection",
          id: "targetIds",
          ordered: true,
        }),
      ],
    });
  });

  it("projects discard choices with source card metadata", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "discardFromHand",
          targetKind: "card",
          amount: 1,
          eligibleIds: ["hand_1", "hand_2"],
          canDecline: true,
          source: {
            cardId: "panam_1",
            definitionId: "panam-palmer-strength-through-family",
            displayName: "Panam Palmer: Strength Through Family",
            cardType: "unit",
            color: "green",
          },
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 11, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({
      id: "resolveDiscardFromHand",
      source: { kind: "card", instanceId: "panam_1" },
      text: {
        params: {
          sourceCardId: "panam_1",
          sourceDisplayName: "Panam Palmer: Strength Through Family",
        },
      },
    });
  });

  it("projects a pass affordance for optional (min 0) gig effect target choices", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "effectTarget",
          targetKind: "gig",
          // F8 repro shape: "SELECT TARGET (0-1)" with no canDecline flag.
          // The engine's resolveEffectTarget move accepts pass (or an empty
          // target list) whenever min is 0, so the protocol view must carry
          // the pass affordance too — otherwise the prompt is
          // mandatory-in-practice for protocol-driven surfaces.
          min: 0,
          max: 1,
          eligibleIds: ["gd_755974976"],
          source: {
            cardId: "source_1",
            definitionId: "afterparty_at_lizzie_s",
            displayName: "Afterparty at Lizzie's",
            cardType: "program",
          },
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 12, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({ id: "resolveEffectTarget", enabled: true });
    expect(parsed.actions[0]?.inputs).toEqual([
      expect.objectContaining({
        kind: "entity-selection",
        id: "targetIds",
        role: "target",
        entityKinds: ["die"],
        required: false,
        min: 0,
        max: 1,
        candidates: [{ entity: { kind: "die", instanceId: "gd_755974976" }, enabled: true }],
      }),
      expect.objectContaining({
        kind: "boolean",
        id: "pass",
        required: false,
      }),
    ]);

    // An empty targetIds submission (the decline) validates against the
    // projected view and translates to the native empty-target move.
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 12,
      requestId: parsed.actions[0]?.requestId,
      actionId: "resolveEffectTarget",
      values: { targetIds: [] },
    });
    expect(validateInteractionSubmission(parsed, submission).ok).toBe(true);
    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveEffectTarget",
      payload: { targetIds: [] },
    });
  });

  it("keeps required (min 1) effect target choices without a pass input", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "effectTarget",
          targetKind: "gig",
          min: 1,
          max: 1,
          eligibleIds: ["gd_1"],
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 13, prompt }),
    );

    expect(parsed.actions[0]?.inputs).toHaveLength(1);
    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      id: "targetIds",
      required: true,
      min: 1,
      max: 1,
    });
  });

  it("rejects an impossible required target choice at the adapter boundary", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: "p1",
        payload: {
          type: "effectTarget",
          targetKind: "gig",
          min: 1,
          max: 1,
          eligibleIds: [],
        },
      },
    };

    expect(() =>
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 14, prompt }),
    ).toThrow(
      'Cyberpunk interaction input "targetIds" requires 1 selections but has 0 enabled candidates',
    );
  });

  it("disables unaffordable play-from-trash candidates", () => {
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
          max: 1,
          canDecline: true,
          eligibleIds: ["floor_it", "corporate_surveillance"],
          targetPurpose: "playCard",
          availableEddiesAfterCosts: 1,
          effectiveCostsByCardId: { floor_it: 1, corporate_surveillance: 2 },
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 11, prompt }),
    );
    const targetInput = parsed.actions[0]?.inputs[0];
    expect(targetInput).toMatchObject({
      kind: "entity-selection",
      id: "targetIds",
      min: 0,
      max: 1,
    });
    expect(targetInput && "candidates" in targetInput ? targetInput.candidates : []).toEqual([
      { entity: { kind: "card", instanceId: "floor_it" }, enabled: true },
      {
        entity: { kind: "card", instanceId: "corporate_surveillance" },
        enabled: false,
        disabledText: {
          key: "cyberpunk.target.insufficientEddies",
          params: { cost: 2, available: 1 },
        },
      },
    ]);
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
              { cardId: "gear_with_target", attachTargets: ["unit_1", "legend_area_1"] },
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
        candidates: [
          { entity: { instanceId: "unit_1" } },
          { entity: { instanceId: "legend_area_1" } },
        ],
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

  it("declares manual payment sources for activated abilities", () => {
    const state = CyberpunkTestEngine.createWithFixture({ eddies: 2 }).getState();
    const paymentSourceIds = [
      ...state.G.players[P1].eddieCardIds,
      ...state.G.players[P1].zones.legendArea,
    ].map(String);
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        {
          moveId: "activateAbility",
          inputSpec: {
            type: "selectAbility",
            candidates: [
              {
                cardId: "legend_1",
                abilityIndex: 0,
                effectHints: [],
                eddieCost: 1,
                spendsCard: false,
              },
            ],
          },
        },
      ],
    };

    const view = buildCyberpunkInteractionView({
      actorId: P1,
      stateVersion: 21,
      prompt,
      state,
    });

    expect(view.actions[0]?.inputs[2]).toMatchObject({
      kind: "entity-selection",
      id: "paymentSourceIds",
      candidates: paymentSourceIds.map((instanceId) => ({ entity: { instanceId } })),
    });
    expect(
      validateInteractionSubmission(view, {
        protocolVersion: 2,
        stateVersion: 21,
        requestId: "cyberpunk:21:activateAbility",
        actionId: "activateAbility",
        values: { cardId: "legend_1", abilityIndex: "0", paymentSourceIds: [paymentSourceIds[0]] },
      }).ok,
    ).toBe(true);
  });

  it("declares manual payment sources for card-play choices", () => {
    const state = CyberpunkTestEngine.createWithFixture({ eddies: 1 }).getState();
    const paymentSourceIds = [
      ...state.G.players[P1].eddieCardIds,
      ...state.G.players[P1].zones.legendArea,
    ].map(String);
    const paymentSourceId = paymentSourceIds[0]!;
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseCardToPlay",
        chooserId: P1,
        payload: { player: P1, cardIds: ["card_1"], free: false, canDecline: false },
      },
    };

    const view = buildCyberpunkInteractionView({
      actorId: P1,
      stateVersion: 22,
      prompt,
      state,
    });

    expect(view.actions[0]?.inputs[1]).toMatchObject({
      kind: "entity-selection",
      id: "paymentSourceIds",
      candidates: paymentSourceIds.map((instanceId) => ({ entity: { instanceId } })),
    });
    expect(
      validateInteractionSubmission(view, {
        protocolVersion: 2,
        stateVersion: 22,
        requestId: "cyberpunk:22:resolveCardToPlay",
        actionId: "resolveCardToPlay",
        values: { cardId: "card_1", paymentSourceIds: [paymentSourceId] },
      }).ok,
    ).toBe(true);
  });

  it("translates protocol submissions back to native command args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
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

  it("parses activateAbility abilityIndex from the string option id", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 3,
      requestId: "cyberpunk:3:activateAbility",
      actionId: "activateAbility",
      values: { cardId: "legend_1", abilityIndex: "1" },
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "activateAbility",
      payload: { cardId: "legend_1", abilityIndex: 1 },
    });
  });

  it("accepts activateAbility abilityIndex as a raw number end to end", () => {
    const prompt: PlayerPrompt = {
      status: "action",
      choice: null,
      availableMoves: [
        {
          moveId: "activateAbility",
          inputSpec: {
            type: "selectAbility",
            candidates: [{ cardId: "legend_1", abilityIndex: 1 }],
          },
        },
      ],
    };
    const view = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 3, prompt }),
    );

    // The protocol coerces the numeric form to the option id "1", so a client
    // that skips the stringification still passes validation and parsing.
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 3,
      requestId: "cyberpunk:3:activateAbility",
      actionId: "activateAbility",
      values: { cardId: "legend_1", abilityIndex: 1 },
    });

    expect(validateInteractionSubmission(view, submission).ok).toBe(true);
    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "activateAbility",
      payload: { cardId: "legend_1", abilityIndex: 1 },
    });
  });

  it("translates resolveAttack pass submissions back to native command args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
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
      protocolVersion: 2,
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

  it("forwards selected Gig-prevention pairs to the native move", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 3,
      requestId: "cyberpunk:3:resolvePreventGigSteal",
      actionId: "resolvePreventGigSteal",
      values: { dieIds: ["gig_1", "gig_2"], cardIds: ["card_3", "card_6"] },
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolvePreventGigSteal",
      payload: {
        pass: false,
        preventions: [
          { dieId: "gig_1", cardId: "card_3" },
          { dieId: "gig_2", cardId: "card_6" },
        ],
      },
    });
  });

  it("translates reveal destination submissions back to native command args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 14,
      requestId: "cyberpunk:14:resolveRevealDestination",
      actionId: "resolveRevealDestination",
      values: { destination: "trash" },
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveRevealDestination",
      payload: { destination: "trash" },
    });
  });

  it("projects chooseEffect as an enabled resolveChooseEffect option selection", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseEffect",
        chooserId: "p1",
        payload: {
          source: {
            cardId: "nocturne-1",
            controllerId: "p1",
            definitionId: "nocturne-op55-n1",
            displayName: "Nocturne OP55 N1",
            cardType: "program",
            color: "blue",
          },
          options: [
            { id: "power-down", label: "Give a rival Unit -5 power this turn" },
            { id: "bottom-deck", label: "Bottom-deck a rival Unit with power 0" },
          ],
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 21, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({
      id: "resolveChooseEffect",
      intent: "choose-option",
      enabled: true,
      source: { kind: "card", instanceId: "nocturne-1" },
      text: {
        params: {
          sourceCardId: "nocturne-1",
          sourceDisplayName: "Nocturne OP55 N1",
        },
      },
    });
    expect(parsed.actions[0]?.inputs[0]).toMatchObject({
      kind: "option-selection",
      id: "optionId",
      min: 1,
      max: 1,
    });
    const options = parsed.actions[0]?.inputs[0];
    expect(options && "options" in options ? options.options.map((o) => o.id) : []).toEqual([
      "power-down",
      "bottom-deck",
    ]);
  });

  it("projects optional free-play choices with a pass/decline input", () => {
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseCardToPlay",
        chooserId: "p1",
        payload: {
          cardIds: ["revealed_1"],
          cards: [filteredCard("revealed_1", "def_1")],
          free: true,
          canDecline: true,
        },
      },
    };

    const parsed = EngineInteractionView.parse(
      buildCyberpunkInteractionView({ actorId: "p1", stateVersion: 22, prompt }),
    );

    expect(parsed.actions[0]).toMatchObject({
      id: "resolveCardToPlay",
      intent: "play-card",
    });
    expect(parsed.actions[0]?.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "entity-selection",
          id: "cardId",
          min: 0,
          max: 1,
        }),
        expect.objectContaining({
          kind: "boolean",
          id: "pass",
          required: false,
        }),
      ]),
    );
  });

  it("translates resolveChooseEffect submissions back to native command args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 21,
      requestId: "cyberpunk:21:resolveChooseEffect",
      actionId: "resolveChooseEffect",
      values: { optionId: "power-down" },
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveChooseEffect",
      payload: { optionId: "power-down" },
    });
  });

  it("translates optional free-play decline submissions back to native command args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 22,
      requestId: "cyberpunk:22:resolveCardToPlay",
      actionId: "resolveCardToPlay",
      values: { pass: true },
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveCardToPlay",
      payload: { pass: true },
    });
  });

  it("treats an empty optional free-play selection as a decline", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 2,
      stateVersion: 22,
      requestId: "cyberpunk:22:resolveCardToPlay",
      actionId: "resolveCardToPlay",
      values: {},
    });

    expect(cyberpunkSubmissionToPayload(submission)).toEqual({
      moveType: "resolveCardToPlay",
      payload: { pass: true },
    });
  });
});

function filteredCard(
  instanceId: string,
  definitionId: string,
): PlayerPrompt["choice"] extends {
  payload: { revealedCards: ReadonlyArray<infer Card> };
}
  ? Card
  : never {
  return {
    instanceId,
    definitionId,
    zone: "deck",
    faceDown: false,
    spent: false,
    damage: 0,
    power: 0,
    effectivePower: 0,
    cost: 1,
    type: "unit",
    classifications: [],
    hasSellTag: false,
    attachedGearIds: [],
    attachedToId: null,
    hasLag: false,
    hasAttackedThisTurn: false,
    grantedRules: [],
    keywords: [],
  };
}
