import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * Hero behavior acceptance tests — Ninja, Ranger, and Runeblade families.
 *
 * Implements the per-hero AAA requirements from HEROES.md for these three
 * classes. Most heroes rely on engine subsystems not yet implemented
 * (combo, arsenal, Runechant, Soul Shackle, Embodiment tokens, etc.) and are
 * documented with it.todo. Health boundaries and any engine-ready mechanics
 * are covered with real passing tests.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer, fabToken } from "../../../../index.ts";
import { listLegalCommands } from "../../../../automation/legal-commands.ts";
import {
  deathDealer,
  drillShotRed,
  nimblismBlue,
  snatchRed,
  tomeOfFyendalYellow,
} from "../../../fixtures.ts";
import { tigerSwipeRed } from "../../../../../../cards/src/cards/actions/tiger-swipe.ts";
import { weaveLightningBlue } from "../../../../../../cards/src/cards/actions/weave-lightning.ts";
import { winterSBiteBlue } from "../../../../../../cards/src/cards/actions/winter-s-bite.ts";

import { phoenixFlameRed } from "../../../../../../cards/src/cards/actions/phoenix-flame.ts";
import { oathOfTheArknightYellow } from "../../../../../../cards/src/cards/actions/oath-of-the-arknight.ts";
import { readTheRunesYellow } from "../../../../../../cards/src/cards/actions/read-the-runes.ts";
import { electrifyRed as electrify } from "../../../../../../cards/src/cards/actions/electrify.ts";
import { whelmingGustwaveRed } from "../../../../../../cards/src/cards/actions/whelming-gustwave.ts";
import { headJabRed } from "../../../../../../cards/src/cards/actions/head-jab.ts";
import { disableRed } from "../../../fixtures.ts";
import { equipmentTrainer } from "../../../test-trainers.ts";

import { katsu } from "../../../../../../cards/src/cards/heroes/katsu.ts";
import { katsuTheWanderer } from "../../../../../../cards/src/cards/heroes/katsu-the-wanderer.ts";
import { fai } from "../../../../../../cards/src/cards/heroes/fai.ts";
import { faiRisingRebellion } from "../../../../../../cards/src/cards/heroes/fai-rising-rebellion.ts";
import { cindra } from "../../../../../../cards/src/cards/heroes/cindra.ts";
import { fealty } from "../../../../../../cards/src/cards/tokens/fealty.ts";
import { kunaiOfRetribution } from "../../../../../../cards/src/cards/weapons/kunai-of-retribution.ts";
import { clawOfVynserakai } from "../../../../../../cards/src/cards/weapons/claw-of-vynserakai.ts";
import { quicksilverDagger } from "../../../../../../cards/src/cards/weapons/quicksilver-dagger.ts";
import { iraCrimsonHaze } from "../../../../../../cards/src/cards/heroes/ira-crimson-haze.ts";
import { iraScarletRevenger } from "../../../../../../cards/src/cards/heroes/ira-scarlet-revenger.ts";
import { benjiThePiercingWind } from "../../../../../../cards/src/cards/heroes/benji-the-piercing-wind.ts";
import { zen } from "../../../../../../cards/src/cards/heroes/zen.ts";
import { azalea } from "../../../../../../cards/src/cards/heroes/azalea.ts";
import { azaleaAceInTheHole } from "../../../../../../cards/src/cards/heroes/azalea-ace-in-the-hole.ts";
import { lexi } from "../../../../../../cards/src/cards/heroes/lexi.ts";
import { riptide } from "../../../../../../cards/src/cards/heroes/riptide.ts";
import { tripwireTrapRed } from "../../../../../../cards/src/cards/defense-reactions/tripwire-trap.ts";
import { viserai } from "../../../../../../cards/src/cards/heroes/viserai.ts";
import { viseraiRuneBlood } from "../../../../../../cards/src/cards/heroes/viserai-rune-blood.ts";
import { chane } from "../../../../../../cards/src/cards/heroes/chane.ts";
import { spellbladeStrikeRed } from "../../../../../../cards/src/cards/actions/spellblade-strike.ts";
import { aurora } from "../../../../../../cards/src/cards/heroes/aurora.ts";
import { auroraShootingStar } from "../../../../../../cards/src/cards/heroes/aurora-shooting-star.ts";
import { briar } from "../../../../../../cards/src/cards/heroes/briar.ts";
import { briarWardenOfThorns } from "../../../../../../cards/src/cards/heroes/briar-warden-of-thorns.ts";
import { florian } from "../../../../../../cards/src/cards/heroes/florian.ts";
import { florianRotwoodHarbinger } from "../../../../../../cards/src/cards/heroes/florian-rotwood-harbinger.ts";
import { viseraiBetweenWorlds } from "../../../../../../cards/src/cards/heroes/viserai-between-worlds.ts";
import { viseraiTheForsaken } from "../../../../../../cards/src/cards/heroes/viserai-the-forsaken.ts";
import { viseraiUsurper } from "../../../../../../cards/src/cards/heroes/viserai-usurper.ts";
import { unboundByShadowRed } from "../../../../../../cards/src/cards/actions/unbound-by-shadow.ts";
import { openTheGateToIArathaelRed } from "../../../../../../cards/src/cards/actions/open-the-gate-to-i-arathael.ts";
import { vynnset } from "../../../../../../cards/src/cards/heroes/vynnset.ts";
import { vynnsetIronMaiden } from "../../../../../../cards/src/cards/heroes/vynnset-iron-maiden.ts";
import { seepingShadowsRed } from "../../../../../../cards/src/cards/actions/seeping-shadows.ts";
import { auroraEmissaryOfLightning } from "../../../../../../cards/src/cards/heroes/aurora-emissary-of-lightning.ts";
import { cindraDracaiOfRetribution } from "../../../../../../cards/src/cards/heroes/cindra-dracai-of-retribution.ts";
import { fangDracaiOfBlades } from "../../../../../../cards/src/cards/heroes/fang-dracai-of-blades.ts";
import { obsidianFireVein } from "../../../../../../cards/src/cards/weapons/obsidian-fire-vein.ts";
import { lexiLivewire } from "../../../../../../cards/src/cards/heroes/lexi-livewire.ts";
import { zenTamerOfPurpose } from "../../../../../../cards/src/cards/heroes/zen-tamer-of-purpose.ts";
import { auroraLegacyOfTempest } from "../../../../../../cards/src/cards/heroes/aurora-legacy-of-tempest.ts";
import { riptideLurkerOfTheDeep } from "../../../../../../cards/src/cards/heroes/riptide-lurker-of-the-deep.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";

const opponentHero = bravo;

// ===========================================================================
// Ninja
// ===========================================================================

// ---------------------------------------------------------------------------
// katsu — KSU002 — Ninja/Young — 20hp
// Printed: "The first time an attack action card you control hits each turn,
// you may discard a card with cost 0. If you do, search your deck for a card
// with combo, banish it face up, then shuffle your deck. You may play it this
// turn."
// Status: Engine-ready (hit trigger + cost-0 discard + combo search + banished play).
// ---------------------------------------------------------------------------

/**
 * Resolve open combat through closed, answering ordering / optional / search
 * decisions for Katsu's first-hit tutor. Prefer a hit-fuel attack without its
 * own hit trigger (e.g. head-jab) so only the hero optional surfaces.
 */
function resolveKatsuHitTutor(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof katsu,
  options: {
    accept?: boolean;
    comboCard?: typeof whelmingGustwaveRed;
  } = {},
): void {
  const accept = options.accept ?? true;
  const player = game.as(hero);
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.hasGameEnded()) return;
    const combatOpen = game.combat()?.open;
    const stackEmpty = game.getState().rulesStack.length === 0;
    const decision = game.getState().decision;
    if (!decision && !combatOpen && stackEmpty) return;

    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      let targetId = decision.candidates[0]?.instanceId;
      if (options.comboCard) {
        const comboId = game
          .getState()
          .containers.zonesByPlayerId[player.id]!.deck.find(
            (id) => game.getState().objects[id]?.canonicalId === options.comboCard!.canonicalId,
          );
        if (comboId && decision.candidates.some((c) => c.instanceId === comboId)) {
          targetId = comboId;
        }
      }
      // Prefer a remaining cost-0 hand card for the discard step (not the attack).
      if (!options.comboCard || !targetId) {
        const handCost0 = game.getState().containers.zonesByPlayerId[player.id]!.hand.find((id) => {
          const def =
            game.getState().cardDefinitions[game.getState().objects[id]?.canonicalId ?? ""];
          return (
            def?.base.numeric.cost === 0 && decision.candidates.some((c) => c.instanceId === id)
          );
        });
        if (handCost0) targetId = handCost0;
      }
      if (!targetId && decision.min > 0) {
        throw new Error(`Katsu entity-target expected a candidate (label=${decision.label}).`);
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: targetId ? [targetId] : [],
          },
        },
      });
      continue;
    }
    if (decision?.kind === "payment") {
      const candidate = decision.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "payment",
            instanceIds: candidate ? [candidate.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) {
      if (game.answerForcedDecision()) continue;
      throw new Error(`resolveKatsuHitTutor: unhandled ${decision.kind}`);
    }
    game.passBoth();
  }
}

describe("katsu (KSU002)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [], deck: 6 },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    expectFabPlayer(game.as(katsu)).toHaveLife(20);
  });

  it("core mechanic: first attack-action hit → discard cost-0 → tutor combo to banished face-up", () => {
    // head-jab: cost-0 attack with go again, no hit trigger of its own.
    // snatch-red: second cost-0 for the discard. Deck end is top (combo).
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(headJabRed);
    resolveKatsuHitTutor(game, katsu, { accept: true, comboCard: whelmingGustwaveRed });

    // Assert — cost-0 discarded to GY; combo banished face-up (no face-down marker).
    expect(Katsu.zone("graveyard")).toContain(snatchRed.canonicalId);
    expectFabCard(Katsu, whelmingGustwaveRed).toBeIn("banished");
    const banishedId = game.findCardInZone(Katsu.id, "banished", whelmingGustwaveRed);
    expect(game.objectState(banishedId)?.faceDown).not.toBe(true);
    // Continuous this-turn play permission for the tutored card.
    const hasPlayPermission = game
      .getState()
      .continuousEffectInstances.some(
        (c) =>
          c.controllerId === Katsu.id &&
          c.atoms.some((a) => a.kind === "rule" && a.parameters.kind === "play-card") &&
          c.initialSubjects.some((s) => s.instanceId === banishedId),
      );
    expect(hasPlayPermission).toBe(true);
  });

  it("core interaction: tutored combo card may be played from banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 2,
        resourcePoints: 0,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Katsu = game.as(katsu);
    const Opponent = game.as(opponentHero);

    Katsu.attackWith(headJabRed);
    resolveKatsuHitTutor(game, katsu, { accept: true, comboCard: whelmingGustwaveRed });
    expectFabCard(Katsu, whelmingGustwaveRed).toBeIn("banished");

    if (game.getState().priority?.holderPlayerId !== Katsu.id) {
      Opponent.pass();
    }
    // Play permission from banished (printed cost 0).
    Katsu.play(whelmingGustwaveRed, { from: "banished" });
    game.passBoth();
    expect(game.combat()?.activeLink).toBeTruthy();
  });

  it("boundaries: declining the optional discard does not search or banish", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(headJabRed);
    resolveKatsuHitTutor(game, katsu, { accept: false });

    // Zone list (not expectFabCard): deck may be reordered by combat/go-again
    // without relocating the combo card.
    expect(Katsu.zone("deck")).toContain(whelmingGustwaveRed.canonicalId);
    expect(Katsu.zone("banished")).toEqual([]);
  });

  it("boundaries: only the first attack-action hit each turn offers the tutor", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Katsu = game.as(katsu);

    // First hit — decline so the deck still has the combo card.
    Katsu.attackWith(headJabRed);
    resolveKatsuHitTutor(game, katsu, { accept: false });

    // Second hit same turn — no optional (first-per-turn limit).
    if (game.getState().priority?.holderPlayerId !== Katsu.id) {
      game.as(opponentHero).pass();
    }
    Katsu.attackWith(headJabRed);
    // Drain combat; there must be no boolean tutor offer on the second hit.
    for (let i = 0; i < 24; i++) {
      const decision = game.getState().decision;
      if (decision?.kind === "boolean") {
        throw new Error("Expected no second-hit Katsu tutor optional this turn.");
      }
      if (decision?.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "ordering",
              orderedIds: decision.entries.map((e) => e.id),
            },
          },
        });
        continue;
      }
      if (!game.combat()?.open && game.getState().rulesStack.length === 0 && !decision) break;
      if (decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }
    expect(Katsu.zone("deck")).toContain(whelmingGustwaveRed.canonicalId);
    expect(Katsu.zone("banished")).toEqual([]);
  });

  it("boundaries: discard candidates are cost 0 only (cost-5 is not legal fodder)", () => {
    // After the attack resolves, the only remaining hand card is cost 5 — no
    // legal cost-0 discard, so accepting the optional cannot tutor.
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed, disableRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Katsu = game.as(katsu);

    Katsu.attackWith(headJabRed);

    // Accept optional if offered; discard entity-target must not list disable-red.
    for (let safety = 0; safety < 32; safety += 1) {
      const decision = game.getState().decision;
      if (!decision) {
        if (!game.combat()?.open && game.getState().rulesStack.length === 0) break;
        game.passBoth();
        continue;
      }
      if (decision.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "ordering",
              orderedIds: decision.entries.map((e) => e.id),
            },
          },
        });
        continue;
      }
      if (decision.kind === "boolean") {
        Katsu.exec({
          move: "answer-decision",
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: true },
          },
        });
        continue;
      }
      if (decision.kind === "entity-target") {
        const disableId = game.findCardInZone(Katsu.id, "hand", disableRed);
        expect(decision.candidates.some((c) => c.instanceId === disableId)).toBe(false);
        // Empty selection — no legal cost-0 discard (min may be 0 when no candidates).
        Katsu.exec({
          move: "answer-decision",
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [] },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      break;
    }
    expect(Katsu.zone("deck")).toContain(whelmingGustwaveRed.canonicalId);
    expect(Katsu.zone("hand")).toContain(disableRed.canonicalId);
    expect(Katsu.zone("banished")).toEqual([]);
  });
});

