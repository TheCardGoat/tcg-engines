import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { supplyDrone } from "./supply-drone.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { claudeFatedVisionary } from "./claude-fated-visionary.ts";
import { reconnaissanceScout } from "./reconnaissance-scout.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { carterSyntheticReaper } from "./carter-synthetic-reaper.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";

/** @covers 52215upufy-a2 */
describe("Claude — grants only to controlled Automaton allies", () => {
  it("retains the death grant when Claude and its recipient die from the same Cleave attack", () => {
    const champion = astraChampion(0);
    const attackerChampion = createClassBonusTestChampion(
      carterSyntheticReaper,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [claudeFatedVisionary, reconnaissanceScout],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: attackerChampion, zones: { field: [carterSyntheticReaper] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const deck = player.zone("main-deck");
    opponent.execute({
      move: "declare-attack",
      attackerId: opponent.card(carterSyntheticReaper).objectId,
      targetIds: [],
      cleavePlayerId: player.id,
    });
    for (
      let step = 0;
      game.state.combat &&
      !game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "granted-1pklrms-a1",
      ) &&
      step < 64;
      step++
    ) {
      const decision = game.state.decision;
      if (decision?.kind === "order-triggered-abilities")
        answerDecision(game, decision.kind, decision.pendingTriggerIds);
      else if (decision?.kind === "choose-retaliators") answerDecision(game, decision.kind, []);
      else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(player.cards(claudeFatedVisionary, { zone: "graveyard" })).toHaveLength(1);
    expect(player.cards(reconnaissanceScout, { zone: "graveyard" })).toHaveLength(1);
    passEffectsStack(game);
    const choice = game.state.decision;
    if (choice?.kind !== "resolve-glimpse")
      throw new Error("Expected grant despite simultaneous source death");
    expect(choice.cardIds).toEqual(deck.map((ref) => ref.objectId));
    answerDecision(game, "resolve-glimpse", {
      kind: "reorder",
      top: deck.map((ref) => ref.objectId),
      bottom: [],
    });
    passEffectsStack(game);
  });
  for (const inPlay of [false, true]) {
    for (const subject of ["automaton", "ordinary", "opposing"] as const) {
      it(`source in play=${inPlay}, subject=${subject}`, () => {
        const champion = astraChampion(0);
        const defendingCard = subject === "ordinary" ? woodlandSquirrels : reconnaissanceScout;
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: subject === "opposing" ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [
                ...(inPlay ? [claudeFatedVisionary] : []),
                ...(subject === "opposing"
                  ? [automatedGardener, automatedGardener]
                  : [defendingCard]),
              ],
              graveyard: inPlay ? [] : [claudeFatedVisionary],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field:
                subject === "opposing" ? [defendingCard] : [automatedGardener, automatedGardener],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const attacker = game.player(subject === "opposing" ? "player-one" : "player-two");
        const defender = game.player(subject === "opposing" ? "player-two" : "player-one");
        const target = defender.card(defendingCard, { zone: "field" });
        const attacks = attacker.cards(automatedGardener);
        const granted = inPlay && subject === "automaton";
        if (granted) {
          const before = game.state;
          expect(() => attacker.declareAttack(attacks[0]!, defender.card(champion))).toThrow();
          expect(game.state).toEqual(before);
        } else {
          attacker.declareAttack(attacks[0]!, defender.card(champion));
          game.resolveCombatWithoutRetaliation();
        }
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId !== attacker.id)
          game.player(wait.playerId).pass();
        const deck = defender.zone("main-deck");
        attacker.declareAttack(attacks[1]!, target);
        advanceCombatToTrigger(game, "granted-1pklrms-a1");
        expect(defender.zone("graveyard")).toContainEqual(target);
        expect(defender.zone("main-deck")).toEqual(deck);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "granted-1pklrms-a1",
          ),
        ).toBe(granted);
        passEffectsStack(game);
        if (granted) {
          const choice = game.state.decision;
          if (choice?.kind !== "resolve-glimpse") throw new Error("Expected granted death Glimpse");
          expect(choice.playerId).toBe(defender.id);
          expect(choice.cardIds).toEqual(deck.slice(0, 3).map((ref) => ref.objectId));
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: [deck[2]!.objectId],
            bottom: [deck[1]!.objectId, deck[0]!.objectId],
          });
          passEffectsStack(game);
          expect(defender.zone("main-deck")).toEqual([deck[2], ...deck.slice(3), deck[1], deck[0]]);
        } else expect(defender.zone("main-deck")).toEqual(deck);
        expect(game.state.decision).toBeNull();
      });
    }
  }

  it("removes the granted death trigger when Claude is destroyed first", () => {
    const champion = astraChampion(0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [claudeFatedVisionary, automatedGardener],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [automatedGardener, automatedGardener, automatedGardener],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = player.card(automatedGardener);
    player.declareAttack(ally, opponent.card(champion));
    game.resolveCombatWithoutRetaliation();
    advanceToRecollection(game, opponent.id);
    for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const targets = [player.card(claudeFatedVisionary), ally, ally];
    const deck = player.zone("main-deck");
    for (const [index, attacker] of opponent.cards(automatedGardener).entries()) {
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
        game.player(wait.playerId).pass();
      opponent.declareAttack(attacker, targets[index]!);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.decision).toBeNull();
    }
    expect(player.zone("graveyard")).toEqual(targets.slice(0, 2));
    expect(player.zone("main-deck")).toEqual(deck);
  });
});

