import { frozenNova, prismaticSpirit } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
  GrandArchiveEffect,
  GrandArchiveResolutionChoice,
  GrandArchiveTargetDeclaration,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  declareGrandArchiveResolutionChoice,
  declareGrandArchiveTargets,
  randomlyDeclareGrandArchiveResolutionChoice,
} from "../activation/activation.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  elements: readonly GrandArchiveElement[] = ["NORM"],
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
        elements,
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("selection-quantifier-champion", "CHAMPION", [
  {
    id: "selectionQuantifierChampion-a1",
    kind: "activated",
    activation: "ability",
    text: "Deal 1 damage to all allies and rest them.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: frozenNovaEffect(),
  },
]);
const ally = card("selection-quantifier-ally", "ALLY");
const fireCard = card("selection-quantifier-fire", "ACTION", [], ["FIRE"]);
const waterCard = card("selection-quantifier-water", "ACTION", [], ["WATER"]);
const windCard = card("selection-quantifier-wind", "ACTION", [], ["WIND"]);
const action = card("selection-quantifier-action", "ACTION", [
  {
    id: "selectionQuantifierAction-a1",
    kind: "card-resolution",
    text: "No effect.",
    effect: { kind: "no-op" },
  },
]);

function frozenNovaEffect(): GrandArchiveEffect {
  if (frozenNova.layout.kind !== "single-faced") {
    throw new Error("Frozen Nova must be single-faced");
  }
  const ability = frozenNova.layout.face.abilities[1];
  if (ability?.kind !== "card-resolution" || ability.effect?.kind !== "choose") {
    throw new Error("Frozen Nova must have its catalog choose effect");
  }
  return ability.effect;
}

function frozenNovaSelection(): GrandArchiveResolutionChoice {
  const effect = frozenNovaEffect();
  if (effect.kind !== "choose") throw new Error("Frozen Nova must choose affected allies");
  return effect.selection;
}

function prismaticSpiritSelection(): GrandArchiveResolutionChoice {
  if (prismaticSpirit.layout.kind !== "single-faced") {
    throw new Error("Prismatic Spirit must be single-faced");
  }
  const ability = prismaticSpirit.layout.face.abilities[0];
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "sequence") {
    throw new Error("Prismatic Spirit must have its catalog sequence effect");
  }
  const choice = ability.effect.effects[1];
  if (choice?.kind !== "choose-value") {
    throw new Error("Prismatic Spirit must choose its two basic elements");
  }
  return choice.selection;
}

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly p1: ReturnType<typeof grandArchivePlayerId>;
  readonly championId: GrandArchiveObjectId;
  readonly allyIds: readonly [GrandArchiveObjectId, GrandArchiveObjectId];
  readonly actionId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    ally,
    action,
    fireCard,
    waterCard,
    windCard,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: action.canonicalId, count: 1 },
      { definitionId: ally.canonicalId, count: 2 },
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
      randomSeed: 846,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const championId = initial.zones[p1].field[0]!;
  const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
  const allyIds = owned
    .filter((object) => object.definitionId === ally.canonicalId)
    .map((object) => object.id);
  const actionId = owned.find((object) => object.definitionId === action.canonicalId)?.id;
  if (allyIds.length !== 2 || !actionId) throw new Error("Missing quantifier test objects");
  const kernel = new GrandArchiveTransactionKernel();
  const prepared = kernel.transact(initial, [
    ...allyIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "field" as const,
    })),
    {
      type: "object-moved",
      objectId: actionId,
      from: "main-deck",
      to: "hand",
    },
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    championId,
    allyIds: [allyIds[0]!, allyIds[1]!],
    actionId,
  };
}

