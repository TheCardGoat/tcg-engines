import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "./identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveDecision } from "./model.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../snapshot/snapshot.ts";

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

const champion = card("link-entry-champion", "CHAMPION");
const ally = card("link-entry-ally", "ALLY");
const filler = card("link-entry-filler", "ACTION");
const allyLinkItem = card("link-entry-item", "ITEM", [
  {
    id: "linkEntryItem-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Ally Link",
    keyword: { name: "link", target: "ally" },
  },
]);
const flexibleLinkItem = card("link-entry-flexible-item", "ITEM", [
  {
    id: "linkEntryFlexibleItem-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Ally Link",
    keyword: { name: "link", target: "ally" },
  },
  {
    id: "linkEntryFlexibleItem-a2",
    kind: "static",
    staticKind: "intrinsic",
    text: "Champion Link",
    keyword: { name: "link", target: "champion" },
  },
]);
const moveOne = card("link-entry-move-one", "ACTION", [
  {
    id: "linkEntryMoveOne-a1",
    kind: "card-resolution",
    text: "Put target item from a graveyard onto the field under your control.",
    targets: [
      {
        id: "linked-card",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        unique: true,
        candidates: {
          kind: "card",
          zones: ["graveyard"],
          filter: { kind: "type", oneOf: ["ITEM"] },
        },
      },
    ],
    effect: {
      kind: "move",
      subject: { kind: "bound", binding: "linked-card" },
      from: "graveyard",
      destination: { zone: "field", controller: "controller" },
    },
  },
]);
const moveAll = card("link-entry-move-all", "ACTION", [
  {
    id: "linkEntryMoveAll-a1",
    kind: "card-resolution",
    text: "Put all item cards from your graveyard onto the field under your control.",
    effect: {
      kind: "move",
      subject: {
        kind: "each",
        collection: {
          zones: ["graveyard"],
          player: "controller",
          filter: { kind: "type", oneOf: ["ITEM"] },
        },
      },
      from: "graveyard",
      destination: { zone: "field", controller: "controller" },
    },
  },
]);

function entryAction(id: string, effect: GrandArchiveEffect) {
  return card(id, "ACTION", [
    {
      id: `${id}-a1`,
      kind: "card-resolution",
      text: "Create linked objects for Link entry testing.",
      effect,
    },
  ]);
}

const summonLinked = entryAction("link-entry-summon", {
  kind: "summon",
  object: allyLinkItem.canonicalId,
  controller: "controller",
  amount: 2,
});
const summonLinkedCopies = entryAction("link-entry-summon-copies", {
  kind: "summon-copies",
  controller: "controller",
  subjects: {
    kind: "each",
    collection: {
      zones: ["graveyard"],
      player: "controller",
      filter: { kind: "canonical-id", value: allyLinkItem.canonicalId },
    },
  },
  token: true,
});
const generateLinked = entryAction("link-entry-generate", {
  kind: "generate",
  card: allyLinkItem.canonicalId,
  player: "controller",
  destination: { zone: "field", controller: "controller" },
  amount: 2,
});
const copyLinked = entryAction("link-entry-copy", {
  kind: "copy",
  copy: "object",
  subject: {
    kind: "each",
    collection: {
      zones: ["field"],
      player: "controller",
      filter: { kind: "canonical-id", value: allyLinkItem.canonicalId },
    },
  },
  amount: 2,
});
const gatherLinked = entryAction("link-entry-gather", {
  kind: "keyword-action",
  action: "gather",
  player: "controller",
});
const gatherIngredientNames = [
  "Blightroot",
  "Fraysia",
  "Manaroot",
  "Razorvine",
  "Silvershine",
  "Springleaf",
] as const;
const gatherIngredients = gatherIngredientNames.map((name, index) =>
  card(name, "ITEM", [
    {
      id: `gatherIngredient-${index}-a1`,
      kind: "static",
      staticKind: "intrinsic",
      text: "Ally Link",
      keyword: { name: "link", target: "ally" },
    },
  ]),
);
const plainToken = card("link-entry-plain-token", "ITEM");
const replacementSource = card("link-entry-replacement-source", "ITEM", [
  {
    id: "linkEntryReplacementSource-a1",
    kind: "static",
    staticKind: "effects",
    text: "If you would summon a test token, summon a linked token instead.",
    effects: [
      {
        kind: "replacement",
        event: {
          name: "tokens-summoned",
          actor: "controller",
          subject: {
            kind: "event-object",
            filter: { kind: "canonical-id", value: plainToken.canonicalId },
          },
        },
        operation: {
          kind: "replace-with",
          effect: {
            kind: "summon",
            object: allyLinkItem.canonicalId,
            controller: "controller",
            amount: { kind: "event-amount" },
          },
        },
        duration: { kind: "while-source-in-functional-zone" },
      },
    ],
  },
]);
const summonReplacedToken = entryAction("link-entry-summon-replaced", {
  kind: "summon",
  object: plainToken.canonicalId,
  controller: "controller",
  amount: 2,
});

