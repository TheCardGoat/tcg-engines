import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { rangerStrides } from "./ranger-strides.ts";
import { ghostHunter } from "../allies/ghost-hunter.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers pvxb5hrfsu-a1 */
describe("Ranger Strides — entry draw", () =>
  proveOnEnterDraw({
    card: rangerStrides,
    abilityId: "pvxb5hrfsu-a1",
    cost: { kind: "memory", amount: 1 },
  }));

/** @covers pvxb5hrfsu-a2 */
describe("Ranger Strides — temporary Ranger ranged grant", () => {
  for (const own of [false, true])
    for (const distant of [false, true])
      for (const championTarget of [false, true])
        it(`grants Ranged 4 to ${own ? "own" : "opposing"} Ranger ${championTarget ? "champion" : "ally"}, distant=${distant}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(rangerStrides, true, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [rangerStrides, ghostHunter, woodlandSquirrels, trainingSword],
                graveyard: [ghostHunter],
                hand: [reposition, reposition, woodlandSquirrels, woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [ghostHunter, trainingSword],
                hand: [reposition, reposition, woodlandSquirrels, woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q,
            foe = own ? q : p;
          const source = p.card(rangerStrides),
            target = owner.card(championTarget ? champion : ghostHunter, { zone: "field" });
          const makeDistant = () => {
            owner.activate(owner.cards(reposition, { zone: "hand" })[0]!, {
              targets: { "target-1": [target.objectId] },
              reservePayment: [
                {
                  kind: "card",
                  cardId: owner.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
                },
              ],
            });
            passEffectsStack(game);
          };
          if (distant) makeDistant();
          if (!own) q.pass();
          for (const invalid of [
            p.card(woodlandSquirrels, { zone: "field" }),
            source,
            p.card(ghostHunter, { zone: "graveyard" }),
          ]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, "pvxb5hrfsu-a2", {
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activateAbility(source, "pvxb5hrfsu-a2", {
            targets: { "target-1": [target.objectId] },
          });
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(() =>
            p.activateAbility(source, "pvxb5hrfsu-a2", {
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          passEffectsStack(game);
          const attack = () => {
            owner.declareAttack(
              target,
              foe.card(champion),
              championTarget ? { weaponIds: [owner.card(trainingSword).objectId] } : {},
            );
            game.resolveCombatWithoutRetaliation();
          };
          attack();
          const firstDamage = 1 + (distant ? 4 + (championTarget ? 0 : 2) : 0);
          expect(game.state.objects[foe.card(champion).objectId]!.damage).toBe(firstDamage);
          advanceToMain(game, foe.id);
          advanceToMain(game, owner.id);
          if (distant) makeDistant();
          attack();
          expect(game.state.objects[foe.card(champion).objectId]!.damage).toBe(
            firstDamage + 1 + (distant && !championTarget ? 2 : 0),
          );
        });
});
