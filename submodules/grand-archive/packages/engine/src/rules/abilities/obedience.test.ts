import { blueSlime, fabricatorSlime } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "./triggers.ts";

function champion(level: number): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  const id = `obedience-champion-${level}`;
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
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: ["TAMER"],
          subtypes: ["TAMER"],
        },
        elements: ["NEOS"],
        stats: { level: 0, life: 30 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

function levelAura(level: number): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  const id = `obedience-level-aura-${level}`;
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
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: ["ITEM"],
          classes: ["TAMER"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: {},
        rulesText: "",
        abilities: [
          {
            id: `${id}-a1`,
            kind: "static",
            staticKind: "effects",
            text: `Your champion gets +${level} level.`,
            effects: [
              {
                kind: "continuous",
                subjects: { kind: "champion", player: "controller" },
                affectedSet: "dynamic",
                duration: { kind: "while-source-in-functional-zone" },
                layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
                change: {
                  kind: "numeric",
                  property: "level",
                  operation: "add",
                  amount: level,
                },
              },
            ],
          },
        ],
      },
    },
  };
}

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "obedience-filler",
  slug: "obedience-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "obedience-filler:face:default",
      catalogId: "obedience-filler",
      name: "obedience-filler",
      cost: { kind: "none" },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: [],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

const prideAura: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "obedience-pride-aura",
  slug: "obedience-pride-aura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "obedience-pride-aura:face:default",
      catalogId: "obedience-pride-aura",
      name: "obedience-pride-aura",
      cost: { kind: "none" },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: [],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "",
      abilities: [
        {
          id: "obediencePrideAura-a1",
          kind: "static",
          staticKind: "effects",
          text: "Allies you control have pride 5.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
              affectedSet: "dynamic",
              duration: { kind: "while-source-in-functional-zone" },
              layer: { layer: "D", modifies: "ability" },
              change: { kind: "grant-keyword", keyword: { name: "pride", value: 5 } },
            },
          ],
        },
      ],
    },
  },
};

function setup(level: number) {
  const startingChampion = champion(level);
  const opposingChampion = champion(0);
  const aura = levelAura(level);
  const program = createGrandArchiveMatchProgram([
    startingChampion,
    opposingChampion,
    aura,
    blueSlime,
    fabricatorSlime,
    filler,
    prideAura,
  ]);
  const player = (
    id: string,
    withSlime: boolean,
    championDefinitionId: string,
  ): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      ...(withSlime
        ? [
            { definitionId: fabricatorSlime.canonicalId, count: 1 },
            { definitionId: blueSlime.canonicalId, count: 1 },
          ]
        : []),
      { definitionId: filler.canonicalId, count: withSlime ? 6 : 8 },
    ],
    materialDeck: [
      { definitionId: championDefinitionId, count: 1 },
      ...(withSlime
        ? [
            { definitionId: aura.canonicalId, count: 1 },
            { definitionId: prideAura.canonicalId, count: 1 },
          ]
        : []),
    ],
    startingChampionDefinitionId: championDefinitionId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        player("p1", true, startingChampion.canonicalId),
        player("p2", false, opposingChampion.canonicalId),
      ],
      firstPlayerId: "p1",
      randomSeed: 263 + level,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const slimeId = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === fabricatorSlime.canonicalId,
  )!.id;
  const auraId = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === aura.canonicalId,
  )!.id;
  const positioned = new GrandArchiveTransactionKernel().transact(state, [
    {
      type: "object-moved",
      objectId: slimeId,
      from: state.objects[slimeId]!.zone,
      to: "field",
    },
    {
      type: "object-moved",
      objectId: auraId,
      from: state.objects[auraId]!.zone,
      to: "field",
    },
  ]).state;
  const blueSlimeId = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === blueSlime.canonicalId,
  )!.id;
  const prideAuraId = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === prideAura.canonicalId,
  )!.id;
  const fillerIds = Object.values(state.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
    .map((object) => object.id);
  return {
    program,
    initial: state,
    state: positioned,
    p1,
    p2,
    slimeId,
    auraId,
    prideAuraId,
    blueSlimeId,
    fillerIds,
  };
}

