import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { servantsObligation } from "./servants-obligation.ts";
import { vacuousServant } from "../tokens/vacuous-servant.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { evasivePositioning } from "../actions/evasive-positioning.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers f4wqesifxk-a2 */
describe("Servant's Obligation — Taunt until this champion is attacked", () => {
  for (const ciel of [false, true])
    for (const championAttacker of [false, true])
      it(`Ciel=${ciel}, first attacker is ${championAttacker ? "champion" : "ally"}`, () => {
        const champion = createLineageTestChampion(servantsObligation, ciel ? "Ciel" : "Other"),
          opponent = createLineageTestChampion(servantsObligation, "Ciel");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [servantsObligation, giantTortoise],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [giantTortoise, giantTortoise, trainingSword],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          ally = p.card(giantTortoise),
          attackers = q.cards(giantTortoise);
        if (ciel) {
          const before = game.state;
          expect(() => q.declareAttack(attackers[0]!, ally)).toThrow();
          expect(game.state).toEqual(before);
        }
        q.declareAttack(
          championAttacker ? q.card(opponent) : attackers[0]!,
          hero,
          championAttacker ? { weaponIds: [q.card(trainingSword).objectId] } : {},
        );
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        q.declareAttack(attackers[1]!, ally);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[ally.objectId]!.damage).toBe(1);
        advanceToMain(game, p.id);
        advanceToMain(game, q.id);
        if (ciel) {
          const before = game.state;
          expect(() => q.declareAttack(attackers[0]!, ally)).toThrow();
          expect(game.state).toEqual(before);
        } else {
          q.declareAttack(attackers[0]!, ally);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[ally.objectId]!.damage).toBe(1);
        }
      });

  it("ignores attacks on another ally and restores Taunt when its unattacked champion wakes", () => {
    const champion = enableAllTestElements(createLineageTestChampion(servantsObligation, "Ciel"));
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [servantsObligation, giantTortoise, trainingSword],
          hand: [spiritsBlessing, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [trainingSword, giantTortoise],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = p.card(champion),
      ally = p.card(giantTortoise);
    p.declareAttack(hero, q.card(champion), { weaponIds: [p.card(trainingSword).objectId] });
    game.resolveCombatWithoutRetaliation();
    advanceToMain(game, q.id);
    q.declareAttack(q.card(champion), ally, { weaponIds: [q.card(trainingSword).objectId] });
    game.resolveCombatWithoutRetaliation();
    q.pass();
    p.activate(spiritsBlessing, {
      costSelections: [[p.card(trainingSword).objectId]],
      reservePayment: [
        { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
    const before = game.state;
    expect(() => q.declareAttack(q.card(giantTortoise), ally)).toThrow();
    expect(game.state).toEqual(before);
    q.declareAttack(q.card(giantTortoise), hero);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[hero.objectId]!.damage).toBe(1);
  });
});

/** @covers f4wqesifxk-a3 */
describe("Servant's Obligation — pay, rest and banish to summon", () => {
  for (const ciel of [false, true])
    it(`requires an awake item and its controller's Ciel, Ciel=${ciel}`, () => {
      const champion = createLineageTestChampion(servantsObligation, ciel ? "Ciel" : "Other"),
        opponent = createLineageTestChampion(servantsObligation, "Ciel");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        definitions: [vacuousServant],
        playerOne: {
          champion,
          zones: {
            "material-deck": [servantsObligation],
            hand: Array.from({ length: 3 }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(servantsObligation);
      p.materialize(source);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const rested = game.state;
      expect(() =>
        p.activateAbility(source, "f4wqesifxk-a3", { reservePayment: payment }),
      ).toThrow();
      expect(game.state).toEqual(rested);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
      const before = game.state;
      expect(() =>
        p.activateAbility(source, "f4wqesifxk-a3", {
          reservePayment: ciel ? payment.slice(1) : payment,
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (!ciel) return;
      p.activateAbility(source, "f4wqesifxk-a3", { reservePayment: payment });
      expect(p.zone("memory")).toHaveLength(3);
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(p.zone("field")).toHaveLength(1);
      const paid = game.state;
      expect(() => p.activateAbility(source, "f4wqesifxk-a3", { reservePayment: [] })).toThrow();
      expect(game.state).toEqual(paid);
      passEffectsStack(game);
      const token = p.card(vacuousServant);
      expect(game.state.objects[token.objectId]!.controllerId).toBe(p.id);
      expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
      expect(q.zone("field")).toHaveLength(1);
      p.declareAttack(token, q.card(opponent));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(1);
    });
});

/** @covers f4wqesifxk-a2 */
it("Servant's Obligation stops granting Taunt after an attack that deals no damage", () => {
  const champion = enableAllTestElements(createLineageTestChampion(servantsObligation, "Ciel"));
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        field: [servantsObligation, giantTortoise],
        hand: [evasivePositioning, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [giantTortoise, giantTortoise] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    attackers = q.cards(giantTortoise),
    hero = p.card(champion);
  q.declareAttack(attackers[0]!, hero);
  q.pass();
  p.activate(evasivePositioning, {
    targets: { "target-1": [hero.objectId] },
    reservePayment: [
      { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
    ],
  });
  passEffectsStack(game);
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[hero.objectId]!.damage).toBe(0);
  q.declareAttack(attackers[1]!, p.card(giantTortoise));
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[p.card(giantTortoise).objectId]!.damage).toBe(1);
});
