import { revokerBell } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  options: { readonly regalia?: boolean } = {},
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
        cost: options.regalia
          ? { kind: "memory", amount: 0 }
          : { kind: type === "CHAMPION" ? "memory" : "reserve", amount: 0 },
        typeLine: {
          supertypes: options.regalia ? ["REGALIA"] : [],
          types: [type],
          classes: ["CLERIC"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("wake-prohibition-champion", "CHAMPION");
const filler = card("wake-prohibition-filler", "ACTION");
const ordinaryRegalia = card("wake-prohibition-regalia", "ITEM", { regalia: true });

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, ordinaryRegalia, revokerBell]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 6 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: revokerBell.canonicalId, count: 1 },
            { definitionId: ordinaryRegalia.canonicalId, count: 1 },
          ]
        : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 613,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const byDefinition = (definitionId: string) => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing ${definitionId}`);
    return object;
  };
  return {
    program,
    state,
    p1,
    bell: byDefinition(revokerBell.canonicalId),
    ordinary: byDefinition(ordinaryRegalia.canonicalId),
  };
}

describe("authoritative Grand Archive wake restrictions", () => {
  it("rejects an alternate wake producer while Revoker Bell's static rule is active", () => {
    const fixture = setup();
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.bell.id,
        from: fixture.bell.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: fixture.ordinary.id,
        from: fixture.ordinary.zone,
        to: "field",
      },
      {
        type: "object-state-changed",
        objectId: fixture.bell.id,
        state: "rested",
        value: true,
      },
      {
        type: "object-state-changed",
        objectId: fixture.ordinary.id,
        state: "rested",
        value: true,
      },
    ]).state;
    const kernel = new GrandArchiveTransactionKernel({
      prepareEvent: (state, event) =>
        prepareGrandArchiveRuleBoundEvent(fixture.program, state, event),
    });

    const result = kernel.transact(positioned, [
      {
        type: "object-state-changed",
        objectId: fixture.bell.id,
        state: "rested",
        value: false,
        actorId: fixture.p1,
        cause: { kind: "rule", rule: "alternate-wake-producer" },
      },
      {
        type: "object-state-changed",
        objectId: fixture.ordinary.id,
        state: "rested",
        value: false,
        actorId: fixture.p1,
        cause: { kind: "rule", rule: "alternate-wake-producer" },
      },
    ]);

    expect(result.state.objects[fixture.bell.id]?.states.has("rested")).toBe(true);
    expect(result.state.objects[fixture.ordinary.id]?.states.has("rested")).toBe(false);
    expect(result.result.events).toEqual([
      expect.objectContaining({
        type: "object-state-changed",
        objectId: fixture.ordinary.id,
        state: "rested",
        value: false,
      }),
    ]);
  });
});
