import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { templarOfTheEternal } from "./templar-of-the-eternal.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { overwhelmingSwing } from "../../ALC/attacks/overwhelming-swing.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers peyG8Hfgqt-a1 */
describe("Templar of the Eternal — combat-only prevention", () => {
  for (const matching of [false, true])
    for (const other of [false, true])
      for (const mode of [
        "small-combat",
        "large-combat",
        "unpreventable-combat",
        "spell",
        "unpreventable-spell",
        "retaliation",
      ]) {
        it(`class=${matching}, other recipient=${other}, mode=${mode}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(templarOfTheEternal, matching, "activation-discount"),
          );
          const enemy = grantTestChampionLevel(
            enableAllTestElements(
              createClassBonusTestChampion(overwhelmingSwing, true, "activation-discount"),
            ),
            mode === "unpreventable-combat" ? 2 : 0,
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: mode === "retaliation" ? "playerOne" : "playerTwo",
            playerOne: { champion, zones: { field: [templarOfTheEternal, giantTortoise] } },
            playerTwo: {
              champion: enemy,
              zones: {
                field: [woodlandSquirrels, woodlandSquirrels, giantTortoise],
                hand: [
                  overwhelmingSwing,
                  fireball,
                  sparkAlight,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target = p.card(other ? giantTortoise : templarOfTheEternal),
            start = game.state.eventHistory.length;
          const pay = (n: number) =>
            q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (mode === "small-combat") {
            for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
              q.declareAttack(attacker, target);
              game.resolveCombatWithoutRetaliation();
            }
          } else if (mode === "large-combat" || mode === "unpreventable-combat") {
            q.activate(overwhelmingSwing, {
              reservePayment: pay(6),
              attackAttackerId: q.card(enemy).objectId,
            });
            passEffectsStack(game);
            declareResolvedAttack(
              game,
              q.card(enemy).objectId,
              target.objectId,
              "Swing at Templar",
            );
            game.resolveCombatWithoutRetaliation();
          } else if (mode === "retaliation") {
            const defender = q.card(giantTortoise);
            p.declareAttack(target, defender);
            for (let i = 0; i < 64 && game.state.combat; i++) {
              if (game.state.decision?.kind === "choose-retaliators")
                answerDecision(game, "choose-retaliators", [defender.objectId]);
              else {
                const wait = game.waitState();
                if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
                game.player(wait.playerId).pass();
              }
            }
            expect(game.state.combat).toBeNull();
          } else {
            q.activate(mode === "spell" ? fireball : sparkAlight, {
              reservePayment: pay(mode === "spell" ? 4 : 2),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
          }
          const raw =
            mode === "small-combat"
              ? 2
              : mode === "large-combat" || mode === "unpreventable-combat"
                ? 5
                : mode === "unpreventable-spell"
                  ? 2
                  : 1;
          const prevented =
              matching && !other && ["small-combat", "large-combat", "retaliation"].includes(mode),
            expected = prevented ? 0 : raw;
          const marked = game.state.eventHistory
            .slice(start)
            .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
            .reduce((n, e) => n + (e.type === "damage-marked" ? e.amount : 0), 0);
          expect(marked).toBe(expected);
          expect(game.state.objects[target.objectId]!.zone).toBe(
            expected >= (other ? 6 : 3) ? "graveyard" : "field",
          );
        });
      }
});

import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
/** @covers peyG8Hfgqt-a2 */
describe("Templar of the Eternal — regalia payment and temporary Spellshroud", () => {
  for (const matching of [false, true])
    for (const pending of [false, true])
      for (const funds of [0, 1, 2]) {
        it(`class=${matching}, responding to spell=${pending}, reserve cards=${funds}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(templarOfTheEternal, matching, "activation-discount"),
          );
          const deck = Array.from({ length: 8 }, () => woodlandSquirrels);
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: pending ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                field: [templarOfTheEternal, trainingSword, giantTortoise],
                graveyard: [trainingSword],
                hand: Array.from({ length: funds }, () => woodlandSquirrels),
                "main-deck": deck,
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [trainingSword],
                hand: [
                  sparkAlight,
                  sparkAlight,
                  ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ],
                "main-deck": deck,
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(templarOfTheEternal),
            sword = p.card(trainingSword, { zone: "field" });
          const spell = () =>
            q.activate(q.cards(sparkAlight, { zone: "hand" })[0]!, {
              reservePayment: q
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              targets: { "target-1": [source.objectId] },
            });
          if (pending) {
            spell();
            q.pass();
          }
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const selection of [
            [],
            [q.card(trainingSword).objectId],
            [p.card(giantTortoise).objectId],
            [p.card(trainingSword, { zone: "graveyard" }).objectId],
            [sword.objectId, sword.objectId],
          ]) {
            expect(() =>
              p.activateAbility(source, "peyG8Hfgqt-a2", {
                reservePayment,
                costSelections: [selection],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const activate = () =>
            p.activateAbility(source, "peyG8Hfgqt-a2", {
              reservePayment,
              costSelections: [[sword.objectId]],
            });
          if (!matching || funds < 2) {
            expect(activate).toThrow();
            expect(game.state).toEqual(before);
            if (pending) {
              passEffectsStack(game);
              expect(game.state.objects[source.objectId]!.damage).toBe(2);
            }
            return;
          }
          activate();
          expect(game.state.objects[sword.objectId]!.zone).toBe("material-deck");
          expect(p.zone("memory")).toHaveLength(2);
          expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.counters.buff).toBe(1);
          expect(game.state.objects[source.objectId]!.damage).toBe(0);
          if (!pending) p.pass();
          const protectedState = game.state;
          expect(spell).toThrow();
          expect(game.state).toEqual(protectedState);
          advanceToMain(game, pending ? p.id : q.id, game.state.turn.number);
          if (pending) p.pass();
          spell();
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.damage).toBe(2);
          expect(game.state.objects[source.objectId]!.counters.buff).toBe(1);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.objects[sword.objectId]!.zone).toBe("material-deck");
        });
      }
});
