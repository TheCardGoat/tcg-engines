/**
 * Pitch triggers (CR 1.14.3 payment path + CR 5.3.2 / 8.5.x triggered effects).
 *
 * When a card is pitched while paying a cost, the engine fires:
 * 1. Structured pitch triggers on the pitched card (“When you pitch this”).
 * 2. Structured pitch triggers on controlled sources (hero / equipment / items)
 *    whose filter matches the pitched card (“Whenever you pitch a red card”).
 * 3. Residual text paths for a few trainers / unparsed cases.
 *
 * Free open-action pitch is illegal (CR 1.14.3b) — triggers only ride payment pitch.
 */
import { describe, expect, it } from "vite-plus/test";
import {
  createFabMatchContext,
  FabTestEngine,
  pitchTriggerAbilities,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
  toFabCardDefinition,
  type FabFixtureCardEntry,
} from "../index.ts";
import { pitchTrainer } from "./test-trainers.ts";
import {
  bravo,
  dash,
  heartOfFyendal,
  nimbleStrikeRed,
  nimblismBlue,
  snatchRed,
} from "./fixtures.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

// ── Catalog: self-pitch gems / resources ────────────────────────────────────
import { eyeOfOphidiaBlue as eyeOfOphidia } from "../../../cards/src/cards/resources/eye-of-ophidia.ts";
import { arknightShardBlue as arknightShard } from "../../../cards/src/cards/resources/arknight-shard.ts";
import { lightOfSolYellow as lightOfSol } from "../../../cards/src/cards/resources/light-of-sol.ts";
import { masterCogYellow as masterCog } from "../../../cards/src/cards/resources/master-cog.ts";
import { grandeurOfValahaiBlue as grandeurOfValahai } from "../../../cards/src/cards/resources/grandeur-of-valahai.ts";
import { schismOfChaosBlue as schismOfChaos } from "../../../cards/src/cards/resources/schism-of-chaos.ts";
import { soulOfExistencePurple as soulOfExistence } from "../../../cards/src/cards/resources/soul-of-existence-purple.ts";
import { voltarisBlue as voltaris } from "../../../cards/src/cards/resources/voltaris.ts";
import { plagueHiveYellow as plagueHive } from "../../../cards/src/cards/resources/plague-hive.ts";
import { willOfArcanaBlue as willOfArcana } from "../../../cards/src/cards/resources/will-of-arcana.ts";
import { richesOfTrPalDhaniYellow as richesOfTrPalDhani } from "../../../cards/src/cards/resources/riches-of-tr-pal-dhani.ts";
import { authorityOfAtayaBlue as authorityOfAtaya } from "../../../cards/src/cards/resources/authority-of-ataya.ts";
import { bloodOfTheDracaiRed as bloodOfTheDracai } from "../../../cards/src/cards/resources/blood-of-the-dracai.ts";
import { parchedTerrainRed } from "../../../cards/src/cards/instants/parched-terrain.ts";
import { invigoratingLightRed } from "../../../cards/src/cards/actions/invigorating-light.ts";
import { heraldOfTriumphBlue } from "../../../cards/src/cards/actions/herald-of-triumph.ts";

