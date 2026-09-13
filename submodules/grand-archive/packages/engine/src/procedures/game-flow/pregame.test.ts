import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
  GrandArchivePrintedCost,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { pantheonBarrier } from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import { grandArchiveObjectHasActiveKeyword } from "../../rules/abilities/intrinsic-keywords.ts";
import {
  assertGrandArchiveDeckConstruction,
  assertGrandArchiveMatchPlayerCount,
  createGrandArchiveMatchInitialState,
  type GrandArchiveDraftPlayerSetup,
  type GrandArchivePantheonPlayerSetup,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { listGrandArchiveLegalMoves } from "../../commands/legal-commands.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function testCard(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  options: {
    readonly cost?: GrandArchivePrintedCost;
    readonly level?: number;
    readonly life?: number;
    readonly durability?: number;
    readonly speed?: "fast" | "slow";
    readonly subtypes?: readonly string[];
    readonly supertypes?: readonly GrandArchiveSupertype[];
    readonly pantheonOnly?: boolean;
  } = {},
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    ...(options.pantheonOnly
      ? {
          formatRestriction: {
            kind: "pantheon-only" as const,
            source: "printed-border-tag" as const,
          },
        }
      : {}),
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: options.cost ?? { kind: "none" },
        typeLine: {
          supertypes: options.supertypes ?? [],
          types: [type],
          classes: ["SPIRIT"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(options.speed ? { speed: options.speed } : {}),
        stats: {
          ...(options.level === undefined ? {} : { level: options.level }),
          ...(options.life === undefined ? {} : { life: options.life }),
          ...(options.durability === undefined ? {} : { durability: options.durability }),
        },
        rulesText: "",
        abilities,
      },
    },
  };
}

const spirit = testCard(
  "pregame-spirit",
  "CHAMPION",
  [
    {
      id: "pregame-spirit-a1",
      kind: "triggered",
      text: "On Enter: Draw two cards.",
      trigger: {
        kind: "event",
        event: { name: "object-entered-field", subject: { kind: "source" } },
      },
      effect: { kind: "draw", player: "controller", amount: 2 },
    },
  ],
  { level: 0, life: 15 },
);
const mainCard = testCard("pregame-main-card", "ACTION");
const lookingGlass = testCard("pregame-looking-glass", "ITEM", [
  {
    id: "pregame-looking-glass-a1",
    kind: "game-setup",
    text: "If this card is in your starting material deck, you may begin the game with it on the field.",
    rule: {
      kind: "optional-start-on-field",
      from: "material-deck",
      condition: "source-in-starting-deck",
    },
  },
]);
const lesserBoon = testCard(
  "pregame-lesser-boon",
  "LESSER BOON",
  [
    {
      id: "pregame-lesser-boon-a1",
      kind: "triggered",
      text: "As you gain this boon, draw a card.",
      trigger: {
        kind: "event",
        event: { name: "boon-gained", subject: { kind: "source" } },
      },
      effect: { kind: "draw", player: "controller", amount: 1 },
    },
  ],
  {
    cost: { kind: "reserve", amount: 0 },
    speed: "fast",
  },
);
const firstBoon = testCard(
  "pregame-first-boon",
  "GREATER BOON",
  [
    {
      id: "pregame-first-boon-a1",
      kind: "static",
      staticKind: "intrinsic",
      text: "First Boon",
      keyword: { name: "first-boon" },
    },
    {
      id: "pregame-first-boon-a2",
      kind: "triggered",
      text: "As you gain this boon, draw a card.",
      trigger: {
        kind: "event",
        event: { name: "boon-gained", subject: { kind: "source" } },
      },
      effect: { kind: "draw", player: "controller", amount: 1 },
    },
  ],
  { cost: { kind: "reserve", amount: 0 }, speed: "slow" },
);
const materialLimitBoon = testCard(
  "pregame-material-limit-boon",
  "GREATER BOON",
  [
    {
      id: "pregame-material-limit-boon-a1",
      kind: "game-setup",
      text: "A deck with this card in it can have up to three more cards in its material deck.",
      rule: {
        kind: "modify-starting-deck-limit",
        zone: "material-deck",
        operation: "add-to-maximum",
        amount: 3,
        appliesIfIncluded: true,
      },
    },
  ],
  { cost: { kind: "reserve", amount: 0 }, speed: "slow" },
);
const barrier = pantheonBarrier;
const tokenRepresentation: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "pregame-token-representation",
  slug: "pregame-token-representation",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "pregame-token-representation:face:default",
      catalogId: "pregame-token-representation",
      name: "Pregame Token",
      cost: { kind: "none" },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["SPIRIT"],
        subtypes: [],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};
