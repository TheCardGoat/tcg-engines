import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { safeguardPaladin } from "./safeguard-paladin.ts";
import { cinderGeyser } from "../../HVN/actions/cinder-geyser.ts";
import { enPassant } from "../../PTM/attacks/en-passant.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers ifmmvbm26h-a1 */
describe("Safeguard Paladin — non-combat damage prevention", () => {
  for (const heroClass of ["Cleric", "Warrior", "Spirit"])
    for (const damage of [1, 2, 3, 4])
      for (const other of [false, true])
        for (const opposing of [false, true]) {
          it(`class=${heroClass}, damage=${damage}, other target=${other}, opposing source=${opposing}`, () => {
            const champion = grantTestChampionLevel(
              enableAllTestElements(
                createClassBonusTestChampion(
                  heroClass === "Cleric" ? cinderGeyser : enPassant,
                  heroClass !== "Spirit",
                  "activation-discount",
                ),
              ),
              damage - 1,
            );
            const cards = [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)];
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: opposing ? "playerTwo" : "playerOne",
              playerOne: {
                champion,
                zones: { field: [safeguardPaladin, giantTortoise], hand: opposing ? [] : cards },
              },
              playerTwo: { champion, zones: { hand: opposing ? cards : [] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = opposing ? q : p,
              target = p.card(other ? giantTortoise : safeguardPaladin);
            const start = game.state.eventHistory.length;
            actor.activate(fireball, {
              reservePayment: actor
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
            const expected = heroClass !== "Spirit" && !other ? Math.max(0, damage - 2) : damage;
            const marked = game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
              .reduce((sum, e) => sum + (e.type === "damage-marked" ? e.amount : 0), 0);
            expect(marked).toBe(expected);
            expect(game.state.objects[target.objectId]!.zone).toBe(
              expected >= (other ? 6 : 2) ? "graveyard" : "field",
            );
          });
        }
  for (const matching of [false, true])
    for (const mode of ["repeated-spells", "combat", "unpreventable"]) {
      it(`class=${matching}, damage mode=${mode}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(safeguardPaladin, matching, "activation-discount"),
          ),
          1,
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: { champion, zones: { field: [safeguardPaladin] } },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, woodlandSquirrels],
              hand: [
                fireball,
                fireball,
                sparkAlight,
                ...Array.from({ length: 8 }, () => woodlandSquirrels),
              ],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(safeguardPaladin),
          start = game.state.eventHistory.length;
        if (mode === "combat") {
          q.declareAttack(q.cards(woodlandSquirrels, { zone: "field" })[0]!, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
          q.declareAttack(q.cards(woodlandSquirrels, { zone: "field" })[1]!, target);
          game.resolveCombatWithoutRetaliation();
        } else {
          const spell = mode === "unpreventable" ? sparkAlight : fireball;
          for (let i = 0; i < (matching && mode === "repeated-spells" ? 2 : 1); i++) {
            q.activate(q.cards(spell, { zone: "hand" })[0]!, {
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, mode === "unpreventable" ? 2 : 4)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
          }
        }
        const events = game.state.eventHistory
          .slice(start)
          .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId);
        expect(
          events.reduce((sum, e) => sum + (e.type === "damage-marked" ? e.amount : 0), 0),
        ).toBe(matching && mode === "repeated-spells" ? 0 : 2);
        expect(game.state.objects[target.objectId]!.zone).toBe(
          matching && mode === "repeated-spells" ? "field" : "graveyard",
        );
      });
    }
});