function ampGainedThisTurn(game: FabTestEngine, playerId: string): number {
  return game
    .committedEvents()
    .filter((event) => event.name === "gain-assets" && event.data.playerId === playerId)
    .reduce((total, event) => total + (event.name === "gain-assets" ? event.data.amp : 0), 0);
}
// ── Catalog: permanent-watchers (whenever you pitch …) ──────────────────────
import { dromai } from "../../../cards/src/cards/heroes/dromai.ts";
import { dromaiAshArtist } from "../../../cards/src/cards/heroes/dromai-ash-artist.ts";
import { baalghorOmenOfTheEnd } from "../../../cards/src/cards/heroes/baalghor-omen-of-the-end.ts";
import { talismanOfRecompenseYellow as talismanOfRecompense } from "../../../cards/src/cards/actions/talisman-of-recompense.ts";
import { vestigeOfSol } from "../../../cards/src/cards/equipment/vestige-of-sol.ts";
import { meridianPathway } from "../../../cards/src/cards/equipment/meridian-pathway.ts";
import { staffOfVerdantShoots } from "../../../cards/src/cards/weapons/staff-of-verdant-shoots.ts";
import { innerChiBlue as innerChi } from "../../../cards/src/cards/resources/inner-chi.ts";
/** Cards with a structured `event.name === "pitch"` ability in the catalog. */
const PITCH_TRIGGER_CATALOG: readonly {
  readonly card: { readonly canonicalId: string; readonly slug?: string };
  readonly kind: "self-pitch" | "permanent-watcher" | "replacement";
  readonly summary: string;
}[] = [
  { card: heartOfFyendal, kind: "self-pitch", summary: "gain 1 life if behind" },
  { card: eyeOfOphidia, kind: "self-pitch", summary: "opt 2" },
  { card: arknightShard, kind: "self-pitch", summary: "create Runechant" },
  { card: grandeurOfValahai, kind: "self-pitch", summary: "create Seismic Surge" },
  { card: plagueHive, kind: "self-pitch", summary: "random aura under each opponent" },
  { card: bloodOfTheDracai, kind: "self-pitch", summary: "next 3 Draconic cost −1" },
  { card: lightOfSol, kind: "self-pitch", summary: "reveal top; yellow → soul" },
  { card: masterCog, kind: "self-pitch", summary: "steam counter on crank item" },
  { card: schismOfChaos, kind: "self-pitch", summary: "each hero shuffle + arsenal top" },
  { card: voltaris, kind: "self-pitch", summary: "create Lightning Flow" },
  { card: richesOfTrPalDhani, kind: "self-pitch", summary: "create Gold" },
  { card: authorityOfAtaya, kind: "self-pitch", summary: "DR cost +1 for opponents" },
  { card: willOfArcana, kind: "self-pitch", summary: "amp 1" },
  { card: soulOfExistence, kind: "self-pitch", summary: "lose 1 life" },
  { card: dromai, kind: "permanent-watcher", summary: "pitch red → create Ash" },
  { card: dromaiAshArtist, kind: "permanent-watcher", summary: "pitch red → create Ash" },
  { card: baalghorOmenOfTheEnd, kind: "permanent-watcher", summary: "pitch any → banish it" },
  { card: talismanOfRecompense, kind: "replacement", summary: "pitch → replace 1 RP with 3" },
  { card: vestigeOfSol, kind: "replacement", summary: "pitch Light + soul → base RP +1" },
  { card: meridianPathway, kind: "permanent-watcher", summary: "pitch Chi → ward 3" },
  {
    card: staffOfVerdantShoots,
    kind: "permanent-watcher",
    summary: "pitch Earth this way → delayed",
  },
];

function hasArenaToken(game: FabTestEngine, hero: typeof bravo, pattern: RegExp): boolean {
  return game
    .as(hero)
    .zone("arena")
    .some((id) => pattern.test(id));
}

function resolvePendingTriggers(game: FabTestEngine): void {
  const triggerGuard = createFabLoopGuard({ label: "pitch-triggers: resolve pending triggers" });
  while (true) {
    triggerGuard.tick();
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision || game.getState().rulesStack.at(-1)?.kind !== "triggered") return;
    game.passBoth();
  }
}