function astraChampion(level: number) {
  const card = lineageTestChampion("Claude test", level);
  if (card.layout.kind !== "single-faced") throw new Error("Expected single face");
  return {
    ...card,
    layout: {
      kind: "single-faced" as const,
      face: { ...card.layout.face, elements: ["NORM", "ASTRA"] as const },
    },
  };
}

/** @covers 52215upufy-a1 */
describe("Claude — mill before selecting Automaton allies", () => {
  for (const [level, deckSize] of [
    [0, 2],
    [1, 2],
    [3, 2],
    [3, 4],
  ] as const) {
    for (const returned of [0, 1, 2]) {
      it(`level=${level}, deck=${deckSize}, returns=${returned}`, () => {
        const champion = astraChampion(0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            lineage: Array.from({ length: level }, (_, i) => astraChampion(i + 1)),
            zones: {
              hand: [
                claudeFatedVisionary,
                supplyDrone,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              graveyard: [supplyDrone, supplyDrone, woodlandSquirrels, potionOfHealing],
              "main-deck": [
                automatedGardener,
                woodlandSquirrels,
                supplyDrone,
                potionOfHealing,
              ].slice(0, deckSize),
            },
          },
          playerTwo: {
            champion,
            zones: { graveyard: [automatedGardener], "main-deck": [woodlandSquirrels] },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const graveyard = player.zone("graveyard");
        const deck = player.zone("main-deck");
        const milled = deck.slice(0, level);
        player.activate(claudeFatedVisionary, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        const memory = player.zone("memory");
        const hand = player.zone("hand");
        player.pass();
        opponent.pass();
        expect(player.zone("graveyard")).toEqual(graveyard);
        expect(player.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        expect(player.zone("graveyard")).toEqual([...graveyard, ...milled]);
        expect(player.zone("main-deck")).toEqual(deck.slice(level));
        expect(player.zone("memory")).toEqual(memory);
        for (const invalid of [
          player.cards(potionOfHealing, { zone: "graveyard" })[0]!,
          player.cards(woodlandSquirrels, { zone: "graveyard" })[0]!,
          player.card(supplyDrone, { zone: "hand" }),
          opponent.card(automatedGardener),
        ]) {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        const eligible = [...milled, ...graveyard].filter(
          (ref) =>
            ref.definitionId === automatedGardener.canonicalId ||
            ref.definitionId === supplyDrone.canonicalId,
        );
        expect(() =>
          answerDecision(game, "resolve-effect-choice", [
            eligible[0]!.objectId,
            eligible[1]!.objectId,
            eligible[0]!.objectId,
          ]),
        ).toThrow();
        const selected = eligible.slice(0, returned);
        answerDecision(
          game,
          "resolve-effect-choice",
          selected.map((ref) => ref.objectId),
        );
        passEffectsStack(game);
        expect(player.zone("memory")).toEqual([...memory, ...selected]);
        expect(player.zone("graveyard")).toEqual(
          [...graveyard, ...milled].filter(
            (ref) => !selected.some((chosen) => chosen.objectId === ref.objectId),
          ),
        );
        expect(player.zone("hand")).toEqual(hand);
        expect(opponent.zone("graveyard")).toHaveLength(1);
        expect(opponent.zone("memory")).toHaveLength(0);
      });
    }
  }
});
