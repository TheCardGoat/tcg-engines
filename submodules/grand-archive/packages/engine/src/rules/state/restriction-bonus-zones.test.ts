import {
  devisedConspiracy,
  flameRuneSwordsman,
  guidedStarlight,
  merlinMemoryThief,
} from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { grandArchiveObjectHasActiveKeyword } from "../abilities/intrinsic-keywords.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const p1 = grandArchivePlayerId("p1");
const p2 = grandArchivePlayerId("p2");

function champion(
  id: string,
  championClass: "ASSASSIN" | "MAGE" | "RANGER",
  lineageName: string,
  element: "ASTRA" | "NORM" | "UMBRA" = "NORM",
) {
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
        lineageName,
        cost: { kind: "memory", amount: 0 },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: [championClass],
          subtypes: [championClass],
        },
        elements: [element],
        stats: { level: 0, life: 20 },
        rulesText: "",
        abilities: [],
      },
    },
  } as const satisfies GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}

const merlinStarter = champion("restriction-merlin-starter", "MAGE", "Merlin");
const mageStarter = champion("restriction-opposing-mage", "MAGE", "Other");
const assassinStarter = champion("restriction-opposing-assassin", "ASSASSIN", "Tristan");
const tristanStarter = champion("restriction-tristan-starter", "ASSASSIN", "Tristan", "UMBRA");
const astraStarter = champion("restriction-astra-starter", "RANGER", "Other", "ASTRA");

function setup(opposingChampion: typeof mageStarter | typeof assassinStarter) {
  const program = createGrandArchiveMatchProgram([
    merlinMemoryThief,
    flameRuneSwordsman,
    merlinStarter,
    mageStarter,
    assassinStarter,
  ]);
  const player = (
    id: "p1" | "p2",
    startingChampion: typeof merlinStarter | typeof mageStarter | typeof assassinStarter,
  ): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: flameRuneSwordsman.canonicalId, count: 1 }],
    materialDeck: [{ definitionId: startingChampion.canonicalId, count: 1 }],
    startingChampionDefinitionId: startingChampion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", merlinStarter), player("p2", opposingChampion)],
      firstPlayerId: "p1",
      randomSeed: 2_513,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const merlinId = initial.zones[p1].field[0]!;
  const swordsmanId = initial.zones[p2]["main-deck"][0]!;
  const withMerlin = {
    ...initial,
    objects: {
      ...initial.objects,
      [merlinId]: {
        ...initial.objects[merlinId]!,
        definitionId: merlinMemoryThief.canonicalId,
      },
    },
  };
  const prepared = new GrandArchiveTransactionKernel().transact(withMerlin, [
    {
      type: "object-moved",
      objectId: swordsmanId,
      from: "main-deck",
      to: "graveyard",
    },
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    merlinId,
    swordsmanId,
  };
}

function mainDeckKeywordIsActive(
  source: typeof devisedConspiracy | typeof guidedStarlight,
  startingChampion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  keyword: "aethercalling" | "prepare",
): boolean {
  const program = createGrandArchiveMatchProgram([source, startingChampion]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: source.canonicalId, count: 1 }],
    materialDeck: [{ definitionId: startingChampion.canonicalId, count: 1 }],
    startingChampionDefinitionId: startingChampion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 2_514,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const object = state.objects[state.zones[p1]["main-deck"][0]!]!;
  return grandArchiveObjectHasActiveKeyword(program, state, object, keyword);
}

function resolveMerlin(
  runtime: GrandArchiveMatchRuntime,
  merlinId: GrandArchiveObjectId,
  swordsmanId: GrandArchiveObjectId,
) {
  const activation = runtime.execute(
    { move: "activate-ability", sourceId: merlinId, abilityId: "umSsPWqb5H-a1" },
    { playerId: p1 },
  );
  if (!activation.ok) throw new Error(activation.message);
  for (const playerId of [p1, p2]) {
    const passed = runtime.execute({ move: "pass" }, { playerId });
    if (!passed.ok) throw new Error(passed.message);
  }
  const decision = runtime.state.decision;
  if (!decision || decision.kind !== "resolve-effect-choice") {
    throw new Error("Expected Merlin's graveyard-card choice");
  }
  const answer = runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: [swordsmanId],
    },
    { playerId: p1 },
  );
  if (!answer.ok) throw new Error(answer.message);
}

describe("Grand Archive all-zone bonus restrictions", () => {
  it("evaluates another player's graveyard Class Bonus against that player's champion", () => {
    const unmatched = setup(assassinStarter);
    resolveMerlin(unmatched.runtime, unmatched.merlinId, unmatched.swordsmanId);
    expect(unmatched.runtime.state.objects[unmatched.swordsmanId]?.zone).toBe("banishment");
    expect(unmatched.runtime.state.objects[unmatched.merlinId]?.counters.level ?? 0).toBe(0);

    const matched = setup(mageStarter);
    resolveMerlin(matched.runtime, matched.merlinId, matched.swordsmanId);
    expect(matched.runtime.state.objects[matched.swordsmanId]?.zone).toBe("banishment");
    expect(matched.runtime.state.objects[matched.merlinId]?.counters.level).toBe(1);
  });

  it("applies Champion and Element Bonus to intrinsic keywords in the Main Deck", () => {
    expect(mainDeckKeywordIsActive(devisedConspiracy, tristanStarter, "prepare")).toBe(true);
    expect(mainDeckKeywordIsActive(devisedConspiracy, merlinStarter, "prepare")).toBe(false);
    expect(mainDeckKeywordIsActive(guidedStarlight, astraStarter, "aethercalling")).toBe(true);
    expect(mainDeckKeywordIsActive(guidedStarlight, merlinStarter, "aethercalling")).toBe(false);
  });
});
