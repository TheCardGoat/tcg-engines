import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { blazingCindercharge } from "./blazing-cindercharge.ts";
import { resonantAether } from "./resonant-aether.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

type Leveling = "none" | "this-turn" | "previous-turn" | "level-modifier";
function fixture(matching: boolean, leveling: Leveling, hosts = true, graveCount = 3) {
  const base = enableAllTestElements(
    createClassBonusTestChampion(blazingCindercharge, matching, "activation-discount"),
  );
  const starter = leveling === "level-modifier" ? grantTestChampionLevel(base, 2) : base;
  const next = lineageTestChampion("Successor", 1);
  const successor = enableAllTestElements({
    ...next,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...requireSingleFace(next),
        typeLine: requireSingleFace(base).typeLine,
      },
    },
  });
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion: starter,
      zones: {
        hand: [blazingCindercharge, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
        memory: [woodlandSquirrels],
        field: [
          trainingSword,
          woodlandSquirrels,
          ...(hosts ? [trivariateDream, trivariateDream] : []),
        ],
        graveyard: [
          ...Array.from({ length: graveCount }, () => blazingCindercharge),
          sparkAlight,
          resonantAether,
        ],
        banishment: [blazingCindercharge],
        "material-deck": [successor],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: base,
      zones: {
        field: [trivariateDream, woodlandSquirrels],
        graveyard: [blazingCindercharge],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const hero = p.card(starter),
    opponent = q.card(base);
  if (leveling === "this-turn" || leveling === "previous-turn") {
    p.materialize(successor);
    passEffectsStack(game);
    expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(successor.canonicalId);
  }
  advanceToMain(game, p.id);
  if (leveling === "previous-turn") advanceToMain(game, p.id, game.state.turn.number);
  return { game, p, q, hero, opponent };
}
function payment(game: GrandArchiveTestEngine, n = 3) {
  return game
    .player("player-one")
    .cards(woodlandSquirrels, { zone: "hand" })
    .slice(0, n)
    .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
}

/** @covers e48axaql3n-a1 */
describe("Blazing Cindercharge — champion damage and activation legality", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      it(`class=${matching}, own target=${own}`, () => {
        const { game, p, q, hero, opponent } = fixture(matching, "none");
        const source = p.card(blazingCindercharge, { zone: "hand" }),
          target = own ? hero : opponent;
        const before = game.state;
        for (const targets of [
          [],
          [p.card(woodlandSquirrels, { zone: "field" }).objectId],
          [q.card(woodlandSquirrels, { zone: "field" }).objectId],
          [p.card(trainingSword).objectId],
          [hero.objectId, opponent.objectId],
          [target.objectId, target.objectId],
        ]) {
          expect(() =>
            p.activate(source, { reservePayment: payment(game), targets: { "target-1": targets } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(source, {
            reservePayment: payment(game, 2),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        const paid = p.zone("memory").length;
        p.activate(source, {
          reservePayment: payment(game),
          targets: { "target-1": [target.objectId] },
        });
        expect(p.zone("memory")).toHaveLength(paid + 3);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(3);
        expect(game.state.objects[(own ? opponent : hero).objectId]!.damage).toBe(0);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      });
});

/** @covers e48axaql3n-a2 */
describe("Blazing Cindercharge — conditional source and graveyard loading", () => {
  for (const matching of [false, true])
    for (const leveling of ["none", "this-turn", "previous-turn", "level-modifier"] as const)
      for (const accept of [false, true]) run(matching, leveling, accept, 2);
  for (const selected of [0, 1]) run(true, "this-turn", true, selected);
  run(true, "this-turn", true, 0, true, 0);
  run(true, "this-turn", true, 0, false);

  function run(
    matching: boolean,
    leveling: Leveling,
    accept: boolean,
    count: number,
    hosts = true,
    graveCount = 3,
  ) {
    it(`class=${matching}, level=${leveling}, accept=${accept}, selected=${count}, hosts=${hosts}, grave=${graveCount}`, () => {
      const { game, p, q, hero, opponent } = fixture(matching, leveling, hosts, graveCount);
      const source = p.card(blazingCindercharge, { zone: "hand" }),
        graves = p.cards(blazingCindercharge, { zone: "graveyard" });
      p.activate(source, {
        reservePayment: payment(game),
        targets: { "target-1": [opponent.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[opponent.objectId]!.damage).toBe(3);
      const eligible = matching && leveling === "this-turn";
      if (eligible && game.state.decision?.kind === "resolve-optional-effect") {
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        answerDecision(game, "resolve-optional-effect", accept);
        passEffectsStack(game);
      }
      if (eligible && accept && !hosts && game.state.decision?.kind === "resolve-effect-choice") {
        answerDecision(game, "resolve-effect-choice", []);
        passEffectsStack(game);
      }
      if (!eligible || !accept || !hosts) {
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(p.zone("loaded")).toHaveLength(0);
        expect(p.cards(blazingCindercharge, { zone: "graveyard" })).toHaveLength(graveCount + 1);
        return;
      }
      expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
      const invalid = [
        [source.objectId],
        [p.card(blazingCindercharge, { zone: "banishment" }).objectId],
        [q.card(blazingCindercharge, { zone: "graveyard" }).objectId],
        [p.card(sparkAlight).objectId],
        [p.card(resonantAether).objectId],
      ];
      if (graves.length >= 3)
        invalid.push(
          graves.map((c) => c.objectId),
          [graves[0]!.objectId, graves[0]!.objectId],
        );
      for (const choice of invalid) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", choice)).toThrow();
        expect(game.state).toEqual(before);
      }
      if (graveCount > 0)
        answerDecision(
          game,
          "resolve-effect-choice",
          graves.slice(0, count).map((c) => c.objectId),
        );
      const weapons = p.cards(trivariateDream, { zone: "field" }),
        weapon = weapons[0]!;
      for (const choice of [
        [],
        [q.card(trivariateDream).objectId],
        [p.card(trainingSword).objectId],
        [hero.objectId],
        weapons.map((c) => c.objectId),
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", choice)).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
      passEffectsStack(game);
      expect(p.zone("loaded")).toHaveLength(count + 1);
      for (const card of [source, ...graves.slice(0, count)])
        expect(game.state.objects[card.objectId]!.zone).toBe("loaded");
      expect(p.cards(blazingCindercharge, { zone: "graveyard" })).toHaveLength(graveCount - count);
      const before = game.state;
      expect(() =>
        p.declareAttack(hero, opponent, { weaponIds: [weapons[1]!.objectId] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.declareAttack(hero, opponent, { weaponIds: [weapon.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponent.objectId]!.damage).toBe(
        3 + 2 + count + (count === 2 ? 3 : 0),
      );
      expect(p.zone("loaded")).toHaveLength(0);
      for (const card of [source, ...graves.slice(0, count)])
        expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
    });
  }
});

/** @covers e48axaql3n-a1 */
it("rejects the slow action during the opponent's turn without paying", () => {
  const { game, p, q, opponent } = fixture(true, "none");
  advanceToMain(game, q.id);
  q.pass();
  const before = game.state;
  expect(() =>
    p.activate(blazingCindercharge, {
      reservePayment: payment(game),
      targets: { "target-1": [opponent.objectId] },
    }),
  ).toThrow();
  expect(game.state).toEqual(before);
});
