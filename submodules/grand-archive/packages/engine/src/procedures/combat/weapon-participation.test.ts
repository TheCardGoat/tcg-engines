import {
  bulwarkSword,
  galahadCourtKnight,
  greaterBoonOfDetachment,
  intricateLongbow,
  luminousQuartz,
  mechanizedSmasher,
  pantheonBarrier,
  shadowsClaw,
  torRealmwalkerColossus,
  trainingSword,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchiveEffectAttackCandidates,
  proposeGrandArchiveAttackDeclaration,
} from "./combat.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchivePantheonPlayerSetup,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { collectGrandArchiveActionRules } from "../../rules/state/rule-modifications.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "ATTACK" | "CHAMPION" | "ITEM" | "LESSER BOON",
  options: {
    readonly classes?: readonly [GrandArchiveClass, ...GrandArchiveClass[]];
    readonly elements?: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
    readonly lineageName?: string;
    readonly power?: number;
    readonly subtypes?: readonly string[];
  } = {},
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
        ...(options.lineageName ? { lineageName: options.lineageName } : {}),
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: options.classes ?? ["WARRIOR"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        stats: {
          ...(type === "CHAMPION" ? { level: 0, life: 30 } : {}),
          ...(type === "ALLY" ? { life: 3 } : {}),
          ...(options.power === undefined ? {} : { power: options.power }),
        },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const warriorChampion = card("weapon-participation-warrior", "CHAMPION");
const tristanChampion = card("weapon-participation-tristan", "CHAMPION", {
  classes: ["ASSASSIN"],
  lineageName: "Tristan",
});
const phantasiaAlly = card("weapon-participation-phantasia", "ALLY", {
  classes: ["ASSASSIN"],
  power: 1,
  subtypes: ["PHANTASIA"],
});
const testAttack = card("weapon-participation-attack", "ATTACK", { power: 1 });
const filler = card("weapon-participation-filler", "ACTION");
const lesserBoon = card("weapon-participation-lesser-boon", "LESSER BOON");
const barrier = pantheonBarrier;
const windPaymentCards = [
  card("weapon-participation-wind-one", "ACTION", { elements: ["WIND"] }),
  card("weapon-participation-wind-two", "ACTION", { elements: ["WIND"] }),
  card("weapon-participation-wind-three", "ACTION", { elements: ["WIND"] }),
  card("weapon-participation-wind-four", "ACTION", { elements: ["WIND"] }),
] as const;
const firePaymentCard = card("weapon-participation-fire", "ACTION", { elements: ["FIRE"] });

function face(definition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  if (definition.layout.kind !== "single-faced") throw new Error("Test card must be single-faced");
  return definition.layout.face;
}

function setup(options: {
  readonly champion?: typeof warriorChampion | typeof tristanChampion;
  readonly main: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[];
  readonly material: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[];
  readonly field: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[];
  readonly handFillers?: number;
}) {
  const champion = options.champion ?? warriorChampion;
  const definitions = [champion, filler, ...options.main, ...options.material];
  const program = createGrandArchiveMatchProgram(definitions);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? options.main.map((definition) => ({ definitionId: definition.canonicalId, count: 1 }))
        : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1"
        ? options.material.map((definition) => ({ definitionId: definition.canonicalId, count: 1 }))
        : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 941,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (definition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definition.canonicalId,
    );
    if (!object) throw new Error(`Missing test object ${definition.canonicalId}`);
    return object;
  };
  const fieldObjects = options.field.map(find);
  const paymentCards = Object.values(initial.objects)
    .filter(
      (object) =>
        object.ownerId === p1 &&
        object.definitionId === filler.canonicalId &&
        object.zone === "main-deck",
    )
    .slice(0, options.handFillers ?? 0);
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    ...fieldObjects.map((object) => {
      const definition = definitions.find(
        (candidate) => candidate.canonicalId === object.definitionId,
      )!;
      const durability = face(definition).stats.durability;
      return {
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "field" as const,
        ...(durability === undefined ? {} : { initialCounters: { durability } }),
      };
    }),
    ...paymentCards.map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: object.zone,
      to: "hand" as const,
    })),
    { type: "player-first-turn-completed" as const, playerId: p1 },
  ]).state;
  return {
    program,
    state: positioned,
    runtime: new GrandArchiveMatchRuntime(program, positioned),
    p1,
    attackerId: positioned.zones[p1].field[0]!,
    defenderId: positioned.zones[p2].field[0]!,
    find,
    paymentCards,
  };
}

