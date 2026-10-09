import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { overpoweringDefense } from "./overpowering-defense.ts";
import { aesanProtector } from "../../DOA/allies/aesan-protector.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { trivialTrinket } from "../../RDO/items/trivial-trinket.ts";
import { spellwardScepter } from "../../DTR/items/spellward-scepter.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 14hr8i5oix-a1
 * @covers 14hr8i5oix-a2 */
describe("Overpowering Defense — opposing card activations only", () => {
  for (const matching of [false, true])
    for (const count of [0, 1, 2])
      for (const protect of [false, true])
        for (const ownSpell of [false, true])
          it(`class=${matching}, opposing spells=${count}, first protected=${protect}, own spell=${ownSpell}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(overpoweringDefense, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    overpoweringDefense,
                    fireball,
                    ...Array.from({ length: 7 }, () => woodlandSquirrels),
                  ],
                  field: [aesanProtector],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [fireball, fireball, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
                  field: [trivialTrinket, spellwardScepter],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const pay = (player: typeof p, n: number) =>
              player
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const before = game.state;
            expect(() => p.activate(overpoweringDefense, { reservePayment: pay(p, 2) })).toThrow();
            expect(game.state).toEqual(before);
            if (protect) {
              p.pass();
              q.activateAbility(spellwardScepter, "f6lxizyuml-a2");
              passEffectsStack(game);
            }
            p.declareAttack(p.card(aesanProtector), q.card(champion));
            p.pass();
            const spells = q.cards(fireball, { zone: "hand" }).slice(0, count);
            for (const spell of spells)
              q.activate(spell, {
                reservePayment: pay(q, 4),
                targets: { "target-1": [p.card(champion).objectId] },
              });
            q.activateAbility(trivialTrinket, "Nym5Y3JsO5-a1", {
              targets: { "target-player": [p.id] },
            });
            q.pass();
            if (ownSpell)
              p.activate(fireball, {
                reservePayment: pay(p, 4),
                targets: { "target-1": [q.card(champion).objectId] },
              });
            p.activate(overpoweringDefense, { reservePayment: pay(p, 2) });
            passEffectsStack(game);
            expect(game.state.objects[p.card(champion).objectId]?.damage).toBe(
              protect && count ? 1 : 0,
            );
            expect(game.state.objects[q.card(champion).objectId]?.damage).toBe(ownSpell ? 1 : 0);
            expect(p.zone("main-deck")).toHaveLength(0);
            expect(p.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(3);
            for (const spell of spells)
              expect(game.state.objects[spell.objectId]?.zone).toBe("graveyard");
            expect(p.card(overpoweringDefense, { zone: "graveyard" })).toBeDefined();
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
            expect(game.state.winnerIds).toEqual([]);
          });
});

/** @covers 14hr8i5oix-a1 */
describe("Overpowering Defense — attacking Guardian requirement", () => {
  for (const opposing of [false, true])
    for (const guardian of [false, true])
      it(`requires your attacking Guardian, opposing attacker=${opposing}, Guardian=${guardian}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(overpoweringDefense, true, "activation-discount"),
        );
        const attackerCard = guardian ? aesanProtector : woodlandSquirrels;
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opposing ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              hand: [overpoweringDefense, woodlandSquirrels, woodlandSquirrels],
              field: opposing ? [] : [attackerCard],
            },
          },
          playerTwo: { champion, zones: { field: opposing ? [attackerCard] : [] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          actor = opposing ? q : p;
        actor.declareAttack(
          actor.card(attackerCard, { zone: "field" }),
          (opposing ? p : q).card(champion),
        );
        if (opposing) q.pass();
        const options = {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        };
        const before = game.state;
        if (!opposing && guardian) {
          p.activate(overpoweringDefense, options);
          passEffectsStack(game);
        } else {
          expect(() => p.activate(overpoweringDefense, options)).toThrow();
          expect(game.state).toEqual(before);
        }
      });
});