/** Pitch `pitchCard` as payment for cost-1 Nimble Strike (default opponent target). */
function playPitching(
  pitchCard: { canonicalId: string },
  opts: {
    life?: number;
    oppLife?: number;
    hero?: typeof bravo;
    extraHand?: readonly FabFixtureCardEntry[];
    arena?: readonly FabFixtureCardEntry[];
    chest?: readonly FabFixtureCardEntry[];
    legs?: readonly FabFixtureCardEntry[];
    deck?: number | readonly FabFixtureCardEntry[];
  } = {},
) {
  const hero = opts.hero ?? bravo;
  const game = FabTestEngine.start(
    {
      hero,
      life: opts.life ?? 20,
      hand: [nimbleStrikeRed, pitchCard, ...(opts.extraHand ?? [])],
      // Pitch-trigger suites assert payment pitching — opt out of the
      // floating-resource default so the cost is genuinely uncovered.
      resourcePoints: 0,
      arena: opts.arena,
      chest: opts.chest,
      legs: opts.legs,
      deck: opts.deck ?? 6,
    },
    { hero: dash, life: opts.oppLife ?? 20, deck: 6 },
    // Walks priority/pitch timing by hand - opt out of the smart defaults.
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  game.as(hero).play(nimbleStrikeRed, { pitch: [pitchCard] });
  resolvePendingTriggers(game);
  return game;
}

describe("Pitch triggers — mechanism", () => {
  it("CR 1.14.3b: free pitch is illegal (no free path to fire pitch triggers)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [heartOfFyendal], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const cardId = game.findCardInZone(game.as(bravo).id, "hand", heartOfFyendal);
    const r = dispatchTestCommand(game.getRuntime(), "pitch", game.as(bravo).id, { cardId });
    expect(r).toMatchObject({ accepted: false, errorCode: "unknown_move" });
  });

  it("payment pitch moves the card to pitch and generates RP", () => {
    const game = playPitching(nimblismBlue);
    expect(game.as(bravo).zone("pitch")).toContain(nimblismBlue.canonicalId);
    expect(game.as(bravo).resourcePoints()).toBe(2); // pitch 3 − cost 1
  });

  it("trainer: pitch gain-life fires on payment pitch", () => {
    const gem = pitchTrainer({
      slug: "pitch-gain-life",
      effect: { type: "gain-life", amount: 2, target: { selector: "controller" } },
    });
    const game = playPitching(gem, { life: 10 });
    expect(game.as(bravo).life()).toBe(12);
  });

  it("trainer: pitch create-token fires on payment pitch", () => {
    const gem = pitchTrainer({
      slug: "pitch-create-might",
      effect: { type: "create-token", token: "Might", controller: "controller" },
    });
    const game = playPitching(gem);
    expect(hasArenaToken(game, bravo, /might/i)).toBe(true);
  });

  it("trainer: life-comparison condition gates the trigger (Heart of Fyendal shape)", () => {
    const gem = pitchTrainer({
      slug: "pitch-if-behind",
      effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      condition: { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
    });
    const behind = playPitching(gem, { life: 10, oppLife: 15 });
    expect(behind.as(bravo).life()).toBe(11);
    const ahead = playPitching(gem, { life: 15, oppLife: 10 });
    expect(ahead.as(bravo).life()).toBe(15);
  });

  it("multi-card pitch payment fires each pitched card's trigger", () => {
    // cost-1 strike, pitch two blues (3+3) — both create registered real tokens
    const a = pitchTrainer({
      slug: "multi-a",
      effect: { type: "create-token", token: "Might", controller: "controller" },
      pitch: 3,
    });
    const b = pitchTrainer({
      slug: "multi-b",
      effect: { type: "create-token", token: "Vigor", controller: "controller" },
      pitch: 3,
    });
    // Need a cost-2+ attack so both pitches are required; use two cost-0? Better: cost 2 trainer attack.
    const atk = {
      canonicalId: "trainer-cost2-atk",
      types: ["Generic", "Action", "Attack"] as const,
      cost: 4,
      power: 4,
      pitch: 1,
      color: "Red" as const,
    };
    const game = FabTestEngine.start(
      { hero: bravo, hand: [atk, a, b], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(atk, { pitch: [a, b] });
    resolvePendingTriggers(game);
    expect(hasArenaToken(game, bravo, /might/i)).toBe(true);
    expect(hasArenaToken(game, bravo, /vigor/i)).toBe(true);
  });
});

describe("Pitch triggers — catalog inventory", () => {
  it("every known pitch-trigger card still exposes event.name === pitch (or delayed-trigger)", () => {
    for (const entry of PITCH_TRIGGER_CATALOG) {
      const def = toFabCardDefinition(entry.card as Parameters<typeof toFabCardDefinition>[0]);
      const structured = pitchTriggerAbilities(def);
      const delayed = (def.base.abilities ?? []).some(
        (a) =>
          (a as { effect?: { type?: string; event?: { name?: string } } }).effect?.type ===
            "delayed-trigger" &&
          (a as { effect?: { event?: { name?: string } } }).effect?.event?.name === "pitch",
      );
      const replacement = (def.base.abilities ?? []).some(
        (ability) =>
          ability.effect?.type === "replacement" && ability.effect.replaces.name === "pitch",
      );
      // Vestige stores pitch as delayed-trigger under continuous — allow that shape.
      expect(
        structured.length > 0 || delayed || replacement,
        `${entry.card.canonicalId} (${entry.summary}) missing pitch trigger AST`,
      ).toBe(true);
    }
  });

  it("inventory lists 21 production pitch-trigger sources", () => {
    expect(PITCH_TRIGGER_CATALOG).toHaveLength(21);
  });
});

describe("Pitch triggers — self-pitch gems (catalog)", () => {
  it("Heart of Fyendal: gain 1 life when behind; none when ahead", () => {
    const def = toFabCardDefinition(heartOfFyendal);
    expect(pitchTriggerAbilities(def)[0]?.resolution).toMatchObject({
      kind: "effect",
      effect: { type: "gain-life" },
    });
    const behind = playPitching(heartOfFyendal, { life: 10, oppLife: 15 });
    expect(behind.as(bravo).life()).toBe(11);
    const ahead = playPitching(heartOfFyendal, { life: 15, oppLife: 10 });
    expect(ahead.as(bravo).life()).toBe(15);
  });

  it("Eye of Ophidia: opt 2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, eyeOfOphidia],
        deck: [nimblismBlue, snatchRed, heartOfFyendal, arknightShard],
        resourcePoints: 0,
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(nimbleStrikeRed, { pitch: [eyeOfOphidia] });
    resolvePendingTriggers(game);
    const decision = game.getState().decision;
    expect(decision).toMatchObject({ kind: "partition", actorId: game.as(bravo).id });
    if (!decision || decision.kind !== "partition")
      throw new Error("Expected persisted opt partition.");
    game.exec({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: {
          kind: "partition",
          groups: { top: decision.entries.map((entry) => entry.id), bottom: [] },
        },
      },
    });
    expect(
      [...game.committedEvents()].reverse().find((event) => event.name === "opt"),
    ).toMatchObject({
      name: "opt",
      data: { count: 2 },
    });
  });

  it("Arknight Shard: create a Runechant token", () => {
    const game = playPitching(arknightShard);
    expect(hasArenaToken(game, bravo, /runechant/i)).toBe(true);
    // Exactly one token from structured ability (no residual double-create).
    expect(
      game
        .as(bravo)
        .zone("arena")
        .filter((id) => /runechant/i.test(id)),
    ).toHaveLength(1);
  });

  it("Grandeur of Valahai: create a Seismic Surge token", () => {
    const game = playPitching(grandeurOfValahai);
    expect(hasArenaToken(game, bravo, /seismic/i)).toBe(true);
  });

  it("Voltaris: create a Lightning Flow token", () => {
    const game = playPitching(voltaris);
    expect(hasArenaToken(game, bravo, /lightning/i)).toBe(true);
  });

  it("Riches of Tr'pal Dhani: create a Gold token (single)", () => {
    const game = playPitching(richesOfTrPalDhani);
    const golds = game
      .as(bravo)
      .zone("arena")
      .filter((id) => /gold/i.test(id));
    expect(golds.length).toBe(1);
  });

  it("Soul of Existence: lose 1 life", () => {
    const game = playPitching(soulOfExistence, { life: 20 });
    expect(game.as(bravo).life()).toBe(19);
  });

  it("Will of Arcana: amp 1", () => {
    const game = playPitching(willOfArcana);
    expect(ampGainedThisTurn(game, game.as(bravo).id)).toBeGreaterThanOrEqual(1);
  });

  it("Plague Hive: create a random aura token under the opposing hero", () => {
    const game = playPitching(plagueHive);
    const dashArena = game.as(dash).zone("arena");
    expect(
      dashArena.some((id) => /inertia|frailty|bloodrot/i.test(id)),
      `expected aura under opponent, got ${JSON.stringify(dashArena)}`,
    ).toBe(true);
  });

  it("Blood of the Dracai: registers next-3 Draconic cost reduction", () => {
    const game = playPitching(bloodOfTheDracai, { extraHand: [parchedTerrainRed] });
    expect(game.getState().continuousEffectInstances).toContainEqual(
      expect.objectContaining({
        controllerId: game.as(bravo).id,
        atoms: expect.arrayContaining([
          expect.objectContaining({
            kind: "numeric",
            property: "cost",
            operation: "subtract",
            amount: 1,
          }),
        ]),
      }),
    );
    if (game.getState().rulesStack.length > 0) game.passBoth();
    const parchedTerrainId = game.findCardInZone(game.as(bravo).id, "hand", parchedTerrainRed);
    const resourcesBefore = game.as(bravo).resourcePoints();
    game.as(bravo).play(parchedTerrainRed);
    expect(game.as(bravo).resourcePoints()).toBe(resourcesBefore);
    expect(game.getState().continuousEffectInstances).toContainEqual(
      expect.objectContaining({
        controllerId: game.as(bravo).id,
        futureApplicability: expect.objectContaining({
          remaining: 2,
          ordinal: 1,
          latchedSubjects: [expect.objectContaining({ instanceId: parchedTerrainId })],
        }),
      }),
    );
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "continuous-effect-future-object-observed" && event.data.latched,
        ),
    ).toBe(true);
  });

  it("Authority of Ataya: registers opponent defense-reaction cost surcharge", () => {
    const game = playPitching(authorityOfAtaya);
    expect(game.getState().continuousEffectInstances).toContainEqual(
      expect.objectContaining({
        controllerId: game.as(bravo).id,
        atoms: expect.arrayContaining([
          expect.objectContaining({
            kind: "numeric",
            property: "cost",
            operation: "add",
            amount: 1,
          }),
        ]),
      }),
    );
  });

  it("Light of Sol: reveal top of deck (no crash on soul path)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, lightOfSol],
        deck: [nimblismBlue, snatchRed, heartOfFyendal, arknightShard],
        resourcePoints: 0,
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(nimbleStrikeRed, { pitch: [lightOfSol] });
    resolvePendingTriggers(game);
    expect(game.committedEvents().some((event) => event.name === "reveal")).toBe(true);
  });

  it("Schism of Chaos: pitches and shuffles controller deck", () => {
    const game = playPitching(schismOfChaos);
    expect(game.as(bravo).zone("pitch")).toContain(schismOfChaos.canonicalId);
    expect(game.committedEvents().filter((event) => event.name === "shuffle-zone")).toHaveLength(2);
    for (const hero of [bravo, dash]) {
      const playerId = game.as(hero).id;
      const arsenal = game.getState().containers.zonesByPlayerId[playerId]!.arsenal;
      expect(arsenal).toHaveLength(1);
      expect(game.getState().objects[arsenal[0]!]?.markers).toContainEqual({ kind: "face-down" });
    }
  });

  it("Master Cog: pitches (optional steam counter when no crank item is a no-op)", () => {
    const game = playPitching(masterCog);
    expect(game.as(bravo).zone("pitch")).toContain(masterCog.canonicalId);
  });
});

