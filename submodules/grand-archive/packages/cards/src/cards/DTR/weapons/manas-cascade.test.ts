import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { sovereignSanctuary } from "../phantasias/sovereign-sanctuary.ts";
import { manasCascade } from "./manas-cascade.ts";
import { trivariateDream } from "./trivariate-dream.ts";
import { chainedCharge } from "../actions/chained-charge.ts";
import { resonantAether } from "../actions/resonant-aether.ts";
import { backdash } from "../actions/backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { idleThoughts } from "../../DOA/actions/idle-thoughts.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

function prepare(water: number, matching: boolean, seed = 1, memoryCount = 3, preventHit = false) {
  const hero = enableAllTestElements(
    createLineageTestChampion(manasCascade, matching ? "Diana" : "Other"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    randomSeed: seed,
    playerOne: {
      champion: hero,
      zones: {
        field: [manasCascade, trivariateDream, trainingSword],
        hand: [
          ...Array.from({ length: water + 1 }, () => chainedCharge),
          ...Array.from({ length: 4 - water }, () => resonantAether),
          spiritsBlessing,
          ...Array.from({ length: 20 }, () => woodlandSquirrels),
        ],
        memory: [idleThoughts],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: {
      champion: hero,
      zones: {
        field: [
          giantTortoise,
          ...(preventHit ? [sovereignSanctuary, sovereignSanctuary, sovereignSanctuary] : []),
        ],
        memory: [woodlandSquirrels, idleThoughts, backdash].slice(0, memoryCount),
        hand: [backdash],
        "main-deck": [woodlandSquirrels],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    weapon = p.card(manasCascade);
  const payment = () => [
    { kind: "card" as const, cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
  ];
  const waters = p.cards(chainedCharge);
  for (const [index, charge] of waters.entries()) {
    p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
    const target = game.state.stack.at(-1)!;
    p.activate(charge, {
      reservePayment: payment(),
      targets: { "target-stack-item": [target.id] },
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [
      index < water ? weapon.objectId : p.card(trivariateDream).objectId,
    ]);
    passEffectsStack(game);
  }
  const normals = p.cards(resonantAether);
  const load = (card: (typeof normals)[number]) => {
    p.activate(card, { reservePayment: payment() });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
    passEffectsStack(game);
  };
  for (const normal of normals.slice(0, 3 - water)) load(normal);
  return { game, p, q, hero, weapon, waters, normals, load, payment };
}

/** @covers xywyzv14iv-a1 */
describe("Mana's Cascade - water intent threshold and champion-hit memory banishment", () => {
  for (const matching of [false, true])
    for (const water of [0, 1, 2, 3])
      for (const championHit of [false, true])
        it(`Diana=${matching}, water=${water}, champion=${championHit}`, () => {
          const { game, p, q, hero, weapon, waters, normals, load, payment } = prepare(
            water,
            matching,
          );
          const target = championHit ? q.card(hero) : q.card(giantTortoise);
          const memory = q.zone("memory"),
            ownMemory = p.zone("memory"),
            hand = q.zone("hand");
          p.declareAttack(p.card(hero), target, { weaponIds: [weapon.objectId] });
          expect(q.zone("memory")).toEqual(memory);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          for (const card of waters.slice(0, water))
            expect(game.state.objects[card.objectId]!.zone).toBe("intent");
          expect(game.state.objects[waters.at(-1)!.objectId]!.zone).toBe("loaded");
          game.resolveCombatWithoutRetaliation();
          const enabled = matching && water >= 2;
          const damage = 4 + (enabled ? 1 : 0);
          expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          expect(q.zone("memory")).toHaveLength(3 - (enabled && championHit ? 1 : 0));
          const banished = memory.filter(
            (c) => game.state.objects[c.objectId]!.zone === "banishment",
          );
          expect(banished).toHaveLength(enabled && championHit ? 1 : 0);
          expect(p.zone("memory")).toEqual(ownMemory);
          expect(q.zone("hand")).toEqual(hand);
          expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(2);
          for (const card of [...waters.slice(0, water), ...normals.slice(0, 3 - water)])
            expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
          const memoryAfter = q.zone("memory");
          p.activate(spiritsBlessing, {
            reservePayment: payment(),
            costSelections: [[p.card(trainingSword).objectId]],
          });
          passEffectsStack(game);
          load(normals.at(-1)!);
          p.declareAttack(p.card(hero), q.card(hero), { weaponIds: [weapon.objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(
            (championHit ? damage : 0) + 2,
          );
          expect(q.zone("memory")).toEqual(memoryAfter);
          expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(1);
        });

  for (const seed of [1, 2, 3])
    for (const count of [0, 1, 3])
      it(`random memory selection seed=${seed}, memory=${count}`, () => {
        const { game, p, q, hero, weapon } = prepare(2, true, seed, count);
        const before = q.zone("memory");
        p.declareAttack(p.card(hero), q.card(hero), { weaponIds: [weapon.objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(5);
        expect(q.zone("memory")).toHaveLength(Math.max(0, count - 1));
        expect(
          before.filter((c) => game.state.objects[c.objectId]!.zone === "banishment"),
        ).toHaveLength(Math.min(1, count));
        expect(game.state.decision).toBeFalsy();
        expect(game.state.stack).toHaveLength(0);
      });
  it("does not banish memory when all champion combat damage is prevented", () => {
    const { game, p, q, hero, weapon } = prepare(2, true, 1, 3, true);
    const memory = q.zone("memory");
    p.declareAttack(p.card(hero), q.card(hero), { weaponIds: [weapon.objectId] });
    for (let step = 0; step < 128 && game.state.combat; step++) {
      const decision = game.state.decision,
        wait = game.waitState();
      if (decision?.kind === "choose-replacement")
        answerDecision(game, "choose-replacement", decision.candidateIds[0]);
      else if (decision?.kind === "choose-retaliators")
        answerDecision(game, "choose-retaliators", []);
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected combat state ${wait.kind}`);
    }
    expect(game.state.combat).toBeFalsy();
    expect(game.state.objects[q.card(hero).objectId]!.damage).toBe(0);
    expect(q.zone("memory")).toEqual(memory);
    expect(q.zone("banishment")).toHaveLength(0);
    expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(2);
  });
});