const creationActions = [summonLinked, summonLinkedCopies, generateLinked, copyLinked] as const;
const allCards = [
  champion,
  ally,
  filler,
  allyLinkItem,
  flexibleLinkItem,
  moveOne,
  moveAll,
  ...creationActions,
  gatherLinked,
  ...gatherIngredients,
  replacementSource,
  plainToken,
  summonReplacedToken,
];

function setup() {
  const program = createGrandArchiveMatchProgram(allCards);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: allyLinkItem.canonicalId, count: 2 },
      { definitionId: flexibleLinkItem.canonicalId, count: 1 },
      { definitionId: moveOne.canonicalId, count: 1 },
      { definitionId: moveAll.canonicalId, count: 1 },
      ...creationActions.map((action) => ({ definitionId: action.canonicalId, count: 1 })),
      { definitionId: gatherLinked.canonicalId, count: 1 },
      { definitionId: replacementSource.canonicalId, count: 1 },
      { definitionId: summonReplacedToken.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 4 },
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
      randomSeed: 227,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return {
    program,
    state,
    p1: grandArchivePlayerId("p1"),
    p2: grandArchivePlayerId("p2"),
  };
}

function findIds(
  fixture: ReturnType<typeof setup>,
  playerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
) {
  return Object.values(fixture.state.objects)
    .filter((object) => object.ownerId === playerId && object.definitionId === definitionId)
    .map((object) => object.id);
}

function passUntilDecision(runtime: GrandArchiveMatchRuntime): Exclude<GrandArchiveDecision, null> {
  for (let index = 0; index < 20 && !runtime.state.decision; index += 1) {
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Link entry resolution requires Opportunity");
    const result = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!result.ok) throw new Error(result.message);
  }
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a Link entry choice");
  return decision;
}

function answerObjectChoice(
  runtime: GrandArchiveMatchRuntime,
  decision: Exclude<GrandArchiveDecision, null>,
  playerId: ReturnType<typeof grandArchivePlayerId>,
  objectId: string,
) {
  const result = runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: [objectId],
    },
    { playerId },
  );
  if (!result.ok) throw new Error(result.message);
  return result;
}

