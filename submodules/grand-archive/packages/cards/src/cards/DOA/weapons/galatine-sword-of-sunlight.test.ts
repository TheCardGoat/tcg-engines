import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { galatineSwordOfSunlight } from "./galatine-sword-of-sunlight.ts";
import { cleanCut } from "../attacks/clean-cut.ts";
import { backstab } from "../attacks/backstab.ts";
import { refurbish } from "../actions/refurbish.ts";
import { temperedSteel } from "../actions/tempered-steel.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers 3traenEA8M-a1 */
describe("Galatine only gains counters from its controller's Sword attacks", () => {
  it("distinguishes Sword attacks, Sword actions, weapons, and opposing activations", () => {
    const champion = createClassBonusTestChampion(
        galatineSwordOfSunlight,
        false,
        "activation-discount",
      ),
      game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            field: [galatineSwordOfSunlight],
            "material-deck": [trainingSword],
            hand: [
              refurbish,
              cleanCut,
              backstab,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [galatineSwordOfSunlight],
            hand: [cleanCut, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      sword = p.card(galatineSwordOfSunlight),
      foeSword = q.card(galatineSwordOfSunlight),
      hero = p.card(champion),
      foe = q.card(champion);
    p.materialize(trainingSword);
    passEffectsStack(game);
    advanceToMain(game, p.id);
    expect(game.state.objects[sword.objectId]!.counters.durability).toBe(1);
    p.activate(refurbish, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 4)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
      targets: { "target-1": [sword.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[sword.objectId]!.counters.durability).toBe(3);
    p.activate(cleanCut, {
      attackAttackerId: hero.objectId,
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    expect(game.state.objects[sword.objectId]!.counters.durability).toBe(3);
    passEffectsStack(game);
    expect(game.state.objects[sword.objectId]!.counters.durability).toBe(4);
    declareResolvedAttack(game, hero.objectId, foe.objectId, "Resolve Sword attack");
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[foe.objectId]!.damage).toBe(2);
    expect(game.state.objects[foeSword.objectId]!.counters.durability).toBe(1);
    advanceToMain(game, q.id);
    q.activate(cleanCut, {
      attackAttackerId: foe.objectId,
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[foeSword.objectId]!.counters.durability).toBe(2);
    expect(game.state.objects[sword.objectId]!.counters.durability).toBe(4);
    declareResolvedAttack(game, foe.objectId, hero.objectId, "Resolve opposing Sword attack");
    game.resolveCombatWithoutRetaliation();
    advanceToMain(game, p.id);
    p.activate(backstab, {
      attackAttackerId: hero.objectId,
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[sword.objectId]!.counters.durability).toBe(4);
    declareResolvedAttack(game, hero.objectId, foe.objectId, "Resolve non-Sword attack");
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[foe.objectId]!.damage).toBe(4);
  });
});
/** @covers 3traenEA8M-a2 */
describe("Galatine's class power tracks complete groups of three durability", () => {
  for (const classBonus of [false, true])
    for (const added of [0, 1, 2, 4, 5])
      it(`class=${classBonus}, durability=${1 + added}`, () => {
        const champion = createClassBonusTestChampion(
            temperedSteel,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [galatineSwordOfSunlight],
                hand: [
                  ...Array.from({ length: added }, () => temperedSteel),
                  ...Array.from({ length: added }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          sword = p.card(galatineSwordOfSunlight);
        for (const steel of p.cards(temperedSteel)) {
          p.activate(steel, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
            targets: { "target-1": [sword.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[sword.objectId]!.counters.durability).toBe(1 + added);
        p.declareAttack(hero, foe, { weaponIds: [sword.objectId] });
        game.resolveCombatWithoutRetaliation();
        const power = 1 + (classBonus ? Math.floor((1 + added) / 3) : 0);
        expect(game.state.objects[foe.objectId]!.damage).toBe(power);
        if (!added) {
          expect(p.card(galatineSwordOfSunlight, { zone: "banishment" }).objectId).toBe(
            sword.objectId,
          );
          return;
        }
        expect(game.state.objects[sword.objectId]!.counters.durability).toBe(added);
        advanceToMain(game, q.id);
        advanceToMain(game, p.id);
        p.declareAttack(hero, foe, { weaponIds: [sword.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[foe.objectId]!.damage).toBe(
          power + 1 + (classBonus ? Math.floor(added / 3) : 0),
        );
      });
});