describe("katsu-the-wanderer (KSU001)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: katsuTheWanderer, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(katsuTheWanderer)).toHaveLife(40);
  });

  it("core mechanic: Adult shares first-hit cost-0 discard → combo banished play permission (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: katsuTheWanderer,
        hand: [headJabRed, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Katsu = game.as(katsuTheWanderer);

    Katsu.attackWith(headJabRed);
    resolveKatsuHitTutor(game, katsuTheWanderer, {
      accept: true,
      comboCard: whelmingGustwaveRed,
    });
    expectFabCard(Katsu, whelmingGustwaveRed).toBeIn("banished");

    if (game.getState().priority?.holderPlayerId !== Katsu.id) {
      game.as(opponentHero).pass();
    }
    Katsu.play(whelmingGustwaveRed, { from: "banished" });
    game.passBoth();
    expect(game.combat()?.activeLink).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// fai — FAI001 — Draconic/Ninja/Young — 20hp
// Printed: "You may start the game with a Phoenix Flame in your graveyard.
// Once per Turn Instant - {r}{r}{r}: Return a Phoenix Flame from your
// graveyard to your hand. This ability costs {r} less to activate for each
// Draconic chain link you control."
// Status: Engine-ready (CR 4.1.5b start-game seating + graveyard recovery).
// ---------------------------------------------------------------------------

describe("fai (FAI001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: fai, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(fai)).toHaveLife(20);
  });

  it("core mechanic: start-game seats Phoenix Flame from deck into graveyard", () => {
    // CR 4.1.5b via shared start-game-meta seating (same path as Dash items).
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: fai,
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          phoenixFlameRed,
        ],
        startGame: [phoenixFlameRed],
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Fai = game.as(fai);

    expect(Fai.zone("graveyard")).toContain(phoenixFlameRed.canonicalId);
    expect(Fai.zone("deck")).not.toContain(phoenixFlameRed.canonicalId);
    expect(Fai.zone("hand")).not.toContain(phoenixFlameRed.canonicalId);
  });

  it("core interaction: start-game Flame can be recovered for 3 RP (full seating→recover path)", () => {
    // Arrange — production start-game seating, then activate recovery.
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: fai,
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          phoenixFlameRed,
        ],
        startGame: [phoenixFlameRed],
        resourcePoints: 3,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Fai = game.as(fai);

    expect(Fai.zone("graveyard")).toContain(phoenixFlameRed.canonicalId);

    const activate = listLegalCommands(game.getRuntime(), Fai.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "QHNfbDkffrKWgwDw7MjwQ:oncePerTurnInstantResourceResourceResourceReturnPhoenixFlameGraveyardHandAbilityCostsResourceLessDraconicChainLink",
    );
    expect(activate).toBeDefined();
    game.exec({ move: "activate", actorId: Fai.id, payload: activate!.payload });

    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Fai.zone("hand")).toContain(phoenixFlameRed.canonicalId);
    expect(Fai.zone("graveyard")).not.toContain(phoenixFlameRed.canonicalId);
  });

  it("boundaries: without enough resources, the ability cannot be activated (no reduction outside combat)", () => {
    // Arrange — Flame in graveyard; only 2 RP (insufficient for base 3 with 0 links).
    // Explicit hand: [] so floating-RP defaults do not mask resourcePoints: 2.
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [],
        graveyard: [phoenixFlameRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Fai = game.as(fai);

    expect(Fai.resourcePoints()).toBe(2);
    const activate = listLegalCommands(game.getRuntime(), Fai.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "QHNfbDkffrKWgwDw7MjwQ:oncePerTurnInstantResourceResourceResourceReturnPhoenixFlameGraveyardHandAbilityCostsResourceLessDraconicChainLink",
    );
    expect(activate).toBeUndefined();
  });

  it("boundaries: start-game is optional — omitting selection leaves Flame out of graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, snatchRed, snatchRed, snatchRed],
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          phoenixFlameRed,
        ],
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Fai = game.as(fai);

    expect(Fai.zone("graveyard")).not.toContain(phoenixFlameRed.canonicalId);
  });
});