describe("Grand Archive weapon participation", () => {
  it("does not let a non-champion wield a weapon merely because it can attack as an ally", () => {
    const fixture = setup({
      main: [torRealmwalkerColossus],
      material: [trainingSword],
      field: [torRealmwalkerColossus, trainingSword],
    });
    const tor = fixture.find(torRealmwalkerColossus);
    const sword = fixture.find(trainingSword);

    expect(
      fixture.runtime.execute(
        {
          move: "declare-attack",
          attackerId: tor.id,
          targetIds: [fixture.defenderId],
          weaponIds: [sword.id],
        },
        { playerId: fixture.p1 },
      ),
    ).toMatchObject({ ok: false, message: "Selected object cannot be wielded for this attack" });
    expect(
      fixture.runtime.execute(
        {
          move: "declare-attack",
          attackerId: tor.id,
          targetIds: [fixture.defenderId],
        },
        { playerId: fixture.p1 },
      ),
    ).toMatchObject({ ok: true });
  });

  it("lets Galahad wield a controlled Sword through his class-bonus permission", () => {
    const fixture = setup({
      main: [galahadCourtKnight],
      material: [trainingSword],
      field: [galahadCourtKnight, trainingSword],
    });
    const galahad = fixture.find(galahadCourtKnight);
    const sword = fixture.find(trainingSword);

    expect(
      fixture.runtime.execute(
        {
          move: "declare-attack",
          attackerId: galahad.id,
          targetIds: [fixture.defenderId],
          weaponIds: [sword.id],
        },
        { playerId: fixture.p1 },
      ),
    ).toMatchObject({ ok: true });
  });

  it("charges Bulwark Sword's additional weapon-use cost atomically", () => {
    const fixture = setup({
      main: [],
      material: [bulwarkSword],
      field: [bulwarkSword],
      handFillers: 2,
    });
    const weapon = fixture.find(bulwarkSword);
    const command = {
      move: "declare-attack" as const,
      attackerId: fixture.attackerId,
      targetIds: [fixture.defenderId],
      weaponIds: [weapon.id],
    };

    expect(
      new GrandArchiveMatchRuntime(fixture.program, fixture.state).execute(command, {
        playerId: fixture.p1,
      }).ok,
    ).toBe(false);

    expect(
      fixture.runtime.execute(
        {
          ...command,
          reservePayment: fixture.paymentCards.map((payment) => ({
            kind: "card" as const,
            cardId: payment.id,
          })),
        },
        { playerId: fixture.p1 },
      ),
    ).toMatchObject({ ok: true });
    expect(
      fixture.paymentCards.map((payment) => fixture.runtime.state.objects[payment.id]?.zone),
    ).toEqual(["memory", "memory"]);
  });

  it("does not wield Luminous Quartz while it is rested", () => {
    const fixture = setup({
      main: [],
      material: [luminousQuartz],
      field: [luminousQuartz],
    });
    const weapon = fixture.find(luminousQuartz);
    const rested = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-state-changed", objectId: weapon.id, state: "rested", value: true },
    ]).state;

    expect(
      new GrandArchiveMatchRuntime(fixture.program, rested).execute(
        {
          move: "declare-attack",
          attackerId: fixture.attackerId,
          targetIds: [fixture.defenderId],
          weaponIds: [weapon.id],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(false);
  });

  it("does not wield Mechanized Smasher with a resolving Attack card", () => {
    const fixture = setup({
      main: [testAttack],
      material: [mechanizedSmasher],
      field: [mechanizedSmasher],
    });
    const attack = fixture.find(testAttack);
    const weapon = fixture.find(mechanizedSmasher);
    const intent = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: attack.id,
        from: attack.zone,
        to: "intent",
        hostId: fixture.attackerId,
      },
    ]).state;

    expect(() =>
      proposeGrandArchiveAttackDeclaration(
        fixture.program,
        intent,
        fixture.p1,
        {
          move: "declare-attack",
          attackerId: fixture.attackerId,
          attackCardId: attack.id,
          targetIds: [fixture.defenderId],
          weaponIds: [weapon.id],
        },
        { resolvedAttack: true },
      ),
    ).toThrow("cannot be wielded");
  });

  it("pays Mechanized Smasher's catalog reveal cost with four Wind cards from memory", () => {
    const fixture = setup({
      main: [...windPaymentCards],
      material: [mechanizedSmasher],
      field: [mechanizedSmasher],
    });
    const weapon = fixture.find(mechanizedSmasher);
    const windIds = windPaymentCards.map((definition) => fixture.find(definition).id);
    const prepared = new GrandArchiveTransactionKernel().transact(
      fixture.state,
      windIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    expect(
      runtime.execute(
        {
          move: "declare-attack",
          attackerId: fixture.attackerId,
          targetIds: [fixture.defenderId],
          weaponIds: [weapon.id],
          costSelections: [windIds],
        },
        { playerId: fixture.p1 },
      ),
    ).toMatchObject({ ok: true });
    expect(
      runtime.state.eventHistory
        .filter((event) => event.type === "card-revealed")
        .map((event) => ({ objectId: event.objectId, from: event.from })),
    ).toEqual(windIds.map((objectId) => ({ objectId, from: "memory" })));
    expect(windIds.map((objectId) => runtime.state.objects[objectId]?.zone)).toEqual([
      "memory",
      "memory",
      "memory",
      "memory",
    ]);
  });

  it("rolls back Mechanized Smasher attacks whose reveal declaration is incomplete or non-Wind", () => {
    const fixture = setup({
      main: [...windPaymentCards, firePaymentCard],
      material: [mechanizedSmasher],
      field: [mechanizedSmasher],
    });
    const weapon = fixture.find(mechanizedSmasher);
    const windIds = windPaymentCards.map((definition) => fixture.find(definition).id);
    const fireId = fixture.find(firePaymentCard).id;
    const prepared = new GrandArchiveTransactionKernel().transact(
      fixture.state,
      [...windIds, fireId].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);
    const retained = runtime.state;
    const command = {
      move: "declare-attack" as const,
      attackerId: fixture.attackerId,
      targetIds: [fixture.defenderId],
      weaponIds: [weapon.id],
    };

    expect(runtime.execute(command, { playerId: fixture.p1 }).ok).toBe(false);
    expect(runtime.state).toBe(retained);
    expect(
      runtime.execute(
        { ...command, costSelections: [[...windIds.slice(0, 3), fireId]] },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(false);
    expect(runtime.state).toBe(retained);
  });

  it("lets Greater Boon of Detachment waive an unloaded Ranger weapon's load requirement", () => {
    const rangerChampion = card("weapon-participation-ranger", "CHAMPION", {
      classes: ["RANGER"],
    });
    const definitions = [
      rangerChampion,
      filler,
      lesserBoon,
      greaterBoonOfDetachment,
      barrier,
      intricateLongbow,
    ];
    const program = createGrandArchiveMatchProgram(definitions);
    const player = (id: "p1" | "p2" | "p3"): GrandArchivePantheonPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: filler.canonicalId, count: 6 }],
      materialDeck: [
        { definitionId: rangerChampion.canonicalId, count: 1 },
        ...(id === "p1" ? [{ definitionId: intricateLongbow.canonicalId, count: 1 }] : []),
      ],
      startingChampionDefinitionId: rangerChampion.canonicalId,
      pantheon: {
        lesserBoonDefinitionId: lesserBoon.canonicalId,
        greaterBoonDefinitionId: greaterBoonOfDetachment.canonicalId,
        barrierDefinitionId: barrier.canonicalId,
      },
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "pantheon",
        players: [player("p1"), player("p2"), player("p3")],
        firstPlayerId: "p1",
        randomSeed: 943,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = initial.zones[p1].field.find(
      (id) => initial.objects[id]?.definitionId === rangerChampion.canonicalId,
    )!;
    const weapon = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === intricateLongbow.canonicalId,
    )!;
    const boonId = initial.zones[p1].pantheon.find(
      (id) => initial.objects[id]?.definitionId === greaterBoonOfDetachment.canonicalId,
    )!;
    const ready = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-facing-changed", objectId: boonId, facing: "face-up" },
      {
        type: "object-moved",
        objectId: weapon.id,
        from: weapon.zone,
        to: "field",
        initialCounters: { durability: 4 },
      },
      { type: "player-first-turn-completed", playerId: p1 },
    ]).state;
    const boon = ready.objects[boonId]!;
    expect(boon).toMatchObject({ zone: "pantheon", facing: "face-up" });
    expect(
      collectGrandArchiveActionRules({
        action: "use-weapon-for-attack",
        activationKind: "card",
        playerId: p1,
        candidateId: weapon.id,
        actorObjectId: attackerId,
        fromZone: "field",
        usingIds: [weapon.id],
        evaluation: {
          program,
          state: ready,
          controllerId: p1,
          candidateId: weapon.id,
          prospectiveAttackAttackerId: attackerId,
          bindings: {},
        },
      }).map((rule) => rule.effect.mode),
    ).toContain("allow");

    expect(
      grandArchiveEffectAttackCandidates(program, ready, attackerId).weaponCandidates,
    ).toContain(weapon.id);
    expect(
      new GrandArchiveMatchRuntime(program, ready).execute(
        {
          move: "declare-attack",
          attackerId,
          targetIds: [ready.zones[p2].field[0]!],
          weaponIds: [weapon.id],
        },
        { playerId: p1 },
      ),
    ).toMatchObject({ ok: true });
  });

  it("applies Shadow's Claw's durability result when a permitted Phantasia ally uses it", () => {
    const fixture = setup({
      champion: tristanChampion,
      main: [phantasiaAlly],
      material: [shadowsClaw],
      field: [phantasiaAlly, shadowsClaw],
    });
    const ally = fixture.find(phantasiaAlly);
    const weapon = fixture.find(shadowsClaw);

    expect(
      fixture.runtime.execute(
        {
          move: "declare-attack",
          attackerId: ally.id,
          targetIds: [fixture.defenderId],
          weaponIds: [weapon.id],
        },
        { playerId: fixture.p1 },
      ),
    ).toMatchObject({ ok: true });
    expect(fixture.runtime.state.objects[weapon.id]?.counters.durability).toBe(4);
  });
});
