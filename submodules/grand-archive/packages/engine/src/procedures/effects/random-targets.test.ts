import { greaterBoonOfVritra, lacunasGrasp } from "@tcg/grand-archive-cards";
import type { GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  collectGrandArchivePendingTriggerProgressEvents,
  collectGrandArchiveTriggeredAbilityEvents,
} from "../../rules/abilities/triggers.ts";

const champion: GrandArchiveAnyCard = {
  canonicalId: "random-target-champion",
  slug: "random-target-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "random-target-champion:face:default",
      catalogId: "random-target-champion",
      name: "Random Target Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: { level: 0, life: 30 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard = {
  canonicalId: "random-target-filler",
  slug: "random-target-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "random-target-filler:face:default",
      catalogId: "random-target-filler",
      name: "Random Target Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function setupRandomTrigger(withEligibleTargets = true) {
  const program = createGrandArchiveMatchProgram([champion, filler, greaterBoonOfVritra]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 5 },
      ...(id === "p1" ? [{ definitionId: greaterBoonOfVritra.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: id === "p2" ? 2 : 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 619,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const boon = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === greaterBoonOfVritra.canonicalId,
  );
  if (!boon) throw new Error("Greater Boon of Vritra is missing from the fixture");
  const additionalChampion = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p2 &&
      object.definitionId === champion.canonicalId &&
      object.zone === "material-deck",
  );
  if (!additionalChampion) throw new Error("The additional opposing champion is missing");
  const kernel = new GrandArchiveTransactionKernel();
  let prepared = kernel.transact(initial, [
    {
      type: "object-moved",
      objectId: boon.id,
      from: boon.zone,
      to: "pantheon",
      entryFacing: "face-up",
    },
    {
      type: "object-moved",
      objectId: additionalChampion.id,
      from: "material-deck",
      to: "field",
    },
  ]).state;
  if (!withEligibleTargets) {
    prepared = kernel.transact(
      prepared,
      prepared.zones[p2].field.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "field" as const,
        to: "graveyard" as const,
      })),
    ).state;
  }
  const phase = kernel.transact(prepared, [{ type: "phase-changed", phase: "end", actorId: p1 }]);
  const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
    program,
    phase.state,
    phase.result.events,
  );
  const triggered = kernel.transact(phase.state, triggerEvents).state;
  const cursorBefore = triggered.random.cursor;
  const decisionState = kernel.transact(
    triggered,
    collectGrandArchivePendingTriggerProgressEvents(program, triggered),
  ).state;
  return { state: decisionState, cursorBefore };
}

describe("Grand Archive triggered announcements", () => {
  it("automatically chooses Greater Boon of Vritra's target in the engine", () => {
    const fixture = setupRandomTrigger();
    const opposingChampionIds = [
      fixture.state.zones[grandArchivePlayerId("p2")].field[0]!,
      fixture.state.zones[grandArchivePlayerId("p2")].field[1]!,
    ];
    expect(fixture.state.decision).toBeNull();
    expect(fixture.state.random.cursor).toBeGreaterThan(fixture.cursorBefore);
    const targetIds = fixture.state.stack.at(-1)?.targets[0]?.targetIds;
    expect(targetIds).toHaveLength(1);
    expect(opposingChampionIds).toContain(targetIds?.[0]);
  });

  it("fizzles Greater Boon of Vritra's trigger when no legal random target exists", () => {
    const fixture = setupRandomTrigger(false);
    expect(fixture.state.decision).toBeNull();
    expect(fixture.state.pendingTriggers).toHaveLength(0);
    expect(fixture.state.stack).toHaveLength(0);
    expect(fixture.state.random.cursor).toBe(fixture.cursorBefore);
  });

  it("requires Lacuna's Grasp to declare its chosen X before entering the stack", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, lacunasGrasp]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: filler.canonicalId, count: 5 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        ...(id === "p1" ? [{ definitionId: lacunasGrasp.canonicalId, count: 1 }] : []),
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 701,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const source = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === lacunasGrasp.canonicalId,
    );
    if (!source) throw new Error("Lacuna's Grasp is missing from the fixture");
    if (lacunasGrasp.layout.kind !== "single-faced") {
      throw new Error("Lacuna's Grasp must be single-faced");
    }
    const ability = lacunasGrasp.layout.face.abilities.find(
      (candidate) => candidate.kind === "triggered",
    );
    if (!ability || ability.kind !== "triggered") {
      throw new Error("Lacuna's Grasp triggered ability is missing");
    }
    const kernel = new GrandArchiveTransactionKernel();
    const prepared = kernel.transact(initial, [
      { type: "object-moved", objectId: source.id, from: source.zone, to: "field" },
    ]).state;
    const pending = kernel.transact(prepared, [
      {
        type: "pending-trigger-added",
        trigger: {
          id: "pending-trigger-lacunas-grasp",
          batchId: "trigger-batch-lacunas-grasp",
          orderingConfirmed: true,
          sourceId: source.id,
          sourceIncarnation: prepared.objects[source.id]!.incarnation,
          controllerId: p1,
          ability,
          selectedModeIds: [],
          bindings: {},
          variables: {},
          activationPayment: [],
          createdAtVersion: prepared.stateVersion,
        },
        cause: { kind: "rule", rule: "triggered-ability-awaiting-stack" },
      },
    ]).state;
    const awaitingDeclaration = kernel.transact(
      pending,
      collectGrandArchivePendingTriggerProgressEvents(program, pending),
    ).state;
    const decision = awaitingDeclaration.decision;
    if (!decision || decision.kind !== "announce-triggered-ability") {
      throw new Error("Expected Lacuna's Grasp variable declaration");
    }
    expect(awaitingDeclaration.stack).toHaveLength(0);

    const runtime = new GrandArchiveMatchRuntime(program, awaitingDeclaration);
    const legal = listGrandArchiveLegalCommands(program, awaitingDeclaration, p1);
    const variableCommand = legal.find((candidate) =>
      JSON.stringify(candidate.command).includes('"variables":{"X":0}'),
    );
    if (!variableCommand) throw new Error("Legal commands omitted the chosen variable");
    expect(runtime.execute(variableCommand.command, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.stack.at(-1)?.variables.X).toBe(0);
  });
});
