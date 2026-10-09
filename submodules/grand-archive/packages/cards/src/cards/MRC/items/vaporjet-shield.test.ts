import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { vaporjetShield } from "./vaporjet-shield.ts";

/** @covers y208kkz07n-a1 */
describe("Vaporjet Shield — Link", () => {
  proveIntrinsicLink({
    card: vaporjetShield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { strappingConscript } from "../../DOA/allies/strapping-conscript.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers y208kkz07n-a2 */
describe("Vaporjet Shield — damage to its linked host", () => {
  for (const matching of [false, true])
    for (const ally of [false, true])
      for (const other of [false, true])
        for (const mode of ["combat", "spell", "unpreventable"]) {
          it(`class=${matching}, ally host=${ally}, other recipient=${other}, damage=${mode}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(vaporjetShield, matching, "activation-discount"),
            );
            const enemy = grantTestChampionLevel(
              enableAllTestElements(
                createClassBonusTestChampion(vaporjetShield, false, "activation-discount"),
              ),
              1,
            );
            const deck = Array.from({ length: 8 }, () => woodlandSquirrels);
            const game = GrandArchiveTestEngine.startFixture({
              phase: "materialize",
              playerOne: {
                champion,
                zones: {
                  field: [giantTortoise],
                  "material-deck": [vaporjetShield],
                  memory: [woodlandSquirrels, woodlandSquirrels],
                  "main-deck": deck,
                },
              },
              playerTwo: {
                champion: enemy,
                zones: {
                  field: [strappingConscript, strappingConscript],
                  hand: [
                    fireball,
                    fireball,
                    sparkAlight,
                    sparkAlight,
                    ...Array.from({ length: 8 }, () => woodlandSquirrels),
                  ],
                  "main-deck": deck,
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              host = p.card(ally ? giantTortoise : champion),
              target = p.card(
                other ? (ally ? champion : giantTortoise) : ally ? giantTortoise : champion,
              );
            p.materialize(vaporjetShield, {
              targets: { "intrinsic-link-target": [host.objectId] },
            });
            passEffectsStack(game);
            advanceToMain(game, q.id);
            const start = game.state.eventHistory.length;
            if (mode === "combat") {
              for (const attacker of q.cards(strappingConscript, { zone: "field" })) {
                q.declareAttack(attacker, target);
                game.resolveCombatWithoutRetaliation();
              }
            } else
              for (let i = 0; i < 2; i++) {
                const spell = mode === "spell" ? fireball : sparkAlight;
                q.activate(q.cards(spell, { zone: "hand" })[0]!, {
                  reservePayment: q
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .slice(0, mode === "spell" ? 4 : 2)
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                  targets: { "target-1": [target.objectId] },
                });
                passEffectsStack(game);
              }
            const expected = matching && !other && mode !== "unpreventable" ? 2 : 4;
            expect(game.state.objects[target.objectId]!.damage).toBe(expected);
            const amounts = game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
              .map((e) => (e.type === "damage-marked" ? e.amount : 0));
            expect(amounts).toEqual([expected / 2, expected / 2]);
            expect(p.cards(vaporjetShield, { zone: "field" })).toHaveLength(1);
          });
        }
});

import { reclaim } from "../../DOA/actions/reclaim.ts";
describe("Vaporjet Shield — opposing hosts and broken links", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true]) {
      it(`shield class=${matching}, opposing host=${opposing}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(vaporjetShield, matching, "activation-discount"),
        );
        const enemy = grantTestChampionLevel(
            enableAllTestElements(
              createClassBonusTestChampion(vaporjetShield, false, "activation-discount"),
            ),
            1,
          ),
          deck = Array.from({ length: 8 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              field: opposing ? [] : [giantTortoise],
              "material-deck": [vaporjetShield],
              memory: [woodlandSquirrels, woodlandSquirrels],
              hand: [reclaim, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
              "main-deck": deck,
            },
          },
          playerTwo: {
            champion: enemy,
            zones: {
              field: opposing ? [giantTortoise] : [],
              hand: [
                reclaim,
                fireball,
                fireball,
                ...Array.from({ length: 14 }, () => woodlandSquirrels),
              ],
              "main-deck": deck,
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = opposing ? q : p,
          host = owner.card(giantTortoise),
          shield = p.card(vaporjetShield),
          incarnation = game.state.objects[host.objectId]!.incarnation;
        const pay = (who: typeof p, n: number) =>
          who
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const fire = () => {
          q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(q, 4),
            targets: { "target-1": [host.objectId] },
          });
          passEffectsStack(game);
        };
        p.materialize(shield, { targets: { "intrinsic-link-target": [host.objectId] } });
        passEffectsStack(game);
        advanceToMain(game, q.id);
        fire();
        expect(game.state.objects[host.objectId]!.damage).toBe(matching ? 1 : 2);
        if (!opposing) advanceToMain(game, p.id);
        owner.activate(reclaim, {
          reservePayment: pay(owner, 2),
          targets: { "target-1": [host.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[host.objectId]!.zone).toBe("hand");
        expect(game.state.objects[shield.objectId]!.zone).not.toBe("field");
        owner.activate(host, { reservePayment: pay(owner, 4) });
        passEffectsStack(game);
        expect(game.state.objects[host.objectId]!.incarnation).not.toBe(incarnation);
        if (!opposing) p.pass();
        fire();
        expect(game.state.objects[host.objectId]!.damage).toBe(2);
      });
    }
});
