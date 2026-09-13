import { describe, expect, it } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import {
  chooseGrandArchiveAutomatedAction,
  createGrandArchiveCatalogSmokeFixture,
} from "@tcg/grand-archive-engine/automation";
import {
  GrandArchiveMatchRuntime,
  projectGrandArchiveViewerState,
} from "@tcg/grand-archive-engine/simulator";
import { grandArchiveDecisionId, grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import {
  GrandArchiveServerEngine,
  intersectGrandArchiveReplayProjections,
} from "./server-engine.ts";
import {
  projectGrandArchiveSimulator,
  projectGrandArchiveViewerSimulator,
  referencedEntitiesForMessage,
} from "./projection.ts";
import { createGrandArchiveServerEngine } from "./setup.ts";
import {
  grandArchiveCards,
  savageSlash,
  spiritOfWind,
  spiritOfFire,
  libraryWitch,
} from "@tcg/grand-archive-cards";
import { grandArchiveServerAdapter } from "./adapter.ts";
import {
  grandArchiveCommandIncarnations,
  commandForGrandArchiveSubmission,
  projectGrandArchiveInteraction,
} from "./interaction.ts";
import {
  fingerprintGrandArchiveValue,
  inspectGrandArchiveReplay,
  replayGrandArchiveReplay,
  restoreGrandArchiveReplayJournal,
} from "./replay.ts";

function engine() {
  const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
  return new GrandArchiveServerEngine(program, new GrandArchiveMatchRuntime(program, initialState));
}

const context = { gameId: "ga-test", sourceAuthority: "server" as const };

function structuredDecisionCard(
  id: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        ...(type === "CHAMPION" ? { lineageName: id } : {}),
        cost: { kind: type === "CHAMPION" ? "memory" : "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

function realStructuredDecisionFixture() {
  const champion = structuredDecisionCard("adapter-choice-champion", "CHAMPION", [
    {
      id: "adapterChoiceChampion-a1",
      kind: "activated",
      activation: "ability",
      text: "[REST]: Choose a champion.",
      cost: { kind: "rest", subject: { kind: "source" } },
      targets: [
        {
          id: "announced-champion",
          kind: "target",
          declared: "announcement",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          candidates: {
            kind: "object",
            zones: ["field"],
            player: "each-player",
            filter: { kind: "type", oneOf: ["CHAMPION"] },
          },
        },
      ],
      effect: {
        kind: "choose",
        selection: {
          id: "chosen-champion",
          kind: "choice",
          declared: "resolution",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          candidates: {
            kind: "object",
            zones: ["field"],
            player: "each-opponent",
            filter: { kind: "type", oneOf: ["CHAMPION"] },
          },
        },
        effect: { kind: "no-op" },
      },
    },
    {
      id: "adapterChoiceChampion-a2",
      kind: "triggered",
      text: "First adapter trigger",
      trigger: {
        kind: "event",
        event: { name: "object-fostered", subject: { kind: "source" } },
      },
      effect: { kind: "no-op" },
    },
    {
      id: "adapterChoiceChampion-a3",
      kind: "triggered",
      text: "Second adapter trigger",
      trigger: {
        kind: "event",
        event: { name: "object-fostered", subject: { kind: "source" } },
      },
      effect: { kind: "no-op" },
    },
  ]);
  const filler = structuredDecisionCard("adapter-choice-filler", "ACTION");
  const player = (id: "p1" | "p2") => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 10 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const fixture = GrandArchiveTestEngine.start(
    [champion, filler],
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 20260820,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const activationView = projectGrandArchiveInteraction(
    new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    "p1",
  ).view;
  const activation = activationView.actions.find((action) => action.intent === "activate")!;
  expect(activation.inputs[0]).toMatchObject({
    kind: "entity-selection",
    min: 1,
    max: 1,
  });
  const opposingChampionId = fixture.state.zones.p2.field[0]!;
  const declarationInput = activation.inputs[0];
  if (declarationInput?.kind !== "entity-selection") {
    throw new Error("Expected the activation target to be a spatial entity input");
  }
  expect(declarationInput.candidates.map((candidate) => candidate.entity.instanceId)).toContain(
    opposingChampionId,
  );
  const projectedCommand = commandForGrandArchiveSubmission(
    new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    "p1",
    buildInteractionSubmission({
      view: activationView,
      action: activation,
      values: { "target:announced-champion": [opposingChampionId] },
    }),
  );
  expect(
    projectedCommand?.command.move === "activate-ability"
      ? projectedCommand.command.targets?.["announced-champion"]?.[0]
      : undefined,
  ).toBe(opposingChampionId);
  fixture
    .player("p1")
    .executeLegal(
      (candidate) =>
        candidate.command.move === "activate-ability" &&
        candidate.command.targets?.["announced-champion"]?.[0] === opposingChampionId,
      "test choice ability",
    );
  for (let passCount = 0; passCount < 4 && !fixture.state.decision; passCount += 1) {
    const wait = fixture.waitState();
    if (wait.kind !== "opportunity") throw new Error("Expected an Opportunity before resolution");
    fixture.player(wait.playerId).pass();
  }
  expect(fixture.state.decision?.kind).toBe("resolve-effect-choice");
  return fixture;
}

describe("Grand Archive simulator adapter", () => {
  it("preserves memory facing independently of permission to inspect its identity", () => {
    const champion = structuredDecisionCard("memory-champion", "CHAMPION");
    const card = structuredDecisionCard("memory-card", "ACTION");
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: { id: "p1", champion, zones: { memory: [card] } },
      playerTwo: { id: "p2", champion },
    });
    const id = fixture.state.zones.p1.memory[0]!;
    for (const facing of ["face-down", "face-up"] as const) {
      const state = {
        ...fixture.state,
        objects: { ...fixture.state.objects, [id]: { ...fixture.state.objects[id]!, facing } },
      };
      const own = projectGrandArchiveSimulator(fixture.program, state, grandArchivePlayerId("p1"));
      expect(own.entities.find((entity) => entity.id === id)).toMatchObject({
        face: "public",
        dataAttributes: { "data-facing": facing },
      });
      const opponent = projectGrandArchiveSimulator(
        fixture.program,
        state,
        grandArchivePlayerId("p2"),
      );
      expect(opponent.entities.some((entity) => entity.id === id)).toBe(facing === "face-up");
    }
  });

  it("derives pregame controls from legal commands and preserves version/incarnation", () => {
    const server = engine();
    const view = server.getInteractionView("p1");
    expect(server.getInteractionView("p1")).toBe(view);
    expect(server.getInteractionView("p2")).not.toBe(view);
    expect(view.actions.length).toBeGreaterThan(0);
    expect(
      view.actions.every((action) => action.requestId.includes(`:${view.stateVersion}:`)),
    ).toBe(true);
    expect(view.actions.some((action) => action.text.key.includes("pre-game"))).toBe(true);
    const projection = projectGrandArchiveSimulator(
      server.program,
      server.runtime.state,
      grandArchivePlayerId("p1"),
    );
    expect(
      projection.entities.every(
        (entity) => typeof entity.dataAttributes?.["data-incarnation"] === "number",
      ),
    ).toBe(true);
    const completed = server.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action: view.actions.find((action) => action.text.key.includes("pre-game"))!,
      }),
      context,
    );
    expect(completed.success).toBe(true);
    const nextView = server.getInteractionView("p1");
    expect(nextView).not.toBe(view);
    expect(nextView.stateVersion).toBeGreaterThan(view.stateVersion);
    const secondPlayerResources = server.getViewerResources({ role: "player", actorId: "p2" }) as {
      interactionCommandNamesByActionId: Record<string, string>;
    };
    const secondPlayerProjection = projectGrandArchiveViewerSimulator(
      server.getViewerState({ role: "player", actorId: "p2" }) as ReturnType<
        typeof projectGrandArchiveViewerState
      >,
      {
        interactionView: server.getInteractionView("p2"),
        interactionCommandNamesByActionId: secondPlayerResources.interactionCommandNamesByActionId,
      },
    );
    expect(secondPlayerProjection.waitState).toEqual({ kind: "pregame-action", playerId: "p2" });
    expect(secondPlayerProjection.interactions).toContainEqual(
      expect.objectContaining({
        movePreview: expect.objectContaining({ command: "complete-pregame-actions" }),
      }),
    );
  });

  it("represents every subset in a large combinatorial decision as structured input", () => {
    const base = engine();
    const candidateIds = Object.values(base.runtime.state.objects)
      .slice(0, 9)
      .map((object) => object.id);
    expect(candidateIds).toHaveLength(9);
    const state = {
      ...base.runtime.state,
      decision: {
        id: grandArchiveDecisionId("large-subset-choice"),
        kind: "choose-retaliators" as const,
        playerId: grandArchivePlayerId("p1"),
        candidates: candidateIds,
        selectedRetaliatorIds: [],
        remainingControllerIds: [],
        stateVersion: base.runtime.state.stateVersion,
      },
    };
    const runtime = new GrandArchiveMatchRuntime(base.program, state);
    const view = projectGrandArchiveInteraction(runtime, "p1").view;
    const action = view.actions.find((candidate) => candidate.id.includes("large-subset-choice"))!;
    expect(action.inputs[0]).toMatchObject({
      kind: "entity-selection",
      min: 0,
      max: 9,
    });
    expect("candidates" in action.inputs[0]! ? action.inputs[0].candidates : []).toHaveLength(9);
    const simulatorProjection = projectGrandArchiveSimulator(
      base.program,
      state,
      grandArchivePlayerId("p1"),
    );
    expect(
      simulatorProjection.interactions.find((candidate) =>
        candidate.id.includes("large-subset-choice"),
      )?.input,
    ).toMatchObject({ kind: "multi-target", min: 0, max: 9, candidateEntityIds: candidateIds });

    const submission = buildInteractionSubmission({
      view,
      action,
      values: { [action.inputs[0]!.id]: candidateIds },
    });
    const command = commandForGrandArchiveSubmission(runtime, "p1", submission);
    expect(command?.command).toMatchObject({ move: "answer-decision", answer: candidateIds });
  });

  it("submits a structured decision through the server boundary", () => {
    const fixture = realStructuredDecisionFixture();
    const { program, state } = fixture;
    const decision = state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected the catalog match to suspend on a resolution choice");
    }
    const actorId = decision.playerId;

    const deckSearchState = {
      ...state,
      decision: {
        ...decision,
        selection: {
          ...decision.selection,
          count: { kind: "exactly" as const, amount: 1 },
          candidates: {
            kind: "card" as const,
            zones: ["main-deck" as const],
            relationship: "zone-of" as const,
            player: "controller" as const,
          },
        },
      },
    };
    const chooserProjection = projectGrandArchiveSimulator(program, deckSearchState, actorId);
    const deckSearch = chooserProjection.interactions.find(
      (candidate) => candidate.input.candidateEntityIds.length > 0,
    )!;
    expect(deckSearch.input.candidateEntityIds.length).toBeGreaterThan(0);
    for (const candidateId of deckSearch.input.candidateEntityIds) {
      expect(chooserProjection.entities.find((entity) => entity.id === candidateId)).toMatchObject({
        id: candidateId,
        face: "public",
        dataAttributes: { "data-authorized-candidate": true },
      });
    }
    const opponentId = state.turnOrder.find((playerId) => playerId !== actorId)!;
    const opponentProjection = projectGrandArchiveSimulator(program, deckSearchState, opponentId);
    expect(
      opponentProjection.entities.some((entity) =>
        deckSearch.input.candidateEntityIds.includes(entity.id),
      ),
    ).toBe(false);

    const liveServer = new GrandArchiveServerEngine(
      program,
      new GrandArchiveMatchRuntime(program, deckSearchState),
    );
    const liveView = liveServer.getInteractionView(actorId);
    const liveDecision = liveView.actions.find((candidate) => candidate.inputs.length > 0)!;
    const liveCandidates =
      liveDecision.inputs[0]?.kind === "entity-selection" ? liveDecision.inputs[0].candidates : [];
    expect(liveCandidates.map((candidate) => candidate.text?.key)).toContainEqual(
      expect.stringContaining("adapter-choice-filler"),
    );
    const searchedDefinitionId =
      deckSearchState.objects[deckSearch.input.candidateEntityIds[0]!]!.definitionId;
    const liveResources = liveServer.getViewerResources({ role: "player", actorId }) as {
      cardsById: Record<string, unknown>;
      authorizedCardDefinitionIds: Record<string, string>;
      authorizedCardOwnerIds: Record<string, string>;
      interactionCommandNamesByActionId: Record<string, string>;
    };
    expect(Object.keys(liveResources.cardsById)).toContain(searchedDefinitionId);
    expect(liveResources.authorizedCardDefinitionIds).toMatchObject({
      [deckSearch.input.candidateEntityIds[0]!]: searchedDefinitionId,
    });
    expect(liveResources.authorizedCardOwnerIds).toMatchObject({
      [deckSearch.input.candidateEntityIds[0]!]: actorId,
    });
    const liveProjection = projectGrandArchiveViewerSimulator(
      projectGrandArchiveViewerState(program, deckSearchState, actorId),
      {
        interactionView: liveView,
        authorizedCardDefinitionIds: liveResources.authorizedCardDefinitionIds,
        authorizedCardOwnerIds: {
          ...liveResources.authorizedCardOwnerIds,
          [deckSearch.input.candidateEntityIds[0]!]: opponentId,
        },
        authorizedCardNames: {
          [deckSearch.input.candidateEntityIds[0]!]: "Copied card name",
        },
        interactionCommandNamesByActionId: liveResources.interactionCommandNamesByActionId,
      },
    );
    expect(
      liveProjection.entities.find(
        (entity) => entity.id === deckSearch.input.candidateEntityIds[0],
      ),
    ).toMatchObject({
      title: "Copied card name",
      ownerId: opponentId,
    });
    expect(
      liveServer
        .getInteractionView(opponentId)
        .actions.some((candidate) => candidate.inputs.length > 0),
    ).toBe(false);

    const concealedId = deckSearch.input.candidateEntityIds[0]!;
    const concealedProjection = projectGrandArchiveSimulator(
      program,
      {
        ...state,
        objects: {
          ...state.objects,
          [concealedId]: {
            ...state.objects[concealedId]!,
            damage: 3,
            counters: { buff: 2 },
            zone: "banishment",
            facing: "face-down",
          },
        },
        decision: {
          id: grandArchiveDecisionId("concealed-candidate"),
          kind: "choose-retaliators",
          playerId: actorId,
          candidates: [concealedId],
          selectedRetaliatorIds: [],
          remainingControllerIds: [],
          stateVersion: state.stateVersion,
        },
      },
      actorId,
    );
    expect(concealedProjection.entities.find((entity) => entity.id === concealedId)).toMatchObject({
      title: "Face-down card",
      subtitle: "Private information",
      face: "hidden",
      states: ["hidden"],
      backImageUrl: "https://cdn.tcg.online/public/grand-archive/simulator/card-back.webp",
      imageAspectRatio: 5 / 7,
      stats: [],
      decorations: [],
      traits: [],
      dataAttributes: { "data-authorized-candidate": true },
    });
    expect(
      concealedProjection.entities.find((entity) => entity.id === concealedId),
    ).not.toHaveProperty("imageUrl");
    expect(
      concealedProjection.entities.find((entity) => entity.id === concealedId),
    ).not.toHaveProperty("hiddenBackLayout", "square");

    const optionRuntime = new GrandArchiveMatchRuntime(program, {
      ...state,
      decision: {
        ...decision,
        selection: {
          ...decision.selection,
          candidates: { kind: "option", options: ["first", "second"] },
        },
      },
    });
    const optionView = projectGrandArchiveInteraction(optionRuntime, actorId).view;
    const optionAction = optionView.actions.find((candidate) => candidate.inputs.length > 0)!;
    expect(optionAction.inputs[0]).toMatchObject({
      kind: "option-selection",
      min: 1,
      max: 1,
    });
    const optionSubmission = buildInteractionSubmission({
      view: optionView,
      action: optionAction,
      values: { [optionAction.inputs[0]!.id]: ["first"] },
    });
    expect(
      commandForGrandArchiveSubmission(optionRuntime, actorId, optionSubmission)?.command,
    ).toMatchObject({
      move: "answer-decision",
      answer: "first",
    });

    const unsatisfiedServer = new GrandArchiveServerEngine(
      program,
      new GrandArchiveMatchRuntime(program, {
        ...state,
        decision: {
          ...decision,
          selection: {
            ...decision.selection,
            count: { kind: "exactly", amount: 3 },
          },
        },
      }),
    );
    const unsatisfiedView = unsatisfiedServer.getInteractionView(actorId);
    expect(unsatisfiedView.actions.every((candidate) => candidate.inputs.length === 0)).toBe(true);
    const concede = unsatisfiedView.actions.find((candidate) => candidate.intent === "concede")!;
    expect(
      unsatisfiedServer.submitInteraction(
        actorId,
        buildInteractionSubmission({ view: unsatisfiedView, action: concede }),
        context,
      ).success,
    ).toBe(true);

    const server = new GrandArchiveServerEngine(
      program,
      new GrandArchiveMatchRuntime(program, state),
    );
    const view = server.getInteractionView(actorId);
    const action = view.actions.find((candidate) => candidate.inputs.length > 0)!;
    const input = action.inputs[0]!;
    expect(input).toMatchObject({ kind: "entity-selection", min: 1, max: 1 });
    const answer =
      "candidates" in input ? input.candidates.map(({ entity }) => entity.instanceId) : [];
    const submission = buildInteractionSubmission({
      view,
      action,
      values: { [input.id]: answer },
    });

    const accepted = server.submitInteraction(actorId, submission, context);
    expect(accepted.success, JSON.stringify(accepted)).toBe(true);
    expect(server.runtime.state.decision).toBeNull();
    expect(server.getStateID()).toBeGreaterThan(state.stateVersion);
  });

  it("represents all permutations of a six-object ordering decision without enumeration", () => {
    const base = engine();
    const candidateIds = Object.values(base.runtime.state.objects)
      .slice(0, 6)
      .map((object) => object.id);
    const state = {
      ...base.runtime.state,
      decision: {
        id: grandArchiveDecisionId("large-ordering-choice"),
        kind: "order-retaliation-damage" as const,
        playerId: grandArchivePlayerId("p1"),
        retaliatorIds: candidateIds,
        stateVersion: base.runtime.state.stateVersion,
      },
    };
    const runtime = new GrandArchiveMatchRuntime(base.program, state);
    const view = projectGrandArchiveInteraction(runtime, "p1").view;
    const action = view.actions.find((candidate) =>
      candidate.id.includes("large-ordering-choice"),
    )!;
    expect(action.inputs[0]).toMatchObject({ kind: "ordering", min: 6, max: 6 });

    const answer = [...candidateIds].reverse();
    const submission = buildInteractionSubmission({
      view,
      action,
      values: { [action.inputs[0]!.id]: answer },
    });
    const command = commandForGrandArchiveSubmission(runtime, "p1", submission);
    expect(command?.command).toMatchObject({ move: "answer-decision", answer });
  });

  it("labels simultaneous triggered abilities instead of exposing pending-trigger ids", () => {
    const fixture = realStructuredDecisionFixture();
    const sourceId = fixture.state.zones.p1.field[0]!;
    const source = fixture.state.objects[sourceId]!;
    const definition = fixture.program.cardsById[source.definitionId]!;
    const face =
      definition.layout.kind === "single-faced"
        ? definition.layout.face
        : definition.layout.defaultFace;
    const abilities = face.abilities.filter((ability) => ability.kind === "triggered");
    expect(abilities).toHaveLength(2);
    const pendingTriggers = abilities.map((ability, index) => ({
      id: `pending-trigger-${index + 1}`,
      batchId: "adapter-trigger-batch",
      orderingConfirmed: false,
      controllerId: grandArchivePlayerId("p1"),
      ability,
      selectedModeIds: [],
      bindings: {},
      variables: {},
      activationPayment: [],
      createdAtVersion: fixture.state.stateVersion,
      sourceId,
      sourceIncarnation: source.incarnation,
    }));
    const state = {
      ...fixture.state,
      pendingTriggers,
      decision: {
        id: grandArchiveDecisionId("adapter-trigger-order"),
        kind: "order-triggered-abilities" as const,
        playerId: grandArchivePlayerId("p1"),
        pendingTriggerIds: pendingTriggers.map((trigger) => trigger.id),
        stateVersion: fixture.state.stateVersion,
      },
    };
    const projection = projectGrandArchiveSimulator(
      fixture.program,
      state,
      state.decision.playerId,
    );
    const candidateIds = projection.interactions.find((interaction) =>
      interaction.id.includes("adapter-trigger-order"),
    )!.input.candidateEntityIds;
    expect(candidateIds).toEqual(["pending-trigger-1", "pending-trigger-2"]);
    expect(
      candidateIds.map((id) => projection.entities.find((entity) => entity.id === id)?.title),
    ).toEqual(["First adapter trigger", "Second adapter trigger"]);
  });

  it("places the viewing player at the bottom seat", () => {
    const server = engine();
    const projection = projectGrandArchiveSimulator(
      server.program,
      server.runtime.state,
      grandArchivePlayerId("p2"),
    );
    expect(projection.table.seats.find((seat) => seat.id === "p2")?.perspective).toBe("bottom");
    expect(projection.table.seats.find((seat) => seat.id === "p1")?.perspective).toBe("top");
  });

  it("matches complete card names without treating substrings as references", () => {
    const entities = [
      {
        id: "short",
        title: "Spirit",
        kind: "card",
        ownerId: "p1",
        face: "public",
        states: [],
        stats: [],
        traits: [],
      },
      {
        id: "long",
        title: "Lost Spirit",
        kind: "card",
        ownerId: "p1",
        face: "public",
        states: [],
        stats: [],
        traits: [],
      },
    ] as const;

    expect(
      referencedEntitiesForMessage(entities, "Lost Spirit attacks.").map(({ id }) => id),
    ).toEqual(["long"]);
    expect(referencedEntitiesForMessage(entities, "Spiritual power rises.")).toEqual([]);
  });

  it("does not expose opponent hidden card identities in payloads, resources, or logs", () => {
    const server = engine();
    const raw = server.runtime.state;
    const opponentHiddenIds = raw.zones.p2.hand.concat(raw.zones.p2["main-deck"]);
    const payload = JSON.stringify({
      state: server.getViewerState({ role: "player", actorId: "p1" }),
      resources: server.getViewerResources({ role: "player", actorId: "p1" }),
      interaction: server.getInteractionView("p1"),
      projection: projectGrandArchiveSimulator(server.program, raw, grandArchivePlayerId("p1")),
    });
    for (const objectId of opponentHiddenIds) {
      expect(payload).not.toContain(raw.objects[objectId]!.definitionId);
    }
  });

  it("includes the active face definition for visible transformed objects", () => {
    // Resource projection needs only the visible object and its two definitions.
    const champion = structuredDecisionCard("adapter-face-champion", "CHAMPION");
    const original = structuredDecisionCard("adapter-face-original", "ITEM");
    const active = structuredDecisionCard("adapter-face-active", "ITEM");
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: { id: "p1", champion, zones: { field: [original] } },
      playerTwo: { id: "p2", champion },
      definitions: [active],
    });
    const server = new GrandArchiveServerEngine(
      fixture.program,
      new GrandArchiveMatchRuntime(fixture.program, fixture.state),
    );
    const p1 = grandArchivePlayerId("p1");
    const objectId = server.runtime.state.zones[p1].field.find(
      (id) => server.runtime.state.objects[id]?.definitionId === original.canonicalId,
    )!;
    const object = server.runtime.state.objects[objectId]!;
    const activeDefinitionId = active.canonicalId;
    expect(server.getViewerResources({ role: "player", actorId: "p1" })).not.toHaveProperty([
      "cardsById",
      activeDefinitionId,
    ]);
    const transformed = new GrandArchiveServerEngine(
      server.program,
      new GrandArchiveMatchRuntime(server.program, {
        ...server.runtime.state,
        objects: {
          ...server.runtime.state.objects,
          [objectId]: { ...object, activeDefinitionId },
        },
      }),
    );
    const resources = transformed.getViewerResources({ role: "player", actorId: "p1" }) as {
      cardsById: Record<string, unknown>;
    };
    expect(resources.cardsById[activeDefinitionId]).toBe(
      server.program.cardsById[activeDefinitionId],
    );
  });

  it("leaves the exact displayed state unchanged for stale and rejected commands", () => {
    const server = engine();
    const view = server.getInteractionView("p1");
    const action = view.actions[0]!;
    const stale = buildInteractionSubmission({ view, action });
    const before = JSON.stringify(server.getViewerState({ role: "player", actorId: "p1" }));
    const staleResult = server.submitInteraction(
      "p1",
      { ...stale, stateVersion: stale.stateVersion + 1 },
      context,
    );
    expect(staleResult.success).toBe(false);
    expect(JSON.stringify(server.getViewerState({ role: "player", actorId: "p1" }))).toBe(before);
    const rejected = server.dispatch(
      "pass",
      "p2",
      { expectedStateVersion: server.getStateID() },
      context,
    );
    expect(rejected.success).toBe(false);
    expect(JSON.stringify(server.getViewerState({ role: "player", actorId: "p1" }))).toBe(before);
  });

  it("drives a real command through the shared interaction protocol", () => {
    const server = engine();
    const view = server.getInteractionView("p1");
    const action = view.actions.find((candidate) => candidate.text.key.includes("pre-game"));
    expect(action).toBeDefined();
    const result = server.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action: action! }),
      context,
    );
    expect(result.success).toBe(true);
    expect(server.getStateID()).toBeGreaterThan(view.stateVersion);
  });

  it("uses the engine-owned discriminated setup for Draft and Pantheon", () => {
    const face = (card: (typeof grandArchiveCards)[number]) =>
      card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
    const champion = grandArchiveCards.find(
      (card) => face(card).typeLine.types.includes("CHAMPION") && face(card).stats.level === 0,
    )!;
    const main = grandArchiveCards.find(
      (card) =>
        card.definitionKind === "card" &&
        !face(card).typeLine.types.includes("CHAMPION") &&
        !face(card).typeLine.supertypes.includes("REGALIA"),
    )!;
    const lesser = grandArchiveCards.find((card) =>
      face(card).typeLine.types.includes("LESSER BOON"),
    )!;
    const greater = grandArchiveCards.find((card) =>
      face(card).typeLine.types.includes("GREATER BOON"),
    )!;
    const barrier = grandArchiveCards.find(
      (card) =>
        card.definitionKind === "token-representation" && face(card).name === "Pantheon Barrier",
    )!;
    const base = (id: string) => ({
      id,
      name: id,
      mainDeck: [{ definitionId: main.canonicalId, count: 1 }],
      materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const draft = createGrandArchiveServerEngine(
      {
        mode: "draft",
        players: [
          { ...base("p1"), sideboard: [] },
          { ...base("p2"), sideboard: [] },
        ],
        firstPlayerId: "p1",
        randomSeed: 1,
      },
      { validateDeckConstruction: false },
    );
    expect(draft.runtime.state.mode).toBe("draft");
    const pantheonSetup = (id: string) => ({
      ...base(id),
      pantheon: {
        lesserBoonDefinitionId: lesser.canonicalId,
        greaterBoonDefinitionId: greater.canonicalId,
        barrierDefinitionId: barrier.canonicalId,
      },
    });
    const pantheon = createGrandArchiveServerEngine(
      {
        mode: "pantheon",
        players: [pantheonSetup("p1"), pantheonSetup("p2"), pantheonSetup("p3")],
        firstPlayerId: "p1",
        randomSeed: 2,
      },
      { validateDeckConstruction: false },
    );
    expect(pantheon.runtime.state.mode).toBe("pantheon");
    expect(pantheon.runtime.state.turnOrder).toHaveLength(3);
  });

  it("creates, snapshots, and restores a Standard server engine through GameAdapter", async () => {
    const { initialState } = createGrandArchiveCatalogSmokeFixture(99);
    const deckFor = (playerId: "p1" | "p2") => [
      ...initialState.players[playerId]!.startingDeckDefinitionIds["main-deck"].map((cardId) => ({
        cardId,
        qty: 1,
        sectionId: "main",
      })),
      ...initialState.players[playerId]!.startingDeckDefinitionIds["material-deck"].map(
        (cardId) => ({ cardId, qty: 1, sectionId: "material" }),
      ),
    ];
    const cardsMaps = grandArchiveServerAdapter.buildCardInstances([
      { owner: "p1", deck: deckFor("p1") },
      { owner: "p2", deck: deckFor("p2") },
    ]);
    const created = await grandArchiveServerAdapter.createServerEngine!({
      gameSlug: "grand-archive",
      seed: "adapter-lifecycle",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
      timeControl: { mode: "none" },
    });
    if (!(created instanceof GrandArchiveServerEngine)) {
      throw new Error("Expected the Grand Archive server engine");
    }
    for (let playerCount = 0; playerCount < 2; playerCount += 1) {
      const playerId = created.getActivePlayerId()!;
      const pregameView = created.getInteractionView(playerId);
      const pregameAction = pregameView.actions.find((action) =>
        action.text.key.includes("pre-game"),
      )!;
      const completed = created.submitInteraction(
        playerId,
        buildInteractionSubmission({ view: pregameView, action: pregameAction }),
        context,
      );
      expect(completed.success).toBe(true);
    }
    const snapshot = grandArchiveServerAdapter.serializeEngine!(created, cardsMaps);
    const restored = await grandArchiveServerAdapter.restoreEngine!(snapshot, {
      gameSlug: "grand-archive",
      seed: "adapter-lifecycle",
      player1Id: "p1",
      player2Id: "p2",
    });
    expect(restored.getStateID()).toBe(created.getStateID());
    expect(restored.getInteractionView?.("p1")?.actions.length).toBeGreaterThan(0);
    const replayState = restored.getViewerState({ role: "replay" }) as {
      players: Array<{ zones: Record<string, unknown> }>;
    };
    const replayResources = restored.getViewerResources?.({ role: "replay" }) as {
      cardsById: Record<string, unknown>;
    };
    expect(replayState.players.every((player) => Object.keys(player.zones).length > 0)).toBe(true);
    expect(Object.keys(replayResources.cardsById).length).toBeGreaterThan(0);
    const playerProjections = restored.runtime.state.turnOrder.map((viewerId) =>
      projectGrandArchiveViewerState(restored.program, restored.runtime.state, viewerId),
    );
    const firstProjection = playerProjections[0]!;
    const privatePlayer = firstProjection.players.find(
      (player) => player.id === firstProjection.selfId,
    )!;
    const privateHand = privatePlayer.zones.hand;
    if (privateHand.visibility !== "visible" || privateHand.objects.length === 0) {
      throw new Error("Expected the player's private hand projection");
    }
    const privatelyRevealedObject = privateHand.objects[0]!;
    const projectionWithPrivateReveal = {
      ...firstProjection,
      players: firstProjection.players.map((player) => {
        if (player.id !== privatePlayer.id) return player;
        const mainDeck = player.zones["main-deck"];
        if (mainDeck.visibility !== "hidden") return player;
        return {
          ...player,
          zones: {
            ...player.zones,
            "main-deck": {
              ...mainDeck,
              revealedObjects: [...mainDeck.revealedObjects, privatelyRevealedObject],
            },
          },
        };
      }),
    };
    const intersectedReplay = intersectGrandArchiveReplayProjections([
      projectionWithPrivateReveal,
      ...playerProjections.slice(1),
    ]);
    const intersectedMainDeck = intersectedReplay.players.find(
      (player) => player.id === privatePlayer.id,
    )!.zones["main-deck"];
    expect(
      intersectedMainDeck.visibility === "hidden" ? intersectedMainDeck.revealedObjects : [],
    ).not.toContainEqual(expect.objectContaining({ id: privatelyRevealedObject.id }));
    const replayPayload = JSON.stringify({ replayState, replayResources });
    for (const playerId of [grandArchivePlayerId("p1"), grandArchivePlayerId("p2")]) {
      for (const objectId of restored.runtime.state.zones[playerId]["main-deck"]) {
        expect(replayPayload).not.toContain(restored.runtime.state.objects[objectId]!.definitionId);
      }
    }
  }, 15_000);

  it("randomly selects either seat as first player from the deterministic match seed", async () => {
    const { initialState } = createGrandArchiveCatalogSmokeFixture(101);
    const deckFor = (playerId: "p1" | "p2") => [
      ...initialState.players[playerId]!.startingDeckDefinitionIds["main-deck"].map((cardId) => ({
        cardId,
        qty: 1,
        sectionId: "main",
      })),
      ...initialState.players[playerId]!.startingDeckDefinitionIds["material-deck"].map(
        (cardId) => ({ cardId, qty: 1, sectionId: "material" }),
      ),
    ];
    const cardsMaps = grandArchiveServerAdapter.buildCardInstances([
      { owner: "p1", deck: deckFor("p1") },
      { owner: "p2", deck: deckFor("p2") },
    ]);
    const create = (seed: string) =>
      grandArchiveServerAdapter.createServerEngine!({
        gameSlug: "grand-archive",
        seed,
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps,
        timeControl: { mode: "none" },
      });
    expect((await create("seed-1")).getActivePlayerId()).toBe("p1");
    expect((await create("seed-2")).getActivePlayerId()).toBe("p2");
  });

  it("keeps untagged cards in main when a submitted deck has explicit sections", async () => {
    const { initialState } = createGrandArchiveCatalogSmokeFixture(100);
    const deckFor = (playerId: "p1" | "p2") => {
      const main = initialState.players[playerId]!.startingDeckDefinitionIds["main-deck"];
      return [
        ...main.map((cardId, index) => ({
          cardId,
          qty: 1,
          ...(index === 0 ? {} : { sectionId: "main" }),
        })),
        ...initialState.players[playerId]!.startingDeckDefinitionIds["material-deck"].map(
          (cardId) => ({ cardId, qty: 1, sectionId: "material" }),
        ),
      ];
    };
    const cardsMaps = grandArchiveServerAdapter.buildCardInstances([
      { owner: "p1", deck: deckFor("p1") },
      { owner: "p2", deck: deckFor("p2") },
    ]);
    const created = await grandArchiveServerAdapter.createServerEngine!({
      gameSlug: "grand-archive",
      seed: "mixed-sections",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
      timeControl: { mode: "none" },
    });
    expect(created.runtime.state.players.p1?.startingDeckDefinitionIds["main-deck"]).toHaveLength(
      initialState.players.p1!.startingDeckDefinitionIds["main-deck"].length,
    );
  });

  it("rejects unknown deck section names instead of dropping those cards", () => {
    expect(() =>
      grandArchiveServerAdapter.buildCardInstances([
        {
          owner: "p1",
          deck: [{ cardId: grandArchiveCards[0]!.canonicalId, qty: 1, sectionId: "typo" }],
        },
      ]),
    ).toThrow("Unknown Grand Archive deck section: typo");
  });

  it("returns an invalid deck result for unknown card IDs", () => {
    expect(
      grandArchiveServerAdapter.validateDeckForFormat("standard", [
        { cardId: "missing-grand-archive-card", quantity: 1, sectionId: "main" },
      ]),
    ).toEqual({
      formatId: "standard",
      label: "standard",
      valid: false,
      rules: [
        {
          kind: "known-card",
          passed: false,
          message: "Unknown Grand Archive card: missing-grand-archive-card",
        },
      ],
    });
  });

  it("infers main and material sections for a completely flat deck", () => {
    const { initialState } = createGrandArchiveCatalogSmokeFixture(102);
    const counts = new Map<string, number>();
    for (const cardId of [
      ...initialState.players.p1!.startingDeckDefinitionIds["main-deck"],
      ...initialState.players.p1!.startingDeckDefinitionIds["material-deck"],
    ]) {
      counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
    }
    const result = grandArchiveServerAdapter.validateDeckForFormat(
      "standard",
      [...counts].map(([cardId, quantity]) => ({ cardId, quantity })),
    );
    expect(result.valid, JSON.stringify(result)).toBe(true);
  });

  it("persists accepted commands, rejects a retried correlation id after restart, and replays exactly", async () => {
    const server = engine();
    const view = server.getInteractionView("p1");
    const action = view.actions.find((candidate) => candidate.text.key.includes("pre-game"))!;
    const submission = buildInteractionSubmission({
      view,
      action,
      correlationId: "retry-safe-command-1",
    });
    const accepted = server.submitInteraction("p1", submission, context);
    expect(accepted.success).toBe(true);
    if (!accepted.success) return;
    expect(accepted.engineLogRecords).toHaveLength(1);

    const replay = server.exportReplay();
    const replayedSnapshot = replayGrandArchiveReplay(server.program, replay);
    expect(fingerprintGrandArchiveValue(replayedSnapshot)).toBe(replay.finalSnapshotFingerprint);
    const restoredJournal = restoreGrandArchiveReplayJournal(server.program, server.replayJournal);
    expect(restoredJournal.runtime.state.stateVersion).toBe(server.runtime.state.stateVersion);
    expect(restoredJournal.journal.commands).toEqual(server.replayJournal.commands);
    expect(() =>
      restoreGrandArchiveReplayJournal(server.program, {
        ...server.replayJournal,
        programFingerprint: "different-catalog",
      }),
    ).toThrow("unsupported schema or catalog");

    const inspection = inspectGrandArchiveReplay(server.program, replay, "p1", 1);
    expect(inspection.snapshotFingerprint).toBe(replay.finalSnapshotFingerprint);
    expect(JSON.stringify(inspection)).not.toContain('"command"');
    const opponentHiddenDefinitionIds = server.runtime.state.zones.p2.hand
      .concat(server.runtime.state.zones.p2["main-deck"])
      .map((objectId) => server.runtime.state.objects[objectId]!.definitionId);
    for (const definitionId of opponentHiddenDefinitionIds) {
      expect(JSON.stringify(inspection)).not.toContain(definitionId);
    }

    const cardsMaps = { cardInstances: {}, owners: { p1: [], p2: [] } };
    const persisted = grandArchiveServerAdapter.serializeEngine!(server, cardsMaps);
    const restored = await grandArchiveServerAdapter.restoreEngine!(persisted, {
      gameSlug: "grand-archive",
      seed: "ignored-on-restore",
      player1Id: "p1",
      player2Id: "p2",
    });
    const beforeRetry = JSON.stringify(restored.getState());
    const duplicate = restored.submitInteraction?.("p1", submission, context);
    expect(duplicate).toMatchObject({ success: false, errorCode: "duplicate_interaction" });
    expect(JSON.stringify(restored.getState())).toBe(beforeRetry);
  });
});

