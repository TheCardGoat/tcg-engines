import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { legionsWingspan } from "./legions-wingspan.ts";
import { trivariateDream } from "./trivariate-dream.ts";
import { teasingAerocharge } from "../actions/teasing-aerocharge.ts";
import { resonantAether } from "../actions/resonant-aether.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { recurringAethercharge } from "../../RDO/actions/recurring-aethercharge.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { comboStrike } from "../../DOA/attacks/combo-strike.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function prepare(winds: number, matching: boolean, allies = true) {
  const champion = enableAllTestElements(
    createLineageTestChampion(legionsWingspan, matching ? "Diana" : "Other"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [
          legionsWingspan,
          trivariateDream,
          ...(allies ? [woodlandSquirrels, woodlandSquirrels] : []),
        ],
        hand: [
          comboStrike,
          ...Array.from({ length: winds + 1 }, () => teasingAerocharge),
          ...Array.from({ length: 3 - winds }, () => resonantAether),
          ...Array.from({ length: 15 }, () => woodlandSquirrels),
        ],
        graveyard: [woodlandSquirrels],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: Array.from({ length: winds + 2 }, () => woodlandSquirrels),
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    weapon = p.card(legionsWingspan),
    other = p.card(trivariateDream);
  const payment = (n: number) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const windCards = p.cards(teasingAerocharge);
  for (const [index, card] of windCards.entries()) {
    p.activate(card, {
      reservePayment: payment(2),
      targets: { "target-1": [q.cards(woodlandSquirrels, { zone: "field" })[0]!.objectId] },
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [
      index < winds ? weapon.objectId : other.objectId,
    ]);
    passEffectsStack(game);
  }
  for (const card of p.cards(resonantAether, { zone: "hand" })) {
    p.activate(card, { reservePayment: payment(1) });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
    passEffectsStack(game);
  }
  return { game, p, q, champion, weapon, windCards, payment };
}

/** @covers iuixf9rdmu-a1 */
describe("Legion's Wingspan - wind intent choices and temporary ally power", () => {
  for (const matching of [false, true])
    for (const winds of [0, 1, 2, 3])
      for (const split of [false, true])
        it(`Diana=${matching}, winds=${winds}, split=${split}`, () => {
          const { game, p, q, champion, weapon, windCards } = prepare(winds, matching);
          const allies = p.cards(woodlandSquirrels, { zone: "field" }),
            target = q.card(champion),
            gains = [0, 0];
          p.declareAttack(p.card(champion), target, { weaponIds: [weapon.objectId] });
          for (const card of windCards.slice(0, winds))
            expect(game.state.objects[card.objectId]!.zone).toBe("intent");
          expect(game.state.objects[windCards.at(-1)!.objectId]!.zone).toBe("loaded");
          passEffectsStack(game);
          if (matching)
            for (let n = 0; n < winds; n++) {
              expect(game.state.decision?.kind).toBe("resolve-effect-choice");
              const before = game.state;
              for (const ids of [
                [],
                [q.cards(woodlandSquirrels, { zone: "field" })[0]!.objectId],
                [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
                [p.card(champion).objectId],
                [weapon.objectId],
                allies.map((c) => c.objectId),
              ]) {
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(before);
              }
              const index = split ? n % 2 : 0;
              answerDecision(game, "resolve-effect-choice", [allies[index]!.objectId]);
              gains[index]!++;
              passEffectsStack(game);
            }
          expect(game.state.decision).toBeFalsy();
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(4);
          let damage = 4;
          for (const [index, ally] of allies.entries()) {
            p.declareAttack(ally, target);
            game.resolveCombatWithoutRetaliation();
            damage += 1 + gains[index]!;
            expect(game.state.objects[target.objectId]!.damage).toBe(damage);
            expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
          }
          advanceToMain(game, p.id, game.state.turn.number, true);
          for (const ally of allies) {
            p.declareAttack(ally, target);
            game.resolveCombatWithoutRetaliation();
            damage++;
            expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          }
        });

  it("finishes its attack with no eligible allied recipients", () => {
    const { game, p, q, champion, weapon } = prepare(2, true, false);
    p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(4);
    expect(game.state.decision).toBeFalsy();
    expect(game.state.stack).toHaveLength(0);
  });

  it("rejects wielding an Aetherwing with an attack card and does not grant bonuses when not wielded", () => {
    const { game, p, q, champion, weapon, payment } = prepare(0, true);
    const attacker = p.card(champion),
      target = q.card(champion),
      ally = p.cards(woodlandSquirrels, { zone: "field" })[0]!;
    p.activate(comboStrike, { reservePayment: payment(2), attackAttackerId: attacker.objectId });
    passEffectsStack(game);
    const before = game.state;
    expect(() =>
      answerDecision(game, "declare-resolved-attack", {
        attackerId: attacker.objectId,
        targetIds: [target.objectId],
        weaponIds: [weapon.objectId],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    answerDecision(game, "declare-resolved-attack", {
      attackerId: attacker.objectId,
      targetIds: [target.objectId],
      weaponIds: [],
    });
    passEffectsStack(game);
    expect(game.state.decision).toBeFalsy();
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(3);
    p.declareAttack(ally, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(4);
  });
  it("accepts a paid graveyard load into its Aetherwing subtype without granting a wind bonus for that normal charge", () => {
    const champion = enableAllTestElements(createLineageTestChampion(legionsWingspan, "Diana"));
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [legionsWingspan, trivariateDream, trainingSword, woodlandSquirrels],
          graveyard: [recurringAethercharge],
          banishment: [recurringAethercharge],
          hand: [recurringAethercharge, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [legionsWingspan] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      weapon = p.card(legionsWingspan),
      charge = p.card(recurringAethercharge, { zone: "graveyard" });
    const original = game.state;
    for (const zone of ["hand", "banishment"] as const) {
      expect(() =>
        p.activateAbility(p.card(recurringAethercharge, { zone }), "MG8QoeZBXY-a2", {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(original);
    }
    p.activateAbility(charge, "MG8QoeZBXY-a2", {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    expect(p.zone("memory")).toHaveLength(3);
    passEffectsStack(game);
    const before = game.state;
    for (const ids of [[p.card(trainingSword).objectId], [q.card(legionsWingspan).objectId]]) {
      expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[charge.objectId]!.zone).toBe("loaded");
    expect(game.state.objects[charge.objectId]!.hostId).toBe(weapon.objectId);
    p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
    p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
  });
});