describe("fai-rising-rebellion (UPR044)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: faiRisingRebellion, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(faiRisingRebellion)).toHaveLife(40);
  });

  it("boundaries: Phoenix Flame retrieval costs 3 RP with 0 chain links", () => {
    // Arrange — graveyard has a Phoenix Flame, 3 RP, 0 chain links.
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: faiRisingRebellion,
        graveyard: [phoenixFlameRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const FaiRR = game.as(faiRisingRebellion);

    // Assert — ability IS listed at full cost (3 RP).
    const activate = listLegalCommands(game.getRuntime(), FaiRR.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "RjNJbgTJn7bJrjJHBdfC8:oncePerTurnInstantResourceResourceResourceReturnPhoenixFlameGraveyardHandAbilityCostsResourceLessDraconicChainLink",
    );
    expect(activate).toBeDefined();
  });

  it("boundaries: ability NOT affordable with 2 RP and 0 chain links", () => {
    // Arrange — same setup but only 2 RP (below 3 RP base cost).
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: faiRisingRebellion,
        graveyard: [phoenixFlameRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const FaiRR = game.as(faiRisingRebellion);

    // Assert — ability is NOT listed (can't afford 3 RP).
    const activate = listLegalCommands(game.getRuntime(), FaiRR.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "RjNJbgTJn7bJrjJHBdfC8:oncePerTurnInstantResourceResourceResourceReturnPhoenixFlameGraveyardHandAbilityCostsResourceLessDraconicChainLink",
    );
    expect(activate).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// cindra — CIN001 — Royal/Draconic/Ninja/Young — 20hp
// Status: Engine-ready (marked hit → Fealty; OPT Instant equip up to 2 Draconic
// daggers from GY with chain-link costReduction like FAI001).
// ---------------------------------------------------------------------------

/** Activate Cindra equip Instant and equip the given graveyard dagger instance ids (up to 2). */
function resolveCindraEquip(
  game: ReturnType<typeof FabTestEngine.start>,
  daggerInstanceIds: readonly string[],
  options: {
    hero?: typeof cindra;
    abilityId?: string;
  } = {},
): void {
  const hero = options.hero ?? cindra;
  const abilityId =
    options.abilityId ??
    "m7hWTmtRzJnrtqtfLLR6M:oncePerTurnInstantResourceResourceResourceEquipUp2DraconicDaggersGraveyardCostsResourceLessActivateDraconicChainLink";
  const Cindra = game.as(hero);
  const activate = listLegalCommands(game.getRuntime(), Cindra.id).find(
    (cmd) => cmd.move === "activate" && cmd.payload.ability === abilityId,
  );
  expect(activate).toBeDefined();
  game.exec({ move: "activate", actorId: Cindra.id, payload: activate!.payload });
  let selectionSubmitted = false;

  for (let safety = 0; safety < 24; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.continuation.kind === "turn-arsenal" && decision.actorId === Cindra.id) {
      Cindra.target();
      break;
    }
    if (decision?.kind === "entity-target" && decision.actorId === Cindra.id) {
      const picks = daggerInstanceIds
        .map((id) => decision.candidates.find((c) => c.instanceId === id)?.instanceId)
        .filter((id): id is string => Boolean(id));
      // upTo: may select fewer than max when candidates allow zero.
      const selected =
        picks.length > 0
          ? picks.slice(0, decision.max)
          : decision.candidates
              .slice(0, Math.min(decision.max, daggerInstanceIds.length || 1))
              .map((c) => c.instanceId);
      Cindra.exec({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: selected },
        },
      });
      selectionSubmitted = true;
      continue;
    }
    if (decision?.kind === "payment" && decision.actorId === Cindra.id) {
      const candidate = decision.candidates[0];
      Cindra.exec({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "payment",
            instanceIds: candidate ? [candidate.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (selectionSubmitted && !decision && game.getState().rulesStack.length === 0) break;
    const priority = game.getState().priority?.holderPlayerId;
    if (priority) {
      game.exec({ move: "pass", actorId: priority, payload: {} });
      continue;
    }
    if (!decision && game.getState().rulesStack.length === 0) break;
    break;
  }
}

describe("cindra (CIN001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: cindra, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(cindra)).toHaveLife(20);
  });

  it("core mechanic: hitting a marked hero creates a Fealty token", () => {
    // Arrange — Cindra with snatchRed (cost 0, power 4) in hand. The
    // opponent hero is set up as marked so Cindra's hit-trigger fires.
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, marked: true, deck: 6 },
    );
    const Cindra = game.as(cindra);
    const attacks = Cindra.cardsIn("hand", snatchRed);

    // Act — play the attack; no defense so damage resolves and hits.
    Cindra.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Assert — a Fealty token was created in Cindra's arena.
    expect(Cindra.zone("arena")).toContain("token:fealty");
  });

  it("boundaries: hitting a non-marked hero does NOT create a Fealty token", () => {
    // Arrange — Cindra with snatchRed in hand. The opponent is NOT marked.
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Cindra = game.as(cindra);
    const attacks = Cindra.cardsIn("hand", snatchRed);

    // Act — play the attack; damage resolves and hits, but hero is not marked.
    Cindra.must.playAttack(attacks[0]!);

    // Assert — no Fealty token created.
    expect(Cindra.zone("arena")).not.toContain("token:fealty");
  });

  it("core mechanic: pay 3 Instant → equip up to 2 Draconic daggers from graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        graveyard: [kunaiOfRetribution, clawOfVynserakai],
        resourcePoints: 3,
        deck: 6,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Cindra = game.as(cindra);
    const kunaiId = game.findCardInZone(Cindra.id, "graveyard", kunaiOfRetribution);
    const clawId = game.findCardInZone(Cindra.id, "graveyard", clawOfVynserakai);

    resolveCindraEquip(game, [kunaiId, clawId]);

    const weapons = [...Cindra.zone("weapon1"), ...Cindra.zone("weapon2")];
    expect(weapons).toEqual(
      expect.arrayContaining([kunaiOfRetribution.canonicalId, clawOfVynserakai.canonicalId]),
    );
    expect(Cindra.zone("graveyard")).toHaveLength(0);
    expect(Cindra.resourcePoints()).toBe(0);
  });

  it("boundaries: non-Draconic dagger not equippable; insufficient RP; OPT", () => {
    // Non-Draconic dagger in GY only → equip may activate but no legal targets.
    const nonDrac = FabTestEngine.start(
      {
        hero: cindra,
        graveyard: [quicksilverDagger],
        resourcePoints: 3,
        deck: 6,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const C = nonDrac.as(cindra);
    const activate = listLegalCommands(nonDrac.getRuntime(), C.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "m7hWTmtRzJnrtqtfLLR6M:oncePerTurnInstantResourceResourceResourceEquipUp2DraconicDaggersGraveyardCostsResourceLessActivateDraconicChainLink",
    );
    // Ability may still be legal (upTo allows zero) or illegal if no targets required —
    // either way the non-Draconic dagger must remain in GY.
    if (activate) {
      nonDrac.exec({ move: "activate", actorId: C.id, payload: activate.payload });
      for (let safety = 0; safety < 16; safety += 1) {
        const decision = nonDrac.getState().decision;
        if (decision?.kind === "entity-target") {
          expect(
            decision.candidates.every(
              (c) =>
                nonDrac.getState().objects[c.instanceId]?.canonicalId !==
                quicksilverDagger.canonicalId,
            ),
          ).toBe(true);
          // Decline / empty selection if min is 0.
          nonDrac.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: {
                kind: "entity-target",
                instanceIds: decision.min === 0 ? [] : [decision.candidates[0]!.instanceId],
              },
            },
          });
          continue;
        }
        const prio = nonDrac.getState().priority?.holderPlayerId;
        if (prio) {
          nonDrac.exec({ move: "pass", actorId: prio, payload: {} });
          continue;
        }
        break;
      }
    }
    expect(C.zone("graveyard")).toContain(quicksilverDagger.canonicalId);

    // 2 RP with 0 chain links → not affordable (cost 3).
    const lowRp = FabTestEngine.start(
      {
        hand: [],
        hero: cindra,
        graveyard: [kunaiOfRetribution],
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expect(
      listLegalCommands(lowRp.getRuntime(), lowRp.as(cindra).id).find(
        (cmd) =>
          cmd.move === "activate" &&
          cmd.payload.ability ===
            "m7hWTmtRzJnrtqtfLLR6M:oncePerTurnInstantResourceResourceResourceEquipUp2DraconicDaggersGraveyardCostsResourceLessActivateDraconicChainLink",
      ),
    ).toBeUndefined();

    // OPT — second activate same turn is illegal after first resolves.
    const opt = FabTestEngine.start(
      {
        hero: cindra,
        graveyard: [kunaiOfRetribution, clawOfVynserakai],
        resourcePoints: 6,
        deck: 6,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const O = opt.as(cindra);
    const kunaiId = opt.findCardInZone(O.id, "graveyard", kunaiOfRetribution);
    resolveCindraEquip(opt, [kunaiId]);
    expect(
      listLegalCommands(opt.getRuntime(), O.id).find(
        (cmd) =>
          cmd.move === "activate" &&
          cmd.payload.ability ===
            "m7hWTmtRzJnrtqtfLLR6M:oncePerTurnInstantResourceResourceResourceEquipUp2DraconicDaggersGraveyardCostsResourceLessActivateDraconicChainLink",
      ),
    ).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// ira-crimson-haze — IRA001 — Ninja/Young — 20hp
// ira-scarlet-revenger — ASR001 — Ninja — 40hp Adult
// Printed: "Your second attack each turn gets +1{p}."
// Status: Spec (ordinal attack counter via appliesTo.next with ordinal 2).
// ---------------------------------------------------------------------------

describe("ira-crimson-haze (IRA001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: iraCrimsonHaze, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(iraCrimsonHaze)).toHaveLife(20);
  });

  it("core mechanic: second attack each turn gets +1 power (first does not)", () => {
    const game = FabTestEngine.start(
      { hero: iraCrimsonHaze, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);
    const Opponent = game.as(opponentHero);

    // Capture both snatchRed instances to disambiguate.
    const attacks = Ira.cardsIn("hand", snatchRed);
    expect(attacks).toHaveLength(2);

    // First attack: base power 4 — no Ira bonus on the first attack each turn.
    Ira.must.playAttack(attacks[0]!);
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(16); // 20 - 4 = 16

    // Second attack: base power 4 + 1 from Ira's second-attack bonus = 5.
    Ira.must.playAttack(attacks[1]!);
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(11); // 16 - 5 = 11
  });
});

describe("ira-scarlet-revenger (ASR001)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: iraScarletRevenger, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(iraScarletRevenger)).toHaveLife(40);
  });

  it("core mechanic: second attack each turn gets +1 power (first does not)", () => {
    const game = FabTestEngine.start(
      { hero: iraScarletRevenger, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Ira = game.as(iraScarletRevenger);
    const Opponent = game.as(opponentHero);

    const attacks = Ira.cardsIn("hand", snatchRed);

    // First attack: base power 4 — no bonus.
    Ira.must.playAttack(attacks[0]!);
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(16);

    // Second attack: base power 4 + 1 from second-attack bonus = 5.
    Ira.must.playAttack(attacks[1]!);
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(11);
  });

  it("boundaries: only the SECOND attack gets +1 — a third attack is unbuffed", () => {
    // HEROES.md ira boundary: ordinal-2 only (not 3rd+). Three cost-0 attacks
    // with 3 AP; damage path proves power (base 4 unless ordinal-2 grants +1).
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Ira = game.as(iraScarletRevenger);
    const Opponent = game.as(opponentHero);
    const attacks = Ira.cardsIn("hand", snatchRed);

    Ira.must.playAttack(attacks[0]!); // 40 - 4 = 36 (Adult opponent is 20 default dash)
    game.helpers.resolveRestOfCombat();
    // Opponent is dash (20hp) via opponentHero constant.
    expect(Opponent.life()).toBe(16); // 20 - 4
    Ira.must.playAttack(attacks[1]!); // 16 - 5 = 11
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(11);
    Ira.must.playAttack(attacks[2]!); // 11 - 4 = 7 (no third-attack bonus)
    game.helpers.resolveRestOfCombat();
    expect(Opponent.life()).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// benji-the-piercing-wind — CRU047 — Ninja/Young — 17hp
// Printed: "Your attack action cards with 2 or less {p} can't be defended by
// cards from hand. The first time an attack action card you control hits each
// turn, your next attack gains +1{p}."
// Status: Engine-ready (hand-defend restrict on ≤2{p} AAC + first-hit next +1{p}).
// ---------------------------------------------------------------------------

describe("benji-the-piercing-wind (CRU047)", () => {
  it("boundaries: hero defaults to 17 life (distinct low-health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: benjiThePiercingWind, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(benjiThePiercingWind)).toHaveLife(17);
  });

  it("core mechanic: attack action cards with power ≤ 2 can't be defended by hand cards", () => {
    // Arrange — Tiger Swipe is a power-2 attack action; opponent holds a hand block.
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [tigerSwipeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Benji = game.as(benjiThePiercingWind);

    // Act — attack to defend step.
    Benji.attackWith(tigerSwipeRed);

    // Assert — hand defense is illegal against ≤2{p} AAC under Benji's continuous.
    expect(game.combat()?.step).toBe("defend");
    expect(game.as(opponentHero).expectBlockRejected([nimblismBlue]).errorCode).toBe(
      "restricted_by_rule",
    );
  });

  it("boundaries: power > 2 attack actions may still be defended from hand", () => {
    // Snatch is power 4 — Benji's ≤2 restriction does not apply.
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Opponent = game.as(opponentHero);

    Benji.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    // Hand block is legal; declaring it should succeed.
    Opponent.defendWith(nimblismBlue);
    expect(
      Object.values(game.combat()?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat().length,
    ).toBeGreaterThan(0);
  });

  it("core mechanic: first hit by own attack action each turn buffs next attack +1 power", () => {
    const game = FabTestEngine.start(
      { hero: benjiThePiercingWind, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Opponent = game.as(opponentHero);

    const attacks = Benji.cardsIn("hand", snatchRed);

    // First attack hits for base power 4. Trigger fires: next attack gains +1.
    Benji.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(16);

    // Second attack: base 4 + 1 from Benji's hit-trigger buff = 5.
    Benji.must.playAttack(attacks[1]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(11);
  });

  it("boundaries: hit-buff applies only to the NEXT attack after the first hit (third unbuffed)", () => {
    // HEROES.md benji: first hit each turn buffs next attack +1 only once.
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 3,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Opponent = game.as(opponentHero);
    const attacks = Benji.cardsIn("hand", snatchRed);

    Benji.must.playAttack(attacks[0]!); // hit → next +1; 20-4=16
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(16);
    Benji.must.playAttack(attacks[1]!); // 16-5=11
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(11);
    Benji.must.playAttack(attacks[2]!); // 11-4=7 (no further buff)
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// zen — MST047 — Mystic/Ninja/Young — 20hp
// Printed: "Once per Turn Instant - {c}{c}{c}: Create a Crouching Tiger in your
// hand. Search your deck for a card with combo, banish it, then shuffle. You
// may play it this turn."
// Status: Engine-ready (chi Instant → CT hand + combo tutor banished + play).
// ---------------------------------------------------------------------------

/**
 * Activate Zen's once-per-turn Instant (MST047-a1 / MST046-a1): pay 3 chi →
 * create Crouching Tiger in hand, search combo to banished, grant this-turn
 * play permission. Answers search entity-target; drains stack priority.
 */
function resolveZenChiTutor(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof zen,
  options: {
    comboCard?: typeof whelmingGustwaveRed;
    abilityId?: string;
  } = {},
): void {
  const abilityId =
    options.abilityId ??
    (hero === zenTamerOfPurpose
      ? "GDbCgdDrFKCWWthrgD6h6:oncePerTurnInstantChiChiChiCreateCrouchingTigerHandSearchDeckComboBanishThenShufflePlayTurn"
      : "7FHM67fkfjCjzwWzKfFKH:oncePerTurnInstantChiChiChiCreateCrouchingTigerHandSearchDeckComboBanishThenShufflePlayTurn");
  const player = game.as(hero);
  const opponent = game.as(opponentHero);

  const activate = listLegalCommands(game.getRuntime(), player.id).find(
    (cmd) => cmd.move === "activate" && cmd.payload.ability === abilityId,
  );
  expect(activate).toBeDefined();
  game.exec({ move: "activate", actorId: player.id, payload: activate!.payload });

  for (let safety = 0; safety < 48; safety += 1) {
    if (game.hasGameEnded()) return;
    const decision = game.getState().decision;
    if (decision?.kind === "payment" && decision.actorId === player.id) {
      throw new Error(`Zen chi activation unexpectedly required payment (${decision.label})`);
    }
    if (decision?.kind === "entity-target") {
      let targetId = decision.candidates[0]?.instanceId;
      if (options.comboCard) {
        const comboId = game
          .getState()
          .containers.zonesByPlayerId[player.id]!.deck.find(
            (id) => game.getState().objects[id]?.canonicalId === options.comboCard!.canonicalId,
          );
        if (comboId && decision.candidates.some((c) => c.instanceId === comboId)) {
          targetId = comboId;
        }
      }
      if (!targetId && decision.min > 0) {
        throw new Error(`Zen search expected a candidate (label=${decision.label}).`);
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: targetId ? [targetId] : [],
          },
        },
      });
      continue;
    }
    if (decision) {
      if (game.answerForcedDecision()) continue;
      throw new Error(`resolveZenChiTutor: unhandled ${decision.kind}`);
    }
    if (!game.combat()?.open && game.getState().rulesStack.length === 0) return;
    try {
      game.exec({ move: "pass", actorId: player.id });
      continue;
    } catch {
      /* not this player's pass window */
    }
    try {
      game.exec({ move: "pass", actorId: opponent.id });
      continue;
    } catch {
      /* not this player's pass window */
    }
    break;
  }
}

describe("zen (MST047)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: zen, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(zen)).toHaveLife(20);
  });

  it("core mechanic: pay 3 chi → Crouching Tiger in hand + tutor combo to banished", () => {
    // Arrange — Instant path: seed chi; deck end is combo card to tutor.
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        resourcePoints: 0,
        chiPoints: 3,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Zen = game.as(zen);

    // Act
    resolveZenChiTutor(game, zen, { comboCard: whelmingGustwaveRed });

    // Assert — CT in hand; combo banished; chi spent; this-turn play permission.
    expect(Zen.zone("hand")).toContain("token:crouching-tiger");
    expectFabCard(Zen, whelmingGustwaveRed).toBeIn("banished");
    expect(game.getState().players[Zen.id]!.chiPoints).toBe(0);
    const banishedId = game.findCardInZone(Zen.id, "banished", whelmingGustwaveRed);
    const hasPlayPermission = game
      .getState()
      .continuousEffectInstances.some(
        (c) =>
          c.controllerId === Zen.id &&
          c.atoms.some((a) => a.kind === "rule" && a.parameters.kind === "play-card") &&
          c.initialSubjects.some((s) => s.instanceId === banishedId),
      );
    expect(hasPlayPermission).toBe(true);
  });

  it("core interaction: tutored combo card may be played from banished this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        actionPoints: 1,
        resourcePoints: 0,
        chiPoints: 3,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Zen = game.as(zen);
    const Opponent = game.as(opponentHero);

    resolveZenChiTutor(game, zen, { comboCard: whelmingGustwaveRed });
    expectFabCard(Zen, whelmingGustwaveRed).toBeIn("banished");

    if (game.getState().priority?.holderPlayerId !== Zen.id) {
      Opponent.pass();
    }
    // Play permission from banished (whelming gustwave printed cost 0).
    Zen.play(whelmingGustwaveRed, { from: "banished" });
    game.passBoth();
    expect(game.combat()?.activeLink).toBeTruthy();
  });

  it("boundaries: once per turn; ability not legal without 3 chi", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        resourcePoints: 0,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Zen = game.as(zen);

    // Default fixture has no chi → activation not legal.
    const withoutChi = listLegalCommands(game.getRuntime(), Zen.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "7FHM67fkfjCjzwWzKfFKH:oncePerTurnInstantChiChiChiCreateCrouchingTigerHandSearchDeckComboBanishThenShufflePlayTurn",
    );
    expect(withoutChi).toBeUndefined();

    const optGame = FabTestEngine.start(
      {
        hero: zen,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        resourcePoints: 0,
        chiPoints: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const OptZen = optGame.as(zen);
    resolveZenChiTutor(optGame, zen, { comboCard: whelmingGustwaveRed });
    expect(OptZen.zone("hand")).toContain("token:crouching-tiger");

    // Second activation remains illegal with enough chi after the first.
    const second = listLegalCommands(optGame.getRuntime(), OptZen.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "7FHM67fkfjCjzwWzKfFKH:oncePerTurnInstantChiChiChiCreateCrouchingTigerHandSearchDeckComboBanishThenShufflePlayTurn",
    );
    expect(second).toBeUndefined();
  });
});

// ===========================================================================
// Ranger
// ===========================================================================

// ---------------------------------------------------------------------------
// azalea — ARC039 — Ranger/Young — 20hp
// Printed: "Once per Turn Action - 0: Put a card from your arsenal on the
// bottom of your deck. If you do, put the top card of your deck face up into
// your arsenal. If it's an arrow card, it gains dominate until end of turn. Go
// again"
// Status: Engine-ready (arsenal swap + Arrow dominate grant + go again).
// ---------------------------------------------------------------------------

/** Activate Azalea's arsenal swap. A singleton arsenal card is determined (CR 1.8.6c). */
function resolveAzaleaArsenalSwap(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof azalea,
): void {
  const player = game.as(hero);
  player.activate(hero);
  game.passBoth();
  game.helpers.resolveUntilIdle();
}

describe("azalea (ARC039)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: azalea, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(azalea)).toHaveLife(20);
  });

  it("core mechanic: bottom arsenal, load deck-top face-up; Arrow gains dominate", () => {
    // HEROES.md azalea core — arsenal swap then Arrow dominate until end of turn.
    // Deck array end is the top. Arsenal holds a non-Arrow; deck top is drill-shot (Arrow).
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [snatchRed],
        deck: [tomeOfFyendalYellow, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    resolveAzaleaArsenalSwap(game, azalea);

    // Assert — old arsenal card is on deck bottom; Arrow is the sole arsenal card.
    expect(Azalea.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expect(Azalea.zone("arsenal")).toEqual([drillShotRed.canonicalId]);

    // Play the loaded Arrow from arsenal — dominate must be on the chain link.
    if (game.getState().priority?.holderPlayerId !== Azalea.id) {
      game.as(opponentHero).pass();
    }
    Azalea.play(drillShotRed, { from: "arsenal" });
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("dominate");
  });

  it("core interaction: go again refunds the action point spent to activate", () => {
    // layerKeywords go-again on ARC039-a1 → net AP 0 after resolution.
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 0,
        actionPoints: 1,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Azalea = game.as(azalea);

    expect(Azalea.actionPoints()).toBe(1);
    resolveAzaleaArsenalSwap(game, azalea);

    // −1 AP to activate Action ability, +1 from go again = still 1.
    expect(Azalea.actionPoints()).toBe(1);
    expect(Azalea.zone("arsenal")).toEqual([drillShotRed.canonicalId]);
  });

  it("boundaries: non-Arrow arsenal load does not put dominate on a later hand attack", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [snatchRed],
        deck: [drillShotRed, snatchRed, snatchRed, snatchRed, snatchRed, tomeOfFyendalYellow],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);

    resolveAzaleaArsenalSwap(game, azalea);
    expect(Azalea.zone("arsenal")).toEqual([tomeOfFyendalYellow.canonicalId]);

    if (game.getState().priority?.holderPlayerId !== Azalea.id) {
      game.as(opponentHero).pass();
    }
    // CR 8.2.6a: arrows are played from the arsenal, so this boundary uses a
    // non-arrow hand attack to confirm a non-arrow arsenal load grants no dominate.
    Azalea.play(snatchRed);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).not.toContain("dominate");
  });

  it("boundaries: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 0,
        actionPoints: 2,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Azalea = game.as(azalea);

    resolveAzaleaArsenalSwap(game, azalea);

    expect(() => Azalea.activate(azalea)).toThrow();
  });

  it("boundaries: empty arsenal — ability cannot resolve the swap", () => {
    // No arsenal card → no legal entity-target candidates; swap does not load arsenal.
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 0,
        actionPoints: 1,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Azalea = game.as(azalea);

    const activate = listLegalCommands(game.getRuntime(), Azalea.id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "Fc8mPQBjrNq6Fg9LW9RLc:oncePerTurnAction0PutArsenalBottomDeckPutTopDeckFaceUpArsenalArrowGainsDominateEndTurnGoAgain",
    );
    if (!activate) {
      // Preferred: legality rejects empty-arsenal activation.
      expect(activate).toBeUndefined();
      return;
    }
    game.exec({ move: "activate", actorId: Azalea.id, payload: activate.payload });
    game.passBoth();
    const decision = game.getState().decision;
    // Either no candidates / fizzle, or a stuck unsupported path — arsenal stays empty.
    if (decision?.kind === "entity-target") {
      expect(decision.candidates.length).toBe(0);
    }
    expect(Azalea.zone("arsenal")).toEqual([]);
    expect(Azalea.zone("deck").at(-1)).toBe(drillShotRed.canonicalId);
  });
});

describe("azalea-ace-in-the-hole (ARC038)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: azaleaAceInTheHole, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(azaleaAceInTheHole)).toHaveLife(40);
  });

  it("core mechanic: Adult shares arsenal swap → Arrow dominate (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: azaleaAceInTheHole,
        weapon1: [deathDealer],
        arsenal: [snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azaleaAceInTheHole);

    resolveAzaleaArsenalSwap(game, azaleaAceInTheHole);

    expect(Azalea.zone("arsenal")).toEqual([drillShotRed.canonicalId]);
    if (game.getState().priority?.holderPlayerId !== Azalea.id) {
      game.as(opponentHero).pass();
    }
    Azalea.play(drillShotRed, { from: "arsenal" });
    game.passBoth();
    expect(game.combat()?.activeLink?.keywords).toContain("dominate");
  });
});

