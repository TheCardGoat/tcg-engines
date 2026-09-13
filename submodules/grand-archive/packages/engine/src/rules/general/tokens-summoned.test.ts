import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { silvershine, volnia, zinnVolniaAbbess } from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
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
        cost: type === "ACTION" ? { kind: "reserve", amount: 0 } : { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 5 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("summon-event-champion", "CHAMPION", [
  {
    id: "summonEventChampion-a1",
    kind: "activated",
    activation: "ability",
    text: "Reserve 1: Do nothing.",
    cost: { kind: "pay-reserve", amount: 1 },
    effect: { kind: "no-op" },
  },
]);
const arisannaTestChampion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = (() => {
  const base = card("summon-event-arisanna", "CHAMPION");
  if (base.layout.kind !== "single-faced") throw new Error("Expected a single-faced champion");
  return {
    ...base,
    layout: {
      ...base.layout,
      face: {
        ...base.layout.face,
        name: "Arisanna, Test Champion",
        lineageName: "Arisanna",
      },
    },
  };
})();
const token = card("summon-event-token", "ITEM", [
  {
    id: "summonEventToken-a1",
    kind: "activated",
    activation: "ability",
    text: "Sacrifice this: Do nothing.",
    cost: { kind: "sacrifice", subject: { kind: "source" } },
    effect: { kind: "no-op" },
  },
  {
    id: "summonEventToken-a2",
    kind: "triggered",
    text: "On Leave: Draw a card.",
    trigger: {
      kind: "event",
      event: { name: "object-left-field", subject: { kind: "source" } },
    },
    effect: { kind: "draw", player: "controller", amount: 1 },
  },
  {
    id: "summonEventToken-a3",
    kind: "activated",
    activation: "ability",
    text: "Sacrifice this: The next time you reserve a card, draw a card.",
    cost: { kind: "sacrifice", subject: { kind: "source" } },
    effect: {
      kind: "create-delayed-trigger",
      trigger: {
        kind: "event",
        event: { name: "card-reserved", actor: "controller" },
      },
      limit: 1,
      effect: { kind: "draw", player: "controller", amount: 1 },
    },
  },
]);
const filler = card("summon-event-filler", "ACTION");
const watcher = card("summon-event-watcher", "ALLY", [
  {
    id: "summonEventWatcher-a1",
    kind: "triggered",
    text: "Whenever you summon one or more tokens, put that many counters on this ally.",
    trigger: {
      kind: "event",
      cardinality: "one-or-more",
      event: {
        name: "tokens-summoned",
        actor: "controller",
        subject: {
          kind: "event-object",
          bindAs: "summoned-token-batch",
          filter: { kind: "token", value: true },
        },
      },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "summoned" },
      amount: { kind: "event-amount" },
    },
  },
]);
const summonTwo = card("summon-event-action", "ACTION", [
  {
    id: "summonEventAction-a1",
    kind: "card-resolution",
    text: "Summon two test tokens.",
    effect: { kind: "summon", object: token.canonicalId, controller: "controller", amount: 2 },
  },
]);
const summonTwoSilvershine = card("summon-two-silvershine", "ACTION", [
  {
    id: "summonTwoSilvershine-a1",
    kind: "card-resolution",
    text: "Summon two Silvershine tokens.",
    effect: {
      kind: "summon",
      object: silvershine.canonicalId,
      controller: "controller",
      amount: 2,
    },
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([champion, token, filler, watcher, summonTwo]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: watcher.canonicalId, count: 1 },
      { definitionId: summonTwo.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 443,
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
    p2: grandArchivePlayerId("p2"),
    watcherId: objectId(watcher.canonicalId),
    actionId: objectId(summonTwo.canonicalId),
  };
}

function setupZinnSummon(startingChampion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  const program = createGrandArchiveMatchProgram([
    startingChampion,
    silvershine,
    volnia,
    zinnVolniaAbbess,
    summonTwoSilvershine,
    filler,
  ]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: zinnVolniaAbbess.canonicalId, count: 1 },
      { definitionId: summonTwoSilvershine.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: startingChampion.canonicalId, count: 1 }],
    startingChampionDefinitionId: startingChampion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 777,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const findOwned = (definitionId: string) =>
    Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === definitionId,
    )!.id;
  const zinnId = findOwned(zinnVolniaAbbess.canonicalId);
  const actionId = findOwned(summonTwoSilvershine.canonicalId);
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: zinnId, from: "main-deck", to: "field" },
    { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, positioned),
    p1,
    p2,
    actionId,
  };
}