describe("Grand Archive selection quantifiers", () => {
  it("makes target identities unique by default across one activation", () => {
    const fixture = setup();
    const evaluation = {
      program: fixture.program,
      state: fixture.runtime.state,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      bindings: {},
    };
    const first = {
      id: "first-target",
      kind: "target",
      declared: "announcement",
      chooser: "controller",
      count: { kind: "exactly", amount: 1 },
      candidates: { kind: "object", zones: ["field"] },
    } satisfies GrandArchiveTargetDeclaration;
    const second = {
      ...first,
      id: "second-target",
    } satisfies GrandArchiveTargetDeclaration;

    expect(() =>
      declareGrandArchiveTargets(
        [
          {
            ...first,
            count: { kind: "exactly", amount: 2 },
          },
        ],
        { [first.id]: [fixture.allyIds[0], fixture.allyIds[0]] },
        evaluation,
      ),
    ).toThrow("A target identity cannot be selected twice");
    expect(() =>
      declareGrandArchiveTargets(
        [first, second],
        {
          [first.id]: [fixture.allyIds[0]],
          [second.id]: [fixture.allyIds[0]],
        },
        evaluation,
      ),
    ).toThrow("A target identity cannot be selected twice");
  });

  it("requires explicit printed permission to select one target repeatedly", () => {
    const fixture = setup();
    const repeated = {
      id: "repeated-target",
      kind: "target",
      declared: "announcement",
      chooser: "controller",
      count: { kind: "exactly", amount: 2 },
      allowRepeated: true,
      candidates: { kind: "object", zones: ["field"] },
    } satisfies GrandArchiveTargetDeclaration;

    expect(
      declareGrandArchiveTargets(
        [repeated],
        { [repeated.id]: [fixture.allyIds[0], fixture.allyIds[0]] },
        {
          program: fixture.program,
          state: fixture.runtime.state,
          controllerId: fixture.p1,
          sourceId: fixture.championId,
          bindings: {},
        },
      )[0]?.targetIds,
    ).toEqual([fixture.allyIds[0], fixture.allyIds[0]]);
  });

  it("does not let a card declaration reinterpret a bound field object as a card", () => {
    const fixture = setup();
    const cardTarget = {
      id: "bound-card",
      kind: "target",
      declared: "announcement",
      chooser: "controller",
      count: { kind: "exactly", amount: 1 },
      candidates: { kind: "card", binding: "field-candidate" },
    } satisfies GrandArchiveTargetDeclaration;

    expect(() =>
      declareGrandArchiveTargets(
        [cardTarget],
        { [cardTarget.id]: [fixture.allyIds[0]] },
        {
          program: fixture.program,
          state: fixture.runtime.state,
          controllerId: fixture.p1,
          sourceId: fixture.championId,
          bindings: { "field-candidate": [fixture.allyIds[0]] },
        },
      ),
    ).toThrow("Target bound-card contains an illegal object");
  });

  it("requires Frozen Nova's count-all choice to contain every eligible ally", () => {
    const fixture = setup();
    const selection = frozenNovaSelection();
    const evaluation = {
      program: fixture.program,
      state: fixture.runtime.state,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      bindings: {},
    };

    expect(() =>
      declareGrandArchiveResolutionChoice(selection, [fixture.allyIds[0]], evaluation),
    ).toThrow("must include every eligible object");
    expect(
      declareGrandArchiveResolutionChoice(
        selection,
        [fixture.allyIds[1], fixture.allyIds[0]],
        evaluation,
      ),
    ).toEqual([fixture.allyIds[1], fixture.allyIds[0]]);
  });

  it("keeps any-number optional while count-all is mandatory", () => {
    const fixture = setup();
    const selection: GrandArchiveResolutionChoice = {
      ...frozenNovaSelection(),
      id: "optional-allies",
      count: { kind: "any-number" },
    };
    expect(
      declareGrandArchiveResolutionChoice(selection, [], {
        program: fixture.program,
        state: fixture.runtime.state,
        controllerId: fixture.p1,
        sourceId: fixture.championId,
        bindings: {},
      }),
    ).toEqual([]);
  });

  it("accepts count-all stack-item choices used by Diana, Moonpiercer", () => {
    const fixture = setup();
    expect(
      fixture.runtime.execute(
        { move: "activate-card", cardId: fixture.actionId, reservePayment: [] },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    const stackItem = fixture.runtime.state.stack[0];
    if (!stackItem) throw new Error("Expected an action activation on the stack");
    const selection: GrandArchiveResolutionChoice = {
      id: "targeting-activations",
      kind: "choice",
      declared: "resolution",
      chooser: "controller",
      count: { kind: "all" },
      unique: true,
      candidates: { kind: "stack-item", itemTypes: ["card-activation"] },
    };
    const evaluation = {
      program: fixture.program,
      state: fixture.runtime.state,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      bindings: {},
    };

    expect(() => declareGrandArchiveResolutionChoice(selection, [], evaluation)).toThrow(
      "must include every eligible object",
    );
    expect(declareGrandArchiveResolutionChoice(selection, [stackItem.id], evaluation)).toEqual([
      stackItem.id,
    ]);
  });

  it("accepts Prismatic Spirit's exact choice of two distinct basic elements", () => {
    const fixture = setup();
    const selection = prismaticSpiritSelection();
    const evaluation = {
      program: fixture.program,
      state: fixture.runtime.state,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      bindings: {},
    };

    expect(declareGrandArchiveResolutionChoice(selection, ["FIRE", "WATER"], evaluation)).toEqual([
      "FIRE",
      "WATER",
    ]);
    expect(() => declareGrandArchiveResolutionChoice(selection, ["FIRE"], evaluation)).toThrow(
      "illegal selection count",
    );
    expect(() =>
      declareGrandArchiveResolutionChoice(selection, ["FIRE", "FIRE"], evaluation),
    ).toThrow("cannot be selected twice");
    expect(() =>
      declareGrandArchiveResolutionChoice(selection, ["FIRE", "NORM"], evaluation),
    ).toThrow("not available");
  });

  it("uses every available object when an exact resolution count is unavailable", () => {
    const fixture = setup();
    const selection: GrandArchiveResolutionChoice = {
      ...frozenNovaSelection(),
      id: "three-allies-at-resolution",
      count: { kind: "exactly", amount: 3 },
    };
    const evaluation = {
      program: fixture.program,
      state: fixture.runtime.state,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      bindings: {},
    };

    expect(declareGrandArchiveResolutionChoice(selection, fixture.allyIds, evaluation)).toEqual(
      fixture.allyIds,
    );
    expect(() =>
      declareGrandArchiveResolutionChoice(selection, [fixture.allyIds[0]], evaluation),
    ).toThrow("illegal selection count");
    expect(randomlyDeclareGrandArchiveResolutionChoice(selection, evaluation).binding).toEqual(
      expect.arrayContaining([...fixture.allyIds]),
    );

    const announcement: GrandArchiveTargetDeclaration = {
      ...selection,
      kind: "target",
      declared: "announcement",
    };
    expect(() =>
      declareGrandArchiveTargets(
        [announcement],
        { [announcement.id]: fixture.allyIds },
        evaluation,
      ),
    ).toThrow("illegal selection count");
  });

  it("resolves Frozen Nova's forced all selection without creating a decision", () => {
    const fixture = setup();
    expect(
      fixture.runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.championId,
          abilityId: "selectionQuantifierChampion-a1",
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    for (let pass = 0; pass < 8 && fixture.runtime.state.stack.length > 0; pass += 1) {
      expect(fixture.runtime.state.decision).toBeNull();
      const holderId = fixture.runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Frozen Nova requires Opportunity while resolving");
      const result = fixture.runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
    }
    expect(fixture.runtime.state.stack).toHaveLength(0);
    for (const allyId of fixture.allyIds) {
      expect(fixture.runtime.state.objects[allyId]).toMatchObject({ damage: 1 });
      expect(fixture.runtime.state.objects[allyId]?.states.has("rested")).toBe(true);
    }
  });
});
