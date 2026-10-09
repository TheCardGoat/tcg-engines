import { describe } from "vitest";
import { greaterBoonOfKanaloa } from "./greater-boon-of-kanaloa.ts";

import { proveLevelLockedBoon } from "../../../testing/level-locked-boon.ts";
/** @covers xqkjh2YMT1-a1 */
describe("Greater Boon of Kanaloa — Level Locked", () => {
  proveLevelLockedBoon({ card: greaterBoonOfKanaloa, threshold: 2 });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { lesserBoonOfApollo } from "./lesser-boon-of-apollo.ts";
import { pantheonBarrier } from "../tokens/pantheon-barrier.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";

/** @covers xqkjh2YMT1-a3 */
describe("Greater Boon of Kanaloa end-phase recovery", () => {
  for (const bestowed of [false, true])
    for (const damage of [0, 1, 3, 5])
      it(`recovers only at its controller's end phase: bestowed=${bestowed}, damage=${damage}`, () => {
        const champions = [0, 1, 2].map((level) => {
          const card = enableAllTestElements(lineageTestChampion("Kanaloa Recovery", level));
          return {
            ...card,
            layout: {
              kind: "single-faced" as const,
              face: {
                ...requireSingleFace(card),
                stats: { ...requireSingleFace(card).stats, power: 6 },
                cost: { kind: "memory" as const, amount: 0 },
              },
            },
          };
        });
        const champion = champions[0]!;
        const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
          id,
          name: id,
          startingChampionDefinitionId: champion.canonicalId,
          mainDeck: [
            { definitionId: singeingLeap.canonicalId, count: 20 },
            { definitionId: woodlandSquirrels.canonicalId, count: 40 },
          ],
          materialDeck: champions.map((card) => ({ definitionId: card.canonicalId, count: 1 })),
          pantheon: {
            lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
            greaterBoonDefinitionId: greaterBoonOfKanaloa.canonicalId,
            barrierDefinitionId: pantheonBarrier.canonicalId,
          },
        });
        const game = GrandArchiveTestEngine.start(
          [
            ...champions,
            woodlandSquirrels,
            singeingLeap,
            lesserBoonOfApollo,
            greaterBoonOfKanaloa,
            pantheonBarrier,
          ],
          {
            mode: "pantheon",
            firstPlayerId: "player-one",
            randomSeed: 17,
            players: [setup("player-one"), setup("player-two"), setup("player-three")],
          },
          { validateDeckConstruction: false, skipPregameForTests: true },
        );
        const p = game.player("player-one"),
          q = game.player("player-two"),
          r = game.player("player-three");
        for (let turn = 0; turn < 12 + damage; turn++)
          advanceToMain(game, p.id, game.state.turn.number);
        for (const next of champions.slice(1)) {
          for (let step = 0; step < 128; step++) {
            const wait = game.waitState();
            if (wait.kind === "materialization-choice" && wait.playerId === p.id) break;
            if (wait.kind === "materialization-choice")
              game.player(wait.playerId).execute({ move: "skip-materialization" });
            else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected ${wait.kind}`);
          }
          p.materialize(next);
          passEffectsStack(game);
          advanceToMain(game, p.id);
        }
        const hurt = (player: typeof p, n: number) => {
          for (let i = 0; i < n; i++) {
            const source = player.cards(singeingLeap, { zone: "hand" })[0]!;
            const payment = player.zone("hand").find((ref) => ref.objectId !== source.objectId)!;
            player.activate(source, {
              reservePayment: [{ kind: "card", cardId: payment.objectId }],
            });
            passEffectsStack(game);
          }
        };
        p.declareAttack(p.card(champion), q.card(pantheonBarrier, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
        advanceToMain(game, q.id);
        q.declareAttack(q.card(champion), r.card(pantheonBarrier, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
        hurt(q, 1);
        advanceToMain(game, r.id);
        r.declareAttack(r.card(champion), p.card(pantheonBarrier, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
        hurt(r, 1);
        advanceToMain(game, p.id);
        hurt(p, damage);
        advanceToMain(game, p.id, game.state.turn.number);
        const hero = p.card(champion),
          foes = [q.card(champion), r.card(champion)],
          boon = p.card(greaterBoonOfKanaloa, { zone: "pantheon" });
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        if (bestowed) {
          const payment = p
            .zone("hand")
            .slice(0, 16)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          expect(payment).toHaveLength(16);
          p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment: payment });
          passEffectsStack(game);
        }
        expect(game.state.objects[boon.objectId]!.facing).toBe(bestowed ? "face-up" : "face-down");
        function reachEnd(playerId: string) {
          for (let step = 0; step < 256; step++) {
            if (game.state.turn.playerId === playerId && game.state.turn.phase === "end") return;
            const wait = game.waitState();
            if (wait.kind === "materialization-choice")
              game.player(wait.playerId).execute({ move: "skip-materialization" });
            else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected ${wait.kind}`);
          }
          throw new Error("End phase not reached");
        }
        for (let tick = 0; tick < 3; tick++) {
          reachEnd(p.id);
          expect(game.state.objects[hero.objectId]!.damage).toBe(
            Math.max(0, damage - (bestowed ? 2 * tick : 0)),
          );
          expect(game.state.stack).toHaveLength(bestowed ? 1 : 0);
          if (bestowed)
            expect(game.state.stack[0]).toMatchObject({
              kind: "triggered-ability",
              sourceId: boon.objectId,
              ability: { id: "xqkjh2YMT1-a3" },
            });
          passEffectsStack(game);
          const expected = Math.max(0, damage - (bestowed ? 2 * (tick + 1) : 0));
          expect(game.state.objects[hero.objectId]!.damage).toBe(expected);
          for (const opponent of [q, r]) {
            reachEnd(opponent.id);
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.objects[hero.objectId]!.damage).toBe(expected);
            expect(
              game.state.objects[
                opponent.card(greaterBoonOfKanaloa, { zone: "pantheon" }).objectId
              ]!.facing,
            ).toBe("face-down");
          }
          for (const foe of foes) expect(game.state.objects[foe.objectId]!.damage).toBe(1);
        }
      }, 30_000); // Long three-player integration sequence, including 16-reserve bestowment.
});
