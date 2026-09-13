import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  subtypes: readonly string[] = [],
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
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("search-rules-champion", "CHAMPION");
const target = card("search-rules-target", "ACTION", [], ["TARGET"]);
const filler = card("search-rules-filler", "ACTION");

type SearchableZone = Exclude<GrandArchiveZone, "effects-stack" | "field" | "pantheon">;

function searchEffect(zone: SearchableZone, filtered: boolean, amount = 1): GrandArchiveEffect {
  return {
    kind: "search",
    player: "controller",
    zone,
    selection: {
      id: "searched-card",
      kind: "choice",
      declared: "resolution",
      chooser: "controller",
      count: { kind: "exactly", amount },
      candidates: {
        kind: "card",
        zones: [zone],
        relationship: "zone-of",
        player: "controller",
        ...(filtered ? { filter: { kind: "subtype" as const, oneOf: ["TARGET"] } } : {}),
      },
    },
  };
}

function sourceCard(zone: SearchableZone, filtered: boolean, amount: number) {
  return card(
    `search-rules-source-${zone}-${filtered ? "filtered" : "plain"}-${amount}`,
    "ACTION",
    [
      {
        id: "searchRulesSource-a1",
        kind: "card-resolution",
        text: "Search for the test card.",
        effect: searchEffect(zone, filtered, amount),
      },
    ],
  );
}

function setup(zone: SearchableZone, filtered: boolean, amount = 1) {
  const source = sourceCard(zone, filtered, amount);
  const program = createGrandArchiveMatchProgram([champion, target, filler, source]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: target.canonicalId, count: id === "p1" ? amount : 0 },
      { definitionId: filler.canonicalId, count: 9 },
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
      randomSeed: 119,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  );
  const targetObjects = Object.values(initial.objects).filter(
    (object) => object.ownerId === p1 && object.definitionId === target.canonicalId,
  );
  if (!sourceObject || targetObjects.length !== amount) {
    throw new Error("Missing search rules fixture objects");
  }
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    ...(sourceObject.zone === "hand"
      ? []
      : [
          {
            type: "object-moved" as const,
            objectId: sourceObject.id,
            from: sourceObject.zone,
            to: "hand" as const,
          },
        ]),
    ...targetObjects.flatMap((targetObject) =>
      targetObject.zone === zone
        ? []
        : [
            {
              type: "object-moved" as const,
              objectId: targetObject.id,
              from: targetObject.zone,
              to: zone,
            },
          ],
    ),
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2: grandArchivePlayerId("p2"),
    sourceId: sourceObject.id,
    targetId: targetObjects[0]!.id,
    targetIds: targetObjects.map((object) => object.id),
  };
}

function resolveToSearchDecision(fixture: {
  readonly runtime: GrandArchiveMatchRuntime;
  readonly p1: ReturnType<typeof grandArchivePlayerId>;
  readonly p2: ReturnType<typeof grandArchivePlayerId>;
  readonly sourceId: GrandArchiveObjectId;
}) {
  expect(
    fixture.runtime.execute(
      { move: "activate-card", cardId: fixture.sourceId },
      { playerId: fixture.p1 },
    ).ok,
  ).toBe(true);
  expect(fixture.runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
  expect(fixture.runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
  expect(fixture.runtime.state.decision).toMatchObject({ kind: "resolve-effect-choice" });
}

function emptySearchCommand(runtime: GrandArchiveMatchRuntime) {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a search decision");
  return listGrandArchiveLegalCommands(runtime.program, runtime.state, decision.playerId).find(
    ({ command }) => command.move === "answer-decision" && JSON.stringify(command.answer) === "[]",
  );
}

describe("Grand Archive searching and finding", () => {
  it("allows a filtered private-zone search to fail to find and preserves that permission in snapshots", () => {
    const fixture = setup("main-deck", true);
    resolveToSearchDecision(fixture);
    expect(fixture.runtime.state.decision).toMatchObject({ mayFailToFind: true });

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const command = emptySearchCommand(restored);
    expect(command).toBeDefined();
    const result = restored.execute(command!.command, { playerId: fixture.p1 });
    if (!result.ok) throw new Error(result.message);
    expect(result.events).toContainEqual(
      expect.objectContaining({ type: "cards-searched", objectIds: [] }),
    );
    expect(restored.state.objects[fixture.targetId]?.zone).toBe("main-deck");
  });

  it("requires a card for an unfiltered private-zone search when a legal card exists", () => {
    const fixture = setup("main-deck", false);
    resolveToSearchDecision(fixture);
    expect(fixture.runtime.state.decision).not.toHaveProperty("mayFailToFind");
    expect(emptySearchCommand(fixture.runtime)).toBeUndefined();
  });

  it("adds zero without weakening a filtered search's non-empty exact count", () => {
    const fixture = setup("main-deck", true, 2);
    resolveToSearchDecision(fixture);
    const decision = fixture.runtime.state.decision;
    if (!decision) throw new Error("Expected a filtered private search decision");
    const partial = fixture.runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [fixture.targetIds[0]!],
      },
      { playerId: fixture.p1 },
    );
    expect(partial.ok).toBe(false);
    expect(fixture.runtime.state.decision?.id).toBe(decision.id);
    expect(emptySearchCommand(fixture.runtime)).toBeDefined();
  });

  it("does not allow failure to find for a filtered search of a public zone", () => {
    const fixture = setup("graveyard", true);
    expect(
      fixture.runtime.execute(
        { move: "activate-card", cardId: fixture.sourceId },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(fixture.runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(fixture.runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    // The only legal public card is mandatory and therefore selected without a prompt.
    expect(fixture.runtime.state.decision).toBeNull();
    expect(fixture.runtime.state.eventHistory).toContainEqual(
      expect.objectContaining({ type: "cards-searched", objectIds: [fixture.targetId] }),
    );
  });
});