describe("Grand Archive non-stack Link entry", () => {
  it("asks the entering object's controller to choose a legal linked object without targeting", () => {
    const fixture = setup();
    const actionId = findIds(fixture, fixture.p1, moveOne.canonicalId)[0]!;
    const itemId = findIds(fixture, fixture.p1, flexibleLinkItem.canonicalId)[0]!;
    const opposingAllyId = findIds(fixture, fixture.p2, ally.canonicalId)[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: itemId, from: "main-deck", to: "graveyard" },
      { type: "object-moved", objectId: opposingAllyId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: actionId,
        targets: { "linked-card": [itemId] },
        reservePayment: [],
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.stack.at(-1)?.targets).toEqual([
      {
        binding: "linked-card",
        targetIds: [itemId],
        targetObjectIncarnations: { [itemId]: positioned.objects[itemId]!.incarnation },
        required: true,
      },
    ]);

    const decision = passUntilDecision(runtime);
    expect(decision).toMatchObject({ kind: "resolve-effect-choice", playerId: fixture.p1 });
    answerObjectChoice(runtime, decision, fixture.p1, opposingAllyId);
    expect(runtime.state.objects[itemId]).toMatchObject({ zone: "field", hostId: opposingAllyId });
  });

  it("lets an unlinked object enter and then sacrifices it when no legal Link choice exists", () => {
    const fixture = setup();
    const actionId = findIds(fixture, fixture.p1, moveOne.canonicalId)[0]!;
    const itemId = findIds(fixture, fixture.p1, allyLinkItem.canonicalId)[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: itemId, from: "main-deck", to: "graveyard" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: actionId,
        targets: { "linked-card": [itemId] },
        reservePayment: [],
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    const events = [...activation.events];
    for (let index = 0; index < 6 && runtime.state.stack.length > 0; index += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Link sacrifice resolution requires Opportunity");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
      events.push(...result.events);
    }
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[itemId]?.zone).toBe("graveyard");
    expect(events).toContainEqual(
      expect.objectContaining({
        type: "object-moved",
        objectId: itemId,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "broken-link-sacrifice" },
      }),
    );
  });

  it("sacrifices newly summoned linked tokens without prompting when no choice is legal", () => {
    const fixture = setup();
    const actionId = findIds(fixture, fixture.p1, summonLinked.canonicalId)[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId, reservePayment: [] },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    const events = [...activation.events];
    for (let index = 0; index < 4 && runtime.state.stack.length > 0; index += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Summoned Link resolution requires Opportunity");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
      events.push(...result.events);
    }

    expect(runtime.state.decision).toBeNull();
    expect(
      Object.values(runtime.state.objects).filter(
        (object) => object.definitionId === allyLinkItem.canonicalId && object.isToken,
      ),
    ).toEqual([]);
    expect(
      events.filter(
        (event) =>
          event.type === "object-moved" &&
          event.cause?.kind === "rule" &&
          event.cause.rule === "broken-link-sacrifice",
      ),
    ).toHaveLength(2);
  });

  it("collects every Link choice before simultaneously moving multiple objects", () => {
    const fixture = setup();
    const actionId = findIds(fixture, fixture.p1, moveAll.canonicalId)[0]!;
    const itemIds = findIds(fixture, fixture.p1, allyLinkItem.canonicalId);
    const allyId = findIds(fixture, fixture.p1, ally.canonicalId)[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      ...itemIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "graveyard" as const,
      })),
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId, reservePayment: [] },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);

    const firstDecision = passUntilDecision(runtime);
    answerObjectChoice(runtime, firstDecision, fixture.p1, allyId);
    expect(itemIds.every((id) => runtime.state.objects[id]?.zone === "graveyard")).toBe(true);
    const secondDecision = runtime.state.decision;
    if (!secondDecision) throw new Error("Expected the second Link entry choice");
    answerObjectChoice(runtime, secondDecision, fixture.p1, allyId);
    expect(itemIds.every((id) => runtime.state.objects[id]?.zone === "field")).toBe(true);
    expect(itemIds.every((id) => runtime.state.objects[id]?.hostId === allyId)).toBe(true);
  });

  it.each([
    ["summon", summonLinked, "none"],
    ["summon-copies", summonLinkedCopies, "graveyard"],
    ["generate to the field", generateLinked, "none"],
    ["copy an object on the field", copyLinked, "field"],
  ] as const)(
    "chooses Link hosts before effects %s create simultaneous field objects",
    (_label, action, sourceSetup) => {
      const fixture = setup();
      const actionId = findIds(fixture, fixture.p1, action.canonicalId)[0]!;
      const itemIds = findIds(fixture, fixture.p1, allyLinkItem.canonicalId);
      const allyId = findIds(fixture, fixture.p1, ally.canonicalId)[0]!;
      const setupEvents = [
        {
          type: "object-moved" as const,
          objectId: actionId,
          from: "main-deck" as const,
          to: "hand" as const,
        },
        {
          type: "object-moved" as const,
          objectId: allyId,
          from: "main-deck" as const,
          to: "field" as const,
        },
        ...(sourceSetup === "graveyard"
          ? itemIds.map((objectId) => ({
              type: "object-moved" as const,
              objectId,
              from: "main-deck" as const,
              to: "graveyard" as const,
            }))
          : sourceSetup === "field"
            ? [
                {
                  type: "object-moved" as const,
                  objectId: itemIds[0]!,
                  from: "main-deck" as const,
                  to: "field" as const,
                  hostId: allyId,
                },
              ]
            : []),
      ];
      const positioned = new GrandArchiveTransactionKernel().transact(
        fixture.state,
        setupEvents,
      ).state;
      const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
      const activation = runtime.execute(
        { move: "activate-card", cardId: actionId, reservePayment: [] },
        { playerId: fixture.p1 },
      );
      if (!activation.ok) throw new Error(activation.message);

      const firstDecision = passUntilDecision(runtime);
      answerObjectChoice(runtime, firstDecision, fixture.p1, allyId);
      const entriesAfterFirstChoice = Object.values(runtime.state.objects).filter(
        (object) =>
          object.definitionId === allyLinkItem.canonicalId &&
          object.zone === "field" &&
          !itemIds.includes(object.id),
      );
      expect(entriesAfterFirstChoice).toEqual([]);

      const secondDecision = runtime.state.decision;
      if (!secondDecision) throw new Error("Expected the second created-object Link choice");
      answerObjectChoice(runtime, secondDecision, fixture.p1, allyId);
      const entries = Object.values(runtime.state.objects).filter(
        (object) =>
          object.definitionId === allyLinkItem.canonicalId &&
          object.zone === "field" &&
          !itemIds.includes(object.id),
      );
      expect(entries).toHaveLength(2);
      expect(entries.every((object) => object.hostId === allyId)).toBe(true);
    },
  );

  it("chooses a host for the random ingredient before Gather creates it", () => {
    const fixture = setup();
    const actionId = findIds(fixture, fixture.p1, gatherLinked.canonicalId)[0]!;
    const allyId = findIds(fixture, fixture.p1, ally.canonicalId)[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const randomBeforeResolution = positioned.random;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId, reservePayment: [] },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);

    const decision = passUntilDecision(runtime);
    expect(runtime.state.random).toEqual(randomBeforeResolution);
    answerObjectChoice(runtime, decision, fixture.p1, allyId);

    const ingredientIds = new Set(gatherIngredients.map((ingredient) => ingredient.canonicalId));
    const created = Object.values(runtime.state.objects).filter(
      (object) => object.isToken && ingredientIds.has(object.definitionId),
    );
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({ zone: "field", hostId: allyId });
    expect(runtime.state.random).not.toEqual(randomBeforeResolution);
  });

  it("defers a replacement-created linked token into an interactive follow-up", () => {
    const fixture = setup();
    const actionId = findIds(fixture, fixture.p1, summonReplacedToken.canonicalId)[0]!;
    const sourceId = findIds(fixture, fixture.p1, replacementSource.canonicalId)[0]!;
    const allyId = findIds(fixture, fixture.p1, ally.canonicalId)[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    const activation = runtime.execute(
      { move: "activate-card", cardId: actionId, reservePayment: [] },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);

    const decision = passUntilDecision(runtime);
    expect(decision).toMatchObject({ kind: "resolve-effect-choice", playerId: fixture.p1 });
    expect(runtime.state.replacementPreCommit?.continuation.queue).toEqual([]);
    const resumed = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );
    answerObjectChoice(resumed, decision, fixture.p1, allyId);
    const secondDecision = resumed.state.decision;
    if (!secondDecision) throw new Error("Expected the second replacement-token Link choice");
    answerObjectChoice(resumed, secondDecision, fixture.p1, allyId);

    const linkedTokens = Object.values(resumed.state.objects).filter(
      (object) =>
        object.definitionId === allyLinkItem.canonicalId &&
        object.isToken &&
        object.zone === "field",
    );
    expect(linkedTokens).toHaveLength(2);
    expect(linkedTokens.every((token) => token.hostId === allyId)).toBe(true);
    expect(
      Object.values(resumed.state.objects).some(
        (object) => object.definitionId === plainToken.canonicalId && object.zone === "field",
      ),
    ).toBe(false);
  });
});
