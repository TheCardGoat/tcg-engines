import { describe } from "vitest";
import { proveSubtypeRetaliationRestriction } from "../../../testing/retaliation-restrictions.ts";
/** @covers PIcB5KuuMd-a1 */
describe("Vorpal Sword — all Specter allies cannot retaliate", () =>
  proveSubtypeRetaliationRestriction("sword"));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { vorpalSword } from "./vorpal-sword.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { meltdown } from "../../ALC/actions/meltdown.ts";
import { temperedSteel } from "../../DOA/actions/tempered-steel.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
function opportunity(game: GrandArchiveTestEngine, id: string) {
  for (let i = 0; i < 8; i++) {
    const w = game.waitState();
    if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
    if (w.playerId === id) return;
    game.player(w.playerId).pass();
  }
  throw new Error("No opportunity");
}
/** @covers PIcB5KuuMd-a2 */
describe("Vorpal Sword — paid temporary Spellshroud", () => {
  for (const named of [false, true])
    for (const own of [false, true])
      for (const response of [false, true])
        it(`Merlin=${named}, own spell=${own}, response=${response}`, () => {
          const champion = enableAllTestElements(
            lineageTestChampion(named ? "Merlin" : "Other", 0),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [vorpalSword],
                "material-deck": [trainingSword, trainingSword],
                hand: [
                  meltdown,
                  temperedSteel,
                  ...Array.from({ length: 6 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                "material-deck": [trainingSword],
                hand: [meltdown, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            caster = own ? p : q,
            source = p.card(vorpalSword),
            [first, second] = p.cards(trainingSword, { zone: "material-deck" });
          const cast = () =>
            caster.activate(meltdown, {
              targets: { "target-1": [source.objectId] },
              reservePayment: caster
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            });
          if (response) cast();
          opportunity(game, p.id);
          for (const ids of [
            [],
            [q.card(trainingSword).objectId],
            [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
            [first!.objectId, second!.objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, "PIcB5KuuMd-a2", { costSelections: [ids] }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const activate = () =>
            p.activateAbility(source, "PIcB5KuuMd-a2", { costSelections: [[first!.objectId]] });
          if (!named) {
            const before = game.state;
            expect(activate).toThrow();
            expect(game.state).toEqual(before);
            opportunity(game, caster.id);
            if (!response) {
              advanceToMain(game, caster.id);
              cast();
            }
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
            return;
          }
          activate();
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.objects[first!.objectId]!.zone).toBe("banishment");
          {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, "PIcB5KuuMd-a2", { costSelections: [[second!.objectId]] }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          if (response) {
            expect(
              caster.zone("graveyard").some((c) => c.definitionId === meltdown.canonicalId),
            ).toBe(true);
            return;
          }
          opportunity(game, caster.id);
          {
            const before = game.state;
            expect(cast).toThrow();
            expect(game.state).toEqual(before);
          }
          if (own) {
            p.activate(temperedSteel, {
              targets: { "target-1": [source.objectId] },
              reservePayment: [
                { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
              ],
            });
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.counters.durability).toBe(4);
          }
          advanceToMain(game, caster.id, game.state.turn.number);
          cast();
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        });
});
function finishSwordCombat(game: GrandArchiveTestEngine, accept: boolean) {
  let offers = 0;
  for (
    let i = 0;
    i < 64 && (game.state.combat || game.state.stack.length || game.state.decision);
    i++
  ) {
    const d = game.state.decision;
    if (d?.kind === "choose-retaliators") answerDecision(game, d.kind, []);
    else if (d?.kind === "resolve-optional-effect") {
      offers++;
      answerDecision(game, d.kind, accept);
    } else {
      const w = game.waitState();
      if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
      game.player(w.playerId).pass();
    }
  }
  expect(game.state.combat).toBeNull();
  return offers;
}
/** @covers PIcB5KuuMd-a3 */
describe("Vorpal Sword — once-per-turn preparation-paid attacker wake", () => {
  for (const named of [false, true])
    for (const prepared of [false, true])
      for (const accept of [false, true])
        for (const ally of [false, true])
          it(`Merlin=${named}, prepared=${prepared}, accept=${accept}, ally=${ally}`, () => {
            const champion = enableAllTestElements(
              lineageTestChampion(named ? "Merlin" : "Other", 0),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [vorpalSword],
                  hand: [acceptedContract, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
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
              hero = p.card(champion),
              sword = p.card(vorpalSword),
              [first, second] = q.cards(giantTortoise, { zone: "field" }),
              target = ally ? first! : q.card(champion);
            if (prepared) {
              p.activate(acceptedContract, {
                reservePayment: p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              });
              passEffectsStack(game);
            }
            const attack = (id: typeof target) =>
              p.declareAttack(hero, id, { weaponIds: [sword.objectId] });
            attack(target);
            finishSwordCombat(game, accept);
            const wakes = named && prepared && accept && ally;
            expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(!wakes);
            expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
              (prepared ? 3 : 0) - (wakes ? 1 : 0),
            );
            expect(game.state.objects[target.objectId]!.damage).toBe(3);
            expect(game.state.objects[sword.objectId]!.counters.durability).toBe(2);
            if (wakes) {
              attack(second!);
              expect(finishSwordCombat(game, true)).toBe(0);
              expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
              expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(2);
              expect(game.state.objects[second!.objectId]!.damage).toBe(3);
            } else {
              const before = game.state;
              expect(() => attack(second!)).toThrow();
              expect(game.state).toEqual(before);
            }
            if (named && prepared) {
              advanceToMain(game, p.id, game.state.turn.number);
              attack(second!);
              finishSwordCombat(game, true);
              expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
              expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(wakes ? 1 : 2);
              expect(game.state.objects[sword.objectId]!.zone).toBe(wakes ? "banishment" : "field");
            }
          });
});
