import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { extortingBlackjack } from "./extorting-blackjack.ts";
import { balefulOblation } from "../actions/baleful-oblation.ts";
import { backdash } from "../actions/backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  advanceToMain,
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
function prepare(omens: readonly Card[], classBonus: boolean, damage = 0) {
  const champion = createClassBonusTestChampion(
    extortingBlackjack,
    classBonus,
    "activation-discount",
  );
  const opponent = createClassBonusTestChampion(extortingBlackjack, true, "activation-discount");
  const opposingOmens = [
    balefulOblation,
    balefulOblation,
    balefulOblation,
    balefulOblation,
    backdash,
  ];
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        field: Array.from({ length: omens.length + 1 }, () => condemnedTrinket),
        hand: [
          extortingBlackjack,
          ...Array.from({ length: 2 + 3 * (omens.length + 1) }, () => woodlandSquirrels),
        ],
        graveyard: [...omens, backdash, woodlandSquirrels],
        banishment: [balefulOblation, balefulOblation, balefulOblation, balefulOblation, backdash],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion: opponent,
      zones: {
        field: [
          ...opposingOmens.map(() => condemnedTrinket),
          ...Array.from({ length: damage }, () => enfeebledDagger),
        ],
        hand: Array.from({ length: 15 }, () => woodlandSquirrels),
        graveyard: opposingOmens,
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    hero = p.card(champion),
    target = q.card(opponent);
  const payment = (player: typeof p, n: number) =>
    player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  for (const card of opposingOmens) {
    const selected = q.cards(card, { zone: "graveyard" })[0]!;
    q.activateAbility(q.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
      reservePayment: payment(q, 3),
    });
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(game, "resolve-effect-choice", [selected.objectId]);
      passEffectsStack(game);
    }
    expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
  }
  for (let i = 0; i < damage; i++) {
    q.activateAbility(q.cards(enfeebledDagger, { zone: "field" })[0]!, "idpdon8f0h-a1", {
      targets: { "target-unit": [hero.objectId] },
    });
    passEffectsStack(game);
  }
  advanceToMain(game, p.id);
  for (const card of omens) {
    const selected = p.cards(card, { zone: "graveyard" })[0]!;
    p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
      reservePayment: payment(p, 3),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [selected.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
  }
  const attack = () => {
    const before = game.state;
    expect(() =>
      p.activate(extortingBlackjack, {
        attackAttackerId: hero.objectId,
        reservePayment: payment(p, 1),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    const memory = p.zone("memory").length;
    p.activate(extortingBlackjack, {
      attackAttackerId: hero.objectId,
      reservePayment: payment(p, 2),
    });
    expect(p.zone("memory")).toHaveLength(memory + 2);
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
    declareResolvedAttack(game, hero.objectId, target.objectId, "Declare Extorting Blackjack");
  };
  return { game, p, q, hero, target, payment, attack };
}

/** @covers bfg5ubeczk-a1 */
describe("Extorting Blackjack — exactly 21 owned omen reserve cost", () => {
  const twenties = [balefulOblation, balefulOblation, balefulOblation, balefulOblation];
  for (const scenario of [
    { name: "zero", omens: [], damage: 2 },
    { name: "twenty", omens: twenties, damage: 2 },
    { name: "twenty-one", omens: [...twenties, backdash], damage: 12 },
    { name: "twenty-two", omens: [...twenties, extortingBlackjack], damage: 2 },
    {
      name: "twenty-one including zero",
      omens: [...twenties, backdash, woodlandSquirrels],
      damage: 12,
    },
    { name: "forty-two", omens: [...twenties, ...twenties, extortingBlackjack], damage: 2 },
  ])
    it(scenario.name, () => {
      const { game, p, target, attack } = prepare(scenario.omens, false);
      attack();
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(scenario.damage);
      expect(p.cards(extortingBlackjack, { zone: "graveyard" })).toHaveLength(1);
    });
  for (const initiallyExact of [false, true])
    it(`rechecks when a one-cost omen is added during combat: initially exact=${initiallyExact}`, () => {
      const { game, p, hero, target, payment, attack } = prepare(
        [...twenties, ...(initiallyExact ? [backdash] : [])],
        false,
      );
      attack();
      p.activateAbility(p.card(condemnedTrinket, { zone: "field" }), "21oy1nd4nw-a1", {
        reservePayment: payment(p, 3),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [
        p.card(backdash, { zone: "graveyard" }).objectId,
      ]);
      passEffectsStack(game);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(initiallyExact ? 2 : 12);
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
    });
});

/** @covers bfg5ubeczk-a2 */
describe("Extorting Blackjack — class-gated recovery counts distinct omen costs", () => {
  const scenarios = [
    { name: "none", omens: [], recovery: 0 },
    { name: "zero cost", omens: [woodlandSquirrels], recovery: 1 },
    { name: "one cost", omens: [backdash], recovery: 1 },
    { name: "repeated one cost", omens: [backdash, backdash, backdash], recovery: 1 },
    {
      name: "four distinct costs",
      omens: [woodlandSquirrels, backdash, extortingBlackjack, balefulOblation],
      recovery: 4,
    },
    {
      name: "duplicates and mixed",
      omens: [woodlandSquirrels, backdash, backdash, balefulOblation],
      recovery: 3,
    },
    {
      name: "four matching five-cost omens",
      omens: [balefulOblation, balefulOblation, balefulOblation, balefulOblation],
      recovery: 1,
    },
  ];
  for (const enabled of [false, true])
    for (const scenario of scenarios)
      it(`${scenario.name}, class bonus=${enabled}`, () => {
        const { game, p, hero, target, attack } = prepare(scenario.omens, enabled, 5);
        attack();
        advanceCombatToTrigger(game, "bfg5ubeczk-a2");
        if (enabled) {
          expect(game.state.objects[hero.objectId]!.damage).toBe(5);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          5 - (enabled ? scenario.recovery : 0),
        );
        expect(game.state.objects[target.objectId]!.damage).toBe(2);
        expect(p.cards(extortingBlackjack, { zone: "graveyard" })).toHaveLength(1);
      });
  for (const damage of [0, 1])
    it(`recovery is capped by ${damage} existing damage`, () => {
      const { game, hero, target, attack } = prepare(
        [woodlandSquirrels, backdash, extortingBlackjack, balefulOblation],
        true,
        damage,
      );
      attack();
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(0);
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
    });
  it("counts a new distinct omen when the attack trigger resolves", () => {
    const { game, p, hero, target, payment, attack } = prepare([woodlandSquirrels], true, 5);
    attack();
    advanceCombatToTrigger(game, "bfg5ubeczk-a2");
    expect(game.state.objects[hero.objectId]!.damage).toBe(5);
    p.activateAbility(p.card(condemnedTrinket, { zone: "field" }), "21oy1nd4nw-a1", {
      reservePayment: payment(p, 3),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [
      p.card(backdash, { zone: "graveyard" }).objectId,
    ]);
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.damage).toBe(3);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