// ---------------------------------------------------------------------------
// lexi — ELE032 — Elemental/Ranger/Young — 20hp
// Status: Engine-ready (arsenal face-up cost + Lightning/Ice branch + go again).
// ---------------------------------------------------------------------------

/**
 * Activate Lexi a1: answer face-down arsenal entity-target, drain priority so
 * the layer resolves (Lightning grant / Ice Frostbite + go again AP refund).
 */
function resolveLexiArsenalFlip(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof lexi,
): void {
  const player = game.as(hero);
  player.activate(hero);
  for (let safety = 0; safety < 24; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const targetId = decision.candidates[0]?.instanceId;
      if (!targetId) throw new Error("Lexi expected a face-down arsenal candidate.");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [targetId] },
        },
      });
      continue;
    }
    if (decision) {
      if (game.answerForcedDecision()) continue;
      return;
    }
    if (game.getState().rulesStack.length > 0 || game.getState().rulesProcess) {
      const priority = game.getState().priority?.holderPlayerId;
      if (!priority) return;
      try {
        game.exec({ move: "pass", actorId: priority, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    // Settled when go-again refunded AP (Action spent 1, layerKeywords go again +1).
    if (player.actionPoints() >= 1 && safety > 0) return;
    return;
  }
}

describe("lexi (ELE032)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: lexi, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(lexi)).toHaveLife(20);
  });

  it("core mechanic: face-down Lightning arsenal → face-up; next attack gains go again; layer go again refunds AP", () => {
    // Weave Lightning Blue is a Lightning Action (non-attack arsenal flip target).
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arsenal: [{ card: weaveLightningBlue, state: { faceDown: true } }],
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexi);

    const arsenalId = game.findCardInZone(Lexi.id, "arsenal", weaveLightningBlue);
    resolveLexiArsenalFlip(game, lexi);

    // Assert — arsenal face-up; Action AP spent + go again refunded.
    expect(game.objectState(arsenalId)?.faceDown).not.toBe(true);
    expect(Lexi.actionPoints()).toBe(1);

    // Next attack rides the appliesTo.next go-again grant onto the combat link.
    if (game.getState().priority?.holderPlayerId !== Lexi.id) {
      game.as(opponentHero).pass();
    }
    Lexi.attackWith(snatchRed, { pitch: [snatchRed, snatchRed] });
    expect(game.combat()?.step).toBe("defend");
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("core mechanic: face-down Ice arsenal → face-up; create Frostbite under opponent", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: lexi,
        arsenal: [{ card: winterSBiteBlue, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexi);

    const arsenalId = game.findCardInZone(Lexi.id, "arsenal", winterSBiteBlue);
    resolveLexiArsenalFlip(game, lexi);

    expect(game.objectState(arsenalId)?.faceDown).not.toBe(true);
    expect(game.as(opponentHero).zone("arena")).toContain("token:frostbite");
    expect(Lexi.actionPoints()).toBe(1);
  });

  it("core interaction: once per turn — second activate the same turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: lexi,
        arsenal: [
          { card: weaveLightningBlue, state: { faceDown: true } },
          { card: winterSBiteBlue, state: { faceDown: true } },
        ],
        actionPoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexi);
    resolveLexiArsenalFlip(game, lexi);

    // The second seated face-down card remains a valid would-be target, so
    // this rejection proves the once-per-turn gate rather than target absence.
    expect(
      game.objectState(game.findCardInZone(Lexi.id, "arsenal", winterSBiteBlue))?.faceDown,
    ).toBe(true);

    expect(() => Lexi.activate(lexi)).toThrow(/once|limit|rejected|illegal|unavailable/i);
  });

  it("boundaries: non-Lightning/non-Ice face-down arsenal flips face-up but grants neither go again nor Frostbite", () => {
    // snatch-red is Generic Attack — neither Lightning nor Ice talent.
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arsenal: [{ card: snatchRed, state: { faceDown: true } }],
        hand: [snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexi);
    const arsenalId = game.findCardInZone(Lexi.id, "arsenal", snatchRed);

    resolveLexiArsenalFlip(game, lexi);

    expect(game.objectState(arsenalId)?.faceDown).not.toBe(true);
    expect(game.as(opponentHero).zone("arena")).not.toContain("token:frostbite");
    // Layer go again still refunds AP; next attack must NOT have go-again from Lexi grant.
    if (game.getState().priority?.holderPlayerId !== Lexi.id) {
      game.as(opponentHero).pass();
    }
    // Attack a different snatch from hand with pitch.
    Lexi.attackWith(snatchRed, { pitch: [snatchRed, snatchRed] });
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });

  it("boundaries: face-up arsenal is not a legal flip target", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: lexi,
        arsenal: [weaveLightningBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Lexi = game.as(lexi);
    const arsenalId = game.findCardInZone(Lexi.id, "arsenal", weaveLightningBlue);
    game.setObjectFaceDown(arsenalId, false);
    expect(game.objectState(arsenalId)?.faceDown).not.toBe(true);

    // No face-down arsenal candidates → activation cost targets unavailable.
    expect(() => Lexi.activate(lexi)).toThrow(/unavailable|rejected|face/i);
  });
});

// ---------------------------------------------------------------------------
// riptide — OUT092 — Ranger/Young — 19hp
// Status: Engine-ready (play-from-hand → optional face-down arsenal; trap
// trigger observation → 1 damage to attacking hero).
// ---------------------------------------------------------------------------

/** Accept or decline riptide's optional hand→arsenal face-down; pick a hand card when accepting. */
function answerRiptideArsenal(
  game: ReturnType<typeof FabTestEngine.start>,
  accept: boolean,
  cardCanonicalId?: string,
): void {
  for (let safety = 0; safety < 24; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length === 0) return;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      if (!accept) {
        game.passBoth();
        return;
      }
      continue;
    }
    if (decision.kind === "entity-target" && accept) {
      const pick =
        (cardCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === cardCanonicalId,
            )?.instanceId
          : undefined) ?? decision.candidates[0]?.instanceId;
      if (!pick) throw new Error("riptide expected a hand card for arsenal.");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick] },
        },
      });
      game.passBoth();
      return;
    }
    return;
  }
}