describe("Grand Archive obedience", () => {
  it("rejects Fabricator Slime's activated ability while Pride 3 is unmet", () => {
    const fixture = setup(2);
    const command = {
      move: "activate-ability" as const,
      sourceId: fixture.slimeId,
      abilityId: "rpELNyrSrM-a3",
    };

    const result = new GrandArchiveMatchRuntime(fixture.program, fixture.state).execute(command, {
      playerId: fixture.p1,
    });

    expect(result).toMatchObject({
      ok: false,
      code: "illegal-command",
      message: "Player cannot activate an ability of a disobedient ally",
    });
    expect(
      listGrandArchiveLegalCommands(fixture.program, fixture.state, fixture.p1).some(
        (candidate) =>
          candidate.command.move === "activate-ability" &&
          candidate.command.sourceId === fixture.slimeId &&
          candidate.command.abilityId === "rpELNyrSrM-a3",
      ),
    ).toBe(false);
  });

  it("allows the same activated ability once its Pride threshold is met", () => {
    const fixture = setup(3);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    const result = runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.slimeId,
        abilityId: "rpELNyrSrM-a3",
      },
      { playerId: fixture.p1 },
    );

    if (!result.ok) throw new Error(result.message);
    expect(runtime.state.objects[fixture.slimeId]?.states.has("rested")).toBe(true);
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "activated-ability",
      sourceId: fixture.slimeId,
    });
  });

  it("uses the highest value when the ally has multiple Pride abilities", () => {
    const fixture = setup(3);
    const withAdditionalPride = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.prideAuraId,
        from: fixture.state.objects[fixture.prideAuraId]!.zone,
        to: "field",
      },
    ]).state;
    const result = new GrandArchiveMatchRuntime(fixture.program, withAdditionalPride).execute(
      {
        move: "activate-ability",
        sourceId: fixture.slimeId,
        abilityId: "rpELNyrSrM-a3",
      },
      { playerId: fixture.p1 },
    );

    expect(result).toMatchObject({
      ok: false,
      code: "illegal-command",
      message: "Player cannot activate an ability of a disobedient ally",
    });
  });

  it("keeps Fabricator Slime's static entry replacement functional while it is disobedient", () => {
    const fixture = setup(2);
    const hand = new GrandArchiveTransactionKernel().transact(
      fixture.initial,
      [fixture.slimeId, ...fixture.fillerIds.slice(0, 2)].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: fixture.initial.objects[objectId]!.zone,
        to: "hand" as const,
      })),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, hand);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: fixture.slimeId,
        reservePayment: fixture.fillerIds
          .slice(0, 2)
          .map((cardId) => ({ kind: "card" as const, cardId })),
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    expect(runtime.state.objects[fixture.slimeId]).toMatchObject({ zone: "field" });
    expect(runtime.state.objects[fixture.slimeId]?.counters.buff).toBe(1);
  });

  it("still admits Blue Slime's triggered ability while Pride 4 is unmet", () => {
    const fixture = setup(2);
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.initial, [
      {
        type: "object-moved",
        objectId: fixture.blueSlimeId,
        from: fixture.initial.objects[fixture.blueSlimeId]!.zone,
        to: "field",
      },
    ]).state;
    const damage = new GrandArchiveTransactionKernel().transact(positioned, [
      {
        type: "damage-marked",
        objectId: fixture.blueSlimeId,
        amount: 1,
        sourceId: positioned.zones[fixture.p2].field[0]!,
        actorId: fixture.p2,
        cause: { kind: "rule", rule: "obedience-trigger-test" },
      },
    ]);

    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        fixture.program,
        damage.state,
        damage.result.events,
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "pending-trigger-added",
          trigger: expect.objectContaining({
            ability: expect.objectContaining({ id: "1Sl4Gq2OuV-a2" }),
          }),
        }),
      ]),
    );
  });

  it("does not stop an attack that began before its attacker became disobedient", () => {
    const fixture = setup(3);
    const strengthened = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "counter-changed",
        objectId: fixture.slimeId,
        counter: "buff",
        delta: 1,
      },
    ]).state;
    const ready = {
      ...strengthened,
      players: {
        ...strengthened.players,
        [fixture.p1]: {
          ...strengthened.players[fixture.p1]!,
          hasTakenFirstTurn: true,
        },
      },
    };
    const targetId = ready.zones[fixture.p2].field[0]!;
    const declaringRuntime = new GrandArchiveMatchRuntime(fixture.program, ready);
    const declaration = declaringRuntime.execute(
      {
        move: "declare-attack",
        attackerId: fixture.slimeId,
        targetIds: [targetId],
      },
      { playerId: fixture.p1 },
    );
    if (!declaration.ok) throw new Error(declaration.message);

    const lostPrideRequirement = new GrandArchiveTransactionKernel().transact(
      declaringRuntime.state,
      [
        {
          type: "object-moved",
          objectId: fixture.auraId,
          from: "field",
          to: "graveyard",
        },
      ],
    ).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, lostPrideRequirement);
    for (let index = 0; index < 12 && runtime.state.combat; index += 1) {
      if (runtime.state.decision) {
        throw new Error(`Unexpected combat decision: ${runtime.state.decision.kind}`);
      }
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Combat continuation requires Opportunity");
      const pass = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!pass.ok) throw new Error(pass.message);
    }

    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.objects[targetId]?.damage).toBe(1);
  });
});
