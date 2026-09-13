import { dorinthea } from "@tcg/flesh-and-blood-cards/cards/heroes/dorinthea";
import { dawnblade } from "@tcg/flesh-and-blood-cards/cards/weapons/dawnblade";
import { refractionBolters } from "@tcg/flesh-and-blood-cards/cards/equipment/refraction-bolters";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { cintariSellsword } from "@tcg/flesh-and-blood-cards/cards/tokens/cintari-sellsword";
import { malice } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessLooterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-looter";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "@tcg/flesh-and-blood-engine/automation";
import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import type { FabDecision } from "@tcg/flesh-and-blood-engine/runtime";
import { EngineInteractionView, buildInteractionSubmission } from "@tcg/protocol";
import { describe, expect, it } from "vitest";
import {
  commandForFabSubmission,
  fabOptionalTriggerAutomationTargetMode,
  projectFabInteraction,
} from "./interaction.ts";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

const ACTOR = "fab-p1";
const OBSERVER = "fab-p2";
const continuation = { kind: "trigger-first-player", processId: "process-1" } as const;

function runtimeWithDecision(decision: FabDecision) {
  const game = FabTestEngine.create({
    player1Id: ACTOR,
    player2Id: OBSERVER,
    player1: { heroCardId: catalogIds.rhinar, hand: [], deck: 4 },
    player2: { heroCardId: catalogIds.bravo, hand: [], deck: 4 },
    cardDefinitions: CATALOG_TEST_DEFINITIONS,
  });
  game.getRuntime().getState().decision = decision;
  return game.getRuntime();
}

function base(kind: FabDecision["kind"]) {
  return {
    decisionId: "decision-1" as const,
    stateVersion: 0,
    actorId: ACTOR,
    label: `Resolve ${kind}`,
    continuation,
  };
}