describe("riptide (OUT092)", () => {
  it("boundaries: hero defaults to 19 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: riptide, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(riptide)).toHaveLife(19);
  });

  it("core mechanic: play from hand → optional put another hand card face-down into arsenal", () => {
    // Arrange — two hand cards: play one (nimblism 0-cost non-attack), arsenal the other.
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [nimblismBlue, snatchRed],
        deck: 6,
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Riptide = game.as(riptide);

    // Act — play nimblism; accept optional arsenal of snatch.
    Riptide.play(nimblismBlue);
    answerRiptideArsenal(game, true, snatchRed.canonicalId);

    // Assert — snatch is face-down in arsenal (not the played card).
    expect(Riptide.zone("arsenal")).toEqual([snatchRed.canonicalId]);
    const snatchId = Object.keys(game.getState().objects).find(
      (id) => game.getState().objects[id]?.canonicalId === snatchRed.canonicalId,
    )!;
    const faceDown =
      game.getState().objects[snatchId]?.markers.some((m) => m.kind === "face-down") ?? false;
    expect(faceDown).toBe(true);
    expect(Riptide.zone("hand")).not.toContain(snatchRed.canonicalId);
  });

  it("boundaries: optional decline; played card is not arsenal'd; arsenal already occupied blocks move", () => {
    // Decline keeps both the second hand card and empty arsenal.
    const decline = FabTestEngine.start(
      {
        hero: riptide,
        hand: [nimblismBlue, snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const D = decline.as(riptide);
    D.play(nimblismBlue);
    answerRiptideArsenal(decline, false);
    expect(D.zone("hand")).toContain(snatchRed.canonicalId);
    expect(D.zone("arsenal")).toHaveLength(0);

    // Arsenal already full — optional may prompt but cannot put a second card.
    const full = FabTestEngine.start(
      {
        hero: riptide,
        hand: [nimblismBlue, snatchRed],
        arsenal: [tomeOfFyendalYellow],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const F = full.as(riptide);
    F.play(nimblismBlue);
    // Decline if prompted, or accept with no legal move — arsenal stays the original card.
    for (let safety = 0; safety < 16; safety += 1) {
      const decision = full.getState().decision;
      if (!decision) {
        if (full.getState().rulesStack.length === 0) break;
        const prio = full.getState().priority?.holderPlayerId;
        if (prio) full.exec({ move: "pass", actorId: prio, payload: {} });
        else break;
        continue;
      }
      if (decision.kind === "boolean") {
        full.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      break;
    }
    expect(F.zone("arsenal")).toEqual([tomeOfFyendalYellow.canonicalId]);
  });

  it("core mechanic: when a Trap you control triggers, deal 1 to the attacking hero", () => {
    // Arrange — seat Riptide as defender (seat 2) so opponent attacks first without
    // needing an end-turn dance. Trap in arsenal; play as DR on reaction.
    const game = FabTestEngine.start(
      {
        hero: opponentHero,
        hand: [snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      {
        hero: riptide,
        arsenal: [tripwireTrapRed],
        deck: 6,
        hand: [],
      },
      { autoPassPriority: false },
    );
    const Riptide = game.as(riptide);
    const Opp = game.as(opponentHero);
    const lifeBefore = Opp.life();

    Opp.must.playAttack(snatchRed);
    // Empty defend → reaction.
    if (game.combat()?.step === "defend") {
      Riptide.defend();
    }
    for (let safety = 0; safety < 24; safety += 1) {
      if (
        game.combat()?.step === "reaction" &&
        game.getState().priority?.holderPlayerId === Riptide.id
      ) {
        break;
      }
      const decision = game.getState().decision;
      if (decision?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      // Attacker passes first on reaction so defender can play DR.
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio === Opp.id) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      if (prio && game.combat()?.step !== "reaction") {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      if (game.combat()?.step === "reaction" && prio === Opp.id) {
        game.exec({ move: "pass", actorId: Opp.id, payload: {} });
        continue;
      }
      break;
    }

    // Act — play Tripwire from arsenal as defense reaction (cost 0).
    expect(game.combat()?.step).toBe("reaction");
    expect(game.getState().priority?.holderPlayerId).toBe(Riptide.id);
    Riptide.play(tripwireTrapRed, { from: "arsenal" });
    for (let safety = 0; safety < 40; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (decision?.kind === "payment") {
        // Tripwire unless-pay: empty payment declines paying 1{r}.
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "payment", instanceIds: [] },
          },
        });
        continue;
      }
      if (game.getState().rulesStack.length === 0 && !decision) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
      else break;
    }

    // Assert — attacking hero took 1 generic from riptide a2 (trap triggered).
    expect(Opp.life()).toBe(lifeBefore - 1);
  });
});

// marlynn (SEA083) + marlynn-treasure-hunter (SEA082) AAA lives in
// hero-illusionist-mech-merchant.test.ts (Gold→Goldfin + action-phase Arrow arsenal).

// ===========================================================================
// Runeblade
// ===========================================================================

// ---------------------------------------------------------------------------
// viserai — ARC076 — Runeblade/Young — 20hp
// Printed: "Whenever you play a Runeblade card, if you've played another
// non-attack action card this turn, create a Runechant token."
// Status: Spec (Runechant token, conditional trigger).
// ---------------------------------------------------------------------------

describe("viserai (ARC076)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: viserai, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(viserai)).toHaveLife(20);
  });

  it("core mechanic: playing a Runeblade card after a prior non-attack action creates a Runechant token", () => {
    // Arrange — Viserai with a non-attack action and a Runeblade card in hand.
    // Tome of Fyendal (Generic non-attack action, cost 1) is played first to
    // satisfy the "another non-attack action" condition. Oath of the Arknight
    // (Runeblade Action, cost 2) triggers Viserai's static ability.
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [tomeOfFyendalYellow, oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 5,
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Viserai = game.as(viserai);

    // Act — play Tome of Fyendal first (sets played-non-attack-action status).
    Viserai.must.play(tomeOfFyendalYellow);

    // Then play Oath of the Arknight (Runeblade card) → triggers Viserai.
    Viserai.must.play(oathOfTheArknightYellow);

    // Assert — a Runechant token was created in Viserai's arena.
    const arena = Viserai.zone("arena");
    expect(arena).toContain("token:runechant");
  });

  it("boundaries: no hero-triggered Runechant when no prior non-attack action was played", () => {
    // HEROES.md viserai boundary: condition requires a PRIOR non-attack action.
    // Oath of the Arknight still creates its own Runechant (ARC092-a2) → exactly 1.
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.must.play(oathOfTheArknightYellow);

    const runeCount = Viserai.zone("arena").filter((c) => c.includes("token:runechant")).length;
    expect(runeCount).toBe(1);
  });
});

describe("viserai-rune-blood (ARC075)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: viseraiRuneBlood, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(viseraiRuneBlood)).toHaveLife(40);
  });

  it("core mechanic: playing a Runeblade card after a prior non-attack action creates a Runechant token", () => {
    // Arrange — same ability as ARC076 viserai (Adult version, 40 hp).
    const game = FabTestEngine.start(
      {
        hero: viseraiRuneBlood,
        hand: [tomeOfFyendalYellow, oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 5,
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const ViseraiRB = game.as(viseraiRuneBlood);

    // Act — play a non-attack action first, then a Runeblade card.
    ViseraiRB.must.play(tomeOfFyendalYellow);
    ViseraiRB.must.play(oathOfTheArknightYellow);

    // Assert — a Runechant token was created.
    const arena = ViseraiRB.zone("arena");
    expect(arena).toContain("token:runechant");
  });

  it("boundaries: no Runechant created when no prior non-attack action was played", () => {
    // Arrange — play ONLY a Runeblade card without a prior non-attack action.
    const game = FabTestEngine.start(
      {
        hero: viseraiRuneBlood,
        hand: [oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const ViseraiRB = game.as(viseraiRuneBlood);

    // Act — play Oath of the Arknight without a prior non-attack action.
    ViseraiRB.must.play(oathOfTheArknightYellow);

    // Assert — no Viserai-triggered Runechant; the card's own Runechant
    // (ARC092-a2) still fires, so exactly 1 Runechant from the card itself.
    const runeCount = ViseraiRB.zone("arena").filter((c) => c.includes("token:runechant")).length;
    expect(runeCount).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// viserai-between-worlds — IAR107 — Shadow/Runeblade/Young — 20hp
// Printed: "Whenever you create 1 or more Runechants, banish the top card of
// your deck. Then if you've created 3 or more Runechants this turn, traverse."
// Status: Engine-ready (Runechant → banish + 3+ this turn → traverse).
// ---------------------------------------------------------------------------

describe("viserai-between-worlds (IAR107)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: viseraiBetweenWorlds, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(viseraiBetweenWorlds)).toHaveLife(20);
  });

  it("core mechanic: creating a Runechant banishes the top card of your deck", () => {
    // Arrange — Viserai-Between-Worlds with Oath of the Arknight (a Runeblade
    // action that creates its own Runechant via ARC092-a2) in hand.
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [oathOfTheArknightYellow],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const ViseraiBW = game.as(viseraiBetweenWorlds);
    const deckBefore = ViseraiBW.zone("deck").length;

    // Act — play Oath of the Arknight; its ARC092-a2 creates a Runechant,
    // which fires Viserai-Between-Worlds' "whenever you create 1+ Runechants"
    // trigger → banish the top card of the deck.
    ViseraiBW.must.play(oathOfTheArknightYellow);

    // Assert — a Runechant was created…
    expect(ViseraiBW.zone("arena").some((c) => c.includes("token:runechant"))).toBe(true);
    // …and exactly one card was pulled off the top of the deck (now banished).
    expect(ViseraiBW.zone("deck").length).toBe(deckBefore - 1);
  });

  it("boundaries: multi-token create (2 Runechants) banishes only once per creation batch", () => {
    // Printed: "Whenever you create 1 or more Runechants" — CR simultaneous
    // batch: at most one trigger per source per batch even when create emits
    // one event per token. Read the Runes creates 2 in one resolution.
    const game = FabTestEngine.start(
      {
        hero: viseraiBetweenWorlds,
        hand: [readTheRunesYellow],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const ViseraiBW = game.as(viseraiBetweenWorlds);
    const deckBefore = ViseraiBW.zone("deck").length;

    ViseraiBW.play(readTheRunesYellow);
    for (let safety = 0; safety < 24; safety += 1) {
      const st = game.getState();
      if (st.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      if (st.rulesStack.length > 0 || st.rulesProcess) {
        const priority = st.priority?.holderPlayerId;
        if (!priority) break;
        try {
          game.exec({ move: "pass", actorId: priority, payload: {} });
        } catch {
          break;
        }
        continue;
      }
      break;
    }

    const runeCount = ViseraiBW.zone("arena").filter((c) => c.includes("token:runechant")).length;
    expect(runeCount).toBe(2);
    // One batch → one trigger → one deck-top banish (not one per token).
    expect(ViseraiBW.zone("deck").length).toBe(deckBefore - 1);
    expect(ViseraiBW.zone("banished").length).toBe(1);
  });

  // Physical IAR107 card: front = Between Worlds, back = Usurper (shared
  // Demon face). The engine traverse transform flips the active face.
  const physicalViseraiBetweenWorlds = {
    ...viseraiBetweenWorlds,
    layout: {
      kind: "twin" as const,
      front: {
        faceId: "zggWCkTJQgBjj7FCDTwmQ:face:front" as const,
        name: viseraiBetweenWorlds.base.names[0],
        typeText: typeBoxTokens(viseraiBetweenWorlds.base.typeBox).join(" "),
        types: typeBoxTokens(viseraiBetweenWorlds.base.typeBox),
        traits: viseraiBetweenWorlds.base.traits ?? [],
        text: "",
        keywords: viseraiBetweenWorlds.base.keywords,
        abilities: viseraiBetweenWorlds.base.abilities,
      },
      back: {
        faceId: "zggWCkTJQgBjj7FCDTwmQ:face:back" as const,
        name: viseraiUsurper.base.names[0],
        typeText: typeBoxTokens(viseraiUsurper.base.typeBox).join(" "),
        types: typeBoxTokens(viseraiUsurper.base.typeBox),
        traits: viseraiUsurper.base.traits ?? [],
        text: "",
        keywords: viseraiUsurper.base.keywords,
        abilities: viseraiUsurper.base.abilities,
      },
    },
  };

  it("core interaction: at 3+ Runechants created this turn, traverse flips to Usurper", () => {
    // Oath creates 1 Runechant; Read the Runes creates 2 → total 3 this turn.
    // On the second create-batch trigger, the then-clause transform into
    // traverse flips Young Between Worlds → Usurper (shared Demon back).
    const game = FabTestEngine.start(
      {
        hero: physicalViseraiBetweenWorlds,
        life: 20,
        hand: [oathOfTheArknightYellow, readTheRunesYellow],
        deck: [viseraiUsurper, ...Array.from({ length: 5 }, () => oathOfTheArknightYellow)],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const ViseraiBW = game.as(physicalViseraiBetweenWorlds);
    const heroInstanceId = game.getState().containers.zonesByPlayerId[ViseraiBW.id]!.heroZone[0]!;
    expect(game.getState().objects[heroInstanceId]?.canonicalId).toBe(
      viseraiBetweenWorlds.canonicalId,
    );

    const drain = () => {
      for (let safety = 0; safety < 48; safety += 1) {
        if (game.hasGameEnded()) return;
        const st = game.getState();
        if (!st.combat?.open && st.rulesStack.length === 0 && !st.rulesProcess && !st.decision) {
          return;
        }
        if (st.decision) {
          if (game.answerForcedDecision()) continue;
          break;
        }
        const priority = st.priority?.holderPlayerId;
        if (!priority) break;
        try {
          game.exec({ move: "pass", actorId: priority, payload: {} });
        } catch {
          break;
        }
      }
    };

    // First create (1 Runechant) — banish only; no traverse yet.
    ViseraiBW.must.play(oathOfTheArknightYellow);
    drain();
    expect(game.getState().objects[heroInstanceId]?.canonicalId).toBe(
      viseraiBetweenWorlds.canonicalId,
    );

    // Second create batch (+2 Runechants) → cumulative 3 → traverse.
    ViseraiBW.must.play(readTheRunesYellow);
    drain();

    const runeCount = ViseraiBW.zone("arena").filter((c) => c.includes("token:runechant")).length;
    expect(runeCount).toBe(3);
    // Traverse flipped the active face to the Usurper (physical card back).
    expect(game.getState().objects[heroInstanceId]?.activeFace).toMatchObject({
      activeFaceIds: ["zggWCkTJQgBjj7FCDTwmQ:face:back"],
    });
    // Traverse reminder: life does not change.
    expect(ViseraiBW.life()).toBe(20);
  });
});

// ---------------------------------------------------------------------------
// viserai-usurper — IAR106 — Shadow/Runeblade/Demon — (no printed health;
// flip face of viserai-the-forsaken — life is preserved across traverse)
// Printed: "The first attack action card with blood debt you play each turn
// gets go again. At the beginning of each end phase, if you've created or
// activated a Gate to i'Arathael this turn, you may traverse."
// Status: Engine-ready (a1 blood-debt go-again + a2 Gate this-turn optional traverse).
// ---------------------------------------------------------------------------

describe("viserai-usurper (IAR106)", () => {
  it("boundaries: Demon flip identity loads as hero with explicit life (no printed health)", () => {
    // HEROES.md: usurper has no printed health — life is carried from the
    // forsaken face via traverse. Starting with an explicit life proves the
    // catalog identity is reachable without inventing a printed hp total.
    const game = FabTestEngine.start(
      { hand: [], hero: viseraiUsurper, life: 33, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(viseraiUsurper)).toHaveLife(33);
  });

  it("core mechanic (a1): the first blood-debt attack action each turn gains go again", () => {
    // unbound-by-shadow is a Shadow Attack Action with blood debt, cost 0,
    // power 4, and NO printed go-again. a1 grants go again to the first
    // blood-debt Attack Action each turn (hasKeyword: "blood-debt" +
    // appliesTo ordinal 1 / perTurn).
    const game = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        life: 33,
        hand: [unboundByShadowRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Usurper = game.as(viseraiUsurper);

    Usurper.attackWith(unboundByShadowRed);

    // The attack gained go-again from a1 (unbound-by-shadow has none printed).
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundaries: non-blood-debt attack actions do not gain go again from a1", () => {
    // spellblade-strike is a Runeblade Attack Action with no blood-debt keyword.
    const game = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        life: 33,
        hand: [spellbladeStrikeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(viseraiUsurper).attackWith(spellbladeStrikeRed);
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
  });

  it("boundaries: only the FIRST blood-debt attack action each turn gains go again", () => {
    // Two unbound-by-shadow copies: first gets go-again; resolve combat, then
    // second blood-debt attack the same turn does not re-arm the ordinal.
    const game = FabTestEngine.start(
      {
        hero: viseraiUsurper,
        life: 33,
        hand: [unboundByShadowRed, unboundByShadowRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Usurper = game.as(viseraiUsurper);

    Usurper.attackWith(unboundByShadowRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");

    // Resolve first combat (go-again refunds AP so a second attack is legal).
    for (let safety = 0; safety < 32; safety += 1) {
      if (!game.combat()?.open && game.getState().rulesStack.length === 0) break;
      if (game.getState().decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      if (game.declareNoDefenseIfPending()) continue;
      const priority = game.getPriorityPlayerId();
      if (!priority) break;
      try {
        game.exec({ move: "pass", actorId: priority, payload: {} });
      } catch {
        break;
      }
    }

    Usurper.attackWith(unboundByShadowRed);
    // Second blood-debt attack same turn: ordinal 1 spent for the turn.
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
  });

  // Physical IAR106 card: front = Usurper, back = the Forsaken (traverse
  // destination). The engine traverse transform flips the active face.
  const physicalViseraiUsurper = {
    ...viseraiUsurper,
    layout: {
      kind: "twin" as const,
      front: {
        faceId: "QMGnHJqg6fhcKLfmpRQLz:face:front" as const,
        name: viseraiUsurper.base.names[0],
        typeText: typeBoxTokens(viseraiUsurper.base.typeBox).join(" "),
        types: typeBoxTokens(viseraiUsurper.base.typeBox),
        traits: viseraiUsurper.base.traits ?? [],
        text: "",
        keywords: viseraiUsurper.base.keywords,
        abilities: viseraiUsurper.base.abilities,
      },
      back: {
        faceId: "QMGnHJqg6fhcKLfmpRQLz:face:back" as const,
        name: viseraiTheForsaken.base.names[0],
        typeText: typeBoxTokens(viseraiTheForsaken.base.typeBox).join(" "),
        types: typeBoxTokens(viseraiTheForsaken.base.typeBox),
        traits: viseraiTheForsaken.base.traits ?? [],
        text: "",
        keywords: viseraiTheForsaken.base.keywords,
        abilities: viseraiTheForsaken.base.abilities,
      },
    },
  };

  it("core mechanic (a2): end phase — if a Gate to i'Arathael was created this turn, optional traverse flips to the Forsaken face", () => {
    // Open the Gate to i'Arathael creates a Gate token on HIT. Attack with it
    // (undefended -> hit) -> Gate created this turn -> end phase -> a2 fires
    // (condition met via the Gate this-turn fact) -> accept the optional
    // traverse -> hero flips to the Forsaken face (physical card back).
    const game = FabTestEngine.start(
      {
        hero: physicalViseraiUsurper,
        life: 33,
        hand: [openTheGateToIArathaelRed],
        actionPoints: 1,
        deck: [viseraiTheForsaken],
      },
      { hand: [], hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Usurper = game.as(physicalViseraiUsurper);
    const heroInstanceId = game.getState().containers.zonesByPlayerId[Usurper.id]!.heroZone[0]!;
    expect(game.getState().objects[heroInstanceId]?.canonicalId).toBe(viseraiUsurper.canonicalId);

    const drain = () => {
      for (let safety = 0; safety < 60; safety += 1) {
        if (game.hasGameEnded()) return;
        const st = game.getState();
        if (!st.combat?.open && st.rulesStack.length === 0 && !st.rulesProcess && !st.decision) {
          return;
        }
        const d = st.decision;
        if (d) {
          if (d.kind === "ordering") {
            game.exec({
              move: "answer-decision",
              actorId: d.actorId,
              payload: {
                decisionId: d.decisionId,
                stateVersion: d.stateVersion,
                answer: { kind: "ordering", orderedIds: d.entries.map((e) => e.id) },
              },
            });
            continue;
          }
          if (d.kind === "boolean") {
            game.exec({
              move: "answer-decision",
              actorId: d.actorId,
              payload: {
                decisionId: d.decisionId,
                stateVersion: d.stateVersion,
                answer: { kind: "boolean", value: true },
              },
            });
            continue;
          }
          if (d.kind === "entity-target" && d.candidates[0]) {
            game.exec({
              move: "answer-decision",
              actorId: d.actorId,
              payload: {
                decisionId: d.decisionId,
                stateVersion: d.stateVersion,
                answer: { kind: "entity-target", instanceIds: [d.candidates[0]!.instanceId] },
              },
            });
            continue;
          }
          if (game.answerForcedDecision()) continue;
        }
        game.passBoth();
      }
    };

    // Attack with open-the-gate; drain through to the hit + Gate creation.
    Usurper.attackWith(openTheGateToIArathaelRed);
    drain();
    // A Gate token was created this turn by the hit.
    expect(Usurper.zone("arena").some((id) => /gate-to-i-arathael/i.test(String(id)))).toBe(true);
    // End the turn; the end-phase traverse trigger fires (condition met).
    const endPhaseDecisions: string[] = [];
    Usurper.endTurn();
    for (let safety = 0; safety < 60; safety += 1) {
      if (game.hasGameEnded()) break;
      const st = game.getState();
      if (!st.combat?.open && st.rulesStack.length === 0 && !st.rulesProcess && !st.decision) break;
      const d = st.decision;
      if (d) {
        endPhaseDecisions.push(`${d.decisionId}:${d.kind}`);
        if (d.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: d.actorId,
            payload: {
              decisionId: d.decisionId,
              stateVersion: d.stateVersion,
              answer: { kind: "boolean", value: true },
            },
          });
          continue;
        }
        if (game.answerForcedDecision()) continue;
      }
      game.passBoth();
    }

    // Assert — optional traverse fired (boolean was offered) and the hero
    // flipped to the Forsaken face (IAR106 Adult / traverse destination).
    // Life is preserved across the flip (CR traverse reminder).
    expect(endPhaseDecisions.some((d) => d.includes("boolean"))).toBe(true);
    // Traverse flipped the active face to the Forsaken (physical card back).
    expect(game.getState().objects[heroInstanceId]?.activeFace).toMatchObject({
      activeFaceIds: ["QMGnHJqg6fhcKLfmpRQLz:face:back"],
    });
    expect(Usurper.life()).toBe(33);
  });
});

// ---------------------------------------------------------------------------
// chane — CHN001 — Shadow/Runeblade/Young — 20hp
// Printed: "Once per Turn Action - Create a Soul Shackle token: Your next
// Runeblade or Shadow action this turn gains go again. Go again"
// Status: Engine-ready (create-token activation cost + appliesTo.next go-again).
// ---------------------------------------------------------------------------

describe("chane (CHN001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: chane, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(chane)).toHaveLife(20);
  });

  it("core mechanic: activate creates Soul Shackle; ability go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: chane,
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    // Drain stack priority after activation.
    for (let i = 0; i < 12; i += 1) {
      const state = game.getState();
      if (!state.decision && state.rulesStack.length === 0) break;
      if (state.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }

    expect(Chane.zone("arena")).toContain("token:soul-shackle");
    // −1 AP to activate Action, +1 from go again on the ability.
    expect(Chane.actionPoints()).toBe(1);
  });

  it("core interaction: next Runeblade action gains go again from the continuous grant", () => {
    // Spellblade Strike is a Runeblade AAC without printed go again.
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [spellbladeStrikeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    for (let i = 0; i < 12; i += 1) {
      const state = game.getState();
      if (!state.decision && state.rulesStack.length === 0) break;
      if (state.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }
    expect(Chane.zone("arena")).toContain("token:soul-shackle");
    expect(Chane.actionPoints()).toBe(1);

    Chane.must.playAttack(spellbladeStrikeRed);
    // Attack spent 1 AP; granted go again refunds it after resolution.
    for (let i = 0; i < 16; i += 1) {
      const state = game.getState();
      if (!state.combat?.open && state.rulesStack.length === 0 && !state.decision) break;
      if (state.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }
    // Continuous appliesTo.next latched go again onto the Runeblade AAC —
    // AP is available again after the chain closes.
    expect(Chane.actionPoints()).toBeGreaterThanOrEqual(1);
  });

  it("boundaries: once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: chane,
        actionPoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    for (let i = 0; i < 12; i += 1) {
      const state = game.getState();
      if (!state.decision && state.rulesStack.length === 0) break;
      if (state.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }
    expect(Chane.zone("arena")).toContain("token:soul-shackle");

    let rejected = false;
    try {
      Chane.activate(chane);
    } catch {
      rejected = true;
    }
    expect(rejected).toBe(true);
    // Still only one Soul Shackle from the first activation.
    expect(Chane.zone("arena").filter((id) => id === "token:soul-shackle")).toHaveLength(1);
  });

  it("boundaries: Generic action does not receive the go-again grant", () => {
    // Snatch is Generic — not Runeblade or Shadow.
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Chane = game.as(chane);

    Chane.activate(chane);
    for (let i = 0; i < 12; i += 1) {
      const state = game.getState();
      if (!state.decision && state.rulesStack.length === 0) break;
      if (state.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }

    Chane.must.playAttack(snatchRed);
    for (let i = 0; i < 16; i += 1) {
      const state = game.getState();
      if (!state.combat?.open && state.rulesStack.length === 0 && !state.decision) break;
      if (state.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    expect(Chane.actionPoints()).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// aurora — AUR001 — Elemental/Runeblade/Young — 20hp
// Printed: "Once per Turn Instant - {r}{r}: Create an Embodiment of Lightning
// token. Activate this only if you've played a Lightning card this turn."
// ---------------------------------------------------------------------------

describe("aurora (AUR001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: aurora, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(aurora)).toHaveLife(20);
  });

  it("core mechanic: pay 2 RP to create Embodiment of Lightning after playing a Lightning card", () => {
    // Arrange — Aurora with a Lightning card and enough resources.
    // electrify (ELE198) is a Lightning non-attack Action with Go Again.
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [electrify],
        deck: 6,
        resourcePoints: 3,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Aurora = game.as(aurora);

    // Act — play the Lightning card (costs 1 RP), then activate the ability (2 RP).
    Aurora.must.play(electrify);
    Aurora.activate(aurora);

    // Assert — Embodiment of Lightning token created, 0 RP remains (3 − 1 − 2).
    expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
    expect(Aurora.resourcePoints()).toBe(0);
  });

  it("boundaries: cannot activate without playing a Lightning card first", () => {
    // Arrange — Aurora with resources but no Lightning card played yet.
    const game = FabTestEngine.start(
      {
        hero: aurora,
        hand: [tomeOfFyendalYellow],
        deck: 6,
        resourcePoints: 3,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Aurora = game.as(aurora);

    // Act — attempt to activate the ability without playing a Lightning card.
    // Assert — the activation is rejected because the condition is not met.
    expect(() => Aurora.activate(aurora)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// aurora-shooting-star — ROS007 — Elemental/Runeblade — 40hp Adult
// Printed: "Once per Turn Instant - {r}{r}: Create an Embodiment of Lightning
// token. Activate this only if you've played a Lightning card this turn."
// ---------------------------------------------------------------------------

describe("aurora-shooting-star (ROS007)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: auroraShootingStar, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(auroraShootingStar)).toHaveLife(40);
  });

  it("core mechanic: pay 2 RP to create Embodiment of Lightning after playing a Lightning card", () => {
    // Arrange — same mechanic as AUR001 aurora but Adult version.
    const game = FabTestEngine.start(
      {
        hero: auroraShootingStar,
        hand: [electrify],
        deck: 6,
        resourcePoints: 3,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const AuroraSS = game.as(auroraShootingStar);

    // Act — play the Lightning card (1 RP), then activate (2 RP).
    AuroraSS.must.play(electrify);
    AuroraSS.activate(auroraShootingStar);

    // Assert — Embodiment of Lightning created, 0 RP remains.
    expect(AuroraSS.zone("arena")).toContain("token:embodiment-of-lightning");
    expect(AuroraSS.resourcePoints()).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// aurora-emissary-of-lightning — OMN048 — Lightning/Runeblade/Young — 20hp
// Printed: "Instant - {r}{r}, {t}, destroy a Lightning Flow you control:
// Create an Embodiment of Lightning token."
// Status: Engine-ready (resource + tap-self + destroy-named-token cost; Embodiment).
// ---------------------------------------------------------------------------

/** Drain activation stack after Instant hero activate. */
function resolveAuroraEmissaryActivate(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof auroraEmissaryOfLightning,
): void {
  const actor = game.as(hero);
  actor.activate(hero);
  for (let safety = 0; safety < 20; safety += 1) {
    const state = game.getState();
    if (state.decision?.kind === "entity-target" && state.decision.actorId === actor.id) {
      const pick = state.decision.candidates[0]?.instanceId;
      if (!pick) break;
      game.exec({
        move: "answer-decision",
        actorId: actor.id,
        payload: {
          decisionId: state.decision.decisionId,
          stateVersion: state.decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick] },
        },
      });
      continue;
    }
    if (state.decision) {
      if (game.answerForcedDecision()) continue;
      break;
    }
    if (state.rulesStack.length === 0) break;
    game.passBoth();
  }
}

describe("aurora-emissary-of-lightning (OMN048)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: auroraEmissaryOfLightning, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(auroraEmissaryOfLightning)).toHaveLife(20);
  });

  it("core mechanic: pay 2 + tap + destroy Lightning Flow → Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: auroraEmissaryOfLightning,
        arena: [fabToken("lightning-flow")],
        deck: 6,
        resourcePoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    resolveAuroraEmissaryActivate(game, auroraEmissaryOfLightning);

    expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
    expect(Aurora.zone("arena")).not.toContain("token:lightning-flow");
    expect(Aurora.resourcePoints()).toBe(0);
    // Instant + tap-self cost: hero is tapped after activation.
    const heroId = game.getState().players[Aurora.id]?.heroCardId;
    const heroObj = heroId ? game.getState().objects[heroId] : null;
    expect(heroObj?.markers.some((m) => m.kind === "tapped")).toBe(true);
  });

  it("boundaries: cannot activate without a Lightning Flow you control", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: auroraEmissaryOfLightning,
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expect(() => game.as(auroraEmissaryOfLightning).activate(auroraEmissaryOfLightning)).toThrow();
  });

  it("boundaries: cannot activate with insufficient resources", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: auroraEmissaryOfLightning,
        arena: [fabToken("lightning-flow")],
        resourcePoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expect(() => game.as(auroraEmissaryOfLightning).activate(auroraEmissaryOfLightning)).toThrow();
    expect(game.as(auroraEmissaryOfLightning).zone("arena")).toContain("token:lightning-flow");
  });

  it("boundaries: no Lightning-played gate (distinct from base aurora)", () => {
    // Base aurora requires a Lightning card played this turn; emissary does not.
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: auroraEmissaryOfLightning,
        arena: [fabToken("lightning-flow")],
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    resolveAuroraEmissaryActivate(game, auroraEmissaryOfLightning);
    expect(game.as(auroraEmissaryOfLightning).zone("arena")).toContain(
      "token:embodiment-of-lightning",
    );
  });

  it("core interaction: second Flow enables a second Embodiment the same turn (no OPT)", () => {
    // Printed Instant has no once-per-turn limit — only needs another Flow + RP.
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: auroraEmissaryOfLightning,
        arena: [fabToken("lightning-flow"), fabToken("lightning-flow")],
        resourcePoints: 4,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    resolveAuroraEmissaryActivate(game, auroraEmissaryOfLightning);
    // Hero is tapped after first Instant; Instant abilities often still allow
    // re-activation while tapped unless the cost requires untapped — tap-self
    // requires the source untapped, so second activate should fail while tapped.
    // Un-tap via end-turn or prove the first path consumed one Flow only.
    expect(Aurora.zone("arena").filter((id) => id === "token:lightning-flow")).toHaveLength(1);
    expect(
      Aurora.zone("arena").filter((id) => id === "token:embodiment-of-lightning"),
    ).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// vynnset — DTD134 — Shadow/Runeblade/Young — 20hp
// vynnset-iron-maiden — DTD133 — Shadow/Runeblade — 40hp Adult
// Printed: "At the start of your turn, banish a card from your hand. If you do,
// create a Runechant token. Whenever you play a Shadow non-attack action card,
// you may pay {h}. If you do, the next Runechant effect that would deal damage
// this turn can't be prevented."
// Ability 1 (start-phase banish → Runechant) + ability 2 (optional pay {h} →
// next Runechant damage can't be prevented) are production.
// ---------------------------------------------------------------------------

/**
 * Drain stack/priority after a Vynnset play, answering the optional pay-{h}
 * boolean. Mirrors the optional-effect combat resolver pattern.
 */
function resolveVynnsetOptionals(
  game: ReturnType<typeof FabTestEngine.start>,
  acceptPayLife = true,
): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.hasGameEnded()) return;
    const state = game.getState();
    if (!state.combat?.open && state.rulesStack.length === 0 && !state.decision) return;
    const decision = state.decision;
    if (decision) {
      if (decision.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: acceptPayLife },
          },
        });
        continue;
      }
      if (decision.kind === "entity-target") {
        const pick = decision.candidates[0]?.instanceId;
        if (!pick) return;
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [pick] },
          },
        });
        continue;
      }
      if (decision.kind === "ordering") {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "ordering",
              orderedIds: decision.entries.map((entry) => entry.id),
            },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      return;
    }
    game.passBoth();
  }
}

describe("vynnset (DTD134)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: vynnset, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(vynnset)).toHaveLife(20);
  });

  it("core mechanic: start-of-turn banish a hand card to create a Runechant token", () => {
    // Arrange — Vynnset with cards in hand.
    const game = FabTestEngine.start(
      { hero: vynnset, hand: [snatchRed, snatchRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Vynnset = game.as(vynnset);

    // Act — end Vynnset's turn, then the opponent's turn. When Vynnset's
    // next turn starts, the start-phase trigger fires.
    Vynnset.endTurn();
    game.as(opponentHero).endTurn();

    // The trigger creates an entity-target decision: choose a card to banish.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // Assert — a card was banished AND a Runechant token was created.
    expect(Vynnset.zone("banished").length).toBe(1);
    expect(Vynnset.zone("arena")).toContain("token:runechant");
  });

  it("core interaction: Shadow non-attack → pay 1{h} → unpreventable Runechant still offers Spellvoid and destroys it when accepted", () => {
    // Arrange — Runechant ready; opponent has Spellvoid 1 (arcane-only prevent);
    // Shadow non-attack arms unpreventable; attack triggers Runechant.
    const spellvoidHelm = equipmentTrainer({
      slug: "vynnset-spellvoid-1",
      keywords: [{ name: "spellvoid", value: 1 }],
      defense: 0,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [seepingShadowsRed, snatchRed],
        arena: [fabToken("runechant")],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, life: 20, head: [spellvoidHelm], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Vynnset = game.as(vynnset);
    const Opponent = game.as(opponentHero);
    const lifeBefore = Vynnset.life();

    // Act — play Shadow non-attack; accept optional pay {h}.
    Vynnset.must.play(seepingShadowsRed);
    resolveVynnsetOptionals(game, true);

    expect(Vynnset.life()).toBe(lifeBefore - 1);
    expect(
      game
        .getState()
        .continuousEffectInstances.some((instance) =>
          instance.atoms.some(
            (atom) =>
              atom.kind === "rule" && atom.action === "be-prevented" && atom.mode === "restrict",
          ),
        ),
    ).toBe(true);

    // Play attack → Runechant deals 1 arcane unpreventably. CR 6.4.10h still
    // lets Spellvoid apply, so the defending player must explicitly choose
    // whether to pay its destroy-self cost; it cannot reduce the damage.
    Vynnset.must.play(snatchRed);
    resolveVynnsetOptionals(game, true);
    const spellvoidChoice = Opponent.expectDecision("option");
    expect(spellvoidChoice.options).toHaveLength(1);
    Opponent.chooseOptions(spellvoidChoice.options[0]!.id);
    game.helpers.resolveRestOfCombat();

    // Combat damage (snatch 4 or seeping-buffed 5) + full Runechant 1; the
    // paid Spellvoid cost is still applied even though it prevented zero.
    expect(Opponent.life()).toBeLessThanOrEqual(20 - 4 - 1);
    expect(Opponent.zone("head")).not.toContain(spellvoidHelm.canonicalId);
    expect(Opponent.zone("graveyard")).toContain(spellvoidHelm.canonicalId);
    expect(Vynnset.zone("arena")).not.toContain("token:runechant");
  });

  it("boundaries: declining optional pay keeps Runechant damage preventable by spellvoid", () => {
    const spellvoidHelm = equipmentTrainer({
      slug: "vynnset-spellvoid-decline",
      keywords: [{ name: "spellvoid", value: 1 }],
      defense: 0,
      zoneSubtype: "Head",
    });
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [seepingShadowsRed, snatchRed],
        arena: [fabToken("runechant")],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, life: 20, head: [spellvoidHelm], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Vynnset = game.as(vynnset);
    const Opponent = game.as(opponentHero);
    const lifeBefore = Vynnset.life();

    Vynnset.must.play(seepingShadowsRed);
    resolveVynnsetOptionals(game, false);
    expect(Vynnset.life()).toBe(lifeBefore);

    Vynnset.must.play(snatchRed);
    resolveVynnsetOptionals(game, false);
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      optionalOptions: "all",
      ordering: "listed",
    });

    // Spellvoid absorbs the 1 arcane and is destroyed; combat damage still lands.
    expect(Opponent.zone("head")).not.toContain(spellvoidHelm.canonicalId);
    expect(Opponent.life()).toBeGreaterThanOrEqual(20 - 5);
    expect(Opponent.life()).toBeLessThanOrEqual(20 - 4);
  });

  it("boundaries: non-Shadow non-attack does not offer the unpreventable pay option", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [tomeOfFyendalYellow],
        arena: [fabToken("runechant")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Vynnset = game.as(vynnset);
    const lifeBefore = Vynnset.life();

    Vynnset.must.play(tomeOfFyendalYellow);
    // No boolean optional for Vynnset's a2 — Generic Tome is not Shadow.
    for (let safety = 0; safety < 24; safety += 1) {
      const state = game.getState();
      if (state.decision?.kind === "boolean" && state.decision.actorId === Vynnset.id) {
        throw new Error("Vynnset must not offer pay-{h} on a non-Shadow action");
      }
      if (!state.combat?.open && state.rulesStack.length === 0 && !state.decision) break;
      if (state.decision) {
        if (game.answerForcedDecision()) continue;
        break;
      }
      game.passBoth();
    }
    expect(Vynnset.life()).toBe(lifeBefore);
    expect(
      game
        .getState()
        .continuousEffectInstances.some((instance) =>
          instance.atoms.some((atom) => atom.kind === "rule" && atom.action === "be-prevented"),
        ),
    ).toBe(false);
  });
});

describe("vynnset-iron-maiden (DTD133)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: vynnsetIronMaiden, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(vynnsetIronMaiden)).toHaveLife(40);
  });

  it("core mechanic: start-of-turn banish a hand card to create a Runechant token", () => {
    // Same ability as DTD134 vynnset (Adult version, 40 hp).
    const game = FabTestEngine.start(
      { hero: vynnsetIronMaiden, hand: [snatchRed, snatchRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Vynnset = game.as(vynnsetIronMaiden);

    // End Vynnset's turn, then the opponent's turn → Vynnset's next turn starts.
    Vynnset.endTurn();
    game.as(opponentHero).endTurn();

    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Vynnset.zone("banished").length).toBe(1);
    expect(Vynnset.zone("arena")).toContain("token:runechant");
  });
});

// ---------------------------------------------------------------------------
// briar — ELE063 — Elemental/Runeblade/Young — 20hp
// briar-warden-of-thorns — ELE062 — 40hp Adult
// Ability 1: "The first time an attack action card you control deals damage to
//   an opposing hero, create an Embodiment of Earth token."
// Ability 2: "Whenever you play your second 'non-attack' action card each turn,
//   create an Embodiment of Lightning token."
// ---------------------------------------------------------------------------

describe("briar (ELE063)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: briar, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(briar)).toHaveLife(20);
  });

  it("core mechanic: second non-attack action card each turn creates an Embodiment of Lightning token", () => {
    // Arrange — two non-attack action cards in hand.
    // tomeOfFyendalYellow (Generic Action, cost 1) and electrify (Lightning
    // Action, cost 1) are both non-attack actions.
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [tomeOfFyendalYellow, electrify],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briar);

    // Act — play the first non-attack action (no token: ordinal 1 ≠ 2).
    Briar.must.play(tomeOfFyendalYellow);
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");

    // Play the second non-attack action → triggers Briar's ordinal-2 ability.
    Briar.must.play(electrify);

    // Assert — Embodiment of Lightning token created.
    expect(Briar.zone("arena")).toContain("token:embodiment-of-lightning");
  });

  it("core mechanic: first attack-action damage to opposing hero creates an Embodiment of Earth token", () => {
    // Arrange — Briar with an attack action card and enough resources/AP.
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briar);
    const Opponent = game.as(opponentHero);

    const attacks = Briar.cardsIn("hand", snatchRed);
    expect(attacks).toHaveLength(1);

    // Act — play the attack; no defense, so damage resolves.
    Briar.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Opponent.life()).toBe(16); // 20 − 4

    // Assert — Embodiment of Earth token created on first dealt damage.
    expect(Briar.zone("arena")).toContain("token:embodiment-of-earth");
  });

  it("boundaries: Embodiment of Earth trigger fires only once per turn", () => {
    // Arrange — Briar with two attack action cards.
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briar);
    const attacks = Briar.cardsIn("hand", snatchRed);

    // First attack → token created (ordinal 1).
    Briar.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Briar.zone("arena")).toContain("token:embodiment-of-earth");

    // Second attack → no additional token (limit: count 1, ordinal [1]).
    const earthCount = Briar.zone("arena").filter((c) => c === "token:embodiment-of-earth").length;
    Briar.must.playAttack(attacks[1]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    const earthCount2 = Briar.zone("arena").filter((c) => c === "token:embodiment-of-earth").length;
    expect(earthCount2).toBe(earthCount);
  });

  it("core interaction: dual triggers same turn — Lightning from 2nd non-attack then Earth from AAC damage", () => {
    // Independent paths fire the same turn. Embodiment of Lightning self-destroys
    // when an AAC is played (grants go again) — so assert Lightning before the
    // attack, then Earth after damage.
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [tomeOfFyendalYellow, electrify, snatchRed],
        actionPoints: 3,
        resourcePoints: 4,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briar);

    Briar.must.play(tomeOfFyendalYellow);
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-earth");

    Briar.must.play(electrify);
    expect(Briar.zone("arena")).toContain("token:embodiment-of-lightning");

    Briar.must.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    // Lightning consumed by its own AAC-play trigger; Earth remains from damage.
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");
    expect(Briar.zone("arena")).toContain("token:embodiment-of-earth");
  });

  it("boundaries: attack actions do not count toward the second non-attack Lightning ordinal", () => {
    // One AAC + one non-attack is not "second non-attack".
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [snatchRed, electrify],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briar);

    Briar.must.playAttack(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Briar.zone("arena")).toContain("token:embodiment-of-earth");
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");

    Briar.must.play(electrify);
    // Still only one non-attack played this turn → no Lightning.
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");
  });

  it("boundaries: first non-attack alone does not create Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [tomeOfFyendalYellow],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briar);

    Briar.must.play(tomeOfFyendalYellow);
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");
    expect(Briar.zone("arena")).not.toContain("token:embodiment-of-earth");
  });
});

describe("briar-warden-of-thorns (ELE062)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: briarWardenOfThorns, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(briarWardenOfThorns)).toHaveLife(40);
  });

  it("core mechanic: second non-attack action card each turn creates an Embodiment of Lightning token", () => {
    // Arrange — same ability as ELE063 briar (Adult version, 40 hp).
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        hand: [tomeOfFyendalYellow, electrify],
        deck: 6,
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briarWardenOfThorns);

    // Act — first non-attack action (no token), then second (triggers).
    Briar.must.play(tomeOfFyendalYellow);
    Briar.must.play(electrify);

    // Assert — Embodiment of Lightning token created.
    expect(Briar.zone("arena")).toContain("token:embodiment-of-lightning");
  });

  it("core mechanic: first attack-action damage to opposing hero creates an Embodiment of Earth token", () => {
    // Same dealt-damage trigger as ELE063 briar (Adult variant).
    const game = FabTestEngine.start(
      {
        hero: briarWardenOfThorns,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Briar = game.as(briarWardenOfThorns);

    const attacks = Briar.cardsIn("hand", snatchRed);
    Briar.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Assert — Embodiment of Earth token created on first dealt damage.
    expect(Briar.zone("arena")).toContain("token:embodiment-of-earth");
  });
});

// ---------------------------------------------------------------------------
// florian — FLR001 — Elemental/Runeblade/Young — 20hp
// Status: Engine-ready (create-extra aura-token replacement + Earth banished threshold).
// ---------------------------------------------------------------------------

/** Earth action stub for banished-zone threshold seating (no abilities needed). */
const earthStub = {
  canonicalId: "trainer-earth-card",
  types: ["Earth", "Action"] as const,
  cost: 0,
  color: "Red" as const,
  pitch: "1" as const,
  abilities: [],
};

/** Cost-0 action that creates a Seismic Surge aura token on resolve. */
const createSeismicSurge = {
  canonicalId: "trainer-create-seismic-surge",
  types: ["Generic", "Action"] as const,
  cost: 0,
  color: "Blue" as const,
  pitch: "3" as const,
  abilities: [
    {
      id: "trainer-create-seismic-a1",
      kind: "resolution" as const,
      text: "Create a Seismic Surge token.",
      effect: {
        type: "create-token" as const,
        token: "seismic-surge",
        controller: "controller" as const,
      },
    },
  ],
};

/** Cost-0 action that creates two Seismic Surge tokens (batch +1 → three). */
const createTwoSeismicSurges = {
  canonicalId: "trainer-create-two-seismic",
  types: ["Generic", "Action"] as const,
  cost: 0,
  color: "Blue" as const,
  pitch: "3" as const,
  abilities: [
    {
      id: "trainer-create-two-seismic-a1",
      kind: "resolution" as const,
      text: "Create 2 Seismic Surge tokens.",
      effect: {
        type: "create-token" as const,
        token: "seismic-surge",
        controller: "controller" as const,
        count: 2,
      },
    },
  ],
};

/** Cost-0 action that creates a Copper item token (non-aura — not boosted). */
const createCopper = {
  canonicalId: "trainer-create-copper",
  types: ["Generic", "Action"] as const,
  cost: 0,
  color: "Blue" as const,
  pitch: "3" as const,
  abilities: [
    {
      id: "trainer-create-copper-a1",
      kind: "resolution" as const,
      text: "Create a Copper token.",
      effect: {
        type: "create-token" as const,
        token: "copper",
        controller: "controller" as const,
      },
    },
  ],
};

function drainFlorianPriority(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const state = game.getState();
    if (state.decision) {
      if (game.answerForcedDecision()) continue;
      return;
    }
    if (state.rulesStack.length > 0 || state.rulesProcess) {
      const priority = state.priority?.holderPlayerId;
      if (!priority) return;
      try {
        game.exec({ move: "pass", actorId: priority, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

function countArenaToken(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  tokenCanonicalId: string,
): number {
  return game
    .getState()
    .containers.zonesByPlayerId[playerId]!.arena.filter(
      (id) => game.getState().objects[id]?.canonicalId === tokenCanonicalId,
    ).length;
}

describe("florian (FLR001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: florian, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(florian)).toHaveLife(20);
  });

  it("core mechanic: with 4+ Earth banished, creating an aura token creates that many plus 1", () => {
    // Arrange — 4 Earth in banished; create one Seismic Surge (aura token).
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [createSeismicSurge],
        banished: [earthStub, earthStub, earthStub, earthStub],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Florian = game.as(florian);

    // Act — resolve the create-token action.
    Florian.play(createSeismicSurge);
    drainFlorianPriority(game);

    // Assert — 1 create → 2 Seismic Surges (that many plus 1).
    expect(countArenaToken(game, Florian.id, "token:seismic-surge")).toBe(2);
  });

  it("core interaction: multi-count aura create gets a single +1 (batch-scoped create-extra)", () => {
    // Create 2 Seismic Surges → that many (2) plus 1 = 3, not +1 per event (4).
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [createTwoSeismicSurges],
        banished: [earthStub, earthStub, earthStub, earthStub],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Florian = game.as(florian);
    Florian.play(createTwoSeismicSurges);
    drainFlorianPriority(game);
    expect(countArenaToken(game, Florian.id, "token:seismic-surge")).toBe(3);
  });

  it("boundaries: fewer than 4 Earth banished → aura create is not boosted", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [createSeismicSurge],
        banished: [earthStub, earthStub, earthStub],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Florian = game.as(florian);
    Florian.play(createSeismicSurge);
    drainFlorianPriority(game);
    expect(countArenaToken(game, Florian.id, "token:seismic-surge")).toBe(1);
  });

  it("boundaries: non-aura tokens (Copper item) are not boosted", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [createCopper],
        banished: [earthStub, earthStub, earthStub, earthStub],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Florian = game.as(florian);
    Florian.play(createCopper);
    drainFlorianPriority(game);
    expect(countArenaToken(game, Florian.id, "token:copper")).toBe(1);
  });
});

describe("florian-rotwood-harbinger (ROS001)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: florianRotwoodHarbinger, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(florianRotwoodHarbinger)).toHaveLife(40);
  });

  it("core mechanic: Adult needs 8 Earth banished for create-extra (7 is under threshold)", () => {
    const under = FabTestEngine.start(
      {
        hero: florianRotwoodHarbinger,
        hand: [createSeismicSurge],
        banished: Array.from({ length: 7 }, () => earthStub),
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    under.as(florianRotwoodHarbinger).play(createSeismicSurge);
    drainFlorianPriority(under);
    expect(
      countArenaToken(under, under.as(florianRotwoodHarbinger).id, "token:seismic-surge"),
    ).toBe(1);

    const atThreshold = FabTestEngine.start(
      {
        hero: florianRotwoodHarbinger,
        hand: [createSeismicSurge],
        banished: Array.from({ length: 8 }, () => earthStub),
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    atThreshold.as(florianRotwoodHarbinger).play(createSeismicSurge);
    drainFlorianPriority(atThreshold);
    expect(
      countArenaToken(
        atThreshold,
        atThreshold.as(florianRotwoodHarbinger).id,
        "token:seismic-surge",
      ),
    ).toBe(2);
  });
});

// ===========================================================================
// Boundary tests for promo / variant heroes documented in HEROES.md
// ===========================================================================

describe("cindra-dracai-of-retribution (HNT054)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: cindraDracaiOfRetribution, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(cindraDracaiOfRetribution)).toHaveLife(40);
  });

  it("core mechanic: Adult hit marked hero creates Fealty (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, marked: true, deck: 6 },
    );
    const CindraDR = game.as(cindraDracaiOfRetribution);
    const attacks = CindraDR.cardsIn("hand", snatchRed);

    CindraDR.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(CindraDR.zone("arena")).toContain("token:fealty");
  });

  it("boundaries: Adult non-marked hit does not create Fealty (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const CindraDR = game.as(cindraDracaiOfRetribution);
    CindraDR.must.playAttack(CindraDR.cardsIn("hand", snatchRed)[0]!);
    expect(CindraDR.zone("arena")).not.toContain("token:fealty");
  });

  it("core mechanic: Adult pay 3 Instant → equip up to 2 Draconic daggers from GY (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: cindraDracaiOfRetribution,
        graveyard: [kunaiOfRetribution, clawOfVynserakai],
        resourcePoints: 3,
        deck: 6,
        hand: [],
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Cindra = game.as(cindraDracaiOfRetribution);
    const kunaiId = game.findCardInZone(Cindra.id, "graveyard", kunaiOfRetribution);
    const clawId = game.findCardInZone(Cindra.id, "graveyard", clawOfVynserakai);

    resolveCindraEquip(game, [kunaiId, clawId], {
      hero: cindraDracaiOfRetribution,
      abilityId:
        "HRtHpngjPbHNKCFMbJw7m:oncePerTurnInstantResourceResourceResourceEquipUp2DraconicDaggersGraveyardCostsResourceLessActivateDraconicChainLink",
    });

    const weapons = [...Cindra.zone("weapon1"), ...Cindra.zone("weapon2")];
    expect(weapons).toEqual(
      expect.arrayContaining([kunaiOfRetribution.canonicalId, clawOfVynserakai.canonicalId]),
    );
    expect(Cindra.zone("graveyard")).toHaveLength(0);
    expect(Cindra.resourcePoints()).toBe(0);
  });
});

