import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import { livelyChorale } from "../../HVN/actions/lively-chorale.ts";
import { heightenSpellcraft } from "../../P24/actions/heighten-spellcraft.ts";
import { songOfFrost } from "./song-of-frost.ts";

/** @covers t1cn1tzgcx-a1 @covers t1cn1tzgcx-a2 */
describe("Song of Frost — normal reserve or Class Bonus graveyard payment", () => {
  for (const matching of [false, true])
    for (const alternate of [false, true])
      for (const donor of [reclaim, livelyChorale]) {
        it(`pays before resolution without a spurious decision, class=${matching}, alternate=${alternate}, donor=${donor.slug}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(songOfFrost, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [songOfFrost, donor, woodlandSquirrels, woodlandSquirrels],
                graveyard: [donor, donor, woodlandSquirrels, heightenSpellcraft],
                memory: [donor],
                banishment: [donor],
              },
            },
            playerTwo: { champion, zones: { graveyard: [donor] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const source = p.card(songOfFrost),
            donors = p.cards(donor, { zone: "graveyard" });
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          if (alternate) {
            for (const ids of [
              [],
              donors.map((c) => c.objectId),
              [donors[0]!.objectId, donors[0]!.objectId],
              [p.card(donor, { zone: "hand" }).objectId],
              [p.card(donor, { zone: "memory" }).objectId],
              [p.card(donor, { zone: "banishment" }).objectId],
              [q.card(donor, { zone: "graveyard" }).objectId],
              [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
              [p.card(heightenSpellcraft).objectId],
            ]) {
              expect(() =>
                p.activate(source, { costOptionIndex: 1, costSelections: [ids] }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            if (!matching) {
              expect(() =>
                p.activate(source, { costOptionIndex: 1, costSelections: [[donors[0]!.objectId]] }),
              ).toThrow();
              expect(game.state).toEqual(before);
              return;
            }
            expect(() =>
              p.activate(source, {
                costOptionIndex: 1,
                reservePayment,
                costSelections: [[donors[0]!.objectId]],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.activate(source, { costOptionIndex: 1, costSelections: [[donors[0]!.objectId]] });
          } else {
            expect(() => p.activate(source, { reservePayment: reservePayment.slice(1) })).toThrow();
            expect(game.state).toEqual(before);
            p.activate(source, { reservePayment });
          }
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          expect(game.state.objects[donors[0]!.objectId]!.zone).toBe(
            alternate ? "banishment" : "graveyard",
          );
          expect(game.state.objects[donors[1]!.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(alternate ? 1 : 3);
          expect(p.zone("hand")).toHaveLength(alternate ? 3 : 1);
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(game.state.combat).toBeNull();
          expect(game.state.turn.phase).toBe("main");
          expect(q.card(donor, { zone: "graveyard" })).toBeDefined();
        });
      }
});

import { fireball } from "../../DOA/actions/fireball.ts";

/** @covers t1cn1tzgcx-a2 */
describe("Song of Frost — ending combat clears unresolved effects", () => {
  for (const matching of [false, true])
    for (const alternate of matching ? [false, true] : [false])
      for (const ownTurn of [false, true])
        for (const combat of [false, true]) {
          it(`ends only a live attack, class=${matching}, alternate=${alternate}, ownTurn=${ownTurn}, combat=${combat}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(songOfFrost, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: ownTurn ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  hand: [
                    songOfFrost,
                    fireball,
                    ...Array.from({ length: 6 }, () => woodlandSquirrels),
                  ],
                  field: [woodlandSquirrels],
                  graveyard: [reclaim],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                  field: [woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const actor = ownTurn ? p : q,
              victim = ownTurn ? q : p;
            const attacker = actor.card(woodlandSquirrels, { zone: "field" });
            if (combat) actor.declareAttack(attacker, victim.card(champion));
            const pending = actor.card(fireball);
            actor.activate(pending, {
              reservePayment: actor
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [victim.card(champion).objectId] },
            });
            if (!ownTurn) actor.pass();
            const donor = p.card(reclaim);
            p.activate(
              songOfFrost,
              alternate
                ? { costOptionIndex: 1, costSelections: [[donor.objectId]] }
                : {
                    reservePayment: p
                      .cards(woodlandSquirrels, { zone: "hand" })
                      .slice(0, 2)
                      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                  },
            );
            expect(game.state.objects[victim.card(champion).objectId]!.damage).toBe(0);
            passEffectsStack(game);
            expect(game.state.combat).toBeNull();
            expect(game.state.turn.phase).toBe("main");
            expect(game.state.turn.playerId).toBe(actor.id);
            expect(game.state.objects[attacker.objectId]!.states.has("attacking")).toBe(false);
            expect(game.state.objects[attacker.objectId]!.states.has("rested")).toBe(combat);
            expect(game.state.objects[victim.card(champion).objectId]!.damage).toBe(combat ? 0 : 1);
            expect(game.state.objects[pending.objectId]!.zone).toBe(
              combat ? "banishment" : "graveyard",
            );
            expect(p.card(songOfFrost, { zone: "graveyard" })).toBeDefined();
            expect(game.state.objects[donor.objectId]!.zone).toBe(
              alternate ? "banishment" : "graveyard",
            );
            expect(p.zone("memory")).toHaveLength((ownTurn ? 4 : 0) + (alternate ? 0 : 2));
            expect(q.zone("memory")).toHaveLength(ownTurn ? 0 : 4);
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
          });
        }
});
