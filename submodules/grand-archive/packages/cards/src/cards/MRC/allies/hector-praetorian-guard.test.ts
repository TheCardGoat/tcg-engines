import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { hectorPraetorianGuard } from "./hector-praetorian-guard.ts";

/** @covers AsDKTmP3kp-a1 */
describe("Hector, Praetorian Guard — Imbue keyword", () => {
  proveImbueKeyword({
    card: hectorPraetorianGuard,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";

/** @covers AsDKTmP3kp-a2 */
describe("Hector — imbued entry", () => {
  for (const matching of [false, true])
    for (const neos of [0, 1, 2, 3])
      for (const reveal of [false, true])
        it(`summons only after matching imbued entry: class=${matching}, Neos=${neos}, reveal=${reveal}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(hectorPraetorianGuard, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [automatonDrone],
            playerOne: {
              champion,
              zones: {
                hand: [
                  hectorPraetorianGuard,
                  ...Array.from({ length: neos }, () => hectorPraetorianGuard),
                  ...Array.from({ length: 3 - neos }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: { champion },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const source = p.cards(hectorPraetorianGuard, { zone: "hand" })[0]!;
          p.activate(source, {
            revealForImbue: reveal,
            reservePayment: p
              .zone("hand")
              .filter((c) => c.objectId !== source.objectId)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          expect(p.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
          expect(game.state.stack.at(-1)!.activationStates.includes("imbued")).toBe(
            reveal && neos === 3,
          );
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(p.zone("memory")).toHaveLength(3);
          const drones = p.cards(automatonDrone, { zone: "field" });
          expect(drones).toHaveLength(matching && reveal && neos === 3 ? 2 : 0);
          expect(q.cards(automatonDrone)).toHaveLength(0);
          for (const drone of drones) {
            expect(game.state.objects[drone.objectId]!.controllerId).toBe(p.id);
            expect(game.state.objects[drone.objectId]!.states.has("rested")).toBe(false);
          }
        });
});

import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { titanMkIi } from "../../RDO/tokens/titan-mk-ii.ts";
import { plantedExplosive } from "../../P26/actions/planted-explosive.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";

/** @covers AsDKTmP3kp-a3 */
describe("Hector — once-per-turn Neos prevention", () => {
  for (const matching of [false, true])
    for (const tokens of [0, 1, 2, 3])
      for (const recipient of ["champion", "hector", "norm", "token", "opponent"] as const)
        for (const unpreventable of [false, true]) {
          if (!tokens && recipient === "token") continue;
          it(`prevents one eligible event: class=${matching}, tokens=${tokens}, target=${recipient}, unpreventable=${unpreventable}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(hectorPraetorianGuard, matching, "activation-discount"),
            );
            const opponent = enableAllTestElements(
              createClassBonusTestChampion(hectorPraetorianGuard, false, "floating-memory"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field: [
                    hectorPraetorianGuard,
                    giantTortoise,
                    ...Array.from({ length: tokens }, () => titanMkIi),
                  ],
                },
              },
              playerTwo: {
                champion: opponent,
                zones: {
                  field: [automatonDrone],
                  hand: [
                    plantedExplosive,
                    plantedExplosive,
                    sparkAlight,
                    ...Array.from({ length: 4 }, () => woodlandSquirrels),
                  ],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const target =
              recipient === "champion"
                ? p.card(champion)
                : recipient === "hector"
                  ? p.card(hectorPraetorianGuard)
                  : recipient === "norm"
                    ? p.card(giantTortoise)
                    : recipient === "token"
                      ? p.cards(titanMkIi)[0]!
                      : q.card(opponent);
            let total = 0;
            for (let hit = 0; hit < 2; hit++) {
              const card = hit === 0 && unpreventable ? sparkAlight : plantedExplosive;
              const start = game.state.eventHistory.length;
              q.activate(q.cards(card, { zone: "hand" })[0]!, {
                targets: { "target-1": [target.objectId] },
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 2)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              });
              passEffectsStack(game);
              const expected =
                hit === 0 &&
                !unpreventable &&
                matching &&
                (recipient === "champion" || recipient === "hector")
                  ? Math.max(0, 2 - tokens)
                  : 2;
              const actual = game.state.eventHistory
                .slice(start)
                .reduce(
                  (sum, e) =>
                    sum +
                    (e.type === "damage-marked" && e.objectId === target.objectId ? e.amount : 0),
                  0,
                );
              expect(actual).toBe(expected);
              total += expected;
              const targetState = game.state.objects[target.objectId];
              const life =
                recipient === "hector" || recipient === "token" ? 3 : recipient === "norm" ? 6 : 15;
              if (total >= life) {
                if (recipient === "token") expect(targetState).toBeUndefined();
                else expect(targetState!.zone).toBe("graveyard");
                break;
              }
              expect(targetState!.damage).toBe(total);
            }
          });
        }
});

import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { astralShard } from "../../DTR/tokens/astral-shard.ts";
import { meteorStrike } from "../actions/meteor-strike.ts";
import { answerDecision, advanceToMain } from "../../../testing/decisions.ts";
for (const matching of [false, true])
  for (const tokens of [1, 2])
    it(`Hector prevents one simultaneous damage event for all eligible units: class=${matching}, tokens=${tokens}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(hectorPraetorianGuard, matching, "activation-discount"),
      );
      const opponent = enableAllTestElements(
        createClassBonusTestChampion(hectorPraetorianGuard, false, "floating-memory"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [
              hectorPraetorianGuard,
              giantTortoise,
              ...Array.from({ length: tokens }, () => manaroot),
            ],
          },
        },
        playerTwo: {
          champion: opponent,
          preserveMainDeckOrder: true,
          zones: {
            field: [astralShard, giantTortoise],
            hand: [plantedExplosive, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            "main-deck": [meteorStrike, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        hector = p.card(hectorPraetorianGuard);
      const start = game.state.eventHistory.length;
      q.activateAbility(astralShard, "eP07Xxscuq-a1");
      passEffectsStack(game);
      const decision = game.state.decision;
      if (decision?.kind !== "resolve-glimpse") throw new Error("Expected glimpse");
      answerDecision(game, "resolve-glimpse", {
        kind: "starcall",
        cardId: decision.cardIds[0]!,
        bottom: decision.cardIds.slice(1),
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      for (const target of [hero, hector, p.card(giantTortoise), q.card(giantTortoise)]) {
        const expected =
          matching && (target.objectId === hero.objectId || target.objectId === hector.objectId)
            ? 3 - tokens
            : 3;
        const actual = game.state.eventHistory
          .slice(start)
          .reduce(
            (sum, e) =>
              sum + (e.type === "damage-marked" && e.objectId === target.objectId ? e.amount : 0),
            0,
          );
        expect(actual).toBe(expected);
      }
      const previous = game.state.objects[hero.objectId]!.damage;
      q.activate(q.card(plantedExplosive), {
        targets: { "target-1": [hero.objectId] },
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(previous + 2);
    });

for (const matching of [false, true])
  for (const tokens of [0, 2])
    it(`Hector resets prevention each turn: class=${matching}, tokens=${tokens}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(hectorPraetorianGuard, matching, "activation-discount"),
      );
      const opponent = enableAllTestElements(
        createClassBonusTestChampion(hectorPraetorianGuard, false, "floating-memory"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [hectorPraetorianGuard, ...Array.from({ length: tokens }, () => manaroot)],
            hand: [plantedExplosive, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            hand: [
              plantedExplosive,
              plantedExplosive,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      let total = 0;
      for (const actor of [q, p, q]) {
        advanceToMain(game, actor.id);
        actor.activate(actor.cards(plantedExplosive, { zone: "hand" })[0]!, {
          targets: { "target-1": [hero.objectId] },
          reservePayment: actor
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        total += matching ? Math.max(0, 2 - tokens) : 2;
        expect(game.state.objects[hero.objectId]!.damage).toBe(total);
      }
    });

for (const matching of [false, true])
  for (const tokens of [0, 2])
    it(`Hector also prevents only the first combat hit: class=${matching}, tokens=${tokens}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(hectorPraetorianGuard, matching, "activation-discount"),
      );
      const opponent = enableAllTestElements(
        createClassBonusTestChampion(hectorPraetorianGuard, false, "floating-memory"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [hectorPraetorianGuard, ...Array.from({ length: tokens }, () => manaroot)],
          },
        },
        playerTwo: { champion: opponent, zones: { field: [giantTortoise, giantTortoise] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      const attackers = q.cards(giantTortoise);
      q.declareAttack(attackers[0]!, hero);
      game.resolveCombatWithoutRetaliation();
      const first = matching && tokens > 0 ? 0 : 1;
      expect(game.state.objects[hero.objectId]!.damage).toBe(first);
      q.declareAttack(attackers[1]!, hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(first + 1);
    });

import { sylphsEnvelopment } from "../../HVN/actions/sylphs-envelopment.ts";
for (const matching of [false, true])
  it(`Hector's returned field instance has a fresh prevention use: class=${matching}`, () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(hectorPraetorianGuard, matching, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [hectorPraetorianGuard, manaroot, manaroot],
          hand: [
            plantedExplosive,
            plantedExplosive,
            sylphsEnvelopment,
            ...Array.from({ length: 6 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      hero = p.card(champion),
      hector = p.card(hectorPraetorianGuard);
    const pay = () =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    p.activate(p.cards(plantedExplosive, { zone: "hand" })[0]!, {
      targets: { "target-1": [hero.objectId] },
      reservePayment: pay(),
    });
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(matching ? 0 : 2);
    const incarnation = game.state.objects[hector.objectId]!.incarnation;
    p.activate(p.card(sylphsEnvelopment), {
      targets: { "target-ally": [hector.objectId] },
      reservePayment: pay(),
    });
    passEffectsStack(game);
    expect(game.state.objects[hector.objectId]!.incarnation).toBeGreaterThan(incarnation);
    p.activate(p.cards(plantedExplosive, { zone: "hand" })[0]!, {
      targets: { "target-1": [hero.objectId] },
      reservePayment: pay(),
    });
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(matching ? 0 : 4);
  });
