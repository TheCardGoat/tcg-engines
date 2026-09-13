import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  passEffectsStack,
  declareResolvedAttack,
} from "../../../testing/decisions.ts";
import { invokeDominance } from "./invoke-dominance.ts";
import { acceptedContract } from "./accepted-contract.ts";
import { cleanCut } from "../attacks/clean-cut.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { baubleOfMending } from "../items/bauble-of-mending.ts";
/** @covers PLljzdiMmq-a2 */
describe("Invoke Dominance grants temporary level and restricts only its controller's non-ally activations", () => {
  it("permits allies and activated abilities, excludes actions and attacks, then expires", () => {
    const champion = createClassBonusTestChampion(invokeDominance, true, "activation-discount"),
      game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              invokeDominance,
              acceptedContract,
              cleanCut,
              grayWolf,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            field: [baubleOfMending],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [invokeDominance, woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = p.card(champion),
      foe = q.card(champion),
      level = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[hero.objectId]!, "level", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        }),
      pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const before = game.state;
    expect(() => p.activate(invokeDominance)).toThrow();
    expect(game.state).toEqual(before);
    p.activate(invokeDominance, { reservePayment: pay(1) });
    expect(level()).toBe(0);
    passEffectsStack(game);
    expect(level()).toBe(3);
    const locked = game.state;
    expect(() => p.activate(acceptedContract, { reservePayment: pay(5) })).toThrow();
    expect(game.state).toEqual(locked);
    expect(() =>
      p.activate(cleanCut, { reservePayment: pay(2), attackAttackerId: hero.objectId }),
    ).toThrow();
    expect(game.state).toEqual(locked);
    p.activate(grayWolf, { reservePayment: pay(2) });
    passEffectsStack(game);
    p.declareAttack(p.card(grayWolf), foe);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[foe.objectId]!.damage).toBe(2);
    const hand = p.zone("hand").length;
    p.activateAbility(baubleOfMending, "hLHpI5rHIK-a1", { targets: { "target-1": [] } });
    passEffectsStack(game);
    expect(p.zone("hand")).toHaveLength(hand + 1);
    p.pass();
    q.activate(invokeDominance, {
      reservePayment: [
        { kind: "card", cardId: q.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    advanceToMain(game, q.id);
    expect(level()).toBe(0);
    advanceToMain(game, p.id);
    expect(() => p.declareAttack(p.card(grayWolf), foe)).toThrow();
    p.activate(cleanCut, { reservePayment: pay(2), attackAttackerId: hero.objectId });
    passEffectsStack(game);
    declareResolvedAttack(game, hero.objectId, foe.objectId, "Restriction expired");
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[foe.objectId]!.damage).toBe(4);
  });
});