describe("Pitch triggers — permanent watchers (catalog)", () => {
  it("Dromai (young): whenever you pitch a red card, create an Ash token", () => {
    // Pitch Blood of the Dracai (red gem) while Dromai is the hero.
    const game = playPitching(bloodOfTheDracai, { hero: dromai });
    expect(hasArenaToken(game, dromai, /ash/i)).toBe(true);
  });

  it("Dromai, Ash Artist: whenever you pitch a red card, create an Ash token", () => {
    const game = playPitching(bloodOfTheDracai, { hero: dromaiAshArtist });
    expect(hasArenaToken(game, dromaiAshArtist, /ash/i)).toBe(true);
  });

  it("Dromai: pitching a blue card does not create Ash", () => {
    const game = playPitching(nimblismBlue, { hero: dromai });
    expect(hasArenaToken(game, dromai, /ash/i)).toBe(false);
  });

  it("Baalghor: whenever you pitch a card, banish it", () => {
    const game = playPitching(nimblismBlue, { hero: baalghorOmenOfTheEnd });
    expect(game.as(baalghorOmenOfTheEnd).zone("pitch")).not.toContain(nimblismBlue.canonicalId);
    expect(game.as(baalghorOmenOfTheEnd).zone("banished")).toContain(nimblismBlue.canonicalId);
  });

  it("Talisman of Recompense: replaces exactly 1 pitched resource with 3 and destroys itself", () => {
    const game = playPitching(bloodOfTheDracai, {
      arena: [talismanOfRecompense],
    });
    expect(game.as(bravo).resourcePoints()).toBe(2);
    expect(game.as(bravo).zone("arena")).not.toContain(talismanOfRecompense.canonicalId);
    expect(game.as(bravo).zone("graveyard")).toContain(talismanOfRecompense.canonicalId);
    expect(
      game
        .committedEvents()
        .find((event) => event.name === "pitch")
        ?.replacementIds.some((replacementId) =>
          replacementId.endsWith(
            ":9ttJWT9drbGLKtmTFMDqM:wheneverPitchWouldGainExactlyOneResourceInsteadDestroyTalismanRecompenseGain",
          ),
        ),
    ).toBe(true);
  });

  it("Meridian Pathway: pitching a Chi card fires the equip's pitch trigger", () => {
    // Inner Chi is a Chi resource — permanent filter "Chi" should match.
    const chi = innerChi;
    const def = toFabCardDefinition(chi as Parameters<typeof toFabCardDefinition>[0]);
    // If catalog marks Chi in types, permanent watcher applies.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chi],
        legs: [meridianPathway],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const pathwayId = game.findCardInZone(actorId, "legs", meridianPathway);
    game.exec({
      move: "activate",
      actorId,
      payload: {
        instanceId: pathwayId,
        ability: "GgRFLW8zdKbNJtgfFTFkp:instantMayPlayAurasTurnAsThoughTheyWere",
      },
    });
    const payment = game.getState().decision;
    expect(payment).toMatchObject({ kind: "payment", actorId });
    if (!payment || payment.kind !== "payment") throw new Error("Expected Chi payment decision.");
    const chiId = game.findCardInZone(actorId, "hand", chi);
    game.exec({
      move: "answer-decision",
      actorId,
      payload: {
        decisionId: payment.decisionId,
        stateVersion: payment.stateVersion,
        answer: { kind: "payment", instanceIds: [chiId] },
      },
    });
    expect(game.as(bravo).zone("pitch")).toContain(chi.canonicalId);
    expect(game.as(bravo).zone("legs")).toContain(meridianPathway.canonicalId);
    expect(game.committedEvents().find((event) => event.name === "pitch")).toMatchObject({
      data: { resourcesGenerated: 0, chiGenerated: 3 },
    });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: "GgRFLW8zdKbNJtgfFTFkp:wheneverPitchChiMayHaveGetWard3Until",
    });
    void def;
  });

  function vestigeFixture(pitchCard: FabFixtureCardEntry): FabTestEngine {
    return FabTestEngine.start(
      {
        hero: bravo,
        hand: [invigoratingLightRed, nimbleStrikeRed, pitchCard, snatchRed],
        arsenal: [heartOfFyendal],
        chest: [vestigeOfSol],
        deck: 8,
        actionPoints: 2,
        resourcePoints: 3,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        deck: 8,
      },
      // Walk payment and priority explicitly; player decisions are never inferred.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
  }

  function putInvigoratingLightIntoSoul(game: FabTestEngine): void {
    const Bravo = game.as(bravo);
    Bravo.attackWith(invigoratingLightRed);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.zone("soul")).toContain(invigoratingLightRed.canonicalId);
  }

  it("Vestige of Sol: a same-turn public soul entry makes a Light blue pitch generate base 3 plus 1", () => {
    const game = vestigeFixture(heraldOfTriumphBlue);
    const Bravo = game.as(bravo);

    putInvigoratingLightIntoSoul(game);
    Bravo.play(nimbleStrikeRed, { pitch: [heraldOfTriumphBlue] });

    expect(Bravo.zone("pitch")).toContain(heraldOfTriumphBlue.canonicalId);
    expect(Bravo.resourcePoints()).toBe(3); // pitch 3 + Vestige 1 - Nimble Strike 1
    expect(
      game
        .committedEvents()
        .find(
          (event) =>
            event.name === "pitch" &&
            event.data.object.canonicalId === heraldOfTriumphBlue.canonicalId,
        ),
    ).toMatchObject({
      data: { resourcesGenerated: 4 },
      replacementIds: [
        expect.stringMatching(/PTjbDJpDMHwR6TdJkBLtr:ifHasBeenPutIntoHeroSSoulTurn$/),
      ],
    });
  });

  it("Vestige of Sol: the same-turn soul fact and replacement survive snapshot restoration", () => {
    let game = vestigeFixture(heraldOfTriumphBlue);
    putInvigoratingLightIntoSoul(game);

    const beforeRestore = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(beforeRestore),
        createFabMatchContext(beforeRestore.cardDefinitions, beforeRestore.publicCardIdentities),
      ),
    );
    const Bravo = game.as(bravo);
    Bravo.play(nimbleStrikeRed, { pitch: [heraldOfTriumphBlue] });

    expect(Bravo.resourcePoints()).toBe(3);
    expect(game.committedEvents().find((event) => event.name === "pitch")).toMatchObject({
      data: { resourcesGenerated: 4 },
      replacementIds: [
        expect.stringMatching(/PTjbDJpDMHwR6TdJkBLtr:ifHasBeenPutIntoHeroSSoulTurn$/),
      ],
    });
  });

  it("Vestige of Sol boundary: a non-Light blue pitch keeps its base value after a soul entry", () => {
    const game = vestigeFixture(nimblismBlue);
    const Bravo = game.as(bravo);

    putInvigoratingLightIntoSoul(game);
    Bravo.play(nimbleStrikeRed, { pitch: [nimblismBlue] });

    expect(Bravo.resourcePoints()).toBe(2); // pitch 3 - Nimble Strike 1
    expect(
      game
        .committedEvents()
        .find(
          (event) =>
            event.name === "pitch" && event.data.object.canonicalId === nimblismBlue.canonicalId,
        ),
    ).toMatchObject({ data: { resourcesGenerated: 3 }, replacementIds: [] });
  });

  it("Vestige of Sol boundary: a Light pitch keeps its base value without a same-turn soul entry", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, heraldOfTriumphBlue, snatchRed, nimblismBlue],
        arsenal: [heartOfFyendal],
        chest: [vestigeOfSol],
        deck: 8,
        resourcePoints: 0,
      },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.play(nimbleStrikeRed, { pitch: [heraldOfTriumphBlue] });

    expect(Bravo.resourcePoints()).toBe(2); // pitch 3 - Nimble Strike 1
    expect(game.committedEvents().find((event) => event.name === "pitch")).toMatchObject({
      data: { resourcesGenerated: 3 },
      replacementIds: [],
    });
  });

  it("Staff of Verdant Shoots: structured pitch delayed-trigger is present", () => {
    const def = toFabCardDefinition(staffOfVerdantShoots);
    const pitchAbs = pitchTriggerAbilities(def);
    expect(pitchAbs.length).toBeGreaterThan(0);
    expect(pitchAbs[0]?.resolution).toMatchObject({
      kind: "effect",
      effect: { type: "delayed-trigger" },
    });
  });
});

describe("Pitch triggers — catalog completeness smoke", () => {
  it.each(
    PITCH_TRIGGER_CATALOG.filter((e) => e.kind === "self-pitch").map((e) => [
      e.card.slug ?? e.card.canonicalId,
      e.card,
      e.summary,
    ]),
  )("self-pitch %s can be pitched as payment (%s)", (_slug, card, _summary) => {
    const pitchCard = card as { canonicalId: string };
    // Some gems are yellow/red pitch value 1–2 — still cover cost 1 with RP shortfall.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        hand: [nimbleStrikeRed, pitchCard],
        deck: 6,
        resourcePoints: 0,
      },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // Yellow pitch 2 covers cost 1; red pitch 1 covers cost 1; blue pitch 3 covers cost 1.
    game.as(bravo).play(nimbleStrikeRed, { pitch: [pitchCard] });
    expect(game.as(bravo).zone("pitch")).toContain(pitchCard.canonicalId);
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
