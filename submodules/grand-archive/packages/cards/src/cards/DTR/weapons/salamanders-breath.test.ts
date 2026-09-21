import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { twoOfHearts } from "../allies/two-of-hearts.ts";
import { salamandersBreath } from "./salamanders-breath.ts";
import { trivariateDream } from "./trivariate-dream.ts";
import { resonantAether } from "../actions/resonant-aether.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
function prepare(count: number, matching = true, fires = 4, fireAlly = false) {
  const champion = enableAllTestElements(
    createLineageTestChampion(salamandersBreath, matching ? "Diana" : "Other"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [salamandersBreath, trivariateDream, trainingSword],
        hand: [
          spiritsBlessing,
          sparkAlight,
          ...Array.from({ length: count + 3 }, () => resonantAether),
          ...Array.from({ length: 10 }, () => woodlandSquirrels),
        ],
        graveyard: [
          ...Array.from({ length: fires }, () => sparkAlight),
          ...(fireAlly ? [twoOfHearts] : []),
          woodlandSquirrels,
        ],
        banishment: [sparkAlight],
        memory: [sparkAlight],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { graveyard: [sparkAlight] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    weapon = p.card(salamandersBreath),
    charges = p.cards(resonantAether);
  const payment = () => [
    { kind: "card" as const, cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
  ];
  const load = (card: (typeof charges)[number], host = weapon) => {
    p.activate(card, { reservePayment: payment() });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [host.objectId]);
    passEffectsStack(game);
  };
  for (const [index, card] of charges.slice(0, count + 2).entries())
    load(card, index < count ? weapon : p.card(trivariateDream));
  return { game, p, q, champion, weapon, charges, load, payment };
}

/** @covers mob9nu6lal-a1 */
describe("Salamander's Breath - optional fire banishment bounded by attacking Aethercharges", () => {
  for (const count of [1, 2, 3])
    for (const chosenCount of Array.from(new Set([0, 1, count])))
      it(`${count} attacking charges, banish ${chosenCount}`, () => {
        const { game, p, q, champion, weapon, charges, load, payment } = prepare(count);
        const fires = p.cards(sparkAlight, { zone: "graveyard" }),
          target = q.card(champion);
        p.declareAttack(p.card(champion), target, { weaponIds: [weapon.objectId] });
        expect(p.cards(sparkAlight, { zone: "graveyard" })).toHaveLength(4);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        const before = game.state;
        for (const ids of [
          [q.card(sparkAlight).objectId],
          [p.card(sparkAlight, { zone: "hand" }).objectId],
          [p.card(sparkAlight, { zone: "memory" }).objectId],
          [p.card(sparkAlight, { zone: "banishment" }).objectId],
          [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
          [fires[0]!.objectId, fires[0]!.objectId],
          fires.slice(0, count + 1).map((c) => c.objectId),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(
          game,
          "resolve-effect-choice",
          fires.slice(0, chosenCount).map((c) => c.objectId),
        );
        passEffectsStack(game);
        expect(p.cards(sparkAlight, { zone: "graveyard" })).toHaveLength(4 - chosenCount);
        expect(p.cards(sparkAlight, { zone: "banishment" })).toHaveLength(1 + chosenCount);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        game.resolveCombatWithoutRetaliation();
        const first = 1 + count + chosenCount;
        expect(game.state.objects[target.objectId]!.damage).toBe(first);
        for (const card of charges.slice(0, count))
          expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
        for (const card of charges.slice(count, count + 2))
          expect(game.state.objects[card.objectId]!.zone).toBe("loaded");
        p.activate(spiritsBlessing, {
          reservePayment: payment(),
          costSelections: [[p.card(trainingSword).objectId]],
        });
        passEffectsStack(game);
        load(charges.at(-1)!);
        p.declareAttack(p.card(champion), target, { weaponIds: [weapon.objectId] });
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(first + 2);
        expect(p.cards(sparkAlight, { zone: "banishment" })).toHaveLength(1 + chosenCount);
      });

  for (const matching of [false, true])
    for (const fires of [0, 4])
      it(`Diana=${matching}, available fire=${fires}, decline if offered`, () => {
        const { game, p, q, champion, weapon } = prepare(2, matching, fires);
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          expect(matching).toBe(true);
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
        expect(p.cards(sparkAlight, { zone: "graveyard" })).toHaveLength(fires);
        expect(p.cards(sparkAlight, { zone: "banishment" })).toHaveLength(1);
      });
  for (const spells of [0, 1, 2])
    it(`can banish a fire ally and ${spells} fire spells, even below the three-charge limit`, () => {
      const { game, p, q, champion, weapon } = prepare(3, true, spells, true);
      const selected = [
        p.card(twoOfHearts, { zone: "graveyard" }),
        ...p.cards(sparkAlight, { zone: "graveyard" }),
      ];
      p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapon.objectId] });
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);
      answerDecision(
        game,
        "resolve-effect-choice",
        selected.map((c) => c.objectId),
      );
      passEffectsStack(game);
      for (const card of selected)
        expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(5 + spells);
      expect(p.card(woodlandSquirrels, { zone: "graveyard" })).toBeDefined();
    });
});