const cards = [
  spirit,
  mainCard,
  lookingGlass,
  lesserBoon,
  firstBoon,
  barrier,
  tokenRepresentation,
] as const;

function standardPlayer(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [{ definitionId: mainCard.canonicalId, count: 6 }],
    materialDeck: [
      { definitionId: spirit.canonicalId, count: 1 },
      { definitionId: lookingGlass.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: spirit.canonicalId,
  };
}

function pantheonPlayer(id: string): GrandArchivePantheonPlayerSetup {
  return {
    ...standardPlayer(id),
    sideboard: undefined,
    pantheon: {
      lesserBoonDefinitionId: lesserBoon.canonicalId,
      greaterBoonDefinitionId: firstBoon.canonicalId,
      barrierDefinitionId: barrier.canonicalId,
    },
  };
}

describe("Grand Archive pre-game workflow", () => {
  it("enforces the official Standard, Draft, and Pantheon player counts", () => {
    expect(() => assertGrandArchiveMatchPlayerCount("standard", 1)).toThrow(
      "Standard matches require exactly 2 players",
    );
    expect(() => assertGrandArchiveMatchPlayerCount("standard", 3)).toThrow(
      "Standard matches require exactly 2 players",
    );
    expect(() => assertGrandArchiveMatchPlayerCount("pantheon", 2)).toThrow(
      "Pantheon matches require exactly 3 or 4 players",
    );
    expect(() => assertGrandArchiveMatchPlayerCount("pantheon", 5)).toThrow(
      "Pantheon matches require exactly 3 or 4 players",
    );
    expect(() => assertGrandArchiveMatchPlayerCount("draft", 3)).toThrow(
      "Draft matches require exactly 2 players",
    );
    expect(() => assertGrandArchiveMatchPlayerCount("standard", 2)).not.toThrow();
    expect(() => assertGrandArchiveMatchPlayerCount("draft", 2)).not.toThrow();
    expect(() => assertGrandArchiveMatchPlayerCount("pantheon", 3)).not.toThrow();
    expect(() => assertGrandArchiveMatchPlayerCount("pantheon", 4)).not.toThrow();
  });

  it("enforces Draft deck sizes without applying a constructed copy limit", () => {
    const program = createGrandArchiveMatchProgram([spirit, mainCard]);
    const player: GrandArchiveDraftPlayerSetup = {
      id: "p1",
      name: "p1",
      mainDeck: [{ definitionId: mainCard.canonicalId, count: 30 }],
      materialDeck: [{ definitionId: spirit.canonicalId, count: 10 }],
      sideboard: [],
      startingChampionDefinitionId: spirit.canonicalId,
    };

    expect(() => assertGrandArchiveDeckConstruction(program, "draft", player)).not.toThrow();
    expect(() =>
      assertGrandArchiveDeckConstruction(program, "draft", player, {
        draftMainDeckCopyLimit: 4,
      }),
    ).toThrow("main deck contains more than 4 card(s)");
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "draft",
        players: [player, { ...player, id: "p2", name: "p2" }],
        firstPlayerId: "p1",
        randomSeed: 30,
      },
      { skipPregameForTests: true },
    );
    expect(initial.mode).toBe("draft");
    expect(
      restoreGrandArchiveMatchSnapshot(program, serializeGrandArchiveMatchSnapshot(initial)).mode,
    ).toBe("draft");
    const runtime = new GrandArchiveMatchRuntime(program, initial);
    const passOpportunityCycle = () => {
      for (let pass = 0; pass < 2; pass += 1) {
        const holderId = runtime.state.opportunity?.holderId;
        if (!holderId) throw new Error("Expected Draft Opportunity holder");
        const result = runtime.execute({ move: "pass" }, { playerId: holderId });
        if (!result.ok) throw new Error(result.message);
      }
    };
    passOpportunityCycle();
    expect(runtime.state.turn.phase).toBe("end");
    passOpportunityCycle();
    const p2 = grandArchivePlayerId("p2");
    expect(runtime.state.turn).toMatchObject({ playerId: p2, phase: "main" });
    expect(runtime.state.zones[p2].hand).toHaveLength(1);
    expect(() =>
      assertGrandArchiveDeckConstruction(program, "draft", {
        ...player,
        materialDeck: [{ definitionId: spirit.canonicalId, count: 11 }],
      }),
    ).toThrow("Draft material deck cannot exceed 10 cards");
  });

  it("enforces Standard sideboard points and keeps Boons out of physical decks", () => {
    const uniqueMainCards = Array.from({ length: 15 }, (_, index) =>
      testCard(`pregame-constructed-main-${index}`, "ACTION"),
    );
    const regalia = testCard("pregame-sideboard-regalia", "ITEM", [], {
      supertypes: ["REGALIA"],
    });
    const program = createGrandArchiveMatchProgram([
      spirit,
      lesserBoon,
      regalia,
      ...uniqueMainCards,
    ]);
    const player: GrandArchiveStandardPlayerSetup = {
      id: "p1",
      name: "p1",
      mainDeck: uniqueMainCards.map((card) => ({ definitionId: card.canonicalId, count: 4 })),
      materialDeck: [{ definitionId: spirit.canonicalId, count: 1 }],
      startingChampionDefinitionId: spirit.canonicalId,
      sideboard: [{ definitionId: regalia.canonicalId, count: 5 }],
    };

    expect(() => assertGrandArchiveDeckConstruction(program, "standard", player)).not.toThrow();
    expect(() =>
      assertGrandArchiveDeckConstruction(program, "standard", {
        ...player,
        sideboard: [{ definitionId: regalia.canonicalId, count: 6 }],
      }),
    ).toThrow("Standard sideboard cannot exceed 15 points");
    expect(() =>
      assertGrandArchiveDeckConstruction(program, "standard", {
        ...player,
        mainDeck: [
          ...uniqueMainCards.slice(0, 14).map((card) => ({
            definitionId: card.canonicalId,
            count: 4,
          })),
          { definitionId: uniqueMainCards[14]!.canonicalId, count: 3 },
          { definitionId: lesserBoon.canonicalId, count: 1 },
        ],
      }),
    ).toThrow("must start in the Pantheon");
  });

  it("admits a Pantheon-tagged card only in the Pantheon format", () => {
    const ordinaryCards = Array.from({ length: 15 }, (_, index) =>
      testCard(`pregame-format-main-${index}`, "ACTION"),
    );
    const tagged = testCard("pregame-pantheon-tagged", "ACTION", [], {
      pantheonOnly: true,
    });
    const program = createGrandArchiveMatchProgram([spirit, tagged, ...ordinaryCards]);
    const standard: GrandArchiveStandardPlayerSetup = {
      id: "p1",
      name: "p1",
      mainDeck: [
        ...ordinaryCards.slice(0, 14).map((card) => ({
          definitionId: card.canonicalId,
          count: 4,
        })),
        { definitionId: ordinaryCards[14]!.canonicalId, count: 3 },
        { definitionId: tagged.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: spirit.canonicalId, count: 1 }],
      startingChampionDefinitionId: spirit.canonicalId,
    };
    const draft: GrandArchiveDraftPlayerSetup = {
      id: "p1",
      name: "p1",
      mainDeck: [
        { definitionId: ordinaryCards[0]!.canonicalId, count: 29 },
        { definitionId: tagged.canonicalId, count: 1 },
      ],
      materialDeck: [{ definitionId: spirit.canonicalId, count: 1 }],
      sideboard: [],
      startingChampionDefinitionId: spirit.canonicalId,
    };

    expect(() => assertGrandArchiveDeckConstruction(program, "standard", standard)).toThrow(
      "has a Pantheon tag and cannot be included in Standard",
    );
    expect(() => assertGrandArchiveDeckConstruction(program, "draft", draft)).toThrow(
      "has a Pantheon tag and cannot be included in Draft",
    );
    expect(tagged.formatRestriction).toEqual({
      kind: "pantheon-only",
      source: "printed-border-tag",
    });
  });

  it("applies an included Boon's material-deck maximum during Pantheon construction", () => {
    const uniqueMainCards = Array.from({ length: 60 }, (_, index) =>
      testCard(`pregame-pantheon-main-${index}`, "ACTION"),
    );
    const champions = Array.from({ length: 15 }, (_, index) =>
      testCard(`pregame-pantheon-champion-${index}`, "CHAMPION", [], {
        level: 0,
        life: 15,
      }),
    );
    const program = createGrandArchiveMatchProgram([
      lesserBoon,
      materialLimitBoon,
      barrier,
      ...uniqueMainCards,
      ...champions,
    ]);
    const player: GrandArchivePantheonPlayerSetup = {
      id: "p1",
      name: "p1",
      mainDeck: uniqueMainCards.map((card) => ({ definitionId: card.canonicalId, count: 1 })),
      materialDeck: champions.map((card) => ({ definitionId: card.canonicalId, count: 1 })),
      startingChampionDefinitionId: champions[0]!.canonicalId,
      pantheon: {
        lesserBoonDefinitionId: lesserBoon.canonicalId,
        greaterBoonDefinitionId: materialLimitBoon.canonicalId,
        barrierDefinitionId: barrier.canonicalId,
      },
    };

    expect(() => assertGrandArchiveDeckConstruction(program, "pantheon", player)).not.toThrow();
    expect(() =>
      assertGrandArchiveDeckConstruction(program, "pantheon", {
        ...player,
        materialDeck: [...player.materialDeck, player.materialDeck[0]!],
      }),
    ).toThrow("Pantheon material deck must contain between 12 and 15 cards");
  });

  it("rejects token representations from physical decks", () => {
    const program = createGrandArchiveMatchProgram(cards);
    const invalidPlayer = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: tokenRepresentation.canonicalId, count: 60 }],
      materialDeck: [{ definitionId: spirit.canonicalId, count: 1 }],
      startingChampionDefinitionId: spirit.canonicalId,
    });
    expect(() =>
      createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [invalidPlayer("p1"), invalidPlayer("p2")],
        firstPlayerId: "p1",
        randomSeed: 1,
      }),
    ).toThrow("is not a physical card and cannot start in a deck");
  });

  it("resolves Standard pre-game actions and starting champion abilities before Opportunity", () => {
    const program = createGrandArchiveMatchProgram(cards);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [standardPlayer("p1"), standardPlayer("p2")],
        firstPlayerId: "p1",
        randomSeed: 10,
      },
      { validateDeckConstruction: false },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(initial.status).toBe("pregame");
    expect(initial.opportunity).toBeNull();
    expect(initial.zones[p1].field).toEqual([]);
    expect(listGrandArchiveLegalMoves(initial, p1)).toEqual([
      "bestow-boon",
      "start-pregame-card",
      "complete-pregame-actions",
      "concede",
    ]);
    expect(listGrandArchiveLegalMoves(initial, p2)).toEqual(["concede"]);

    const runtime = new GrandArchiveMatchRuntime(program, initial);
    expect(runtime.execute({ move: "complete-pregame-actions" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.status).toBe("pregame");
    expect(runtime.state.opportunity).toBeNull();
    expect(runtime.execute({ move: "complete-pregame-actions" }, { playerId: p2 }).ok).toBe(true);

    expect(runtime.state.status).toBe("playing");
    expect(runtime.state.pregame).toBeNull();
    expect(runtime.state.zones[p1].hand).toHaveLength(2);
    expect(runtime.state.zones[p2].hand).toHaveLength(2);
    expect(runtime.state.zones[p1].field).toHaveLength(1);
    expect(runtime.state.zones[p2].field).toHaveLength(1);
    expect(runtime.state.opportunity?.holderId).toBe(p1);
    const finalOpportunityIndex = Math.max(
      ...runtime.state.eventHistory.map((event, index) =>
        event.type === "opportunity-opened" ? index : -1,
      ),
    );
    const finalStartingDrawIndex = Math.max(
      ...runtime.state.eventHistory.map((event, index) =>
        event.type === "object-moved" && event.from === "main-deck" && event.to === "hand"
          ? index
          : -1,
      ),
    );
    expect(finalOpportunityIndex).toBeGreaterThan(finalStartingDrawIndex);
  });

  it("serializes Pantheon pre-game progress and enforces First Boon before Spirits enter", () => {
    const program = createGrandArchiveMatchProgram(cards);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "pantheon",
        players: [pantheonPlayer("p1"), pantheonPlayer("p2"), pantheonPlayer("p3")],
        firstPlayerId: "p1",
        randomSeed: 20,
      },
      { validateDeckConstruction: false },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const p3 = grandArchivePlayerId("p3");
    const runtime = new GrandArchiveMatchRuntime(program, initial);

    const initialP1BoonId = runtime.state.zones[p1].pantheon.find(
      (id) => runtime.state.objects[id]?.definitionId === firstBoon.canonicalId,
    )!;
    expect(
      grandArchiveObjectHasActiveKeyword(
        program,
        runtime.state,
        runtime.state.objects[initialP1BoonId]!,
        "first-boon",
      ),
    ).toBe(true);
    const blocked = runtime.execute({ move: "complete-pregame-actions" }, { playerId: p1 });
    expect(blocked).toMatchObject({ ok: false, code: "illegal-command" });
    const p1BoonId = initialP1BoonId;
    expect(runtime.execute({ move: "bestow-boon", cardId: p1BoonId }, { playerId: p1 }).ok).toBe(
      true,
    );
    expect(runtime.state.objects[p1BoonId]).toMatchObject({
      zone: "pantheon",
      facing: "face-up",
    });
    expect(runtime.state.zones[p1].hand).toHaveLength(1);

    const glassId = runtime.state.zones[p1]["material-deck"].find(
      (id) => runtime.state.objects[id]?.definitionId === lookingGlass.canonicalId,
    )!;
    expect(
      runtime.execute({ move: "start-pregame-card", cardId: glassId }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(runtime.state.objects[glassId]?.zone).toBe("field");
    expect(runtime.execute({ move: "complete-pregame-actions" }, { playerId: p1 }).ok).toBe(true);

    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(runtime.state),
    );
    expect(restored.pregame).toMatchObject({ stage: "player-actions", currentPlayerIndex: 1 });
    const resumed = new GrandArchiveMatchRuntime(program, restored);
    for (const playerId of [p2, p3]) {
      const boonId = resumed.state.zones[playerId].pantheon.find(
        (id) => resumed.state.objects[id]?.definitionId === firstBoon.canonicalId,
      )!;
      expect(resumed.execute({ move: "bestow-boon", cardId: boonId }, { playerId }).ok).toBe(true);
      expect(resumed.execute({ move: "complete-pregame-actions" }, { playerId }).ok).toBe(true);
    }

    expect(resumed.state.status).toBe("playing");
    expect(resumed.state.stack).toEqual([]);
    expect(resumed.state.pendingTriggers).toEqual([]);
    expect(resumed.state.opportunity?.holderId).toBe(p1);
    expect(resumed.state.zones[p1].hand).toHaveLength(4);
    expect(resumed.state.zones[p2].hand).toHaveLength(3);
    expect(resumed.state.zones[p3].hand).toHaveLength(3);
    const startingCardsEventIndex = resumed.state.eventHistory.findIndex(
      (event) => event.type === "pregame-starting-cards-entered",
    );
    const pregameCompletedEventIndex = resumed.state.eventHistory.findIndex(
      (event) => event.type === "pregame-completed",
    );
    const startingHandDrawOwners = resumed.state.eventHistory
      .slice(startingCardsEventIndex + 1, pregameCompletedEventIndex)
      .flatMap((event) =>
        event.type === "object-moved" && event.from === "main-deck" && event.to === "hand"
          ? [resumed.state.objects[event.objectId]!.ownerId]
          : [],
      );
    expect(startingHandDrawOwners).toEqual([p1, p1, p2, p2, p3, p3]);
    for (const playerId of [p1, p2, p3]) {
      expect(
        resumed.state.zones[playerId].field.some(
          (id) => resumed.state.objects[id]?.definitionId === spirit.canonicalId,
        ),
      ).toBe(true);
      expect(
        resumed.state.zones[playerId].field.some(
          (id) => resumed.state.objects[id]?.definitionId === barrier.canonicalId,
        ),
      ).toBe(true);
    }

    const lesserBoonId = resumed.state.zones[p1].pantheon.find(
      (id) => resumed.state.objects[id]?.definitionId === lesserBoon.canonicalId,
    )!;
    expect(
      resumed.execute({ move: "bestow-boon", cardId: lesserBoonId }, { playerId: p1 }).ok,
    ).toBe(true);
    expect(resumed.state.objects[lesserBoonId]).toMatchObject({
      zone: "pantheon",
      facing: "face-up",
    });
    expect(resumed.state.stack).toHaveLength(1);
    expect(resumed.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(resumed.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(resumed.execute({ move: "pass" }, { playerId: p3 }).ok).toBe(true);
    expect(resumed.state.zones[p1].hand).toHaveLength(5);
  });
});

describe("Grand Archive bestowment costs and restrictions", () => {
  const discountedBoon = testCard(
    "discounted-lesser-boon",
    "LESSER BOON",
    [
      {
        id: "discounted-lesser-boon-a1",
        kind: "static",
        staticKind: "effects",
        text: "This boon costs 2 less to bestow.",
        effects: [
          {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "bestow",
            subject: { kind: "source" },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 2,
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ],
    { cost: { kind: "reserve", amount: 5 }, speed: "fast" },
  );
  const powercell = testCard("bestowment-powercell", "ITEM", [], {
    subtypes: ["POWERCELL"],
  });
  const uniqueMainCard = testCard("bestowment-unique-main-card", "ACTION", [], {
    supertypes: ["UNIQUE"],
  });
  const additionalCostBoon = testCard(
    "additional-cost-lesser-boon",
    "LESSER BOON",
    [
      {
        id: "additional-cost-lesser-boon-a1",
        kind: "static",
        staticKind: "effects",
        text: "As an additional cost to bestow this boon, sacrifice a Powercell item.",
        effects: [
          {
            kind: "rule-modification",
            mode: "add-cost",
            action: "bestow",
            subject: { kind: "source" },
            cost: {
              kind: "select-and-sacrifice",
              player: "controller",
              count: { kind: "exactly", amount: 1 },
              filter: {
                kind: "all",
                filters: [
                  { kind: "type", oneOf: ["ITEM"] },
                  { kind: "subtype", oneOf: ["POWERCELL"] },
                ],
              },
            },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ],
    { cost: { kind: "reserve", amount: 0 }, speed: "fast" },
  );
  const restrictedBoon = testCard(
    "restricted-lesser-boon",
    "LESSER BOON",
    [
      {
        id: "restricted-lesser-boon-a1",
        kind: "static",
        staticKind: "effects",
        text: "Bestow this boon only during an opponent's recollection phase.",
        effects: [
          {
            kind: "rule-modification",
            mode: "require",
            action: "bestow",
            subject: { kind: "source" },
            condition: {
              kind: "all",
              conditions: [
                { kind: "phase", phase: "recollection" },
                { kind: "turn-player", player: "opponent" },
              ],
            },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ],
    { cost: { kind: "reserve", amount: 0 }, speed: "fast" },
  );
  const startingDeckRestrictedBoon = testCard(
    "starting-deck-restricted-lesser-boon",
    "LESSER BOON",
    [
      {
        id: "starting-deck-restricted-lesser-boon-a1",
        kind: "static",
        staticKind: "effects",
        text: "Bestow this boon only if your starting main deck had no unique cards.",
        effects: [
          {
            kind: "rule-modification",
            mode: "require",
            action: "bestow",
            subject: { kind: "source" },
            condition: {
              kind: "starting-deck-count",
              zone: "main-deck",
              filter: { kind: "supertype", oneOf: ["UNIQUE"] },
              operator: "eq",
              value: 0,
            },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ],
    { cost: { kind: "reserve", amount: 0 }, speed: "fast" },
  );

  function fixture(
    selectedLesserBoon: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
    firstPlayerId = "p1",
    includeUniqueCard = false,
  ) {
    const fixtureCards = [
      spirit,
      mainCard,
      powercell,
      uniqueMainCard,
      selectedLesserBoon,
      firstBoon,
      barrier,
    ];
    const program = createGrandArchiveMatchProgram(fixtureCards);
    const player = (id: string): GrandArchivePantheonPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: mainCard.canonicalId, count: 6 },
        { definitionId: powercell.canonicalId, count: 1 },
        ...(includeUniqueCard ? [{ definitionId: uniqueMainCard.canonicalId, count: 1 }] : []),
      ],
      materialDeck: [{ definitionId: spirit.canonicalId, count: 1 }],
      startingChampionDefinitionId: spirit.canonicalId,
      pantheon: {
        lesserBoonDefinitionId: selectedLesserBoon.canonicalId,
        greaterBoonDefinitionId: firstBoon.canonicalId,
        barrierDefinitionId: barrier.canonicalId,
      },
    });
    const state = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "pantheon",
        players: [player("p1"), player("p2"), player("p3")],
        firstPlayerId,
        randomSeed: 30,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    return { program, state };
  }

  it("applies reserve reductions and requires the exact modified payment", () => {
    const { program, state } = fixture(discountedBoon);
    const p1 = grandArchivePlayerId("p1");
    const additionalCards = state.zones[p1]["main-deck"].slice(0, 2);
    const prepared = new GrandArchiveTransactionKernel().transact(
      state,
      additionalCards.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ).state;
    const boonId = prepared.zones[p1].pantheon.find(
      (id) => prepared.objects[id]?.definitionId === discountedBoon.canonicalId,
    )!;
    const reservePayment = prepared.zones[p1].hand.map((cardId) => ({
      kind: "card" as const,
      cardId,
    }));
    const underpaidRuntime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      underpaidRuntime.execute(
        { move: "bestow-boon", cardId: boonId, reservePayment: reservePayment.slice(0, 2) },
        { playerId: p1 },
      ),
    ).toMatchObject({ ok: false, code: "illegal-command" });
    expect(underpaidRuntime.state.objects[boonId]).toMatchObject({
      zone: "pantheon",
      facing: "face-down",
    });
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "bestow-boon",
          cardId: boonId,
          reservePayment,
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.zones[p1].memory).toHaveLength(3);
    expect(runtime.state.objects[boonId]).toMatchObject({ zone: "pantheon", facing: "face-up" });
  });

  it("pays printed additional bestowment costs atomically", () => {
    const { program, state } = fixture(additionalCostBoon);
    const p1 = grandArchivePlayerId("p1");
    const powercellId = state.zones[p1]["main-deck"].find(
      (id) => state.objects[id]?.definitionId === powercell.canonicalId,
    )!;
    const prepared = new GrandArchiveTransactionKernel().transact(state, [
      {
        type: "object-moved",
        objectId: powercellId,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const boonId = prepared.zones[p1].pantheon.find(
      (id) => prepared.objects[id]?.definitionId === additionalCostBoon.canonicalId,
    )!;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        { move: "bestow-boon", cardId: boonId, costSelections: [[powercellId]] },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[powercellId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[boonId]?.facing).toBe("face-up");
  });

  it("enforces bestowment-only timing requirements", () => {
    const { program, state } = fixture(restrictedBoon, "p2");
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const p3 = grandArchivePlayerId("p3");
    const runtime = new GrandArchiveMatchRuntime(program, state);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p3 }).ok).toBe(true);
    const boonId = runtime.state.zones[p1].pantheon.find(
      (id) => runtime.state.objects[id]?.definitionId === restrictedBoon.canonicalId,
    )!;
    expect(
      runtime.execute({ move: "bestow-boon", cardId: boonId }, { playerId: p1 }),
    ).toMatchObject({ ok: false, code: "illegal-command" });
    const recollection = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "phase-changed", phase: "recollection" },
    ]).state;
    const recollectionRuntime = new GrandArchiveMatchRuntime(program, recollection);
    expect(
      recollectionRuntime.execute({ move: "bestow-boon", cardId: boonId }, { playerId: p1 }).ok,
    ).toBe(true);
  });

  it("evaluates bestowment restrictions against the immutable starting deck", () => {
    const p1 = grandArchivePlayerId("p1");
    const withUnique = fixture(startingDeckRestrictedBoon, "p1", true);
    const uniqueId = Object.values(withUnique.state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === uniqueMainCard.canonicalId,
    )!.id;
    const uniqueRemoved = new GrandArchiveTransactionKernel().transact(withUnique.state, [
      {
        type: "object-moved",
        objectId: uniqueId,
        from: withUnique.state.objects[uniqueId]!.zone,
        to: "graveyard",
      },
    ]).state;
    const restrictedBoonId = uniqueRemoved.zones[p1].pantheon.find(
      (id) => uniqueRemoved.objects[id]?.definitionId === startingDeckRestrictedBoon.canonicalId,
    )!;
    const restrictedRuntime = new GrandArchiveMatchRuntime(withUnique.program, uniqueRemoved);
    expect(
      restrictedRuntime.execute(
        { move: "bestow-boon", cardId: restrictedBoonId },
        { playerId: p1 },
      ),
    ).toMatchObject({ ok: false, code: "illegal-command" });

    const withoutUnique = fixture(startingDeckRestrictedBoon);
    const legalBoonId = withoutUnique.state.zones[p1].pantheon.find(
      (id) =>
        withoutUnique.state.objects[id]?.definitionId === startingDeckRestrictedBoon.canonicalId,
    )!;
    const legalRuntime = new GrandArchiveMatchRuntime(withoutUnique.program, withoutUnique.state);
    expect(
      legalRuntime.execute({ move: "bestow-boon", cardId: legalBoonId }, { playerId: p1 }).ok,
    ).toBe(true);
  });
});
