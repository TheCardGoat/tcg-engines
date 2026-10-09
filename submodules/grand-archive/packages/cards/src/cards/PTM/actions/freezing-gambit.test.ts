import { describe } from "vitest";
import { freezingGambit } from "./freezing-gambit.ts";
import { pawnPiece } from "../tokens/pawn-piece.ts";
import { spirelleSchwartzQueen } from "../../DTR/allies/spirelle-schwartz-queen.ts";
import { proveAdditionalSacrifice } from "../../../testing/additional-sacrifice.ts";
/** @covers fgBpQZe0js-a1 */
describe("freezing-gambit additional sacrifice", () => {
  proveAdditionalSacrifice(freezingGambit, 2, [pawnPiece, spirelleSchwartzQueen], ["mode-2"]);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enragedBoars } from "../../DOA/allies/enraged-boars.ts";
import { secondWind } from "../../DOA/actions/second-wind.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

describe("Freezing Gambit — attack reduction", () => {
  for (const duringAttack of [false, true])
    for (const attackerCard of [woodlandSquirrels, enragedBoars])
      it(`reduces current and later attacks: ${attackerCard.slug}, during=${duringAttack}`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(freezingGambit, false, "activation-discount"),
            5,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [freezingGambit, woodlandSquirrels, woodlandSquirrels],
              field: [pawnPiece],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [attackerCard],
              hand: [secondWind, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const attacker = q.card(attackerCard, { zone: "field" }),
          defender = p.card(champion);
        if (duringAttack) q.declareAttack(attacker, defender);
        q.pass();
        p.activate(freezingGambit, {
          modeIds: ["mode-2"],
          targets: { "target-1": [attacker.objectId] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
          costSelections: [[p.card(pawnPiece).objectId]],
        });
        passEffectsStack(game);
        if (!duringAttack) q.declareAttack(attacker, defender);
        game.resolveCombatWithoutRetaliation();
        const reduced = attackerCard === enragedBoars ? 1 : 0;
        expect(game.state.objects[defender.objectId]!.damage).toBe(reduced);
        q.activate(secondWind, {
          targets: { "target-1": [attacker.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        q.declareAttack(attacker, defender);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[defender.objectId]!.damage).toBe(2 * reduced);
        advanceToMain(game, "player-two", game.state.turn.number);
        q.declareAttack(attacker, defender);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[defender.objectId]!.damage).toBe(
          2 * reduced + (attackerCard === enragedBoars ? 4 : 1),
        );
      });
});

import { answerDecision } from "../../../testing/decisions.ts";

/** @covers fgBpQZe0js-a2 */
describe("Freezing Gambit — selected modes", () => {
  for (const both of [false, true])
    for (const pays of [false, true])
      it(`negates unless paid: both=${both}, pays=${pays}`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(freezingGambit, false, "activation-discount"),
            5,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              hand: [freezingGambit, woodlandSquirrels, woodlandSquirrels],
              field: [pawnPiece],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: [enragedBoars],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const pending = q.cards(woodlandSquirrels, { zone: "hand" })[0]!;
        q.activate(pending);
        const activation = game.state.stack.at(-1)!;
        q.pass();
        const options = {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          costSelections: [[p.card(pawnPiece).objectId]],
          targets: {
            "target-stack-item": [activation.id],
            ...(both ? { "target-1": [q.card(enragedBoars).objectId] } : {}),
          },
        };
        const before = game.state;
        for (const modeIds of [[], ["mode-1", "mode-1"], ["unknown"]]) {
          expect(() => p.activate(freezingGambit, { ...options, modeIds })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(freezingGambit, {
          ...options,
          modeIds: both ? ["mode-1", "mode-2"] : ["mode-1"],
        });
        passEffectsStack(game);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-payment",
          playerId: q.id,
        });
        if (pays) {
          const payment = q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const beforePayment = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-payment", { reservePayment: payment.slice(0, 1) }),
          ).toThrow();
          expect(game.state).toEqual(beforePayment);
          answerDecision(game, "resolve-effect-payment", { reservePayment: payment });
        } else answerDecision(game, "resolve-effect-payment", false);
        passEffectsStack(game);
        expect(game.state.objects[pending.objectId]!.zone).toBe(pays ? "field" : "graveyard");
        expect(q.zone("memory")).toHaveLength(pays ? 2 : 0);
        expect(game.state.stack).toHaveLength(0);
        const defender = p.card(champion);
        q.declareAttack(q.card(enragedBoars), defender);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[defender.objectId]!.damage).toBe(both ? 1 : 4);
      });
});