describe("Grand Archive bot decision dispatch", () => {
  function attackDecisionFixture() {
    const fixture = GrandArchiveTestEngine.startFixture({
      playerOne: { id: "p1", champion: spiritOfFire, zones: { field: [libraryWitch] } },
      playerTwo: {
        id: "p2",
        champion: spiritOfWind,
        zones: { hand: [savageSlash, libraryWitch, libraryWitch] },
      },
      firstPlayer: "playerTwo",
    });
    fixture
      .player("p2")
      .executeLegal(
        (candidate) =>
          candidate.command.move === "activate-card" &&
          candidate.command.cardId === fixture.player("p2").card(savageSlash).objectId,
        "activate Savage Slash",
      );
    for (let count = 0; count < 8 && !fixture.state.decision; count++) {
      const holder = fixture.state.opportunity?.holderId;
      if (!holder) throw new Error("Expected Opportunity before attack resolution");
      fixture.player(holder).pass();
    }
    expect(fixture.state.decision?.kind).toBe("declare-resolved-attack");
    return fixture;
  }

  it.each([
    ["effect selection", realStructuredDecisionFixture],
    ["resolved attack declaration", attackDecisionFixture],
  ] as const)(
    "accepts the bot's legal answer for %s and rejects invalid submissions without changing state",
    (_name, makeFixture) => {
      const fixture = makeFixture();
      const server = new GrandArchiveServerEngine(
        fixture.program,
        new GrandArchiveMatchRuntime(fixture.program, fixture.state),
      );
      const decision = fixture.state.decision!;
      const legal = chooseGrandArchiveAutomatedAction(
        fixture.program,
        fixture.state,
        decision.playerId,
      )!;
      expect(legal.command.move).toBe("answer-decision");
      const { move, ...commandPayload } = legal.command;
      const payload = {
        ...commandPayload,
        expectedStateVersion: legal.stateVersion,
        objectIncarnations: grandArchiveCommandIncarnations(server.runtime, legal.command),
      };
      expect(legal.command.move === "answer-decision" && legal.command.stateVersion).toBe(
        decision.stateVersion,
      );
      expect(decision.stateVersion).toBeLessThan(legal.stateVersion);
      const before = server.runtime.state;
      const reject = (actorId: string, badPayload: Record<string, unknown>, errorCode: string) => {
        expect(server.dispatch(move, actorId, badPayload, context)).toMatchObject({
          success: false,
          errorCode,
        });
        expect(server.runtime.state).toBe(before);
        expect(server.replayJournal.commands).toHaveLength(0);
      };
      reject(
        decision.playerId,
        { ...payload, expectedStateVersion: legal.stateVersion - 1 },
        "stale_interaction",
      );
      reject(
        decision.playerId,
        { ...payload, expectedStateVersion: undefined },
        "invalid_command_payload",
      );
      reject(decision.playerId, { ...payload, unexpected: true }, "invalid_command_payload");
      reject(decision.playerId, { ...payload, decisionId: "not-pending" }, "illegal-command");
      reject(
        decision.playerId,
        { ...payload, stateVersion: legal.stateVersion },
        "stale_interaction",
      );
      reject(decision.playerId, { ...payload, stateVersion: undefined }, "invalid_command_payload");
      const otherPlayer = fixture.state.turnOrder.find((id) => id !== decision.playerId)!;
      reject(otherPlayer, payload, "illegal-command");
      if (Object.keys(payload.objectIncarnations).length > 0) {
        reject(
          decision.playerId,
          { ...payload, objectIncarnations: undefined },
          "missing_object_incarnation",
        );
        reject(decision.playerId, { ...payload, objectIncarnations: {} }, "stale_interaction");
      }
      const accepted = server.dispatch(move, decision.playerId, payload, context);
      expect(accepted.success, JSON.stringify(accepted)).toBe(true);
      expect(server.runtime.state.decision?.id).not.toBe(decision.id);
      expect(server.getStateID()).toBeGreaterThan(legal.stateVersion);
      expect(server.replayJournal.commands).toHaveLength(1);
      // The transport must execute exactly the same legal answer as the engine harness.
      fixture.player(decision.playerId).execute(legal.command);
      expect(server.runtime.state).toEqual(fixture.state);
      expect(server.replayJournal.commands[0]?.command).toEqual(legal.command);
    },
  );
});