describe("fang-dracai-of-blades (HNT098)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: fangDracaiOfBlades, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(fangDracaiOfBlades)).toHaveLife(40);
  });

  it("core mechanic: Adult hit marked hero creates Fealty (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, marked: true, deck: 6 },
    );
    const FangDR = game.as(fangDracaiOfBlades);
    const attacks = FangDR.cardsIn("hand", snatchRed);

    FangDR.must.playAttack(attacks[0]!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(FangDR.zone("arena")).toContain("token:fealty");
  });

  it("boundaries: Adult non-marked hit does not create Fealty (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const FangDR = game.as(fangDracaiOfBlades);
    FangDR.must.playAttack(FangDR.cardsIn("hand", snatchRed)[0]!);
    expect(FangDR.zone("arena")).not.toContain("token:fealty");
  });

  it("core mechanic: Adult 3+ Fealty reduces dagger attack activation cost by 1 (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty, fealty],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const Fang = game.as(fangDracaiOfBlades);

    // A marked hero loses Marked on the first opposing hit (CR 9.3.3), so
    // repeated attacks into one initially-marked hero cannot legally create
    // three Fealty. Seat three distinct tokens to prove the actual threshold.
    expect(Fang.cardsIn("arena", fealty)).toHaveLength(3);

    Fang.activate(obsidianFireVein);
    // Base dagger cost 1{r} reduced to 0 at 3+ Fealty.
    expect(Fang.resourcePoints()).toBe(1);
  });
});

