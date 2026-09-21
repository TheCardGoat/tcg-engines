import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { chainedCharge } from "./chained-charge.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { spellwardScepter } from "../items/spellward-scepter.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { strategicPlanning } from "../../DOA/actions/strategic-planning.ts";
import { luxemSight } from "../../DOA/actions/luxem-sight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { finishOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";
const champion = (matching = false) =>
  enableAllTestElements(
    createClassBonusTestChampion(chainedCharge, matching, "activation-discount"),
  );

/** @covers grlpk1akxj-a1 */
describe("Chained Charge — class discount", () => {
  for (const matching of [false, true])
    it(`costs ${matching ? 1 : 2} with class matching ${matching}`, () => {
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: champion(matching),
          zones: { hand: [chainedCharge, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion: champion(!matching), zones: { hand: [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        ally = q.card(woodlandSquirrels);
      q.activate(ally);
      const activation = game.state.stack.at(-1)!;
      q.pass();
      const cost = matching ? 1 : 2,
        payment = p
          .cards(woodlandSquirrels)
          .slice(0, cost)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.activate(chainedCharge, {
          targets: { "target-stack-item": [activation.id] },
          reservePayment: payment.slice(0, -1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(chainedCharge, {
        targets: { "target-stack-item": [activation.id] },
        reservePayment: payment,
      });
      expect(p.zone("memory")).toHaveLength(cost);
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-payment", false);
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
      expect(p.cards(chainedCharge, { zone: "graveyard" })).toHaveLength(1);
    });
});
function prepare(own: boolean, affordable: boolean, hosts = true, protectedSpell = false) {
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: own ? "playerOne" : "playerTwo",
    playerOne: {
      champion: champion(),
      zones: {
        hand: [
          chainedCharge,
          ...(own ? [luxemSight] : []),
          ...Array.from({ length: own && !affordable ? 2 : 4 }, () => woodlandSquirrels),
        ],
        field: [
          ...(hosts ? [trivariateDream, trivariateDream] : []),
          trainingSword,
          spellwardScepter,
        ],
        graveyard: [trivariateDream],
        "main-deck": [strategicPlanning],
      },
    },
    playerTwo: {
      champion: champion(),
      zones: {
        hand: [
          ...(!own ? [luxemSight] : []),
          ...Array.from({ length: affordable ? 2 : 0 }, () => woodlandSquirrels),
        ],
        field: [trivariateDream, spellwardScepter],
        "main-deck": [strategicPlanning],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    actor = own ? p : q;
  if (protectedSpell) {
    actor.activateAbility(spellwardScepter, "f6lxizyuml-a2");
    passEffectsStack(game);
  }
  const spell = actor.card(luxemSight),
    source = p.card(chainedCharge);
  actor.activate(spell);
  const activation = game.state.stack.at(-1)!;
  if (!own) q.pass();
  const reservePayment = p
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, 2)
    .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  const before = game.state;
  for (const targets of [
    [],
    [spell.objectId],
    [p.card(champion()).objectId],
    [activation.id, activation.id],
  ]) {
    expect(() =>
      p.activate(source, { reservePayment, targets: { "target-stack-item": targets } }),
    ).toThrow();
    expect(game.state).toEqual(before);
  }
  p.activate(source, { reservePayment, targets: { "target-stack-item": [activation.id] } });
  passEffectsStack(game);
  expect(game.state.decision).toMatchObject({ kind: "resolve-effect-payment", playerId: actor.id });
  expect(game.state.objects[spell.objectId]!.zone).toBe("effects-stack");
  expect(p.zone("memory")).toHaveLength(2);
  return { game, p, q, actor, spell, source };
}
/** @covers grlpk1akxj-a2 */
describe("Chained Charge — controller payment then optional loading", () => {
  for (const own of [false, true])
    for (const outcome of ["pay", "decline", "unable"] as const)
      for (const load of [false, true])
        it(`own activation ${own}, ${outcome}, load ${load}`, () => {
          const { game, p, q, actor, spell, source } = prepare(own, outcome !== "unable");
          const before = game.state;
          const reserve = actor
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 1)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          expect(() =>
            answerDecision(game, "resolve-effect-payment", { reservePayment: [] }),
          ).toThrow();
          expect(game.state).toEqual(before);
          const decision = game.state.decision;
          if (decision?.kind !== "resolve-effect-payment") throw new Error("Expected payment");
          const other = own ? q : p;
          expect(() =>
            other.execute({
              move: "answer-decision",
              decisionId: decision.id,
              stateVersion: decision.stateVersion,
              answer: false,
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          const memoryCard = p.zone("memory")[0]!;
          for (const ids of [[memoryCard.objectId], [memoryCard.objectId, memoryCard.objectId]]) {
            expect(() =>
              answerDecision(game, "resolve-effect-payment", {
                reservePayment: ids.map((cardId) => ({ kind: "card", cardId })),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          if (outcome === "pay")
            answerDecision(game, "resolve-effect-payment", { reservePayment: reserve });
          else answerDecision(game, "resolve-effect-payment", false);
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-optional-effect",
            playerId: p.id,
          });
          expect(game.state.objects[spell.objectId]!.zone).toBe("effects-stack");
          expect(actor.zone("main-deck")).toHaveLength(1);
          const host = p.cards(trivariateDream, { zone: "field" })[0]!;
          finishOptionalAetherwingLoad(game, source.objectId, host.objectId, load, [
            q.card(trivariateDream).objectId,
            p.card(trainingSword).objectId,
            p.card(trivariateDream, { zone: "graveyard" }).objectId,
            p.card(champion()).objectId,
          ]);
          expect(game.state.objects[spell.objectId]!.zone).toBe("graveyard");
          expect(actor.zone("main-deck")).toHaveLength(outcome === "pay" ? 0 : 1);
          expect(actor.cards(strategicPlanning, { zone: "hand" })).toHaveLength(
            outcome === "pay" ? 1 : 0,
          );
          expect(p.zone("memory")).toHaveLength(2 + (own && outcome === "pay" ? 1 : 0));
          expect(q.zone("memory")).toHaveLength(!own && outcome === "pay" ? 1 : 0);
          expect(game.state.stack).toHaveLength(0);
        });
  for (const pay of [false, true])
    it(`finishes without a host after payment ${pay}`, () => {
      const { game, p, source, actor } = prepare(false, true, false);
      answerDecision(
        game,
        "resolve-effect-payment",
        pay
          ? {
              reservePayment: [
                {
                  kind: "card",
                  cardId: actor.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
                },
              ],
            }
          : false,
      );
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(actor.zone("main-deck")).toHaveLength(pay ? 0 : 1);
      expect(p.zone("memory")).toHaveLength(2);
    });
  for (const load of [false, true])
    it(`offers loading ${load} even when negation is prevented`, () => {
      const { game, p, q, source, actor } = prepare(false, false, true, true);
      answerDecision(game, "resolve-effect-payment", false);
      passEffectsStack(game);
      expect(game.state.decision).toMatchObject({
        kind: "resolve-optional-effect",
        playerId: p.id,
      });
      finishOptionalAetherwingLoad(
        game,
        source.objectId,
        p.cards(trivariateDream, { zone: "field" })[0]!.objectId,
        load,
        [q.card(trivariateDream).objectId],
      );
      expect(actor.zone("main-deck")).toHaveLength(0);
      expect(actor.cards(strategicPlanning, { zone: "hand" })).toHaveLength(1);
    });
  it("rejects an activated ability while leaving that ability able to resolve", () => {
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: champion(),
        zones: { hand: [chainedCharge, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion: champion(), zones: { field: [enfeebledDagger] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = p.card(champion());
    q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
      targets: { "target-unit": [target.objectId] },
    });
    const ability = game.state.stack.at(-1)!;
    q.pass();
    const before = game.state;
    expect(() =>
      p.activate(chainedCharge, {
        targets: { "target-stack-item": [ability.id] },
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
    expect(p.zone("memory")).toHaveLength(0);
  });
});