describe("FAB persisted decision interaction projection", () => {
  it("projects direct prevention outcomes without exposing engine replacement terminology", () => {
    const runtime = runtimeWithDecision({
      ...base("option"),
      kind: "option",
      label: "Prevent incoming arcane damage?",
      min: 0,
      max: 1,
      options: [
        {
          id: "robe:arcane-barrier",
          label: "Nullrune Robe · Pay 1 resource · Prevent 1 · Take 4",
        },
      ],
      presentation: {
        kind: "direct",
        description: "Voltic Bolt would deal 5 arcane damage.",
        emptyLabel: "Take 5 arcane damage",
      },
    });

    const view = projectFabInteraction(runtime, ACTOR).view;
    const input = view.actions[0]?.inputs[0];

    expect(view.resolution?.currentEffect.text.key).toBe("Prevent incoming arcane damage?");
    expect(view.resolution?.currentStep.text).toEqual({
      key: "fab.prompt.directOption",
      params: {
        label: "Voltic Bolt would deal 5 arcane damage.",
      },
    });
    expect(input).toMatchObject({
      kind: "option-selection",
      min: 0,
      max: 1,
      presentation: { kind: "direct", emptyText: { key: "Take 5 arcane damage" } },
    });
  });

  it("projects Restless Looter's attack and Instant only while the ally can pay their tap cost", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessLooterRed],
        hand: [],
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const runtime = game.getRuntime();
    const actorId = game.as(malice).id;
    const looterId = runtime.getState().containers.zonesByPlayerId[actorId]!.arena[0]!;
    const readyProjection = projectFabInteraction(runtime, actorId);
    const readyActions = readyProjection.view.actions.filter(
      (action) => action.source?.instanceId === looterId && action.intent !== "custom",
    );

    expect(readyActions.map((action) => action.text.key)).toEqual([
      "Attack with Restless Looter",
      expect.stringContaining("Activate Restless Looter"),
    ]);

    const instantAction = readyActions.find((action) => action.text.key.startsWith("Activate "));
    if (!instantAction) throw new Error("Expected Restless Looter's Instant action");
    const instantCommand = commandForFabSubmission(
      runtime,
      actorId,
      buildInteractionSubmission({ view: readyProjection.view, action: instantAction, values: {} }),
    );
    if (!instantCommand) throw new Error("Expected Restless Looter's Instant command");
    expect(runtime.dispatch(instantCommand.move, actorId, instantCommand.payload).accepted).toBe(
      true,
    );

    expect(
      projectFabInteraction(runtime, actorId).view.actions.filter(
        (action) => action.source?.instanceId === looterId && action.intent !== "custom",
      ),
    ).toEqual([]);
  });

  it("projects multiple attack targets as one card action with exact target candidates", () => {
    const game = FabTestEngine.create({
      player1Id: ACTOR,
      player2Id: OBSERVER,
      player1: { heroCardId: catalogIds.rhinar, hand: [catalogIds.snatch], deck: 4 },
      player2: {
        heroCardId: catalogIds.bravo,
        arena: [cintariSellsword.canonicalId],
        hand: [],
        deck: 4,
      },
      cardDefinitions: {
        ...CATALOG_TEST_DEFINITIONS,
        [cintariSellsword.canonicalId]: cintariSellsword,
      },
    });
    const runtime = game.getRuntime();
    const state = runtime.getState();
    const attackId = state.containers.zonesByPlayerId[ACTOR]!.hand[0]!;
    const allyId = state.containers.zonesByPlayerId[OBSERVER]!.arena[0]!;
    const projection = projectFabInteraction(runtime, ACTOR);
    const action = projection.view.actions.find(
      (candidate) => candidate.source?.instanceId === attackId && candidate.inputs.length > 0,
    );
    if (!action) throw new Error("Expected a drafted attack-target action");

    expect(action.text.key).toBe("Choose an attack target for: Snatch");
    expect(action.inputs[0]).toMatchObject({
      kind: "entity-selection",
      role: "target",
      min: 1,
      max: 1,
      candidates: [
        { entity: { kind: "player", instanceId: OBSERVER } },
        { entity: { kind: "card", instanceId: allyId } },
      ],
    });
    expect(
      commandForFabSubmission(
        runtime,
        ACTOR,
        buildInteractionSubmission({
          view: projection.view,
          action,
          values: { attackTarget: [allyId] },
        }),
      ),
    ).toMatchObject({ move: "begin-play", payload: { instanceId: attackId, target: allyId } });
  });

  it("projects the ally controller's no-defense interaction when an ally is attacked", () => {
    const game = FabTestEngine.create(
      {
        player1Id: ACTOR,
        player2Id: OBSERVER,
        player1: { heroCardId: catalogIds.rhinar, hand: [catalogIds.snatch], deck: 4 },
        player2: {
          heroCardId: catalogIds.bravo,
          arena: [cintariSellsword.canonicalId],
          hand: [catalogIds.snatch],
          deck: 4,
        },
        cardDefinitions: {
          ...CATALOG_TEST_DEFINITIONS,
          [cintariSellsword.canonicalId]: cintariSellsword,
        },
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const allyId = game.getState().containers.zonesByPlayerId[OBSERVER]!.arena[0]!;

    game.as(catalogIds.rhinar).attackWith(catalogIds.snatch, { target: allyId });

    const view = projectFabInteraction(game.getRuntime(), OBSERVER).view;
    const defense = view.actions.find((action) => action.id === "fab:control:defend");
    const noDefense = view.actions.find((action) => action.text.key === "Do not defend");
    expect(defense?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      role: "defender",
      candidates: [],
    });
    expect(noDefense).toMatchObject({ intent: "pass", enabled: true });
  });

  it("preserves public trigger identities through server animation redaction", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        legs: [refractionBolters],
        hand: [],
        deck: 8,
        resourcePoints: 2,
      },
      { hero: bravo, hand: [], deck: 8 },
      { autoPassPriority: false },
    );
    const attacker = game.as(dorinthea);
    attacker.activateAttack(dawnblade);
    game.as(bravo).defendWith();
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    const order = attacker.expectDecision("ordering");
    const engine = new FleshAndBloodServerEngine(game.getRuntime());
    const result = engine.dispatch(
      "answer-decision",
      attacker.id,
      {
        decisionId: order.decisionId,
        stateVersion: engine.getStateID(),
        answer: { kind: "ordering", orderedIds: order.entries.map((entry) => entry.id) },
      },
      { gameId: "trigger-animation", sourceAuthority: "server" },
    );
    if (!result.success) throw new Error(result.error);
    for (const viewer of [
      { role: "player", actorId: attacker.id },
      { role: "spectator" },
    ] as const) {
      const plan = engine.getViewerAnimationPlan(result.animationPlan ?? null, viewer);
      const triggers = plan?.steps.filter(
        (step) => step.type === "entityTransfer" && step.sourcePresentation === "copy",
      );
      expect(triggers).toHaveLength(2);
      for (const trigger of triggers ?? []) {
        expect(trigger).toMatchObject({
          entity: { id: expect.stringMatching(/^rules-stack:/) },
          sourceFace: "public",
          destinationFace: "public",
        });
      }
    }
  });

  it.each([true, false])(
    "keeps successive hit triggers separate when Dorinthea is accepted=%s",
    (accept) => {
      // Owns the adapter prompt/submission contract, not the authored card rules.
      const game = FabTestEngine.start(
        {
          hero: dorinthea,
          weapon1: [dawnblade],
          legs: [refractionBolters],
          hand: [],
          deck: 8,
          resourcePoints: 2,
        },
        { hero: bravo, hand: [], deck: 8 },
        { autoPassPriority: false },
      );
      const attacker = game.as(dorinthea);
      attacker.activateAttack(dawnblade);
      game.as(bravo).defendWith();
      game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
      const order = attacker.expectDecision("ordering");
      game.answerDecision(attacker.id, {
        kind: "ordering",
        orderedIds: order.entries.map((candidate) => candidate.id),
      });
      game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
      const runtime = game.getRuntime();
      const view = projectFabInteraction(runtime, attacker.id).view;
      const action = view.actions[0]!;
      expect(action.text.key).toBe("Use the optional effect of Dorinthea?");
      expect(action.inputs).toHaveLength(1);
      const command = commandForFabSubmission(
        runtime,
        attacker.id,
        buildInteractionSubmission({ view, action, values: { answer: accept } }),
      );
      expect(command).not.toBeNull();
      expect(runtime.dispatch(command!.move, attacker.id, command!.payload).accepted).toBe(true);
      game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
      expect(projectFabInteraction(runtime, attacker.id).view.actions[0]?.text.key).toContain(
        "Refraction Bolters",
      );
    },
  );

  it("maps card-name semantics and actor-safe suggestions without parsing English copy", () => {
    const runtime = runtimeWithDecision({
      ...base("effect-resolution"),
      kind: "effect-resolution",
      label: "Nommer une carte",
      options: [{ id: "fab-card-name:Snatch", label: "Snatch" }],
      presentation: {
        kind: "card-name",
        label: "Nom de carte",
        placeholder: "Saisissez un nom de carte",
        confirmLabel: "Utiliser ce nom",
        description: "Recherchez le catalogue ou utilisez une suggestion visible.",
        resultLimit: 12,
        suggestionGroups: [
          { id: "your-hand", label: "Dans votre main", optionIds: ["fab-card-name:Snatch"] },
        ],
      },
    });

    const input = projectFabInteraction(runtime, ACTOR).view.actions[0]?.inputs[0];
    expect(input).toMatchObject({
      kind: "option-selection",
      presentation: {
        kind: "search",
        label: { key: "Nom de carte" },
        placeholder: { key: "Saisissez un nom de carte" },
        confirmLabel: { key: "Utiliser ce nom" },
        description: { key: "Recherchez le catalogue ou utilisez une suggestion visible." },
        resultLimit: 12,
        suggestionGroups: [
          {
            id: "your-hand",
            text: { key: "Dans votre main" },
            optionIds: ["fab-card-name:Snatch"],
          },
        ],
      },
    });
    const observerActions = projectFabInteraction(runtime, OBSERVER).view.actions;
    expect(observerActions).toEqual([expect.objectContaining({ intent: "concede" })]);
    expect(JSON.stringify(observerActions)).not.toContain("fab-card-name:");
    expect(JSON.stringify(observerActions)).not.toContain("Dans votre main");
  });

  it("projects explicit card-scoped optional-trigger target modes", () => {
    const canonicalId = "RP6pJj9WtwbTT79qdHPkz";
    const tunic = fleshAndBloodStructuredCardsByCanonicalId.get(canonicalId);
    if (!tunic) throw new Error("Expected authored Fyendal's Spring Tunic");
    const game = FabTestEngine.create({
      player1Id: ACTOR,
      player2Id: OBSERVER,
      player1: { heroCardId: catalogIds.rhinar, chest: [canonicalId], hand: [], deck: 4 },
      player2: { heroCardId: catalogIds.bravo, hand: [], deck: 4 },
      cardDefinitions: { ...CATALOG_TEST_DEFINITIONS, [canonicalId]: tunic },
    });

    const projection = projectFabInteraction(game.getRuntime(), ACTOR);
    const actions = projection.view.actions.filter(
      (action) => fabOptionalTriggerAutomationTargetMode(action) !== null,
    );
    const tunicInstanceId = game.getRuntime().getState().containers.zonesByPlayerId[ACTOR]!
      .chest[0];

    expect(actions.map(fabOptionalTriggerAutomationTargetMode)).toEqual([
      "auto-accept",
      "auto-decline",
    ]);
    expect(actions.map((action) => action.source?.instanceId)).toEqual([
      tunicInstanceId,
      tunicInstanceId,
    ]);
    expect(
      actions.map((action) => projection.commandByActionId.get(action.id)?.payload.mode),
    ).toEqual(["auto-accept", "auto-decline"]);
  });

  it("keeps auto-order available to the trigger decision owner and maps its exact command", () => {
    const runtime = runtimeWithDecision({
      ...base("ordering"),
      kind: "ordering",
      entries: [
        { id: "trigger-one", label: "First trigger" },
        { id: "trigger-two", label: "Second trigger" },
      ],
    });
    const projection = projectFabInteraction(runtime, ACTOR);
    const entry = [...projection.commandByActionId].find(
      ([, command]) =>
        command.move === "set-automation-preferences" && command.payload.autoOrderTriggers === true,
    );
    expect(entry).toBeDefined();
    const action = projection.view.actions.find((action) => action.id === entry?.[0]);
    if (!action) throw new Error("Missing auto-order action");
    const submission = buildInteractionSubmission({ view: projection.view, action, values: {} });
    expect(commandForFabSubmission(runtime, ACTOR, submission)).toMatchObject({
      move: "set-automation-preferences",
      payload: { autoOrderTriggers: true },
    });
    expect(
      projectFabInteraction(runtime, OBSERVER).view.actions.every(
        (action) => action.intent === "concede",
      ),
    ).toBe(true);
  });

  it("preserves an ordered trigger's authoritative source identity", () => {
    const plunderThePoorRed = "6QdjhDLqHJ9DB8GHD6fmf";
    const runtime = runtimeWithDecision({
      ...base("ordering"),
      kind: "ordering",
      entries: [
        {
          id: "pending-trigger-1",
          label: "Plunder The Poor: DYN124-a2",
          source: {
            instanceId: "fab-card-1",
            canonicalId: plunderThePoorRed,
            ownerId: ACTOR,
          },
        },
      ],
    });

    const actor = projectFabInteraction(runtime, ACTOR).view;
    const input = actor.actions[0]?.inputs[0];
    if (input?.kind !== "ordering") throw new Error("Expected ordering input");

    expect(input.candidates[0]?.entity).toEqual({
      kind: "effect",
      instanceId: "pending-trigger-1",
      definitionId: plunderThePoorRed,
      ownerId: ACTOR,
    });
  });

  it("projects exact private deck candidate identity only to the acting player", () => {
    const runtime = runtimeWithDecision({
      ...base("entity-target"),
      kind: "entity-target",
      min: 1,
      max: 1,
      candidates: [],
    });
    const state = runtime.getState();
    const instanceId = state.containers.zonesByPlayerId[ACTOR]!.deck[0]!;
    const definitionId = state.objects[instanceId]!.canonicalId;
    state.decision = {
      ...base("entity-target"),
      kind: "entity-target",
      min: 1,
      max: 1,
      candidates: [{ instanceId, label: "Deck card" }],
    };

    const actor = projectFabInteraction(runtime, ACTOR).view;
    const observer = projectFabInteraction(runtime, OBSERVER).view;
    const input = actor.actions[0]!.inputs[0]!;
    if (input.kind !== "entity-selection") throw new Error("Expected entity selection");

    expect(input.candidates[0]!.entity).toEqual({
      kind: "card",
      instanceId,
      definitionId,
      ownerId: ACTOR,
      zoneId: `${ACTOR}:deck`,
    });
    expect(JSON.stringify(observer)).not.toContain(instanceId);
    expect(JSON.stringify(observer)).not.toContain(definitionId);
  });

  it("projects private candidates only to the actor and safe concession to observers", () => {
    const runtime = runtimeWithDecision({
      ...base("entity-target"),
      kind: "entity-target",
      min: 1,
      max: 1,
      candidates: [{ instanceId: "private-target", label: "Hidden target" }],
    });

    const actor = projectFabInteraction(runtime, ACTOR).view;
    const observer = projectFabInteraction(runtime, OBSERVER).view;

    expect(EngineInteractionView.safeParse(actor).success).toBe(true);
    expect(EngineInteractionView.safeParse(observer).success).toBe(true);
    expect(actor.status).toBe("choosing");
    expect(actor.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      candidates: [{ entity: { instanceId: "private-target" } }],
    });
    expect(observer.status).toBe("waiting");
    expect(observer.actions.map((action) => action.intent)).toEqual(["concede"]);
    expect(observer.resolution).toBeUndefined();
    expect(JSON.stringify(observer)).not.toContain("private-target");
    expect(JSON.stringify(observer)).not.toContain("Hidden target");
    expect(JSON.stringify(observer)).not.toContain("Resolve entity-target");
  });

  it("projects an up-to-one entity decision as optional", () => {
    const runtime = runtimeWithDecision({
      ...base("entity-target"),
      kind: "entity-target",
      min: 0,
      max: 1,
      candidates: [{ instanceId: "hand-card", label: "Hand card" }],
    });

    const actor = projectFabInteraction(runtime, ACTOR).view;

    expect(actor.resolution?.currentStep.requirement).toMatchObject({
      kind: "entity-selection",
      required: false,
      min: 0,
      max: 1,
    });
    expect(actor.actions[0]?.inputs[0]).toMatchObject({
      kind: "entity-selection",
      required: false,
      min: 0,
      max: 1,
    });
  });

  it("projects a standalone FAB optional-effect decision as optional", () => {
    const tunicCanonicalId = "RP6pJj9WtwbTT79qdHPkz";
    const runtime = runtimeWithDecision({
      ...base("boolean"),
      kind: "boolean",
      label: "Use the optional effect of Fyendal's Spring Tunic?",
      acceptLabel: "Use effect",
      declineLabel: "Decline",
      continuation: {
        kind: "optional-effect",
        processId: "process-1",
        effectPath: [0],
      },
      source: {
        instanceId: "tunic-instance",
        canonicalId: tunicCanonicalId,
        ownerId: ACTOR,
      },
    });

    const actor = projectFabInteraction(runtime, ACTOR).view;

    expect(actor.resolution?.currentStep.requirement).toMatchObject({
      kind: "boolean",
      required: false,
    });
    expect(actor.actions[0]?.inputs[0]).toMatchObject({
      kind: "boolean",
      required: false,
      trueText: { key: "Use effect" },
      falseText: { key: "Decline" },
    });
    expect(actor.resolution?.currentEffect.source).toEqual({
      kind: "card",
      instanceId: "tunic-instance",
      definitionId: tunicCanonicalId,
      ownerId: ACTOR,
    });
  });

  it("projects end-turn pitch ordering as cards for board-native presentation", () => {
    const runtime = runtimeWithDecision({
      ...base("ordering"),
      kind: "ordering",
      entries: [
        { id: "pitch-card-1", label: "Disable" },
        { id: "pitch-card-2", label: "Disable" },
      ],
      continuation: {
        kind: "turn-pitch-order",
        processId: "process-1",
        playerId: ACTOR,
      },
    });

    expect(projectFabInteraction(runtime, ACTOR).view.actions[0]?.inputs[0]).toMatchObject({
      kind: "ordering",
      entityKind: "card",
      candidates: [
        { entity: { kind: "card", instanceId: "pitch-card-1" } },
        { entity: { kind: "card", instanceId: "pitch-card-2" } },
      ],
    });
  });

  it.each([
    [
      { ...base("boolean"), kind: "boolean", acceptLabel: "Yes", declineLabel: "No" },
      "boolean",
      true,
    ],
    [
      { ...base("option"), kind: "option", min: 1, max: 1, options: [{ id: "a", label: "A" }] },
      "option-selection",
      ["a"],
    ],
    [
      {
        ...base("entity-target"),
        kind: "entity-target",
        min: 1,
        max: 1,
        candidates: [{ instanceId: "card-1", label: "Card" }],
      },
      "entity-selection",
      ["card-1"],
    ],
    [
      {
        ...base("ordering"),
        kind: "ordering",
        entries: [
          { id: "continuous-atom-1", label: "First continuous effect" },
          { id: "continuous-atom-2", label: "Second continuous effect" },
        ],
        continuation: {
          kind: "continuous-order",
          processId: "process-1",
          orderingId: "continuous-order:process-1:1:7:1:game",
          timestamp: { sequence: 1, simultaneousGroupId: "group-1" },
          subject: { kind: "game" },
          stage: 7,
          substage: 1,
          atomIds: ["continuous-atom-1", "continuous-atom-2"],
          playerId: ACTOR,
          journalCursor: null,
        },
      },
      "ordering",
      ["continuous-atom-2", "continuous-atom-1"],
    ],
    [
      {
        ...base("numeric"),
        kind: "numeric",
        min: 0,
        max: 3,
        requiresExplicitAnswer: true,
      },
      "number",
      2,
    ],
    [
      {
        ...base("partition"),
        kind: "partition",
        entries: [
          {
            id: "card-1",
            label: "Card",
            source: { instanceId: "card-1", canonicalId: "card-def-1", ownerId: ACTOR },
          },
        ],
        groups: [
          {
            id: "top",
            label: "Top of deck",
            ordered: true,
            orderDirection: "bottom-first",
          },
        ],
        source: {
          instanceId: "source-card-1",
          canonicalId: "source-card",
          ownerId: ACTOR,
        },
      },
      "entity-partition",
      { top: ["card-1"] },
    ],
    [
      {
        ...base("payment"),
        kind: "payment",
        amount: 1,
        oneAtATime: true,
        cancellable: true,
        candidates: [{ instanceId: "blue-1", value: 3 }],
      },
      "entity-selection",
      ["blue-1"],
    ],
    [
      {
        ...base("effect-resolution"),
        kind: "effect-resolution",
        options: [{ id: "continue", label: "Continue" }],
      },
      "option-selection",
      ["continue"],
    ],
  ] as const)("maps %s through the unchanged %s input", (decision, inputKind, answerValue) => {
    const runtime = runtimeWithDecision(decision);
    const projection = projectFabInteraction(runtime, ACTOR);
    const action = projection.view.actions[0]!;
    expect(action.inputs[0]?.kind).toBe(inputKind);
    if (decision.kind === "numeric" && decision.requiresExplicitAnswer) {
      expect(action.inputs[0]).toMatchObject({ kind: "number", required: true, min: 0, max: 3 });
      expect(projection.view.resolution?.currentStep.requirement).toMatchObject({
        kind: "number",
        required: true,
        min: 0,
        max: 3,
      });
    }
    if (decision.kind === "partition") {
      expect(action.inputs[0]).toMatchObject({
        kind: "entity-partition",
        entityKind: "card",
        candidates: [
          {
            entity: {
              kind: "card",
              instanceId: "card-1",
              definitionId: "card-def-1",
              ownerId: ACTOR,
            },
          },
        ],
        routes: [{ id: "top", ordered: true, orderDirection: "bottom-first" }],
      });
      expect(projection.view.resolution?.currentEffect.source).toEqual({
        kind: "card",
        instanceId: "source-card-1",
        definitionId: "source-card",
        ownerId: ACTOR,
      });
    }
    expect(EngineInteractionView.safeParse(projection.view).success).toBe(true);

    const submission = buildInteractionSubmission({
      view: projection.view,
      action,
      values: { answer: answerValue },
    });
    const command = commandForFabSubmission(runtime, ACTOR, submission);
    expect(command).toMatchObject({
      move: "answer-decision",
      payload: { decisionId: "decision-1", stateVersion: 0 },
    });

    const observer = projectFabInteraction(runtime, OBSERVER).view;
    expect(EngineInteractionView.safeParse(observer).success).toBe(true);
    expect(observer.status).toBe("waiting");
    expect(observer.actions.map((action) => action.intent)).toEqual(["concede"]);
    expect(JSON.stringify(observer)).not.toContain(decision.label);
  });

  it("projects cancellable payment as a typed undo command only to the actor", () => {
    const runtime = runtimeWithDecision({
      ...base("payment"),
      kind: "payment",
      amount: 1,
      oneAtATime: true,
      cancellable: true,
      candidates: [{ instanceId: "blue-1", value: 3 }],
    });
    const actor = projectFabInteraction(runtime, ACTOR).view;
    const observer = projectFabInteraction(runtime, OBSERVER).view;
    const action = actor.actions.find((candidate) => candidate.intent === "undo")!;
    const submission = buildInteractionSubmission({ view: actor, action, values: {} });

    expect(commandForFabSubmission(runtime, ACTOR, submission)).toMatchObject({
      move: "answer-decision",
      payload: { answer: { kind: "cancel" } },
    });
    expect(observer.actions.map((candidate) => candidate.intent)).toEqual(["concede"]);
  });

  it("lets the waiting player concede through the authoritative interaction while a decision is pending", () => {
    const runtime = runtimeWithDecision({
      ...base("entity-target"),
      kind: "entity-target",
      min: 1,
      max: 1,
      candidates: [{ instanceId: "private-target", label: "Hidden target" }],
    });
    const engine = new FleshAndBloodServerEngine(runtime);
    const observer = engine.getInteractionView(OBSERVER);
    const concedeAction = observer.actions.find((action) => action.intent === "concede");

    expect(concedeAction).toBeDefined();
    const submission = buildInteractionSubmission({
      view: observer,
      action: concedeAction!,
      values: {},
    });
    const result = engine.submitInteraction(OBSERVER, submission, {
      gameId: "fab-live-concession",
      sourceAuthority: "server",
    });

    expect(result.success).toBe(true);
    expect(engine.hasGameEnded()).toBe(true);
    expect(engine.getGameEndResult()).toEqual({
      winnerId: ACTOR,
      // Canonical machine token since the engine's concession change; the
      // player-facing wording is derived at the log/presentation boundary.
      reason: "concede",
    });
    expect(engine.getInteractionView(OBSERVER).actions).toEqual([]);
  });
});
