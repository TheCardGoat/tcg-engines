import { eightOfHearts } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
  GrandArchivePrintedCost,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../game/identity.ts";
import { prepareGrandArchiveRuleBoundEvent } from "../kernel/event-admission.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "./legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import { collectGrandArchiveReplacementCandidates } from "../rules/replacements/replacements.ts";
import {
  applyGrandArchiveCommand,
  GrandArchiveMatchRuntime,
} from "../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly name?: string;
    readonly cost?: GrandArchivePrintedCost;
    readonly elements?: readonly GrandArchiveElement[];
    readonly subtypes?: readonly string[];
    readonly stats?: {
      readonly level?: number;
      readonly power?: number;
      readonly life?: number;
      readonly durability?: number;
    };
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
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
        name: options.name ?? id,
        cost: options.cost ?? { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["MAGE"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        stats:
          options.stats ??
          (type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 2 }
              : {}),
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("special-command-champion", "CHAMPION", {
  cost: { kind: "memory", amount: 0 },
  elements: ["FIRE"],
});
const filler = card("special-command-filler", "ACTION", {
  cost: { kind: "reserve", amount: 0 },
});

function setup(
  cards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  p1MainDeck: GrandArchiveStandardPlayerSetup["mainDeck"],
  p1MaterialDeck: GrandArchiveStandardPlayerSetup["materialDeck"] = [
    { definitionId: champion.canonicalId, count: 1 },
  ],
) {
  const allCards = [champion, filler, ...cards];
  const program = createGrandArchiveMatchProgram(allCards);
  const player = (
    id: "p1" | "p2",
    mainDeck: GrandArchiveStandardPlayerSetup["mainDeck"],
    materialDeck: GrandArchiveStandardPlayerSetup["materialDeck"],
  ): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck,
    materialDeck,
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [
        player("p1", p1MainDeck, p1MaterialDeck),
        player(
          "p2",
          [{ definitionId: filler.canonicalId, count: 8 }],
          [{ definitionId: champion.canonicalId, count: 1 }],
        ),
      ],
      firstPlayerId: "p1",
      randomSeed: 929,
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

function objectIds(state: GrandArchiveMatchState, playerId: string, definitionId: string) {
  return Object.values(state.objects)
    .filter((object) => object.ownerId === playerId && object.definitionId === definitionId)
    .map((object) => object.id);
}

function legalCommands(fixture: ReturnType<typeof setup>, state: GrandArchiveMatchState) {
  const commands = listGrandArchiveLegalCommands(fixture.program, state, fixture.p1, {
    maximumDecisionCandidates: 512,
  });
  for (const candidate of commands) {
    expect(
      applyGrandArchiveCommand(fixture.program, state, candidate.command, {
        playerId: fixture.p1,
        expectedStateVersion: state.stateVersion,
      }).ok,
      candidate.label,
    ).toBe(true);
  }
  return commands;
}

describe("Grand Archive special legal-command discovery", () => {
  it("discovers Ephemerate and exact Brew ingredient activations", () => {
    const ingredient = card("special-brew-ingredient", "ALLY", { name: "Moonwort" });
    const ephemerateAction = card("special-ephemerate-action", "ACTION", {
      cost: { kind: "reserve", amount: 3 },
      abilities: [
        {
          id: "specialEphemerateAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (0)",
          keyword: { name: "ephemerate", cost: { kind: "pay-reserve", amount: 0 } },
        },
      ],
    });
    const brewAction = card("special-brew-action", "ACTION", {
      cost: { kind: "reserve", amount: 4 },
      abilities: [
        {
          id: "specialBrewAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Moonwort",
          keyword: {
            name: "brew",
            requirements: [{ kind: "name", value: "Moonwort", count: 2 }],
          },
        },
      ],
    });
    const fixture = setup(
      [ingredient, ephemerateAction, brewAction],
      [
        { definitionId: ingredient.canonicalId, count: 2 },
        { definitionId: ephemerateAction.canonicalId, count: 1 },
        { definitionId: brewAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 4 },
      ],
    );
    const ephemerateId = objectIds(fixture.state, fixture.p1, ephemerateAction.canonicalId)[0]!;
    const brewId = objectIds(fixture.state, fixture.p1, brewAction.canonicalId)[0]!;
    const ingredientIds = objectIds(fixture.state, fixture.p1, ingredient.canonicalId);
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: ephemerateId,
        from: fixture.state.objects[ephemerateId]!.zone,
        to: "graveyard",
      },
      {
        type: "object-moved",
        objectId: brewId,
        from: fixture.state.objects[brewId]!.zone,
        to: "hand",
      },
      ...ingredientIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: fixture.state.objects[objectId]!.zone,
        to: "field" as const,
      })),
    ]).state;

    const commands = legalCommands(fixture, positioned).flatMap((candidate) =>
      candidate.command.move === "activate-card" ? [candidate.command] : [],
    );
    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ cardId: ephemerateId, activationMethod: "ephemerate" }),
        expect.objectContaining({
          cardId: brewId,
          activationMethod: "brew",
          brewIngredientIds: expect.arrayContaining(ingredientIds),
        }),
      ]),
    );
  });

  it("discovers Prepare, Kindle, and Floating Memory payment declarations", () => {
    const preparedAction = card("special-prepare-action", "ACTION", {
      cost: { kind: "reserve", amount: 0 },
      abilities: [
        {
          id: "specialPrepareAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 1",
          keyword: { name: "prepare", value: 1 },
        },
      ],
    });
    const kindleAction = card("special-kindle-action", "ACTION", {
      cost: { kind: "reserve", amount: 1 },
      elements: ["FIRE"],
      abilities: [
        {
          id: "specialKindleAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 1",
          keyword: { name: "kindle", value: 1 },
        },
      ],
    });
    const fireFuel = card("special-fire-fuel", "ACTION", { elements: ["FIRE"] });
    const floatingFuel = card("special-floating-fuel", "ACTION", {
      abilities: [
        {
          id: "specialFloatingFuel-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: { name: "floating-memory" },
        },
      ],
    });
    const memoryAction = card("special-memory-action", "ACTION", {
      cost: { kind: "memory", amount: 1 },
    });
    const fixture = setup(
      [preparedAction, kindleAction, fireFuel, floatingFuel, memoryAction],
      [
        { definitionId: preparedAction.canonicalId, count: 1 },
        { definitionId: kindleAction.canonicalId, count: 1 },
        { definitionId: fireFuel.canonicalId, count: 1 },
        { definitionId: floatingFuel.canonicalId, count: 1 },
        { definitionId: memoryAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 3 },
      ],
    );
    const preparedId = objectIds(fixture.state, fixture.p1, preparedAction.canonicalId)[0]!;
    const kindleId = objectIds(fixture.state, fixture.p1, kindleAction.canonicalId)[0]!;
    const fireFuelId = objectIds(fixture.state, fixture.p1, fireFuel.canonicalId)[0]!;
    const floatingId = objectIds(fixture.state, fixture.p1, floatingFuel.canonicalId)[0]!;
    const memoryActionId = objectIds(fixture.state, fixture.p1, memoryAction.canonicalId)[0]!;
    const championId = fixture.state.zones[fixture.p1].field[0]!;
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      ...[preparedId, kindleId, memoryActionId].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: fixture.state.objects[objectId]!.zone,
        to: "hand" as const,
      })),
      ...[fireFuelId, floatingId].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: fixture.state.objects[objectId]!.zone,
        to: "graveyard" as const,
      })),
      { type: "counter-changed", objectId: championId, counter: "preparation", delta: 1 },
    ]).state;

    const commands = legalCommands(fixture, positioned).flatMap((candidate) =>
      candidate.command.move === "activate-card" ? [candidate.command] : [],
    );
    expect(commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ cardId: preparedId, prepareAbilityIndexes: [0] }),
        expect.objectContaining({ cardId: kindleId, kindleCardIds: [fireFuelId] }),
        expect.objectContaining({
          cardId: memoryActionId,
          floatingMemoryCardIds: [floatingId],
        }),
      ]),
    );
  });

  it("discovers the modes that become legal only after a successful Imbue declaration", () => {
    const imbueAction = card("special-imbue-action", "ACTION", {
      cost: { kind: "reserve", amount: 2 },
      abilities: [
        {
          id: "specialImbueAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 2",
          keyword: { name: "imbue", value: 2, elementRequirement: "source-elements" },
        },
        {
          id: "specialImbueAction-a2",
          kind: "card-resolution",
          text: "Choose one, or two if this is imbued.",
          effect: {
            kind: "select-modes",
            choose: {
              kind: "exactly",
              amount: {
                kind: "conditional",
                condition: { kind: "activation-state", state: "imbued" },
                then: 2,
                else: 1,
              },
            },
            modes: [
              { id: "first", text: "First.", effect: { kind: "no-op" } },
              { id: "second", text: "Second.", effect: { kind: "no-op" } },
            ],
          },
        },
      ],
    });
    const fixture = setup(
      [imbueAction],
      [
        { definitionId: imbueAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 7 },
      ],
    );
    const sourceId = objectIds(fixture.state, fixture.p1, imbueAction.canonicalId)[0]!;
    const fuelIds = objectIds(fixture.state, fixture.p1, filler.canonicalId).slice(0, 2);
    const positioned = new GrandArchiveTransactionKernel().transact(
      fixture.state,
      [sourceId, ...fuelIds].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: fixture.state.objects[objectId]!.zone,
        to: "hand" as const,
      })),
    ).state;

    const sourceCommands = legalCommands(fixture, positioned).filter(
      (candidate) =>
        candidate.command.move === "activate-card" && candidate.command.cardId === sourceId,
    );
    const command = sourceCommands.find(
      (candidate) =>
        candidate.command.move === "activate-card" &&
        candidate.command.cardId === sourceId &&
        candidate.command.revealForImbue === true &&
        candidate.command.modeIds?.length === 2,
    );
    expect(command?.command, JSON.stringify(sourceCommands, null, 2)).toMatchObject({
      move: "activate-card",
      cardId: sourceId,
      modeIds: ["first", "second"],
      revealForImbue: true,
    });
  });

  it("discovers catalog payment contributions and the remaining reserve payment", () => {
    const suitedAlly = card("special-contribution-suited-ally", "ALLY", {
      cost: { kind: "reserve", amount: 4 },
      subtypes: ["SUITED"],
    });
    const fixture = setup(
      [eightOfHearts, suitedAlly],
      [
        { definitionId: eightOfHearts.canonicalId, count: 1 },
        { definitionId: suitedAlly.canonicalId, count: 2 },
        { definitionId: filler.canonicalId, count: 5 },
      ],
    );
    const sourceId = objectIds(fixture.state, fixture.p1, eightOfHearts.canonicalId)[0]!;
    const sacrificeIds = objectIds(fixture.state, fixture.p1, suitedAlly.canonicalId);
    const reserveIds = objectIds(fixture.state, fixture.p1, filler.canonicalId).slice(0, 2);
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "hand" },
      ...sacrificeIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
      ...reserveIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;

    const command = legalCommands(fixture, positioned).find(
      (candidate) =>
        candidate.command.move === "activate-card" &&
        candidate.command.cardId === sourceId &&
        candidate.command.paymentContributions?.some(
          (contribution) =>
            contribution.ruleId === `static:${sourceId}:YGz8gN8M69-a1:0` &&
            contribution.costSelections?.some(
              (selection) =>
                selection.length === sacrificeIds.length &&
                sacrificeIds.every((objectId) => selection.includes(objectId)),
            ),
        ) &&
        candidate.command.reservePayment?.length === 2,
    );

    expect(command?.command).toMatchObject({
      move: "activate-card",
      cardId: sourceId,
      reservePayment: expect.arrayContaining(
        reserveIds.map((cardId) => ({ kind: "card", cardId })),
      ),
      paymentContributions: [
        {
          ruleId: `static:${sourceId}:YGz8gN8M69-a1:0`,
          costSelections: [expect.arrayContaining(sacrificeIds)],
        },
      ],
    });
  });

  it("enumerates Glimpse ordering, Aethercalling loads, and Starcalling activations", () => {
    const glimpseItem = card("special-glimpse-item", "ITEM", {
      abilities: [
        {
          id: "specialGlimpseItem-a1",
          kind: "activated",
          activation: "ability",
          text: "Glimpse 2.",
          cost: { kind: "pay-reserve", amount: 0 },
          effect: { kind: "keyword-action", action: "glimpse", amount: 2 },
        },
      ],
    });
    const aetherwing = card("special-aetherwing", "WEAPON", {
      subtypes: ["AETHERWING"],
      stats: { power: 0, durability: 2 },
    });
    const aethercallingAction = card("special-aethercalling-action", "ACTION", {
      abilities: [
        {
          id: "specialAethercallingAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Aethercalling",
          keyword: { name: "aethercalling" },
        },
      ],
    });
    const deckLock = card("special-deck-lock", "ITEM", {
      abilities: [
        {
          id: "specialDeckLock-a1",
          kind: "static",
          staticKind: "effects",
          text: "If a card would leave your main deck to become loaded, prevent that event.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "card-moved",
                from: "main-deck",
                to: "loaded",
                subject: { kind: "event-object", owner: "controller" },
              },
              operation: { kind: "prevent" },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
    });
    const movementRestriction = card("special-movement-restriction", "ITEM", {
      abilities: [
        {
          id: "specialMovementRestriction-a1",
          kind: "static",
          staticKind: "effects",
          text: "Cards can't leave your main deck.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "move",
              subject: { kind: "player", player: "controller" },
              fromZone: "main-deck",
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
    });
    const starcallingAction = card("special-starcalling-action", "ACTION", {
      cost: { kind: "reserve", amount: 4 },
      abilities: [
        {
          id: "specialStarcallingAction-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Starcalling — (0)",
          keyword: { name: "starcalling", cost: { kind: "pay-reserve", amount: 0 } },
        },
      ],
    });
    const fixture = setup(
      [
        glimpseItem,
        aetherwing,
        aethercallingAction,
        starcallingAction,
        deckLock,
        movementRestriction,
      ],
      [
        { definitionId: aethercallingAction.canonicalId, count: 1 },
        { definitionId: starcallingAction.canonicalId, count: 1 },
        { definitionId: filler.canonicalId, count: 6 },
      ],
      [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: glimpseItem.canonicalId, count: 1 },
        { definitionId: aetherwing.canonicalId, count: 1 },
        { definitionId: deckLock.canonicalId, count: 1 },
        { definitionId: movementRestriction.canonicalId, count: 1 },
      ],
    );
    const glimpseId = objectIds(fixture.state, fixture.p1, glimpseItem.canonicalId)[0]!;
    const weaponId = objectIds(fixture.state, fixture.p1, aetherwing.canonicalId)[0]!;
    const aethercallingId = objectIds(
      fixture.state,
      fixture.p1,
      aethercallingAction.canonicalId,
    )[0]!;
    const starcallingId = objectIds(fixture.state, fixture.p1, starcallingAction.canonicalId)[0]!;
    const deckLockId = objectIds(fixture.state, fixture.p1, deckLock.canonicalId)[0]!;
    const movementRestrictionId = objectIds(
      fixture.state,
      fixture.p1,
      movementRestriction.canonicalId,
    )[0]!;
    const remainingDeck = fixture.state.zones[fixture.p1]["main-deck"].filter(
      (objectId) => objectId !== aethercallingId && objectId !== starcallingId,
    );
    const kernel = new GrandArchiveTransactionKernel();
    const guarded = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: glimpseId, from: "material-deck", to: "field" },
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 2 },
      },
      { type: "object-moved", objectId: deckLockId, from: "material-deck", to: "field" },
      {
        type: "object-moved",
        objectId: movementRestrictionId,
        from: "material-deck",
        to: "field",
      },
      {
        type: "zone-reordered",
        playerId: fixture.p1,
        zone: "main-deck",
        objectIds: [starcallingId, aethercallingId, ...remainingDeck],
        cause: { kind: "rule", rule: "test-fixture-order" },
      },
    ]).state;
    const ordinaryLoad = {
      type: "object-moved" as const,
      objectId: aethercallingId,
      from: "main-deck" as const,
      to: "loaded" as const,
      hostId: weaponId,
      actorId: fixture.p1,
    };
    expect(prepareGrandArchiveRuleBoundEvent(fixture.program, guarded, ordinaryLoad)).toBe(
      undefined,
    );
    expect(
      collectGrandArchiveReplacementCandidates(fixture.program, guarded, ordinaryLoad).some(
        (candidate) => candidate.id.includes(deckLockId),
      ),
    ).toBe(true);
    const specialLoad = { ...ordinaryLoad, gameActionKind: "special-game-action" as const };
    expect(prepareGrandArchiveRuleBoundEvent(fixture.program, guarded, specialLoad)).toMatchObject(
      specialLoad,
    );
    expect(collectGrandArchiveReplacementCandidates(fixture.program, guarded, specialLoad)).toEqual(
      [],
    );
    const positioned = kernel.transact(guarded, [
      {
        type: "object-moved",
        objectId: movementRestrictionId,
        from: "field",
        to: "graveyard",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId: glimpseId, abilityId: "specialGlimpseItem-a1" },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    expect(runtime.state.decision?.kind).toBe("resolve-glimpse");

    const commands = legalCommands(fixture, runtime.state);
    const answers = commands.flatMap((candidate) =>
      candidate.command.move === "answer-decision" ? [candidate.command.answer] : [],
    );
    expect(answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "reorder",
          top: [starcallingId],
          bottom: [aethercallingId],
        }),
        expect.objectContaining({
          kind: "reorder",
          loads: [{ cardId: aethercallingId, weaponId }],
        }),
        expect.objectContaining({
          kind: "starcall",
          cardId: starcallingId,
          bottom: [aethercallingId],
        }),
      ]),
    );

    const boundedAnswers = listGrandArchiveLegalCommands(
      fixture.program,
      runtime.state,
      fixture.p1,
      { maximumDecisionCandidates: 8 },
    ).flatMap((candidate) =>
      candidate.command.move === "answer-decision" ? [candidate.command.answer] : [],
    );
    expect(boundedAnswers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: "reorder",
          loads: [{ cardId: aethercallingId, weaponId }],
        }),
      ]),
    );

    const loadCommand = commands.find(
      (candidate) =>
        candidate.command.move === "answer-decision" &&
        typeof candidate.command.answer === "object" &&
        candidate.command.answer !== null &&
        "loads" in candidate.command.answer &&
        JSON.stringify(candidate.command.answer.loads) ===
          JSON.stringify([{ cardId: aethercallingId, weaponId }]),
    );
    expect(loadCommand).toBeDefined();
    const loaded = runtime.execute(loadCommand!.command, { playerId: fixture.p1 });
    if (!loaded.ok) throw new Error(loaded.message);
    expect(runtime.state.objects[aethercallingId]).toMatchObject({
      zone: "loaded",
      hostId: weaponId,
    });
    expect(loaded.events).toContainEqual(
      expect.objectContaining({
        type: "object-moved",
        objectId: aethercallingId,
        gameActionKind: "special-game-action",
      }),
    );
  });
});
