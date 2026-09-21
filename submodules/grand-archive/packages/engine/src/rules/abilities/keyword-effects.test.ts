import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAbilityId,
  GrandArchiveAnyCard,
  GrandArchiveCardType,
  GrandArchiveElement,
  GrandArchiveIntrinsicStaticAbility,
  GrandArchiveIntrinsicTriggeredAbility,
  GrandArchiveKeyword,
  GrandArchiveKeywordName,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import type { GrandArchiveCardInstance, GrandArchiveDecision } from "../../game/model.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import {
  grandArchiveObjectHasActiveKeyword,
  grandArchiveObjectActiveKeywords,
} from "./intrinsic-keywords.ts";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
import type { GrandArchiveTestFixture } from "../../testing/test-fixture.ts";

/**
 * Engine-owned keyword-effect coverage.
 *
 * Behavioral keyword coverage lives in the engine so card-local tests do not
 * re-prove shared rules. This file owns concise end-to-end keyword fixtures;
 * specialized sibling suites and names without a standalone runtime branch
 * are recorded in the exhaustive ownership table at the bottom of this file.
 */

type TestCard = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

/** Constructs a card-local ability id in the catalog's required `<card>-a<N>` form. */
function abilityId(canonicalId: string, ordinal: number): GrandArchiveAbilityId {
  return `${canonicalId}-a${ordinal}` as GrandArchiveAbilityId;
}

interface KeywordCardOptions {
  readonly canonicalId: string;
  readonly type?: Extract<
    GrandArchiveCardType,
    "ACTION" | "ALLY" | "ATTACK" | "DOMAIN" | "ITEM" | "WEAPON"
  >;
  readonly supertypes?: readonly GrandArchiveSupertype[];
  readonly subtypes?: readonly string[];
  readonly stats?: {
    readonly level?: number;
    readonly life?: number;
    readonly power?: number;
    readonly durability?: number;
  };
  readonly speed?: "fast" | "slow";
  readonly cost?:
    | { readonly kind: "none" }
    | { readonly kind: "reserve"; readonly amount: number }
    | { readonly kind: "memory"; readonly amount: number };
  readonly elements?: readonly GrandArchiveElement[];
  readonly abilities?: readonly GrandArchiveAbilityDefinition[];
}

function keywordAbility(
  canonicalId: string,
  keyword: GrandArchiveKeyword,
  triggered: boolean,
  ordinal = 1,
): GrandArchiveIntrinsicStaticAbility | GrandArchiveIntrinsicTriggeredAbility {
  const base = { id: abilityId(canonicalId, ordinal), text: "", keyword } as const;
  return triggered
    ? { ...base, kind: "triggered", intrinsic: true }
    : { ...base, kind: "static", staticKind: "intrinsic" };
}

/** Minimal single-faced card carrying one intrinsic keyword ability. */
export function keywordCard(
  keyword: GrandArchiveKeyword,
  options: KeywordCardOptions & { readonly triggered?: boolean },
): TestCard {
  const type = options.type ?? "ALLY";
  const canonicalId = options.canonicalId;
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
        cost: options.cost ?? { kind: "none" },
        typeLine: {
          supertypes: [...(options.supertypes ?? [])],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: [...(options.subtypes ?? [])],
        },
        elements: [...(options.elements ?? ["NORM"])],
        ...(options.speed ? { speed: options.speed } : {}),
        stats: options.stats ?? (type === "ALLY" ? { power: 1, life: 3 } : {}),
        rulesText: "",
        abilities: options.abilities ?? [
          keywordAbility(canonicalId, keyword, options.triggered ?? false),
        ],
      },
    },
  };
}

