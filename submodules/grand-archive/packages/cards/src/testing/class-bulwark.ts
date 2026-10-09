import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { classBonusLeveledChampion } from "./class-bonus-level.ts";
import { advanceToMain, declareResolvedAttack, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSession } from "../cards/DOA/actions/training-session.ts";
import { plantedExplosive } from "../cards/P26/actions/planted-explosive.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { blazingLunge } from "../cards/AMB/attacks/blazing-lunge.ts";
import { heatedVengeance } from "../cards/AMB/attacks/heated-vengeance.ts";
export function proveClassBulwark(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  spellshroud = false,
) {
  const printed = grandArchiveTestFace(card),
    cost = printed.cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const reserveCost = cost.amount;
  for (const matching of [false, true])
    for (const changeClass of [false, true])
      for (const priorDamage of ["none", "skill", "unpreventable"] as const)
        it(`class at entry=${matching}, change class=${changeClass}, prior damage=${priorDamage}`, () => {
          const champion = enableAllTestElements(
              createClassBonusTestChampion(card, matching, "activation-discount"),
            ),
            successor = enableAllTestElements(
              classBonusLeveledChampion(card, !matching, 1).lineage[0]!,
            );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  plantedExplosive,
                  sparkAlight,
                  ...Array.from({ length: 4 }, () => trainingSession),
                  ...Array.from({ length: 18 }, () => woodlandSquirrels),
                ],
                "material-deck": [successor],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise, giantTortoise],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            bulwark = () => game.state.objects[source.objectId]!.counters.bulwark ?? 0;
          p.activate(source, { reservePayment: pay(reserveCost) });
          expect(bulwark()).toBe(0);
          passEffectsStack(game);
          expect(bulwark()).toBe(matching ? 1 : 0);
          for (const spell of p.cards(trainingSession, { zone: "hand" })) {
            p.activate(spell, {
              reservePayment: pay(2),
              targets: { "target-1": [source.objectId] },
            });
            passEffectsStack(game);
          }
          if (changeClass) {
            const start = game.state.turn.number;
            let reached = false;
            for (let i = 0; i < 128; i++) {
              const w = game.waitState();
              if (
                w.kind === "materialization-choice" &&
                w.playerId === p.id &&
                game.state.turn.number > start
              ) {
                reached = true;
                break;
              }
              if (w.kind === "materialization-choice")
                game.player(w.playerId).execute({ move: "skip-materialization" });
              else if (w.kind === "opportunity") game.player(w.playerId).pass();
              else throw new Error(`Unexpected ${w.kind}`);
            }
            expect(reached).toBe(true);
            p.materialize(successor);
            passEffectsStack(game);
            advanceToMain(game, p.id);
            expect(bulwark()).toBe(matching ? 1 : 0);
          }
          let damage = 0;
          if (priorDamage !== "none") {
            const spell = priorDamage === "skill" ? plantedExplosive : sparkAlight;
            const options = { reservePayment: pay(2), targets: { "target-1": [source.objectId] } };
            if (spellshroud && priorDamage === "unpreventable") {
              const before = game.state;
              expect(() => p.activate(spell, options)).toThrow();
              expect(game.state).toEqual(before);
            } else {
              p.activate(spell, options);
              passEffectsStack(game);
              expect(game.state.objects[source.objectId]!.damage).toBe(2);
            }
            expect(bulwark()).toBe(matching ? 1 : 0);
          }
          advanceToMain(game, q.id);
          // Ally damage clears at turn end; the Bulwark counter persists.
          expect(game.state.objects[source.objectId]!.damage).toBe(0);
          for (const [index, attacker] of q.cards(giantTortoise).entries()) {
            q.declareAttack(attacker, source);
            game.resolveCombatWithoutRetaliation();
            if (index > 0 || !matching) damage++;
            expect(game.state.objects[source.objectId]!.damage).toBe(damage);
            expect(bulwark()).toBe(0);
            expect(game.state.objects[source.objectId]!.zone).toBe("field");
          }
        });
  for (const matching of [false, true])
    for (const unpreventable of [false, true])
      it(`Bulwark consumes on combat even when unpreventable: class=${matching}, unpreventable=${unpreventable}`, () => {
        const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          ),
          opponent = enableAllTestElements(
            createClassBonusTestChampion(blazingLunge, true, "activation-discount"),
          );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                ...Array.from({ length: 4 }, () => trainingSession),
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              hand: [blazingLunge, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [heatedVengeance, heatedVengeance],
              field: [giantTortoise],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(source, { reservePayment: pay(reserveCost) });
        passEffectsStack(game);
        for (const spell of p.cards(trainingSession, { zone: "hand" })) {
          p.activate(spell, { reservePayment: pay(2), targets: { "target-1": [source.objectId] } });
          passEffectsStack(game);
        }
        advanceToMain(game, q.id);
        const hero = q.card(opponent);
        q.activate(blazingLunge, {
          attackAttackerId: hero.objectId,
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        passEffectsStack(game);
        declareResolvedAttack(game, hero.objectId, source.objectId, "Bulwark versus Blazing Lunge");
        if (unpreventable) {
          q.activateAbility(blazingLunge, "wewvlfkfp7-a1", {
            costSelections: [
              q.cards(heatedVengeance, { zone: "graveyard" }).map((c) => c.objectId),
            ],
          });
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        const damage = matching && !unpreventable ? 0 : 4;
        expect(game.state.objects[source.objectId]!.damage).toBe(damage);
        expect(game.state.objects[source.objectId]!.counters.bulwark ?? 0).toBe(0);
        q.declareAttack(q.card(giantTortoise), source);
        game.resolveCombatWithoutRetaliation();
        const dies = damage + 1 >= printed.stats.life! + 4;
        expect(game.state.objects[source.objectId]!.zone).toBe(dies ? "graveyard" : "field");
        if (!dies) expect(game.state.objects[source.objectId]!.damage).toBe(damage + 1);
      });
}
