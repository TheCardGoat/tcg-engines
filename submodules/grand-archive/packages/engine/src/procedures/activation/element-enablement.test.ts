import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerEnabledElements } from "../../game/elements.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  elements: readonly GrandArchiveElement[],
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
        lineageName: type === "CHAMPION" ? "Element Test" : undefined,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: [],
        },
        elements,
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const currentChampion = card("element-current-champion", "CHAMPION", ["NORM"]);
const advancedChampion = card("element-advanced-champion", "CHAMPION", ["ARCANE"]);
const exaltedChampion = card("element-exalted-champion", "CHAMPION", ["EXALTED", "NORM"]);
const advancedNonChampion = card("element-advanced-non-champion", "ACTION", ["ARCANE"]);
const exaltedAction = card("element-exalted-action", "ACTION", ["EXALTED"]);
const exaltedFireAction = card("element-exalted-fire-action", "ACTION", ["EXALTED", "FIRE"]);
const filler = card("element-filler", "ACTION", ["NORM"]);

const definitions = [
  currentChampion,
  advancedChampion,
  exaltedChampion,
  advancedNonChampion,
  exaltedAction,
  exaltedFireAction,
  filler,
] as const;

function player(id: string, includeTestCards: boolean): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(includeTestCards
        ? [
            { definitionId: advancedNonChampion.canonicalId, count: 1 },
            { definitionId: exaltedAction.canonicalId, count: 1 },
            { definitionId: exaltedFireAction.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: currentChampion.canonicalId, count: 1 },
      ...(includeTestCards ? [{ definitionId: advancedChampion.canonicalId, count: 1 }] : []),
      ...(includeTestCards ? [{ definitionId: exaltedChampion.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: currentChampion.canonicalId,
  };
}

function fixture() {
  const program = createGrandArchiveMatchProgram(definitions);
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: 20260825,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = (definitionId: string) =>
    Object.values(state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === definitionId,
    )!.id;
  return {
    program,
    state,
    p1,
    championId: objectId(currentChampion.canonicalId),
    advancedChampionId: objectId(advancedChampion.canonicalId),
    exaltedChampionId: objectId(exaltedChampion.canonicalId),
    advancedNonChampionId: objectId(advancedNonChampion.canonicalId),
    exaltedActionId: objectId(exaltedAction.canonicalId),
    exaltedFireActionId: objectId(exaltedFireAction.canonicalId),
  };
}

describe("Grand Archive element enablement", () => {
  it("enables Norm by default and does not let Exalted enable itself", () => {
    const norm = fixture();
    expect(grandArchivePlayerEnabledElements(norm.program, norm.state, norm.p1)).toContain("NORM");

    const exalted = fixture();
    const selfEnablingLineage = new GrandArchiveTransactionKernel().transact(exalted.state, [
      {
        type: "object-moved",
        objectId: exalted.exaltedChampionId,
        from: "material-deck",
        to: "inner-lineage",
        hostId: exalted.championId,
      },
      {
        type: "object-moved",
        objectId: exalted.exaltedActionId,
        from: "main-deck",
        to: "hand",
      },
    ]).state;
    const enabled = grandArchivePlayerEnabledElements(
      exalted.program,
      selfEnablingLineage,
      exalted.p1,
    );
    expect(enabled).toContain("NORM");
    expect(enabled).not.toContain("EXALTED");
    const activation = new GrandArchiveMatchRuntime(exalted.program, selfEnablingLineage).execute(
      { move: "activate-card", cardId: exalted.exaltedActionId },
      { playerId: exalted.p1 },
    );
    expect(activation.ok).toBe(false);
    if (!activation.ok) expect(activation.message).toContain("every required element");
  });

  it("unlocks Exalted only from advanced-element champion cards in the lineage", () => {
    const first = fixture();
    const nonChampionLineage = new GrandArchiveTransactionKernel().transact(first.state, [
      {
        type: "object-moved",
        objectId: first.advancedNonChampionId,
        from: "main-deck",
        to: "inner-lineage",
        hostId: first.championId,
      },
      {
        type: "object-moved",
        objectId: first.exaltedActionId,
        from: "main-deck",
        to: "hand",
      },
    ]).state;
    const invalidRuntime = new GrandArchiveMatchRuntime(first.program, nonChampionLineage);
    const invalid = invalidRuntime.execute(
      { move: "activate-card", cardId: first.exaltedActionId },
      { playerId: first.p1 },
    );
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) expect(invalid.message).toContain("every required element");

    const second = fixture();
    const championLineage = new GrandArchiveTransactionKernel().transact(second.state, [
      {
        type: "object-moved",
        objectId: second.advancedChampionId,
        from: "material-deck",
        to: "inner-lineage",
        hostId: second.championId,
      },
      {
        type: "object-moved",
        objectId: second.exaltedActionId,
        from: "main-deck",
        to: "hand",
      },
      {
        type: "object-moved",
        objectId: second.exaltedFireActionId,
        from: "main-deck",
        to: "hand",
      },
    ]).state;
    const validRuntime = new GrandArchiveMatchRuntime(second.program, championLineage);
    const missingFire = validRuntime.execute(
      { move: "activate-card", cardId: second.exaltedFireActionId },
      { playerId: second.p1 },
    );
    expect(missingFire.ok).toBe(false);
    if (!missingFire.ok) expect(missingFire.message).toContain("every required element");
    expect(
      validRuntime.execute(
        { move: "activate-card", cardId: second.exaltedActionId },
        { playerId: second.p1 },
      ).ok,
    ).toBe(true);
  });
});