function fillerCard(canonicalId: string, speed: "fast" | "slow" = "fast"): TestCard {
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: ["ACTION"], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        speed,
        stats: {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

function championCard(canonicalId: string, level = 0): TestCard {
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
        cost: { kind: "memory", amount: 0 },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: ["WARRIOR"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: { level, life: 30, power: 2 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

/** Two-player keyword fixture with both champions, deck fillers, and flexible zones. */
export function keywordFixture(
  fixture: Omit<GrandArchiveTestFixture, "playerOne" | "playerTwo"> & {
    readonly playerOne?: Partial<GrandArchiveTestFixture["playerOne"]>;
    readonly playerTwo?: Partial<GrandArchiveTestFixture["playerTwo"]>;
    readonly championLevel?: number;
  },
): GrandArchiveTestEngine {
  const level = fixture.championLevel ?? 0;
  const championOne = championCard("keyword-fixture-champion-one");
  const championTwo = championCard("keyword-fixture-champion-two");
  const leveledOne = leveledChampion("keyword-fixture-champion-one-level", level);
  const leveledTwo = leveledChampion("keyword-fixture-champion-two-level", level);
  const filler = fillerCard("keyword-fixture-filler");
  const deckFillers = [filler, filler, filler, filler, filler, filler] as const;
  const withFillers = (
    player: Partial<GrandArchiveTestFixture["playerOne"]> | undefined,
    champion: typeof championOne,
    lineage: readonly TestCard[],
  ) => ({
    champion,
    lineage,
    ...player,
    zones: { "main-deck": deckFillers, ...player?.zones },
  });
  return GrandArchiveTestEngine.startFixture({
    ...fixture,
    playerOne: withFillers(fixture.playerOne, championOne, level > 0 ? [leveledOne] : []),
    playerTwo: withFillers(fixture.playerTwo, championTwo, level > 0 ? [leveledTwo] : []),
  });
}

/** Higher-level champion face used through the fixture lineage arrangement. */
function leveledChampion(canonicalId: string, level: number): TestCard {
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
        cost: { kind: "memory", amount: 1 },
        typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        stats: { level, life: 30, power: 2 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

function objectIdOf(engine: GrandArchiveTestEngine, definitionId: string): GrandArchiveObjectId {
  const object = Object.values(engine.state.objects).find(
    (candidate) => candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing keyword fixture object ${definitionId}`);
  return object.id;
}

/** Fast SPELL action that announces one field-unit target and deals 1 damage. */
function targetedSpell(
  canonicalId: string,
  options: {
    readonly subtypes?: readonly string[];
    readonly cost?: "none" | number;
  } = {},
): TestCard {
  const subtypes = options.subtypes ?? ["SPELL"];
  const amount = options.cost ?? "none";
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
        cost: amount === "none" ? { kind: "none" } : { kind: "reserve", amount },
        typeLine: {
          supertypes: [],
          types: ["ACTION"],
          classes: ["WARRIOR"],
          subtypes: [...subtypes],
        },
        elements: ["NORM"],
        speed: "fast",
        stats: {},
        rulesText: "",
        abilities: [
          {
            id: `${canonicalId}-a1`,
            kind: "card-resolution",
            text: "Deal 1 damage to target unit.",
            targets: [
              {
                id: "target-unit",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: { kind: "up-to", amount: 1 },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  filter: { kind: "type", oneOf: ["ALLY"] },
                },
              },
            ],
            effect: {
              kind: "deal-damage",
              source: { kind: "source" },
              recipient: { kind: "bound", binding: "target-unit" },
              amount: 1,
            },
          },
        ],
      },
    },
  };
}

function objectIn(engine: GrandArchiveTestEngine, definitionId: string): GrandArchiveCardInstance {
  const object = engine.state.objects[objectIdOf(engine, definitionId)];
  if (!object) throw new Error(`Missing keyword fixture object ${definitionId}`);
  return object;
}

/** Passes every Opportunity until the Effects Stack empties, answering forced decisions. */
function drainStack(game: GrandArchiveTestEngine, acceptOptionalEffects = false): void {
  for (let step = 0; step < 96 && game.state.stack.length > 0; step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      const decision = game.state.decision!;
      if (decision.kind === "resolve-optional-effect" && acceptOptionalEffects) {
        game.player(decision.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: true,
        });
        continue;
      }
      if (!game.answerForcedDecision()) {
        throw new Error(
          `Unexpected keyword keyword-action choice ${game.state.decision?.kind ?? "unknown"}`,
        );
      }
      continue;
    }
    if (wait.kind === "game-over") throw new Error("Keyword fixture match ended unexpectedly");
    if (wait.kind !== "opportunity") throw new Error(`Unexpected wait state ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  if (game.state.stack.length > 0) throw new Error("Keyword fixture stack did not drain");
}

/** Advances phases by passing, skipping materialization, and answering forced decisions. */
function passUntil(
  game: GrandArchiveTestEngine,
  predicate: (engine: GrandArchiveTestEngine) => boolean,
): void {
  for (let step = 0; step < 96 && !predicate(game); step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      if (!game.answerForcedDecision()) {
        throw new Error(
          `Unforced decision ${game.state.decision?.kind ?? "unknown"} while passing`,
        );
      }
      continue;
    }
    if (wait.kind === "materialization-choice") {
      game.player(wait.playerId).execute({ move: "skip-materialization" });
      continue;
    }
    if (wait.kind !== "opportunity") throw new Error(`Unexpected wait state ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  if (!predicate(game)) throw new Error("Keyword fixture never reached the expected state");
}

/** Passes Opportunities until a decision of the given kind becomes pending. */
function untilDecision<Kind extends GrandArchiveDecision["kind"]>(
  game: GrandArchiveTestEngine,
  kind: Kind,
): Extract<GrandArchiveDecision, { readonly kind: Kind }> {
  for (let step = 0; step < 32; step += 1) {
    const decision = game.state.decision;
    if (decision && decision.kind === kind) {
      return decision as Extract<GrandArchiveDecision, { readonly kind: Kind }>;
    }
    const wait = game.waitState();
    if (wait.kind === "opportunity") {
      game.player(wait.playerId).pass();
      continue;
    }
    if (wait.kind === "decision" && game.answerForcedDecision()) continue;
    throw new Error(`Unexpected wait state ${wait.kind} while awaiting ${kind}`);
  }
  throw new Error(`Decision ${kind} never appeared`);
}

/** Drives the current combat to completion, retaliating with and declining Critical. */
function completeCombat(
  game: GrandArchiveTestEngine,
  retaliators: readonly GrandArchiveObjectId[] = [],
  declineCritical = true,
): void {
  for (let step = 0; step < 64 && game.state.combat; step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      const decision = game.state.decision!;
      if (decision.kind === "choose-retaliators") {
        game.player(decision.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: retaliators,
        });
        continue;
      }
      if (decision.kind === "resolve-critical" && declineCritical) {
        game.player(decision.playerId).execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [],
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      throw new Error(`Unexpected combat decision ${decision.kind}`);
    }
    if (wait.kind === "opportunity") {
      game.player(wait.playerId).pass();
      continue;
    }
    throw new Error(`Unexpected combat wait state ${wait.kind}`);
  }
  if (game.state.combat) throw new Error("Keyword fixture combat did not finish");
}

/** Returns a copy of the card with extra intrinsic keyword abilities prepended. */
function withKeywords(card: TestCard, keywords: readonly GrandArchiveKeyword[]): TestCard {
  if (card.layout.kind !== "single-faced")
    throw new Error("Keyword helpers need single-faced cards");
  return {
    ...card,
    layout: {
      ...card.layout,
      face: {
        ...card.layout.face,
        abilities: [
          ...keywords.map((keyword, index) =>
            keywordAbility(card.canonicalId, keyword, false, 100 + index),
          ),
          ...card.layout.face.abilities,
        ],
      },
    },
  };
}

describe("Grand Archive keyword effects", () => {
  it("derives an intrinsic keyword from its printed static ability", () => {
    const hinderedItem = keywordCard(
      { name: "hindered" },
      { canonicalId: "kw-hindered-item", type: "ITEM" },
    );
    const game = keywordFixture({
      playerOne: { zones: { field: [hinderedItem] } },
    });
    const hinderedId = objectIdOf(game, hinderedItem.canonicalId);
    expect(
      grandArchiveObjectHasActiveKeyword(
        game.program,
        game.state,
        game.state.objects[hinderedId]!,
        "hindered",
      ),
    ).toBe(true);
    expect(
      grandArchiveObjectActiveKeywords(game.program, game.state, game.state.objects[hinderedId]!),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ name: "hindered" })]));
  });

  it("Hindered enters the field rested", () => {
    const hinderedItem = keywordCard(
      { name: "hindered" },
      {
        canonicalId: "kw-hindered-enters",
        type: "ITEM",
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { hand: [hinderedItem] } },
    });
    game.player("player-one").activate(hinderedItem);
    drainStack(game);
    const entered = objectIn(game, hinderedItem.canonicalId);
    expect(entered.zone).toBe("field");
    expect(entered.states.has("rested")).toBe(true);
  });

  it("Bulwark enters the field with one bulwark counter per instance", () => {
    const bulwarkAlly = keywordCard(
      { name: "bulwark" },
      {
        canonicalId: "kw-bulwark-enters",
        stats: { power: 1, life: 3 },
        abilities: [
          keywordAbility("kw-bulwark-enters", { name: "bulwark" }, false),
          keywordAbility("kw-bulwark-enters", { name: "bulwark" }, false, 2),
        ],
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { hand: [bulwarkAlly] } },
    });
    game.player("player-one").activate(bulwarkAlly);
    drainStack(game);
    const entered = objectIn(game, bulwarkAlly.canonicalId);
    expect(entered.zone).toBe("field");
    expect(entered.counters.bulwark).toBe(2);
  });

  it("Vigor wakes the unit at the beginning of its controller's end step", () => {
    const vigorAlly = keywordCard(
      { name: "vigor" },
      {
        canonicalId: "kw-vigor-ally",
        triggered: true,
        stats: { power: 1, life: 3 },
      },
    );
    const initial = keywordFixture({
      playerOne: { zones: { field: [vigorAlly] } },
    });
    const rested = new GrandArchiveTransactionKernel().transact(initial.state, [
      {
        type: "object-state-changed",
        objectId: objectIdOf(initial, vigorAlly.canonicalId),
        state: "rested",
        value: true,
      },
    ]).state;
    const game = GrandArchiveTestEngine.fromState(initial.program, rested);
    expect(objectIn(game, vigorAlly.canonicalId).states.has("rested")).toBe(true);

    passUntil(game, (engine) => engine.state.turn.phase === "end" && engine.state.stack.length > 0);
    const vigorTrigger = game.state.stack.find(
      (item) =>
        item.kind === "triggered-ability" && item.ability.id === `${vigorAlly.canonicalId}-a1`,
    );
    expect(vigorTrigger).toBeDefined();
    drainStack(game);
    expect(objectIn(game, vigorAlly.canonicalId).states.has("rested")).toBe(false);
  });

  it("Foster fosters an undamaged ally at the beginning of its controller's recollection phase", () => {
    const fosterAlly = keywordCard(
      { name: "foster" },
      {
        canonicalId: "kw-foster-ally",
        triggered: true,
        stats: { power: 1, life: 3 },
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { field: [fosterAlly] } },
    });
    const one = game.state.turnOrder[0]!;
    passUntil(
      game,
      (engine) =>
        engine.state.turn.playerId === one &&
        engine.state.turn.number > 1 &&
        engine.state.turn.phase === "main" &&
        engine.state.stack.length === 0,
    );
    const fostered = game.state.objects[objectIdOf(game, fosterAlly.canonicalId)]!;
    expect(fostered.states.has("fostered")).toBe(true);
  });

  it("Taunt forces awake taunt units to be targeted before other objects", () => {
    const tauntAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-taunt-ally",
        stats: { power: 1, life: 3 },
      },
    );
    const game = keywordFixture({
      playerTwo: { zones: { field: [tauntAlly] } },
    });
    const attacker = game.player("player-one");
    expect(() =>
      attacker.declareAttack("keyword-fixture-champion-one", "keyword-fixture-champion-two"),
    ).toThrow(/legal attack target/);
    attacker.declareAttack("keyword-fixture-champion-one", tauntAlly);
    expect(game.state.combat?.targetIds).toEqual([objectIdOf(game, tauntAlly.canonicalId)]);
  });

  it("Stealth blocks attack declarations unless the attacker has True Sight", () => {
    const stealthAlly = keywordCard(
      { name: "stealth" },
      {
        canonicalId: "kw-stealth-ally",
        stats: { power: 1, life: 3 },
      },
    );
    const trueSightAlly = keywordCard(
      { name: "true-sight" },
      {
        canonicalId: "kw-true-sight-ally",
        stats: { power: 2, life: 3 },
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { field: [trueSightAlly] } },
      playerTwo: { zones: { field: [stealthAlly] } },
    });
    const attacker = game.player("player-one");
    expect(() => attacker.declareAttack("keyword-fixture-champion-one", stealthAlly)).toThrow(
      /legal attack target/,
    );
    attacker.declareAttack(trueSightAlly, stealthAlly);
    expect(game.state.combat?.targetIds).toEqual([objectIdOf(game, stealthAlly.canonicalId)]);
  });

  it("Unblockable attack declarations ignore Taunt", () => {
    const unblockableAlly = keywordCard(
      { name: "unblockable" },
      {
        canonicalId: "kw-unblockable-ally",
        stats: { power: 2, life: 3 },
      },
    );
    const tauntAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-unblockable-taunt-ally",
        stats: { power: 1, life: 3 },
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { field: [unblockableAlly] } },
      playerTwo: { zones: { field: [tauntAlly] } },
    });
    game.player("player-one").declareAttack(unblockableAlly, "keyword-fixture-champion-two");
    expect(game.state.combat?.targetIds).toEqual([
      objectIdOf(game, "keyword-fixture-champion-two"),
    ]);
  });

  it("Spellshroud prevents spell targeting but not attack declarations", () => {
    const spellshroudAlly = keywordCard(
      { name: "spellshroud" },
      {
        canonicalId: "kw-spellshroud-ally",
        stats: { power: 1, life: 3 },
      },
    );
    const spell = targetedSpell("kw-spellshroud-spell");
    const game = keywordFixture({
      playerOne: { zones: { hand: [spell] } },
      playerTwo: { zones: { field: [spellshroudAlly] } },
    });
    const caster = game.player("player-one");
    const targetId = objectIdOf(game, spellshroudAlly.canonicalId);
    expect(() => caster.activate(spell, { targets: { "target-unit": [targetId] } })).toThrow(
      /target/i,
    );
    caster.declareAttack("keyword-fixture-champion-one", spellshroudAlly);
    expect(game.state.combat?.targetIds).toEqual([targetId]);
  });

  it("Omnishroud prevents activation targeting while attacks may still declare it", () => {
    const omnishroudAlly = keywordCard(
      { name: "omnishroud" },
      {
        canonicalId: "kw-omnishroud-ally",
        stats: { power: 1, life: 3 },
      },
    );
    const spell = targetedSpell("kw-omnishroud-spell", { subtypes: ["CURSE"] });
    const game = keywordFixture({
      playerOne: { zones: { hand: [spell] } },
      playerTwo: { zones: { field: [omnishroudAlly] } },
    });
    const caster = game.player("player-one");
    const targetId = objectIdOf(game, omnishroudAlly.canonicalId);
    expect(() => caster.activate(spell, { targets: { "target-unit": [targetId] } })).toThrow(
      /target/i,
    );
    caster.declareAttack("keyword-fixture-champion-one", omnishroudAlly);
    expect(game.state.combat?.targetIds).toEqual([targetId]);
  });

  it("Floating Memory pays one memory from the graveyard during materialization", () => {
    const floatingCard = keywordCard(
      { name: "floating-memory" },
      {
        canonicalId: "kw-floating-memory-card",
      },
    );
    const materializable = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-floating-memory-target",
        type: "ITEM",
        supertypes: ["REGALIA"],
        cost: { kind: "memory", amount: 1 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "materialize",
      playerOne: {
        zones: { graveyard: [floatingCard], "material-deck": [materializable] },
      },
    });
    const player = game.player("player-one");
    const floatingId = player.card(floatingCard, { zone: "graveyard" }).objectId;

    player.materialize(materializable, { floatingMemoryCardIds: [floatingId] });

    expect(game.state.objects[floatingId]?.zone).toBe("banishment");
    expect(game.state.stack.at(-1)?.activationPayment).toEqual([
      { objectId: floatingId, from: "graveyard", to: "banishment" },
    ]);
  });

  it("Reservable rests a ready object to pay one reserve", () => {
    const reservableItem = keywordCard(
      { name: "reservable" },
      {
        canonicalId: "kw-reservable-item",
        type: "ITEM",
      },
    );
    const pricedSpell = targetedSpell("kw-reservable-spell", { cost: 1 });
    const game = keywordFixture({
      playerOne: {
        zones: { field: [reservableItem], hand: [pricedSpell] },
      },
    });
    const player = game.player("player-one");
    const reservableId = objectIdOf(game, reservableItem.canonicalId);
    player.activate(pricedSpell, {
      targets: { "target-unit": [] },
      reservePayment: [{ kind: "reservable", objectId: reservableId }],
    });
    const reservable = game.state.objects[reservableId]!;
    expect(reservable.states.has("rested")).toBe(true);
    expect(game.state.stack.at(-1)?.activationPayment).toEqual([{ objectId: reservable.id }]);
  });

  it("Kindle banishes fire graveyard cards to pay reserve", () => {
    const kindleSpell = withKeywords(targetedSpell("kw-kindle-spell", { cost: 2 }), [
      { name: "kindle", value: 2 },
    ]);
    const firePayment = fillerCard("kw-kindle-fire-payment");
    if (firePayment.layout.kind !== "single-faced") {
      throw new Error("Keyword fixture filler must be single-faced");
    }
    const fireCard: TestCard = {
      ...firePayment,
      layout: {
        kind: "single-faced",
        face: { ...firePayment.layout.face, elements: ["FIRE"] },
      },
    };
    const game = keywordFixture({
      playerOne: {
        zones: {
          graveyard: [fireCard, fireCard],
          hand: [kindleSpell],
        },
      },
    });
    const player = game.player("player-one");
    const fireIds = player.cards(fireCard, { zone: "graveyard" }).map((ref) => ref.objectId);
    expect(fireIds).toHaveLength(2);
    player.activate(kindleSpell, {
      targets: { "target-unit": [] },
      kindleCardIds: fireIds,
    });
    for (const fireId of fireIds) {
      expect(game.state.objects[fireId]?.zone).toBe("banishment");
    }
    expect(game.state.stack.at(-1)?.activationPayment).toEqual(
      expect.arrayContaining(fireIds.map((objectId) => expect.objectContaining({ objectId }))),
    );
  });

  it("Efficiency reduces a card's reserve cost by the champion's level", () => {
    const efficientSpell = withKeywords(targetedSpell("kw-efficiency-spell", { cost: 3 }), [
      { name: "efficiency" },
    ]);
    const payment = fillerCard("kw-efficiency-payment");
    const game = keywordFixture({
      championLevel: 2,
      playerOne: {
        zones: { hand: [efficientSpell, payment] },
      },
    });
    const player = game.player("player-one");
    const spellId = player.card(efficientSpell, { zone: "hand" }).objectId;
    const paymentId = player.card(payment, { zone: "hand" }).objectId;
    expect(
      player.expectFailure({
        move: "activate-card",
        cardId: spellId,
        targets: { "target-unit": [] },
      }).code,
    ).toBe("illegal-command");
    player.activate(efficientSpell, {
      targets: { "target-unit": [] },
      reservePayment: [{ kind: "card", cardId: paymentId }],
    });
    expect(game.state.stack.at(-1)?.activationPayment).toEqual([
      expect.objectContaining({ objectId: paymentId }),
    ]);
  });

  it("applies Efficiency granted to an action card still in hand", () => {
    const granted = targetedSpell("kw-granted-efficiency-spell", { cost: 3 });
    if (granted.layout.kind !== "single-faced") throw new Error("Expected single-faced spell");
    const efficientSpell: TestCard = {
      ...granted,
      layout: {
        kind: "single-faced",
        face: {
          ...granted.layout.face,
          abilities: [
            {
              id: abilityId(granted.canonicalId, 2),
              kind: "static",
              staticKind: "effects",
              text: "This card has efficiency.",
              effects: [
                {
                  kind: "continuous",
                  subjects: { kind: "source" },
                  affectedSet: "dynamic",
                  duration: { kind: "while-source-in-functional-zone" },
                  layer: { layer: "D", modifies: "ability" },
                  change: { kind: "grant-keyword", keyword: { name: "efficiency" } },
                },
              ],
            },
            ...granted.layout.face.abilities,
          ],
        },
      },
    };
    const payment = fillerCard("kw-granted-efficiency-payment");
    const game = keywordFixture({
      championLevel: 2,
      playerOne: { zones: { hand: [efficientSpell, payment] } },
    });
    const player = game.player("player-one");
    const paymentId = player.card(payment, { zone: "hand" }).objectId;
    player.activate(efficientSpell, {
      targets: { "target-unit": [] },
      reservePayment: [{ kind: "card", cardId: paymentId }],
    });
    expect(game.state.stack.at(-1)?.activationPayment).toEqual([
      expect.objectContaining({ objectId: paymentId }),
    ]);
  });

  it("Fast Activation permits an unspeeded card on a non-empty Effects Stack", () => {
    const fastAlly = keywordCard(
      { name: "fast-activation" },
      {
        canonicalId: "kw-fast-activation-ally",
      },
    );
    const slowAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-fast-activation-slow-ally",
        abilities: [],
      },
    );
    const stackAction = fillerCard("kw-fast-activation-stack-action");
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { hand: [stackAction, fastAlly, slowAlly] } },
    });
    const player = game.player("player-one");
    player.activate(stackAction);
    expect(game.state.stack).toHaveLength(1);
    expect(() => player.activate(slowAlly)).toThrow(
      /Slow cards require the turn player's empty-stack Main phase/,
    );
    player.activate(fastAlly);
    expect(game.state.stack).toHaveLength(2);
    drainStack(game);
    expect(game.state.stack).toHaveLength(0);
    player.activate(slowAlly);
    expect(game.state.stack).toHaveLength(1);
  });

  it("Ephemerate activates an action from the graveyard and banishes it as it resolves", () => {
    const ephemerateCard = withKeywords(targetedSpell("kw-ephemerate-card"), [
      { name: "ephemerate", cost: { kind: "pay-reserve", amount: 2 } },
    ]);
    const payment = fillerCard("kw-ephemerate-payment");
    const game = keywordFixture({
      playerOne: {
        zones: {
          graveyard: [ephemerateCard],
          hand: [payment, payment],
        },
      },
    });
    const player = game.player("player-one");
    const payments = player.cards(payment, { zone: "hand" }).map((ref) => ref.objectId);
    expect(payments).toHaveLength(2);
    const ephemerateId = game.state.zones[player.id].graveyard[0]!;
    player.execute({
      move: "activate-card",
      cardId: ephemerateId,
      activationMethod: "ephemerate",
      targets: { "target-unit": [] },
      reservePayment: payments.map((cardId) => ({ kind: "card" as const, cardId })),
    });
    drainStack(game);
    expect(game.state.objects[ephemerateId]?.zone).toBe("banishment");
  });

  it("Brew sacrifices listed ingredients instead of the reserve cost", () => {
    const brewSpell = withKeywords(targetedSpell("kw-brew-spell", { cost: 3 }), [
      {
        name: "brew",
        requirements: [{ kind: "subtype", value: "Herb", count: 2 }],
      },
    ]);
    const herb = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-brew-herb",
        subtypes: ["Herb"],
        abilities: [],
      },
    );
    const game = keywordFixture({
      playerOne: {
        zones: { field: [herb, herb], hand: [brewSpell] },
      },
    });
    const player = game.player("player-one");
    const herbIds = player.cards(herb, { zone: "field" }).map((ref) => ref.objectId);
    expect(herbIds).toHaveLength(2);
    player.activate(brewSpell, {
      targets: { "target-unit": [] },
      activationMethod: "brew",
      brewIngredientIds: herbIds,
    });
    for (const herbId of herbIds) {
      expect(game.state.objects[herbId]?.zone).toBe("graveyard");
    }
    expect(game.state.stack.at(-1)?.activationStates).toContain("brewed");
  });

  it("Aenean Progression charges two more reserve for each resolved instance this game", () => {
    const progressionSpell = withKeywords(targetedSpell("kw-progression-spell", { cost: 0 }), [
      { name: "aenean-progression" },
    ]);
    const payment = fillerCard("kw-progression-payment");
    const game = keywordFixture({
      playerOne: {
        zones: { hand: [progressionSpell, progressionSpell, payment, payment] },
      },
    });
    const player = game.player("player-one");
    const spells = player.cards(progressionSpell, { zone: "hand" }).map((ref) => ref.objectId);
    const payments = player.cards(payment, { zone: "hand" }).map((ref) => ref.objectId);
    expect(payments).toHaveLength(2);
    player.execute({
      move: "activate-card",
      cardId: spells[0]!,
      targets: { "target-unit": [] },
    });
    drainStack(game);
    player.execute({
      move: "activate-card",
      cardId: spells[1]!,
      targets: { "target-unit": [] },
      reservePayment: payments.map((cardId) => ({ kind: "card" as const, cardId })),
    });
    expect(game.state.stack.at(-1)?.activationPayment).toEqual(
      expect.arrayContaining(payments.map((objectId) => expect.objectContaining({ objectId }))),
    );
  });

  it("Pride blocks activating a disobedient ally's ability until the champion levels", () => {
    const proudAlly = keywordCard(
      { name: "pride", value: 2 },
      {
        canonicalId: "kw-pride-ally",
        abilities: [
          {
            id: abilityId("kw-pride-ally", 1),
            kind: "static",
            staticKind: "intrinsic",
            text: "Pride 2",
            keyword: { name: "pride", value: 2 },
          },
          {
            id: abilityId("kw-pride-ally", 2),
            kind: "activated",
            text: "Rest: Do nothing.",
            activation: "ability",
            cost: { kind: "rest", subject: { kind: "source" } },
            effect: { kind: "no-op" },
          },
        ],
      },
    );
    const setupGame = (championLevel: number) =>
      keywordFixture({
        championLevel,
        playerOne: { zones: { field: [proudAlly] } },
      });
    const game = setupGame(0);
    const player = game.player("player-one");
    expect(() => player.activateAbility(proudAlly, abilityId("kw-pride-ally", 2))).toThrow(
      /disobedient ally/,
    );
    const leveled = setupGame(2);
    leveled.player("player-one").activateAbility(proudAlly, abilityId("kw-pride-ally", 2));
    expect(leveled.state.stack.at(-1)).toMatchObject({ kind: "activated-ability" });
  });

  it("Retort adds power while the ally retaliates", () => {
    const attackingAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-retort-attacker",
        stats: { power: 2, life: 5 },
        abilities: [],
      },
    );
    const retortAlly = keywordCard(
      { name: "retort", value: 2 },
      {
        canonicalId: "kw-retort-defender",
        stats: { power: 1, life: 5 },
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [attackingAlly] } },
      playerTwo: { zones: { field: [retortAlly] } },
    });
    const player = game.player("player-one");
    const defenderId = objectIdOf(game, retortAlly.canonicalId);
    player.declareAttack(attackingAlly, retortAlly);
    completeCombat(game, [defenderId]);
    const attacker = game.state.objects[objectIdOf(game, attackingAlly.canonicalId)]!;
    expect(attacker.damage).toBe(3);
    expect(game.state.objects[defenderId]?.damage).toBe(2);
  });

  it("Critical doubles combat damage unless an opponent discards N cards", () => {
    const criticalAlly = keywordCard(
      { name: "critical", value: 1 },
      {
        canonicalId: "kw-critical-attacker",
        stats: { power: 2, life: 5 },
      },
    );
    const defenderAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-critical-defender",
        stats: { power: 0, life: 9 },
        abilities: [],
      },
    );
    const discardPayment = fillerCard("kw-critical-discard");
    const setupGame = () =>
      keywordFixture({
        phase: "main",
        playerOne: { zones: { field: [criticalAlly] } },
        playerTwo: { zones: { field: [defenderAlly], hand: [discardPayment] } },
      });

    const declinedGame = setupGame();
    declinedGame.player("player-one").declareAttack(criticalAlly, defenderAlly);
    const declined = untilDecision(declinedGame, "resolve-critical");
    declinedGame.player(declined.playerId).execute({
      move: "answer-decision",
      decisionId: declined.id,
      stateVersion: declined.stateVersion,
      answer: [],
    });
    completeCombat(declinedGame);
    expect(
      declinedGame.state.objects[objectIdOf(declinedGame, defenderAlly.canonicalId)]?.damage,
    ).toBe(4);

    const paidGame = setupGame();
    const discardId = paidGame.player("player-two").card(discardPayment, { zone: "hand" }).objectId;
    paidGame.player("player-one").declareAttack(criticalAlly, defenderAlly);
    const paid = untilDecision(paidGame, "resolve-critical");
    paidGame.player(paid.playerId).execute({
      move: "answer-decision",
      decisionId: paid.id,
      stateVersion: paid.stateVersion,
      answer: [discardId],
    });
    completeCombat(paidGame);
    expect(paidGame.state.objects[objectIdOf(paidGame, defenderAlly.canonicalId)]?.damage).toBe(2);
    expect(paidGame.state.objects[discardId]?.zone).toBe("graveyard");
  });

  it("Exalted permits playing Exalted-element cards only while a champion enables another advanced element", () => {
    const exaltedAction = keywordCard(
      { name: "exalted" },
      {
        canonicalId: "kw-exalted-action",
        type: "ACTION",
        elements: ["EXALTED"],
        cost: { kind: "none" },
      },
    );
    function championWithElements(canonicalId: string, elements: readonly GrandArchiveElement[]) {
      const champion = championCard(canonicalId);
      return champion.layout.kind === "single-faced"
        ? {
            ...champion,
            layout: {
              kind: "single-faced" as const,
              face: { ...champion.layout.face, elements: [...elements] },
            },
          }
        : champion;
    }
    for (const [label, elements, playable] of [
      ["advanced element", ["TERA"], true],
      ["basic element only", ["FIRE"], false],
      ["Exalted itself", ["EXALTED"], false],
    ] as const) {
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: championWithElements("kw-exalted-champion", elements),
          zones: { hand: [exaltedAction] },
        },
        playerTwo: { champion: championWithElements("kw-exalted-opponent", ["NORM"]) },
      });
      const player = game.player("player-one");
      if (playable) {
        player.activate(exaltedAction);
        expect(game.state.stack.length).toBeGreaterThan(0);
      } else {
        expect(() => player.activate(exaltedAction)).toThrow(
          /does not have every required element enabled/u,
        );
      }
    }
  });

  it("Intercept redirects a champion attack to the awake intercept ally", () => {
    const interceptAlly = keywordCard(
      { name: "intercept" },
      {
        canonicalId: "kw-intercept-ally",
        triggered: true,
        stats: { power: 1, life: 5 },
      },
    );
    const game = keywordFixture({
      phase: "main",
      firstPlayer: "playerTwo",
      playerOne: { zones: { field: [interceptAlly] } },
    });
    game
      .player("player-two")
      .declareAttack("keyword-fixture-champion-two", "keyword-fixture-champion-one");
    const trigger = game.state.stack.find(
      (item) =>
        item.kind === "triggered-ability" &&
        item.sourceId === objectIdOf(game, interceptAlly.canonicalId),
    );
    expect(trigger).toBeDefined();
    drainStack(game, true);
    expect(game.state.combat?.targetIds).toEqual([objectIdOf(game, interceptAlly.canonicalId)]);
    completeCombat(game);
  });

  it("Ambush lets a non-defending ally retaliate against another defender's attacker", () => {
    const ambusher = keywordCard(
      { name: "ambush" },
      {
        canonicalId: "kw-ambush-ally",
        stats: { power: 2, life: 5 },
      },
    );
    const defender = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-ambush-defender",
        stats: { power: 1, life: 5 },
        abilities: [],
      },
    );
    const attacker = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-ambush-attacker",
        stats: { power: 2, life: 9 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [attacker] } },
      playerTwo: { zones: { field: [defender, ambusher] } },
    });
    game.player("player-one").declareAttack(attacker, defender);
    const decision = untilDecision(game, "choose-retaliators");
    const ambusherId = objectIdOf(game, ambusher.canonicalId);
    expect(decision.candidates).toContain(ambusherId);
    game.player(decision.playerId).execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: [ambusherId],
    });
    completeCombat(game);
    expect(game.state.objects[objectIdOf(game, attacker.canonicalId)]?.damage).toBe(2);
  });

  it("Steadfast lets a rested defending ally retaliate", () => {
    const steadfastAlly = keywordCard(
      { name: "steadfast" },
      {
        canonicalId: "kw-steadfast-ally",
        stats: { power: 2, life: 5 },
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerTwo: { zones: { field: [steadfastAlly] } },
    });
    const steadfastId = objectIdOf(game, steadfastAlly.canonicalId);
    const rested = new GrandArchiveTransactionKernel().transact(game.state, [
      { type: "object-state-changed", objectId: steadfastId, state: "rested", value: true },
    ]).state;
    const restedGame = GrandArchiveTestEngine.fromState(game.program, rested);
    restedGame.player("player-one").declareAttack("keyword-fixture-champion-one", steadfastAlly);
    const decision = untilDecision(restedGame, "choose-retaliators");
    expect(decision.candidates).toContain(steadfastId);
    restedGame.player(decision.playerId).execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: [steadfastId],
    });
    completeCombat(restedGame);
    const championOne =
      restedGame.state.objects[objectIdOf(restedGame, "keyword-fixture-champion-one")]!;
    expect(championOne.damage).toBe(2);
  });

  it("Cleave attacks every attackable object the chosen player controls", () => {
    const cleaveAlly = keywordCard(
      { name: "cleave" },
      {
        canonicalId: "kw-cleave-ally",
        stats: { power: 2, life: 5 },
      },
    );
    const bystander = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-cleave-bystander",
        stats: { power: 0, life: 5 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [cleaveAlly] } },
      playerTwo: { zones: { field: [bystander] } },
    });
    const playerTwo = game.state.turnOrder[1]!;
    game.player("player-one").execute({
      move: "declare-attack",
      attackerId: objectIdOf(game, cleaveAlly.canonicalId),
      targetIds: [],
      cleavePlayerId: playerTwo,
    });
    expect(game.state.combat?.targetIds).toEqual(
      expect.arrayContaining([
        objectIdOf(game, bystander.canonicalId),
        objectIdOf(game, "keyword-fixture-champion-two"),
      ]),
    );
    completeCombat(game);
    expect(game.state.objects[objectIdOf(game, bystander.canonicalId)]?.damage).toBe(2);
    expect(game.state.objects[objectIdOf(game, "keyword-fixture-champion-two")]?.damage).toBe(2);
  });

  it("Multistrike adds its exact number of additional attack targets", () => {
    const multistrikeAlly = keywordCard(
      { name: "multistrike", value: 1 },
      {
        canonicalId: "kw-multistrike-ally",
        stats: { power: 2, life: 5 },
      },
    );
    const secondTarget = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-multistrike-second-target",
        stats: { power: 0, life: 5 },
        abilities: [],
      },
    );
    const thirdTarget = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-multistrike-third-target",
        stats: { power: 0, life: 5 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [multistrikeAlly] } },
      playerTwo: { zones: { field: [secondTarget, thirdTarget] } },
    });
    const attacker = game.player("player-one");
    const attackerId = objectIdOf(game, multistrikeAlly.canonicalId);
    const championId = objectIdOf(game, "keyword-fixture-champion-two");
    const secondTargetId = objectIdOf(game, secondTarget.canonicalId);
    const thirdTargetId = objectIdOf(game, thirdTarget.canonicalId);
    expect(
      attacker.expectFailure({
        move: "declare-attack",
        attackerId,
        targetIds: [championId, secondTargetId, thirdTargetId],
      }).message,
    ).toMatch(/illegal number of targets/i);
    attacker.execute({
      move: "declare-attack",
      attackerId,
      targetIds: [championId, secondTargetId],
    });
    expect(game.state.combat?.targetIds).toHaveLength(2);
    completeCombat(game);
    expect(game.state.objects[secondTargetId]?.damage).toBe(2);
  });

  it("Command rests an ally attacker instead of the champion", () => {
    const soldier = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-command-soldier",
        subtypes: ["CHESSMAN"],
        stats: { power: 2, life: 5 },
        abilities: [],
      },
    );
    const commandAttack = keywordCard(
      { name: "command", subtype: "Chessman" },
      {
        canonicalId: "kw-command-attack",
        type: "ATTACK",
        stats: { power: 1 },
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [soldier], hand: [commandAttack] } },
    });
    const player = game.player("player-one");
    const soldierId = objectIdOf(game, soldier.canonicalId);
    player.activate(commandAttack, { attackAttackerId: soldierId });
    drainStack(game);
    const declaration = untilDecision(game, "declare-resolved-attack");
    expect(declaration.attackerCandidates).toEqual([soldierId]);
    player.execute({
      move: "answer-decision",
      decisionId: declaration.id,
      stateVersion: declaration.stateVersion,
      answer: {
        attackerId: soldierId,
        targetIds: [objectIdOf(game, "keyword-fixture-champion-two")],
      },
    });
    expect(game.state.combat?.attackerId).toBe(soldierId);
    completeCombat(game);
    expect(game.state.objects[soldierId]?.states.has("rested")).toBe(true);
    const ownChampion = game.state.objects[objectIdOf(game, "keyword-fixture-champion-one")]!;
    expect(ownChampion.states.has("rested")).toBe(false);
  });

  it("Commanded Will powers up a unit attacking with a Command card", () => {
    const chessman = keywordCard(
      { name: "commanded-will", value: 2 },
      {
        canonicalId: "kw-commanded-will-ally",
        subtypes: ["CHESSMAN"],
        stats: { power: 1, life: 9 },
      },
    );
    const commandAttack = keywordCard(
      { name: "command", subtype: "Chessman" },
      {
        canonicalId: "kw-commanded-will-attack",
        type: "ATTACK",
        stats: { power: 1 },
      },
    );
    const defenderAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-commanded-will-defender",
        stats: { power: 0, life: 9 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [chessman], hand: [commandAttack] } },
      playerTwo: { zones: { field: [defenderAlly] } },
    });
    const player = game.player("player-one");
    const chessmanId = objectIdOf(game, chessman.canonicalId);
    player.activate(commandAttack, { attackAttackerId: chessmanId });
    drainStack(game);
    const declaration = untilDecision(game, "declare-resolved-attack");
    player.execute({
      move: "answer-decision",
      decisionId: declaration.id,
      stateVersion: declaration.stateVersion,
      answer: { attackerId: chessmanId, targetIds: [objectIdOf(game, defenderAlly.canonicalId)] },
    });
    completeCombat(game);
    const defender = game.state.objects[objectIdOf(game, defenderAlly.canonicalId)]!;
    expect(defender.damage).toBe(4);
  });

  it("Ranged powers up a distant attacker", () => {
    const rangedAlly = keywordCard(
      { name: "ranged", value: 2 },
      {
        canonicalId: "kw-ranged-ally",
        stats: { power: 2, life: 5 },
      },
    );
    const defenderAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-ranged-defender",
        stats: { power: 0, life: 9 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [rangedAlly] } },
      playerTwo: { zones: { field: [defenderAlly] } },
    });
    const rangedId = objectIdOf(game, rangedAlly.canonicalId);
    const distant = new GrandArchiveTransactionKernel().transact(game.state, [
      { type: "object-state-changed", objectId: rangedId, state: "distant", value: true },
    ]).state;
    const distantGame = GrandArchiveTestEngine.fromState(game.program, distant);
    distantGame.player("player-one").declareAttack(rangedAlly, defenderAlly);
    completeCombat(distantGame);
    const defender = distantGame.state.objects[objectIdOf(distantGame, defenderAlly.canonicalId)]!;
    expect(defender.damage).toBe(4);
  });

  it("Siegeable domains lose durability from combat damage instead of life", () => {
    const siegeableDomain = keywordCard(
      { name: "siegeable" },
      {
        canonicalId: "kw-siegeable-domain",
        type: "DOMAIN",
        stats: { durability: 3 },
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerTwo: { zones: { field: [siegeableDomain] } },
    });
    const domainId = objectIdOf(game, siegeableDomain.canonicalId);
    expect(game.state.objects[domainId]?.counters.durability).toBe(3);
    game.player("player-one").declareAttack("keyword-fixture-champion-one", siegeableDomain);
    completeCombat(game);
    const domain = game.state.objects[domainId]!;
    expect(domain.zone).toBe("field");
    expect(domain.counters.durability).toBe(1);
    expect(domain.damage).toBe(0);
  });

  it("Immortality keeps a lethally damaged unit on the field", () => {
    const immortalAlly = keywordCard(
      { name: "immortality" },
      {
        canonicalId: "kw-immortality-ally",
        stats: { power: 0, life: 2 },
      },
    );
    const bigAttacker = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-immortality-attacker",
        stats: { power: 5, life: 9 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [bigAttacker] } },
      playerTwo: { zones: { field: [immortalAlly] } },
    });
    game.player("player-one").declareAttack(bigAttacker, immortalAlly);
    completeCombat(game);
    const immortal = game.state.objects[objectIdOf(game, immortalAlly.canonicalId)]!;
    expect(immortal.zone).toBe("field");
    expect(immortal.damage).toBeGreaterThanOrEqual(2);
  });

  it("Interdiction removes Opportunity while its activation is on the Effects Stack", () => {
    const interdictionAction = keywordCard(
      { name: "interdiction" },
      {
        canonicalId: "kw-interdiction-action",
        type: "ACTION",
        speed: "fast",
        abilities: [
          keywordAbility("kw-interdiction-action", { name: "interdiction" }, false),
          {
            id: abilityId("kw-interdiction-action", 2),
            kind: "card-resolution",
            text: "You may mark your champion.",
            effect: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "add-counter",
                subject: { kind: "champion", player: "controller" },
                counter: { named: "interdiction-accepted" },
                amount: 1,
              },
            },
          },
        ],
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { hand: [interdictionAction] } },
    });
    const player = game.player("player-one");
    player.activate(interdictionAction);
    expect(game.state.stack).toContainEqual(
      expect.objectContaining({
        sourceId: objectIdOf(game, interdictionAction.canonicalId),
        opportunityPolicy: "interdiction",
      }),
    );
    expect(game.state.opportunity).toBeNull();
    drainStack(game, true);
    expect(game.state.opportunity?.holderId).toBe(game.state.turnOrder[0]);
  });

  it("Unique forces a state-based choice between same-name objects", () => {
    const uniqueAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-unique-ally",
        supertypes: ["UNIQUE"],
        abilities: [],
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { field: [uniqueAlly, uniqueAlly] } },
    });
    const copies = game
      .player("player-one")
      .cards(uniqueAlly, { zone: "field" })
      .map((ref) => ref.objectId);
    expect(copies).toHaveLength(2);
    game.player("player-one").pass();
    const decision = game.state.decision;
    if (!decision || decision.kind !== "choose-unique-object") {
      throw new Error(`Expected a uniqueness choice, found ${decision?.kind ?? "none"}`);
    }
    game.player(decision.playerId).execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: copies[0],
    });
    expect(game.state.objects[copies[0]]?.zone).toBe("field");
    expect(game.state.objects[copies[1]!]?.zone).toBe("graveyard");
  });

  it("Renewable returns a banished regalia to its owner's material deck", () => {
    const renewableItem = keywordCard(
      { name: "renewable" },
      {
        canonicalId: "kw-renewable-item",
        type: "ITEM",
        supertypes: ["REGALIA"],
        abilities: [
          keywordAbility("kw-renewable-item", { name: "renewable" }, false),
          {
            id: "kw-renewable-item-a9",
            kind: "activated",
            text: "Banish this item: Do nothing.",
            activation: "ability",
            cost: { kind: "banish-self" },
            effect: { kind: "no-op" },
          },
        ],
      },
    );
    const game = keywordFixture({
      playerOne: { zones: { field: [renewableItem] } },
    });
    game.player("player-one").activateAbility(renewableItem, "kw-renewable-item-a9");
    drainStack(game);
    expect(game.state.objects[objectIdOf(game, renewableItem.canonicalId)]?.zone).toBe(
      "material-deck",
    );
  });

  it("Preserve returns a destroyed ally to its owner's material deck", () => {
    const preservedAlly = keywordCard(
      { name: "preserve" },
      {
        canonicalId: "kw-preserve-ally",
        triggered: true,
        stats: { power: 0, life: 2 },
      },
    );
    const bigAttacker = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-preserve-attacker",
        stats: { power: 5, life: 9 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [bigAttacker] } },
      playerTwo: { zones: { field: [preservedAlly] } },
    });
    game.player("player-one").declareAttack(bigAttacker, preservedAlly);
    completeCombat(game);
    expect(game.state.objects[objectIdOf(game, preservedAlly.canonicalId)]?.zone).toBe(
      "material-deck",
    );
  });

  it("Link announces an intrinsic target and sacrifices itself when the link breaks", () => {
    const linkedItem = keywordCard(
      { name: "link", target: "ally" },
      {
        canonicalId: "kw-link-item",
        type: "ITEM",
      },
    );
    const hostAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-link-host",
        stats: { power: 1, life: 1 },
        abilities: [],
      },
    );
    const removalSpell = targetedSpell("kw-link-removal-spell");
    const game = keywordFixture({
      playerOne: { zones: { hand: [linkedItem, removalSpell], field: [hostAlly] } },
    });
    const player = game.player("player-one");
    const hostId = objectIdOf(game, hostAlly.canonicalId);
    expect(() => player.activate(linkedItem)).toThrow();
    player.activate(linkedItem, { targets: { "intrinsic-link-target": [hostId] } });
    drainStack(game);
    const item = game.state.objects[objectIdOf(game, linkedItem.canonicalId)]!;
    expect(item.zone).toBe("field");
    expect(item.hostId).toBe(hostId);

    player.activate(removalSpell, { targets: { "target-unit": [hostId] } });
    drainStack(game);
    expect(game.state.objects[hostId]?.zone).toBe("graveyard");
    expect(game.state.objects[item.id]?.zone).toBe("graveyard");
  });

  it("Link Shield destroys the shield instead of its damaged linked ally", () => {
    const shieldItem = keywordCard(
      { name: "link", target: "ally" },
      {
        canonicalId: "kw-link-shield-item",
        type: "ITEM",
        abilities: [
          keywordAbility("kw-link-shield-item", { name: "link", target: "ally" }, false),
          keywordAbility("kw-link-shield-item", { name: "link-shield" }, false, 2),
        ],
      },
    );
    const shieldedAlly = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-link-shield-ally",
        stats: { power: 0, life: 2 },
        abilities: [],
      },
    );
    const bigAttacker = keywordCard(
      { name: "taunt" },
      {
        canonicalId: "kw-link-shield-attacker",
        stats: { power: 5, life: 9 },
        abilities: [],
      },
    );
    const game = keywordFixture({
      phase: "main",
      playerOne: { zones: { field: [bigAttacker] } },
      playerTwo: { zones: { hand: [shieldItem], field: [shieldedAlly] } },
    });
    const allyId = objectIdOf(game, shieldedAlly.canonicalId);
    const shieldId = objectIdOf(game, shieldItem.canonicalId);
    const linkedState = new GrandArchiveTransactionKernel().transact(game.state, [
      { type: "object-moved", objectId: shieldId, from: "hand", to: "field", hostId: allyId },
    ]).state;
    const linkedGame = GrandArchiveTestEngine.fromState(game.program, linkedState);
    expect(linkedGame.state.objects[shieldId]?.hostId).toBe(allyId);

    linkedGame.player("player-one").declareAttack(bigAttacker, shieldedAlly);
    completeCombat(linkedGame);
    expect(linkedGame.state.objects[shieldId]?.zone).toBe("graveyard");
    const ally = linkedGame.state.objects[allyId]!;
    expect(ally.zone).toBe("field");
    expect(ally.damage).toBe(0);
  });
  it("Aetherwing requires a load, moves every loaded card to intent, and excludes attack cards", () => {
    const weapon = keywordCard(
      { name: "aetherwing" },
      {
        canonicalId: "kw-aetherwing",
        type: "WEAPON",
        subtypes: ["AETHERWING"],
        stats: { power: 1, durability: 3 },
      },
    );
    const charge = keywordCard(
      { name: "aethercalling" },
      {
        canonicalId: "kw-loaded-charge",
        type: "ACTION",
        subtypes: ["AETHERCHARGE", "SPELL"],
        stats: { power: 2 },
        abilities: [
          {
            id: "kw-loaded-charge-a1",
            kind: "card-resolution",
            text: "Load this card into target Aetherwing.",
            targets: [
              {
                id: "weapon",
                kind: "target",
                declared: "announcement",
                chooser: "controller",
                count: { kind: "exactly", amount: 1 },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      { kind: "type", oneOf: ["WEAPON"] },
                      { kind: "subtype", oneOf: ["AETHERWING"] },
                    ],
                  },
                },
              },
            ],
            effect: {
              kind: "move",
              subject: { kind: "source" },
              destination: { zone: "loaded", host: { kind: "bound", binding: "weapon" } },
            },
          },
        ],
      },
    );
    const attack = keywordCard(
      { name: "cleave" },
      { canonicalId: "kw-aetherwing-attack", type: "ATTACK", stats: { power: 2 }, abilities: [] },
    );
    for (const withAttackCard of [false, true]) {
      const game = keywordFixture({
        playerOne: { zones: { field: [weapon], hand: [charge, charge, attack] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const attacker = p.card("keyword-fixture-champion-one"),
        defender = q.card("keyword-fixture-champion-two"),
        host = p.card(weapon);
      const before = game.state;
      expect(() => p.declareAttack(attacker, defender, { weaponIds: [host.objectId] })).toThrow();
      expect(game.state).toEqual(before);
      const loads = p.cards(charge);
      for (const source of loads) {
        p.activate(source, { targets: { weapon: [host.objectId] } });
        drainStack(game);
        expect(game.state.objects[source.objectId]?.zone).toBe("loaded");
        expect(game.state.objects[source.objectId]?.hostId).toBe(host.objectId);
      }
      if (withAttackCard) {
        p.activate(attack, { attackAttackerId: attacker.objectId });
        const decision = untilDecision(game, "declare-resolved-attack");
        const beforeAttack = game.state;
        expect(() =>
          p.execute({
            move: "answer-decision",
            decisionId: decision.id,
            stateVersion: decision.stateVersion,
            answer: {
              attackerId: attacker.objectId,
              targetIds: [defender.objectId],
              weaponIds: [host.objectId],
            },
          }),
        ).toThrow();
        expect(game.state).toEqual(beforeAttack);
        p.execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: { attackerId: attacker.objectId, targetIds: [defender.objectId], weaponIds: [] },
        });
      } else {
        p.declareAttack(attacker, defender, { weaponIds: [host.objectId] });
        for (const source of loads) {
          expect(game.state.objects[source.objectId]?.zone).toBe("intent");
          expect(game.state.objects[source.objectId]?.hostId).toBe(attacker.objectId);
        }
      }
      completeCombat(game);
      expect(game.state.objects[defender.objectId]?.damage).toBe(withAttackCard ? 4 : 7);
      expect(game.state.objects[host.objectId]?.counters.durability).toBe(withAttackCard ? 3 : 2);
      for (const source of loads)
        expect(game.state.objects[source.objectId]?.zone).toBe(
          withAttackCard ? "loaded" : "graveyard",
        );
    }
  });
});

type KeywordCoverageOwner =
  | "keyword-effects.test.ts"
  | { readonly specializedSuite: string }
  | { readonly noStandaloneRuntimeBranch: string };

/**
 * Exhaustive ownership for every catalog keyword name. `satisfies Record<...>`
 * makes a newly added keyword fail type checking until its engine coverage is
 * assigned deliberately.
 */
const keywordCoverageOwnership = {
  "aenean-progression": "keyword-effects.test.ts",
  aethercalling: { specializedSuite: "commands/special-legal-commands.test.ts" },
  aetherwing: "keyword-effects.test.ts",
  "attack-procedure": {
    noStandaloneRuntimeBranch: "catalog marker expanded into attack procedures",
  },
  agility: { specializedSuite: "kernel/engine.test.ts" },
  ambush: "keyword-effects.test.ts",
  brew: "keyword-effects.test.ts",
  bulwark: "keyword-effects.test.ts",
  cascade: { specializedSuite: "procedures/effects/stack-copy.test.ts" },
  cleave: "keyword-effects.test.ts",
  command: "keyword-effects.test.ts",
  "commanded-will": "keyword-effects.test.ts",
  critical: "keyword-effects.test.ts",
  distant: { noStandaloneRuntimeBranch: "object state consumed by Ranged and turn cleanup" },
  "divine-relic": { specializedSuite: "kernel/engine.test.ts" },
  bow: { noStandaloneRuntimeBranch: "weapon subtype marker" },
  gun: { noStandaloneRuntimeBranch: "weapon subtype marker" },
  efficiency: "keyword-effects.test.ts",
  "elysian-aura": { specializedSuite: "kernel/engine.test.ts" },
  exalted: "keyword-effects.test.ts",
  empower: { specializedSuite: "kernel/engine.test.ts" },
  ephemeral: { noStandaloneRuntimeBranch: "object state produced by Ephemerate" },
  ephemerate: "keyword-effects.test.ts",
  "fast-activation": "keyword-effects.test.ts",
  "first-boon": { specializedSuite: "procedures/game-flow/pregame.test.ts" },
  "floating-memory": "keyword-effects.test.ts",
  foster: "keyword-effects.test.ts",
  gather: { specializedSuite: "kernel/engine.test.ts" },
  glimpse: { specializedSuite: "procedures/effects/numeric-player-actions.test.ts" },
  hindered: "keyword-effects.test.ts",
  imbue: { specializedSuite: "procedures/activation/imbue.test.ts" },
  immortality: "keyword-effects.test.ts",
  intercept: "keyword-effects.test.ts",
  interdiction: "keyword-effects.test.ts",
  kindle: "keyword-effects.test.ts",
  lineage: { specializedSuite: "rules/abilities/lineage-keyword.test.ts" },
  "lineage-release": { specializedSuite: "rules/abilities/lineage-release.test.ts" },
  link: "keyword-effects.test.ts",
  "link-shield": "keyword-effects.test.ts",
  multistrike: "keyword-effects.test.ts",
  omnishroud: "keyword-effects.test.ts",
  omen: { noStandaloneRuntimeBranch: "counter concept, not an executable keyword branch" },
  prepare: { specializedSuite: "procedures/activation/multiple-prepare.test.ts" },
  preserve: "keyword-effects.test.ts",
  pride: "keyword-effects.test.ts",
  ranged: "keyword-effects.test.ts",
  renewable: "keyword-effects.test.ts",
  reservable: "keyword-effects.test.ts",
  retaliate: { noStandaloneRuntimeBranch: "rules term represented by combat retaliation" },
  retort: "keyword-effects.test.ts",
  scavenge: { specializedSuite: "kernel/engine.test.ts" },
  spellshroud: "keyword-effects.test.ts",
  starcalling: { specializedSuite: "commands/special-legal-commands.test.ts" },
  siegeable: "keyword-effects.test.ts",
  steadfast: "keyword-effects.test.ts",
  stealth: "keyword-effects.test.ts",
  suppress: { specializedSuite: "procedures/effects/suppress-rules.test.ts" },
  taunt: "keyword-effects.test.ts",
  "true-sight": "keyword-effects.test.ts",
  unblockable: "keyword-effects.test.ts",
  unique: "keyword-effects.test.ts",
  vigor: "keyword-effects.test.ts",
  "weapon-procedure": {
    noStandaloneRuntimeBranch: "catalog marker expanded into weapon procedures",
  },
  wither: { specializedSuite: "rules/abilities/wither.test.ts" },
} satisfies Record<GrandArchiveKeywordName, KeywordCoverageOwner>;

void keywordCoverageOwnership;