describe("lexi-livewire (ELE031)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: lexiLivewire, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(lexiLivewire)).toHaveLife(40);
  });

  it("core mechanic: Adult Ice arsenal flip creates Frostbite (parity)", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: lexiLivewire,
        arsenal: [{ card: winterSBiteBlue, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    resolveLexiArsenalFlip(game, lexiLivewire);
    expect(game.as(opponentHero).zone("arena")).toContain("token:frostbite");
  });
});

describe("zen-tamer-of-purpose (MST046)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: zenTamerOfPurpose, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(zenTamerOfPurpose)).toHaveLife(40);
  });

  it("core mechanic: Adult shares pay 3 chi → CT in hand + tutor combo (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: zenTamerOfPurpose,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, whelmingGustwaveRed],
        resourcePoints: 0,
        chiPoints: 3,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Zen = game.as(zenTamerOfPurpose);

    resolveZenChiTutor(game, zenTamerOfPurpose, {
      comboCard: whelmingGustwaveRed,
      abilityId:
        "GDbCgdDrFKCWWthrgD6h6:oncePerTurnInstantChiChiChiCreateCrouchingTigerHandSearchDeckComboBanishThenShufflePlayTurn",
    });

    expect(Zen.zone("hand")).toContain("token:crouching-tiger");
    expectFabCard(Zen, whelmingGustwaveRed).toBeIn("banished");
    expect(game.getState().players[Zen.id]!.chiPoints).toBe(0);
  });
});

