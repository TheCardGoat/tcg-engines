import { revealTheHidden } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchiveObjectHasActiveKeyword } from "./intrinsic-keywords.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["RANGER"], subtypes: [] },
        elements: ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 2 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("keyword-restriction-champion", "CHAMPION");
const filler = card("keyword-restriction-filler", "ACTION");
const plainAlly = card("keyword-restriction-plain-ally", "ALLY");
const stealthAlly = card("keyword-restriction-stealth-ally", "ALLY", [
  {
    id: "keywordRestrictionStealth-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Stealth",
    keyword: { name: "stealth" },
  },
]);

function revealEffect(): GrandArchiveEffect {
  if (revealTheHidden.layout.kind !== "single-faced") {
    throw new Error("Reveal the Hidden must be single-faced.");
  }
  const face = revealTheHidden.layout.face;
  const ability = face.abilities.find((candidate) => candidate.id === "rHccTUUWou-a1");
  if (!ability || ability.kind !== "card-resolution") {
    throw new Error("Reveal the Hidden has no executable first resolution ability.");
  }
  return ability.effect;
}

function fixture() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    plainAlly,
    stealthAlly,
    revealTheHidden,
  ]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: plainAlly.canonicalId, count: id === "p1" ? 2 : 0 },
      { definitionId: stealthAlly.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: revealTheHidden.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 4 },
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
      randomSeed: 2026,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
  const plainIds = owned
    .filter((object) => object.definitionId === plainAlly.canonicalId)
    .map((object) => object.id);
  const existingPlainId = plainIds[0];
  const futurePlainId = plainIds[1];
  const existingStealthId = owned.find(
    (object) => object.definitionId === stealthAlly.canonicalId,
  )?.id;
  const sourceId = owned.find((object) => object.definitionId === revealTheHidden.canonicalId)?.id;
  if (!existingPlainId || !futurePlainId || !existingStealthId || !sourceId) {
    throw new Error("Keyword restriction fixture is incomplete.");
  }
  const kernel = new GrandArchiveTransactionKernel();
  const state = kernel.transact(initial, [
    { type: "object-moved", objectId: existingPlainId, from: "main-deck", to: "field" },
    { type: "object-moved", objectId: existingStealthId, from: "main-deck", to: "field" },
  ]).state;
  return {
    program,
    kernel,
    state,
    p1,
    sourceId,
    existingPlainId,
    futurePlainId,
    existingStealthId,
  };
}

function grantStealth(
  fixtureState: ReturnType<typeof fixture>,
  state: ReturnType<typeof fixture>["state"],
  targetId: ReturnType<typeof fixture>["existingPlainId"],
) {
  return executeGrandArchiveEffect(
    {
      kind: "continuous",
      subjects: { kind: "bound", binding: "target" },
      affectedSet: "locked",
      duration: { kind: "this-turn" },
      layer: { layer: "D", modifies: "ability" },
      change: { kind: "grant-keyword", keyword: { name: "stealth" } },
    },
    {
      program: fixtureState.program,
      state,
      controllerId: fixtureState.p1,
      sourceId: fixtureState.sourceId,
      bindings: { target: [targetId] },
    },
    (current, events) => {
      const transaction = fixtureState.kernel.transact(current, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  ).state;
}

describe("Grand Archive keyword-grant restrictions", () => {
  it("enforces Reveal the Hidden against later Stealth grants only for its locked units", () => {
    const current = fixture();
    expect(
      grandArchiveObjectHasActiveKeyword(
        current.program,
        current.state,
        current.state.objects[current.existingStealthId]!,
        "stealth",
      ),
    ).toBe(true);

    const revealed = executeGrandArchiveEffect(
      revealEffect(),
      {
        program: current.program,
        state: current.state,
        controllerId: current.p1,
        sourceId: current.sourceId,
        bindings: {},
      },
      (state, events) => {
        const transaction = current.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    expect(
      grandArchiveObjectHasActiveKeyword(
        current.program,
        revealed,
        revealed.objects[current.existingStealthId]!,
        "stealth",
      ),
    ).toBe(false);
    expect(revealed.ruleModifications[0]?.affectedObjectIds).toEqual(
      expect.arrayContaining([current.existingPlainId, current.existingStealthId]),
    );

    const existingGrant = grantStealth(current, revealed, current.existingPlainId);
    expect(
      grandArchiveObjectHasActiveKeyword(
        current.program,
        existingGrant,
        existingGrant.objects[current.existingPlainId]!,
        "stealth",
      ),
    ).toBe(false);

    const entered = current.kernel.transact(existingGrant, [
      {
        type: "object-moved",
        objectId: current.futurePlainId,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const futureGrant = grantStealth(current, entered, current.futurePlainId);
    expect(
      grandArchiveObjectHasActiveKeyword(
        current.program,
        futureGrant,
        futureGrant.objects[current.futurePlainId]!,
        "stealth",
      ),
    ).toBe(true);
  });
});
