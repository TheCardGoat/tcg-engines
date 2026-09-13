import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";

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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("stabilization-champion", "CHAMPION");
const filler = card("stabilization-filler", "ACTION");
const simultaneousTriggerCount = 70;
const simultaneousTriggers: readonly GrandArchiveAbilityDefinition[] = Array.from(
  { length: simultaneousTriggerCount },
  (_, index) => ({
    id: `stabilizationSource-a${index + 2}`,
    kind: "triggered",
    text: `On Enter: Resolve trigger ${index}.`,
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    effect: { kind: "no-op" },
  }),
);
const source = card("stabilization-source", "ITEM", [
  {
    id: "stabilizationSource-a1",
    kind: "activated",
    activation: "ability",
    text: "(0): Trigger each of this object's On Enter abilities.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: {
      kind: "trigger-abilities",
      subject: { kind: "source" },
      triggerName: "on-enter",
      count: "each",
    },
  },
  ...simultaneousTriggers,
]);

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, source]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: source.canonicalId, count: 1 }] : []),
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
      randomSeed: 851,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  );
  if (!sourceObject) throw new Error("Missing stabilization source");
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: sourceObject.id,
      from: sourceObject.zone,
      to: "field",
    },
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2: grandArchivePlayerId("p2"),
    sourceId: sourceObject.id,
  };
}

describe("Grand Archive runtime stabilization", () => {
  it("settles a legal simultaneous-trigger batch larger than the former 64-pass bound", () => {
    const fixture = setup();
    expect(
      fixture.runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.sourceId,
          abilityId: "stabilizationSource-a1",
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(fixture.runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(fixture.runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const ordering = fixture.runtime.state.decision;
    if (!ordering || ordering.kind !== "order-triggered-abilities") {
      throw new Error("Expected simultaneous trigger ordering");
    }
    expect(ordering.pendingTriggerIds).toHaveLength(simultaneousTriggerCount);
    const ordered = fixture.runtime.execute(
      {
        move: "answer-decision",
        decisionId: ordering.id,
        stateVersion: ordering.stateVersion,
        answer: ordering.pendingTriggerIds,
      },
      { playerId: fixture.p1 },
    );

    expect(ordered.ok).toBe(true);
    expect(fixture.runtime.state.decision).toBeNull();
    expect(fixture.runtime.state.pendingTriggers).toHaveLength(0);
    expect(fixture.runtime.state.stack).toHaveLength(simultaneousTriggerCount);
    expect(fixture.runtime.state.stack.every((item) => item.kind === "triggered-ability")).toBe(
      true,
    );
    expect(fixture.runtime.state.opportunity?.holderId).toBe(fixture.p1);
  });
});
