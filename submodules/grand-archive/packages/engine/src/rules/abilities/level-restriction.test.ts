import {
  boltOfDiamonds,
  crystalOfEmpowerment,
  spiritShard,
  tomeOfIgnorance,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { deriveGrandArchiveNumericProperty } from "../state/continuous.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import {
  createGrandArchiveMatchProgram,
  type GrandArchiveMatchProgram,
} from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function champion(
  canonicalId: string,
  level: number,
  elements: readonly [GrandArchiveElement, ...GrandArchiveElement[]] = ["NORM"],
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
        lineageName: "Restriction Tester",
        cost: { kind: "memory", amount: level },
        typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["MAGE"], subtypes: [] },
        elements,
        stats: { level, life: 20 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

function action(
  canonicalId: string,
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
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        speed: "fast",
        stats: {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const levelZeroChampion = champion("level-restriction-zero-champion", 0, ["NORM", "WATER"]);
const levelThreeChampion = champion("level-restriction-three-champion", 3);
const filler = action("level-restriction-filler");
const inlineAction = action("level-restriction-inline-action", [
  {
    id: "levelRestrictionInlineAction-a1",
    kind: "card-resolution",
    text: "Put an always counter on your champion.",
    effect: {
      kind: "add-counter",
      subject: { kind: "champion", player: "controller" },
      counter: { named: "always" },
      amount: 1,
    },
  },
  {
    id: "levelRestrictionInlineAction-a2",
    kind: "card-resolution",
    text: "[Level 2+] Put an inline counter on your champion.",
    restrictions: [
      {
        kind: "inline",
        name: "level-restriction",
        condition: {
          kind: "compare",
          comparison: {
            left: {
              kind: "property",
              subject: { kind: "champion", player: "controller" },
              property: "level",
              basis: "current",
            },
            operator: "gte",
            right: 2,
          },
        },
      },
    ],
    effect: {
      kind: "add-counter",
      subject: { kind: "champion", player: "controller" },
      counter: { named: "inline" },
      amount: 1,
    },
  },
]);
const inlineItem: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "level-restriction-inline-item",
  slug: "level-restriction-inline-item",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "level-restriction-inline-item:face:default",
      catalogId: "level-restriction-inline-item",
      name: "Level Restriction Inline Item",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["ITEM"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: {},
      rulesText: "[Level 2+] (0): Put an inline counter on this item.",
      abilities: [
        {
          id: "levelRestrictionInlineItem-a1",
          kind: "activated",
          activation: "ability",
          text: "[Level 2+] (0): Put an inline counter on this item.",
          cost: { kind: "pay-reserve", amount: 0 },
          restrictions: [
            {
              kind: "inline",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: { kind: "champion", player: "controller" },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "source" },
            counter: { named: "inline" },
            amount: 1,
          },
        },
      ],
    },
  },
};
const p1 = grandArchivePlayerId("p1");
const p2 = grandArchivePlayerId("p2");

function player(
  id: "p1" | "p2",
  championDefinition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mainCards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  materialCards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      ...mainCards.map((card) => ({ definitionId: card.canonicalId, count: 1 })),
      { definitionId: filler.canonicalId, count: 10 },
    ],
    materialDeck: [
      { definitionId: championDefinition.canonicalId, count: 1 },
      ...materialCards.map((card) => ({ definitionId: card.canonicalId, count: 1 })),
    ],
    startingChampionDefinitionId: championDefinition.canonicalId,
  };
}

