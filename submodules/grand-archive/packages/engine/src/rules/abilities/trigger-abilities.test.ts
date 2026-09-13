import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION" | "ITEM",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
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

const champion = card("named-trigger-champion", "CHAMPION");
const filler = card("named-trigger-filler", "ACTION");
const source = card("named-trigger-source", "ITEM", [
  {
    id: "namedTriggerSource-a1",
    kind: "activated",
    activation: "ability",
    text: "Trigger each of this object's On Enter abilities, then mark completion.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "trigger-abilities",
          subject: { kind: "source" },
          triggerName: "on-enter",
          count: "each",
        },
        {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "parent-resolved" },
          amount: 1,
        },
      ],
    },
  },
  {
    id: "namedTriggerSource-a2",
    kind: "triggered",
    text: "On Enter: Put a first counter on this object.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "first" },
      amount: 1,
    },
  },
  {
    id: "namedTriggerSource-a3",
    kind: "triggered",
    text: "On Enter: Put a second counter on this object.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "second" },
      amount: 1,
    },
  },
  {
    id: "namedTriggerSource-a4",
    kind: "triggered",
    text: "On Attack: This ability must not be selected by an On Enter instruction.",
    trigger: {
      kind: "event",
      event: { name: "attack-declared", subject: { kind: "source" } },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "wrong-trigger" },
      amount: 1,
    },
  },
]);

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly sourceId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([champion, filler, source]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 6 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 942,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  );
  if (!sourceObject) throw new Error("Missing named trigger source");
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: sourceObject.id,
      from: sourceObject.zone,
      to: "field",
    },
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    sourceId: sourceObject.id,
  };
}

function passPriority(runtime: GrandArchiveMatchRuntime): void {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
}

describe("Grand Archive explicit named ability triggers", () => {
  it("queues every matching ability after its parent resolves and preserves ordering decisions", () => {
    const fixture = setup();
    const p1 = grandArchivePlayerId("p1");
    expect(
      fixture.runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.sourceId,
          abilityId: "namedTriggerSource-a1",
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    passPriority(fixture.runtime);

    expect(fixture.runtime.state.objects[fixture.sourceId]?.counters["named:parent-resolved"]).toBe(
      1,
    );
    expect(fixture.runtime.state.objects[fixture.sourceId]?.counters["named:first"] ?? 0).toBe(0);
    expect(fixture.runtime.state.objects[fixture.sourceId]?.counters["named:second"] ?? 0).toBe(0);
    expect(
      fixture.runtime.state.pendingTriggers.map((trigger) => trigger.ability.id).sort(),
    ).toEqual(["namedTriggerSource-a2", "namedTriggerSource-a3"]);
    const ordering = fixture.runtime.state.decision;
    if (!ordering || ordering.kind !== "order-triggered-abilities") {
      throw new Error("Expected named trigger ordering decision");
    }

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const firstTrigger = restored.state.pendingTriggers.find(
      (trigger) => trigger.ability.id === "namedTriggerSource-a2",
    );
    const secondTrigger = restored.state.pendingTriggers.find(
      (trigger) => trigger.ability.id === "namedTriggerSource-a3",
    );
    if (!firstTrigger || !secondTrigger) throw new Error("Expected both named triggers");
    expect(
      restored.execute(
        {
          move: "answer-decision",
          decisionId: ordering.id,
          stateVersion: ordering.stateVersion,
          answer: [firstTrigger.id, secondTrigger.id],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);

    expect(
      restored.state.stack.map((item) =>
        item.kind === "triggered-ability" ? item.ability.id : "unexpected",
      ),
    ).toEqual(["namedTriggerSource-a2", "namedTriggerSource-a3"]);
    passPriority(restored);
    expect(restored.state.objects[fixture.sourceId]?.counters["named:second"]).toBe(1);
    passPriority(restored);
    expect(restored.state.objects[fixture.sourceId]?.counters["named:first"]).toBe(1);
    expect(restored.state.objects[fixture.sourceId]?.counters["named:wrong-trigger"] ?? 0).toBe(0);
  });
});