function resolveZinnSummon(fixture: ReturnType<typeof setupZinnSummon>): void {
  const { runtime, p1, p2, actionId } = fixture;
  const activation = runtime.execute(
    { move: "activate-card", cardId: actionId, reservePayment: [] },
    { playerId: p1 },
  );
  if (!activation.ok) throw new Error(activation.message);
  const firstPass = runtime.execute({ move: "pass" }, { playerId: p1 });
  if (!firstPass.ok) throw new Error(firstPass.message);
  const secondPass = runtime.execute({ move: "pass" }, { playerId: p2 });
  if (!secondPass.ok) {
    throw new Error(
      `${secondPass.message}: ${JSON.stringify({
        diagnostic: secondPass.diagnostic,
        opportunity: runtime.state.opportunity,
        stack: runtime.state.stack,
      })}`,
    );
  }
}

describe("Grand Archive token summon batches", () => {
  it("applies Zinn's Champion Bonus once to replace an entire Silvershine batch", () => {
    const fixture = setupZinnSummon(arisannaTestChampion);
    resolveZinnSummon(fixture);
    const { runtime, p1 } = fixture;

    const summonEvents = runtime.state.eventHistory.filter(
      (event) => event.type === "tokens-summoned",
    );
    expect(summonEvents).toHaveLength(1);
    const summoned = summonEvents[0];
    if (!summoned || summoned.type !== "tokens-summoned") {
      throw new Error("Expected Zinn's replaced summon batch");
    }
    expect(summoned.objects).toHaveLength(2);
    expect(summoned.objects.map((object) => object.definitionId)).toEqual([
      volnia.canonicalId,
      volnia.canonicalId,
    ]);
    expect(
      Object.values(runtime.state.objects).filter(
        (object) => object.controllerId === p1 && object.definitionId === silvershine.canonicalId,
      ),
    ).toHaveLength(0);
  });

  it("leaves the Silvershine batch unchanged when Zinn's Champion Bonus is disabled", () => {
    const fixture = setupZinnSummon(champion);
    resolveZinnSummon(fixture);

    const summoned = fixture.runtime.state.eventHistory.find(
      (event) => event.type === "tokens-summoned",
    );
    if (!summoned || summoned.type !== "tokens-summoned") {
      throw new Error("Expected the original summon batch");
    }
    expect(summoned.objects.map((object) => object.definitionId)).toEqual([
      silvershine.canonicalId,
      silvershine.canonicalId,
    ]);
  });

  it("emits one batch event, binds every token, and triggers only once", () => {
    const fixture = setup();
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: fixture.watcherId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: fixture.actionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    const activation = runtime.execute(
      { move: "activate-card", cardId: fixture.actionId, reservePayment: [] },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const summonEvents = runtime.state.eventHistory.filter(
      (event) => event.type === "tokens-summoned",
    );
    expect(summonEvents).toHaveLength(1);
    const summonEvent = summonEvents[0];
    if (!summonEvent || summonEvent.type !== "tokens-summoned") {
      throw new Error("Expected a committed token summon batch");
    }
    expect(summonEvent.objects).toHaveLength(2);
    expect(summonEvent.objects.every((object) => object.zone === "field" && object.isToken)).toBe(
      true,
    );
    const trigger = runtime.state.stack.find((item) => item.kind === "triggered-ability");
    expect(trigger?.bindings["summoned-token-batch"]).toEqual(
      summonEvent.objects.map((object) => object.id),
    );
    expect(runtime.state.stack.filter((item) => item.kind === "triggered-ability")).toHaveLength(1);

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );
    expect(restored.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(restored.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    expect(restored.state.objects[fixture.watcherId]?.counters["named:summoned"]).toBe(2);
  });

  it("lets a departed token trigger from last-known information before it ceases", () => {
    const fixture = setup();
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: fixture.actionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);

    expect(
      runtime.execute(
        { move: "activate-card", cardId: fixture.actionId, reservePayment: [] },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const summoned = [...runtime.state.eventHistory]
      .reverse()
      .find((event) => event.type === "tokens-summoned");
    if (!summoned || summoned.type !== "tokens-summoned") {
      throw new Error("Expected a committed token summon batch");
    }
    const tokenId = summoned.objects[0]!.id;
    const handBefore = runtime.state.zones[fixture.p1].hand.length;

    expect(
      runtime.execute(
        { move: "activate-ability", sourceId: tokenId, abilityId: "summonEventToken-a1" },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);

    expect(runtime.state.objects[tokenId]).toBeUndefined();
    expect(runtime.state.zones[fixture.p1].graveyard).not.toContain(tokenId);
    expect(runtime.state.stack).toContainEqual(
      expect.objectContaining({
        kind: "triggered-ability",
        sourceId: tokenId,
        ability: expect.objectContaining({ id: "summonEventToken-a2" }),
      }),
    );

    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    expect(runtime.state.zones[fixture.p1].hand).toHaveLength(handBefore + 1);
  });

  it("keeps a token's generated delayed trigger after the source token ceases", () => {
    const fixture = setup();
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: fixture.actionId, from: "main-deck", to: "hand" },
    ]).state;
    let runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);

    expect(
      runtime.execute(
        { move: "activate-card", cardId: fixture.actionId, reservePayment: [] },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const summoned = [...runtime.state.eventHistory]
      .reverse()
      .find((event) => event.type === "tokens-summoned");
    if (!summoned || summoned.type !== "tokens-summoned") {
      throw new Error("Expected a committed token summon batch");
    }
    const tokenId = summoned.objects[0]!.id;

    expect(
      runtime.execute(
        { move: "activate-ability", sourceId: tokenId, abilityId: "summonEventToken-a3" },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    for (let pass = 0; pass < 4 && runtime.state.delayedTriggers.length === 0; pass += 1) {
      expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    }

    // Tokens cease after leaving the field, but the generated delayed ability
    // remains independent of its source. See Triggered Abilities rules 6-9
    // and Resolving Triggered and Activated Abilities rule 1.2.1.
    expect(runtime.state.objects[tokenId]).toBeUndefined();
    expect(runtime.state.delayedTriggers).toHaveLength(1);

    const paymentId = runtime.state.zones[fixture.p1]["main-deck"][0]!;
    const withPayment = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "object-moved", objectId: paymentId, from: "main-deck", to: "hand" },
    ]).state;
    runtime = new GrandArchiveMatchRuntime(fixture.program, withPayment);
    const championId = runtime.state.zones[fixture.p1].field.find(
      (objectId) => runtime.state.objects[objectId]?.definitionId === champion.canonicalId,
    );
    if (!championId) throw new Error("Expected the starting champion");

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: championId,
          abilityId: "summonEventChampion-a1",
          reservePayment: [{ kind: "card", cardId: paymentId }],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.delayedTriggers).toHaveLength(0);
    expect(runtime.state.objects[tokenId]).toBeUndefined();
    expect(runtime.state.stack).toContainEqual(
      expect.objectContaining({
        kind: "triggered-ability",
        sourceId: tokenId,
      }),
    );

    const handAfterPayment = runtime.state.zones[fixture.p1].hand.length;
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    expect(runtime.state.zones[fixture.p1].hand).toHaveLength(handAfterPayment + 1);
  });
});
