import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { piercingAetherfuel } from "./piercing-aetherfuel.ts";
import { resonantAether } from "./resonant-aether.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { sovereignSanctuary } from "../phantasias/sovereign-sanctuary.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
function prepare(matching = true, fires = 2, drawFire = false) {
  const hero = enableAllTestElements(
    createClassBonusTestChampion(piercingAetherfuel, matching, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: hero,
      zones: {
        hand: [
          piercingAetherfuel,
          sparkAlight,
          resonantAether,
          resonantAether,
          spiritsBlessing,
          spiritsBlessing,
          ...Array.from({ length: 10 }, () => woodlandSquirrels),
        ],
        field: [
          trivariateDream,
          trivariateDream,
          trainingSword,
          trainingSword,
          woodlandSquirrels,
          enfeebledDagger,
        ],
        graveyard: [...Array.from({ length: fires }, () => sparkAlight), woodlandSquirrels],
        banishment: [sparkAlight],
        memory: [sparkAlight],
        "main-deck": Array.from({ length: 4 }, () => (drawFire ? sparkAlight : woodlandSquirrels)),
      },
    },
    playerTwo: {
      champion: hero,
      zones: {
        field: [sovereignSanctuary],
        graveyard: [sparkAlight],
        hand: [sovereignSanctuary, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    source = p.card(piercingAetherfuel),
    top = p.zone("main-deck")[0]!;
  expect(top.definitionId).toBe((drawFire ? sparkAlight : woodlandSquirrels).canonicalId);
  const payment = (n = 1) =>
    p
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, n)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const weapon = p.cards(trivariateDream, { zone: "field" })[0]!;
  const load = () => {
    p.activate(p.cards(resonantAether, { zone: "hand" })[0]!, { reservePayment: payment() });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
    passEffectsStack(game);
  };
  const attack = () => {
    p.declareAttack(p.card(hero), q.card(hero), { weaponIds: [weapon.objectId] });
    if (game.state.decision?.kind === "order-triggered-abilities")
      answerDecision(game, "order-triggered-abilities", game.state.decision.pendingTriggerIds);
    game.resolveCombatWithoutRetaliation();
  };
  const wake = () => {
    p.activate(p.cards(spiritsBlessing, { zone: "hand" })[0]!, {
      reservePayment: payment(),
      costSelections: [[p.cards(trainingSword, { zone: "field" })[0]!.objectId]],
    });
    passEffectsStack(game);
  };
  return { game, p, q, source, top, payment, weapon, load, attack, wake, hero };
}
/** @covers vo5q7letxz-a1 */
describe("Piercing Aetherfuel — draw before hand discard", () => {
  for (const drawFire of [false, true])
    for (const discardNew of [false, true])
      it(`draw fire ${drawFire}, discard new ${discardNew}`, () => {
        const { game, p, q, source, top, payment } = prepare(false, 2, drawFire);
        const before = game.state;
        expect(() => p.activate(source)).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment: payment() });
        expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
        passEffectsStack(game);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-choice",
          playerId: p.id,
        });
        expect(game.state.objects[top.objectId]!.zone).toBe("hand");
        expect(p.zone("main-deck")).toHaveLength(3);
        const pending = game.state,
          other = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .find((c) => c.objectId !== top.objectId)!;
        for (const ids of [
          [],
          [other.objectId, other.objectId],
          [other.objectId, top.objectId],
          [p.card(sparkAlight, { zone: "memory" }).objectId],
          [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
          [q.card(sparkAlight, { zone: "graveyard" }).objectId],
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
          expect(game.state).toEqual(pending);
        }
        const discarded = discardNew ? top : other;
        answerDecision(game, "resolve-effect-choice", [discarded.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[discarded.objectId]!.zone).toBe("graveyard");
        if (!discardNew) expect(game.state.objects[top.objectId]!.zone).toBe("hand");
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(p.zone("memory")).toHaveLength(2);
        expect(q.zone("memory")).toHaveLength(0);
      });
});
/** @covers vo5q7letxz-a2 */
describe("Piercing Aetherfuel — optional exact-two banishment and next Aetherwing attack", () => {
  for (const matching of [false, true])
    for (const fires of [0, 1, 2, 3])
      for (const accept of [false, true])
        it(`class ${matching}, fire cards ${fires}, accept ${accept}`, () => {
          const { game, p, q, source, top, payment, load, attack, hero } = prepare(matching, fires);
          load();
          p.activate(source, { reservePayment: payment() });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [top.objectId]);
          passEffectsStack(game);
          const enabled = matching && fires >= 2;
          if (enabled) {
            expect(game.state.decision).toMatchObject({
              kind: "resolve-optional-effect",
              playerId: p.id,
            });
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
            if (accept && fires === 3) {
              expect(game.state.decision?.kind).toBe("resolve-effect-choice");
              const available = p.cards(sparkAlight, { zone: "graveyard" }),
                pending = game.state;
              const invalids = [
                [],
                [available[0]!.objectId],
                [available[0]!.objectId, available[0]!.objectId],
                [available[0]!.objectId, p.card(sparkAlight, { zone: "hand" }).objectId],
                [available[0]!.objectId, p.card(sparkAlight, { zone: "memory" }).objectId],
                [available[0]!.objectId, p.card(sparkAlight, { zone: "banishment" }).objectId],
                [available[0]!.objectId, q.card(sparkAlight, { zone: "graveyard" }).objectId],
                [
                  available[0]!.objectId,
                  p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
                ],
                [available[0]!.objectId, source.objectId],
              ];
              if (fires === 3) invalids.push(available.map((c) => c.objectId));
              for (const ids of invalids) {
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(pending);
              }
              answerDecision(
                game,
                "resolve-effect-choice",
                available.slice(0, 2).map((c) => c.objectId),
              );
              expect(game.state.stack).toHaveLength(0);
              passEffectsStack(game);
            }
          } else expect(game.state.decision).toBeNull();
          expect(p.cards(sparkAlight, { zone: "graveyard" })).toHaveLength(
            fires - (enabled && accept ? 2 : 0),
          );
          expect(p.cards(sparkAlight, { zone: "banishment" })).toHaveLength(
            1 + (enabled && accept ? 2 : 0),
          );
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          attack();
          expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(enabled && accept ? 2 : 0);
        });
  it("can use a fire card discarded by its first paragraph to complete the pair", () => {
    const { game, p, q, source, top, payment, load, attack, hero } = prepare(true, 1, true);
    load();
    p.activate(source, { reservePayment: payment() });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [top.objectId]);
    passEffectsStack(game);
    expect(p.cards(sparkAlight, { zone: "graveyard" })).toHaveLength(2);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);

    passEffectsStack(game);
    attack();
    expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(2);
  });
  for (const preceding of ["none", "ally", "other-weapon", "next-turn"] as const)
    it(`next qualifying attack, preceding=${preceding}`, () => {
      const { game, p, q, source, top, payment, load, attack, wake, hero } = prepare();
      load();
      p.activate(source, { reservePayment: payment() });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [top.objectId]);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);

      passEffectsStack(game);
      p.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
        targets: { "target-unit": [q.card(hero).objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(0);
      if (preceding === "ally") {
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), q.card(hero));
        game.resolveCombatWithoutRetaliation();
      }
      if (preceding === "other-weapon") {
        p.declareAttack(p.card(hero), q.card(hero), {
          weaponIds: [p.cards(trainingSword, { zone: "field" })[0]!.objectId],
        });
        game.resolveCombatWithoutRetaliation();
        wake();
      }
      if (preceding === "next-turn") {
        advanceToMain(game, q.id);
        q.activate(q.card(sovereignSanctuary, { zone: "hand" }), {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        advanceToMain(game, p.id);
      }
      expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(0);
      attack();
      const expected = preceding === "next-turn" ? 0 : 2;
      expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(expected);
      wake();
      load();
      attack();
      expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(expected);
    });
});
