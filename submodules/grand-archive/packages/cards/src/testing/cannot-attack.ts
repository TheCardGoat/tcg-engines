import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { trainingSession } from "../cards/DOA/actions/training-session.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
export function proveCannotAttack(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  preventsDamage: boolean,
) {
  for (const matching of [false, true])
    for (const buffs of [0, 1, 2])
      it(`class=${matching}, buff counters=${buffs}`, () => {
        const champion = createClassBonusTestChampion(card, matching, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card, giantTortoise],
              hand: [
                ...Array.from({ length: buffs }, () => trainingSession),
                ...Array.from({ length: 2 * buffs }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          enemy = q.card(giantTortoise);
        for (let i = 0; i < buffs; i++) {
          p.activate(p.cards(trainingSession, { zone: "hand" })[0]!, {
            targets: { "target-1": [source.objectId] },
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(buffs);
        for (const target of [enemy, q.card(champion)]) {
          const before = game.state;
          expect(() => p.declareAttack(source, target)).toThrow();
          expect(game.state).toEqual(before);
        }
        p.declareAttack(giantTortoise, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
        advanceToMain(game, q.id);
        q.declareAttack(enemy, source);
        let offered = false;
        for (let i = 0; i < 64 && game.state.combat; i++) {
          const d = game.state.decision;
          if (d?.kind === "choose-retaliators") {
            expect(d.candidates).toContain(source.objectId);
            answerDecision(game, d.kind, [source.objectId]);
            offered = true;
          } else {
            const w = game.waitState();
            if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
            game.player(w.playerId).pass();
          }
        }
        expect(game.state.combat).toBeNull();
        expect(offered).toBe(buffs > 0);
        expect(game.state.objects[enemy.objectId]!.damage).toBe(buffs);
        expect(game.state.objects[source.objectId]!.damage).toBe(preventsDamage ? 0 : 1);
      });
}