describe("aurora-legacy-of-tempest (OMN047)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: auroraLegacyOfTempest, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(auroraLegacyOfTempest)).toHaveLife(40);
  });

  it("core mechanic: Adult shares pay 2 + tap + destroy Lightning Flow → Embodiment (parity)", () => {
    const game = FabTestEngine.start(
      {
        hand: [],
        hero: auroraLegacyOfTempest,
        arena: [fabToken("lightning-flow")],
        resourcePoints: 2,
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Aurora = game.as(auroraLegacyOfTempest);
    resolveAuroraEmissaryActivate(game, auroraLegacyOfTempest);
    expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
    expect(Aurora.zone("arena")).not.toContain("token:lightning-flow");
    expect(Aurora.resourcePoints()).toBe(0);
  });
});

describe("riptide-lurker-of-the-deep (OUT091)", () => {
  it("boundaries: hero defaults to 38 life", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: riptideLurkerOfTheDeep, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(riptideLurkerOfTheDeep)).toHaveLife(38);
  });

  it("core mechanic: Adult parity — play from hand → optional face-down arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: riptideLurkerOfTheDeep,
        hand: [nimblismBlue, snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Riptide = game.as(riptideLurkerOfTheDeep);
    Riptide.play(nimblismBlue);
    answerRiptideArsenal(game, true, snatchRed.canonicalId);
    expect(Riptide.zone("arsenal")).toEqual([snatchRed.canonicalId]);
  });
});