function findOwned(
  state: GrandArchiveMatchState,
  ownerId: typeof p1 | typeof p2,
  definitionId: string,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing Level Restriction fixture object ${definitionId}`);
  return object.id;
}

function setupLevelZero(mainCard: typeof inlineAction | typeof boltOfDiamonds) {
  const program = createGrandArchiveMatchProgram([
    levelZeroChampion,
    filler,
    inlineAction,
    boltOfDiamonds,
    crystalOfEmpowerment,
  ]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        player("p1", levelZeroChampion, [mainCard], [crystalOfEmpowerment]),
        player("p2", levelZeroChampion, [], []),
      ],
      firstPlayerId: "p1",
      randomSeed: 2_513,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const mainCardId = findOwned(initial, p1, mainCard.canonicalId);
  const crystalId = findOwned(initial, p1, crystalOfEmpowerment.canonicalId);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: mainCardId, from: "main-deck", to: "hand" },
    { type: "object-moved", objectId: crystalId, from: "material-deck", to: "field" },
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    mainCardId,
    crystalId,
    championId: prepared.zones[p1].field.find(
      (id) => prepared.objects[id]?.definitionId === levelZeroChampion.canonicalId,
    )!,
    opponentChampionId: prepared.zones[p2].field.find(
      (id) => prepared.objects[id]?.definitionId === levelZeroChampion.canonicalId,
    )!,
  };
}

function passCurrent(runtime: GrandArchiveMatchRuntime): void {
  const holderId = runtime.state.opportunity?.holderId;
  if (!holderId) throw new Error("Expected an Opportunity holder");
  const result = runtime.execute({ move: "pass" }, { playerId: holderId });
  if (!result.ok) throw new Error(result.message);
}

function activateCrystal(runtime: GrandArchiveMatchRuntime, crystalId: GrandArchiveObjectId): void {
  const activated = runtime.execute(
    { move: "activate-ability", sourceId: crystalId, abilityId: "dmfoA7jOjy-a1" },
    { playerId: p1 },
  );
  if (!activated.ok) throw new Error(activated.message);
  passCurrent(runtime);
  passCurrent(runtime);
}

function currentLevel(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  championId: GrandArchiveObjectId,
): number | undefined {
  return deriveGrandArchiveNumericProperty(state.objects[championId]!, "level", {
    program,
    state,
    controllerId: state.objects[championId]!.controllerId,
    sourceId: championId,
    abilityBearerId: championId,
    bindings: {},
  });
}

describe("Grand Archive Level Restriction", () => {
  it("uses a current-level modifier to unlock catalog activation text", () => {
    const fixture = setupLevelZero(boltOfDiamonds);
    const locked = fixture.runtime.execute(
      {
        move: "activate-card",
        cardId: fixture.mainCardId,
        targets: { "target-1": [fixture.opponentChampionId] },
      },
      { playerId: p1 },
    );
    expect(locked).toMatchObject({ ok: false, code: "illegal-command" });

    activateCrystal(fixture.runtime, fixture.crystalId);
    expect(currentLevel(fixture.program, fixture.runtime.state, fixture.championId)).toBe(2);

    const unlocked = fixture.runtime.execute(
      {
        move: "activate-card",
        cardId: fixture.mainCardId,
        targets: { "target-1": [fixture.opponentChampionId] },
      },
      { playerId: p1 },
    );
    if (!unlocked.ok) throw new Error(unlocked.message);
    expect(fixture.runtime.state.stack.at(-1)).toMatchObject({
      kind: "card-activation",
      cardId: fixture.mainCardId,
      activationPayment: [],
    });
  });

  it("evaluates an inline Level Restriction only when its instruction resolves", () => {
    const lockedFixture = setupLevelZero(inlineAction);
    const locked = lockedFixture.runtime.execute(
      { move: "activate-card", cardId: lockedFixture.mainCardId },
      { playerId: p1 },
    );
    if (!locked.ok) throw new Error(locked.message);
    passCurrent(lockedFixture.runtime);
    passCurrent(lockedFixture.runtime);
    expect(
      lockedFixture.runtime.state.objects[lockedFixture.championId]?.counters["named:always"],
    ).toBe(1);
    expect(
      lockedFixture.runtime.state.objects[lockedFixture.championId]?.counters,
    ).not.toHaveProperty("named:inline");

    const unlockedFixture = setupLevelZero(inlineAction);
    const announced = unlockedFixture.runtime.execute(
      { move: "activate-card", cardId: unlockedFixture.mainCardId },
      { playerId: p1 },
    );
    if (!announced.ok) throw new Error(announced.message);
    activateCrystal(unlockedFixture.runtime, unlockedFixture.crystalId);
    expect(
      currentLevel(
        unlockedFixture.program,
        unlockedFixture.runtime.state,
        unlockedFixture.championId,
      ),
    ).toBe(2);
    passCurrent(unlockedFixture.runtime);
    passCurrent(unlockedFixture.runtime);
    expect(
      unlockedFixture.runtime.state.objects[unlockedFixture.championId]?.counters["named:inline"],
    ).toBe(1);
    expect(
      unlockedFixture.runtime.state.objects[unlockedFixture.championId]?.counters["named:always"],
    ).toBe(1);
  });

  it("applies the same resolution-time check to activated abilities", () => {
    const program = createGrandArchiveMatchProgram([
      levelZeroChampion,
      filler,
      inlineItem,
      crystalOfEmpowerment,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", levelZeroChampion, [], [inlineItem, crystalOfEmpowerment]),
          player("p2", levelZeroChampion, [], []),
        ],
        firstPlayerId: "p1",
        randomSeed: 2_515,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const itemId = findOwned(initial, p1, inlineItem.canonicalId);
    const crystalId = findOwned(initial, p1, crystalOfEmpowerment.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: itemId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: crystalId, from: "material-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const locked = runtime.execute(
      {
        move: "activate-ability",
        sourceId: itemId,
        abilityId: "levelRestrictionInlineItem-a1",
      },
      { playerId: p1 },
    );
    if (!locked.ok) throw new Error(locked.message);
    passCurrent(runtime);
    passCurrent(runtime);
    expect(runtime.state.objects[itemId]?.counters).not.toHaveProperty("named:inline");

    const announced = runtime.execute(
      {
        move: "activate-ability",
        sourceId: itemId,
        abilityId: "levelRestrictionInlineItem-a1",
      },
      { playerId: p1 },
    );
    if (!announced.ok) throw new Error(announced.message);
    activateCrystal(runtime, crystalId);
    passCurrent(runtime);
    passCurrent(runtime);
    expect(runtime.state.objects[itemId]?.counters["named:inline"]).toBe(1);
  });

  it("freezes a catalog static restriction on stack entry but rejects later activations", () => {
    const program = createGrandArchiveMatchProgram([
      levelZeroChampion,
      levelThreeChampion,
      filler,
      spiritShard,
      tomeOfIgnorance,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", levelZeroChampion, [], [levelThreeChampion]),
          player("p2", levelZeroChampion, [], [tomeOfIgnorance]),
        ],
        firstPlayerId: "p1",
        randomSeed: 2_514,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const kernel = new GrandArchiveTransactionKernel();
    const p1ChampionId = initial.zones[p1].field[0]!;
    const levelThreeId = findOwned(initial, p1, levelThreeChampion.canonicalId);
    const leveled = kernel.transact(initial, [
      {
        type: "champion-leveled-up",
        championId: p1ChampionId,
        cardId: levelThreeId,
        actorId: p1,
      },
    ]).state;
    const summoned = executeGrandArchiveEffect(
      { kind: "summon", controller: "controller", object: "Spirit Shard", amount: 2 },
      { program, state: leveled, controllerId: p1, bindings: {} },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const [firstShardId, secondShardId] = summoned.resultObjectIds;
    if (!firstShardId || !secondShardId) throw new Error("Expected two Spirit Shards");
    const runtime = new GrandArchiveMatchRuntime(program, summoned.state);
    const activated = runtime.execute(
      { move: "activate-ability", sourceId: firstShardId, abilityId: "3p5iqigcom-a1" },
      { playerId: p1 },
    );
    if (!activated.ok) throw new Error(activated.message);

    const tomeId = findOwned(runtime.state, p2, tomeOfIgnorance.canonicalId);
    const lowered = kernel.transact(runtime.state, [
      { type: "object-moved", objectId: tomeId, from: "material-deck", to: "field" },
    ]).state;
    const loweredRuntime = new GrandArchiveMatchRuntime(program, lowered);
    expect(currentLevel(program, loweredRuntime.state, p1ChampionId)).toBe(2);
    expect(
      loweredRuntime.execute(
        { move: "activate-ability", sourceId: secondShardId, abilityId: "3p5iqigcom-a1" },
        { playerId: p1 },
      ),
    ).toMatchObject({ ok: false, code: "illegal-command" });

    const handBefore = loweredRuntime.state.zones[p1].hand.length;
    passCurrent(loweredRuntime);
    passCurrent(loweredRuntime);
    expect(loweredRuntime.state.zones[p1].hand).toHaveLength(handBefore + 1);
  });
});
