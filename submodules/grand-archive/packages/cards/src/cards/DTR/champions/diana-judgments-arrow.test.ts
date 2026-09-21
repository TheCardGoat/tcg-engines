import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { dianaJudgmentsArrow } from "./diana-judgments-arrow.ts";
import { backdash } from "../actions/backdash.ts";
import { blazingCindercharge } from "../actions/blazing-cindercharge.ts";
import { chainedCharge } from "../actions/chained-charge.ts";
import { legionsWingspan } from "../weapons/legions-wingspan.ts";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { idleThoughts } from "../../DOA/actions/idle-thoughts.ts";
import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers wiztyu6o24-a1 */
describe("Diana Judgment's Arrow — Diana Lineage", () => {
  proveChampionLineage({
    card: dianaJudgmentsArrow,
    lineageName: "Diana",
    level: 2,
    memoryCost: 2,
  });
});

/** @covers wiztyu6o24-a2 */
describe("Diana Judgment's Arrow — entry loads hand and memory then draws memory", () => {
  for (const selection of [
    "zero",
    "one-hand",
    "one-memory",
    "two-hand",
    "two-memory",
    "mixed",
  ] as const)
    run(selection, true, true);
  run("mixed", false, true);
  run("zero", true, false);
  function run(
    selection: "zero" | "one-hand" | "one-memory" | "two-hand" | "two-memory" | "mixed",
    hosts: boolean,
    charges: boolean,
  ) {
    it(`selection=${selection}, hosts=${hosts}, available charges=${charges}`, () => {
      const starter = lineageTestChampion("Diana", 0),
        previous = lineageTestChampion("Diana", 1),
        foe = lineageTestChampion("Opponent", 0);
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: starter,
          lineage: [previous],
          zones: {
            "material-deck": [dianaJudgmentsArrow],
            field: [trainingSword, ...(hosts ? [legionsWingspan, trivariateDream] : [])],
            hand: [
              woodlandSquirrels,
              ...(charges ? [blazingCindercharge, blazingCindercharge, blazingCindercharge] : []),
            ],
            memory: [
              woodlandSquirrels,
              ...(charges ? [chainedCharge, chainedCharge, chainedCharge] : []),
            ],
            graveyard: [idleThoughts, idleThoughts, blazingCindercharge],
            banishment: [chainedCharge],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: foe,
          zones: { hand: [blazingCindercharge], memory: [chainedCharge], field: [legionsWingspan] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter),
        source = p.card(dianaJudgmentsArrow, { zone: "material-deck" });
      const hand = p.cards(blazingCindercharge, { zone: "hand" }),
        memory = p.cards(chainedCharge, { zone: "memory" });
      const selected =
        selection === "zero"
          ? []
          : selection === "one-hand"
            ? hand.slice(0, 1)
            : selection === "one-memory"
              ? memory.slice(0, 1)
              : selection === "two-hand"
                ? hand.slice(0, 2)
                : selection === "two-memory"
                  ? memory.slice(0, 2)
                  : [hand[0]!, memory[0]!];
      const before = game.state,
        floating = p.cards(idleThoughts, { zone: "graveyard" }).map((c) => c.objectId);
      expect(() =>
        p.materialize(source, { floatingMemoryCardIds: [...floating, floating[0]!] }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.materialize(source, { floatingMemoryCardIds: floating });
      expect(p.cards(idleThoughts, { zone: "banishment" })).toHaveLength(2);
      expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(previous.canonicalId);
      expect(p.zone("loaded")).toHaveLength(0);
      expect(p.zone("main-deck")).toHaveLength(8);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(
        dianaJudgmentsArrow.canonicalId,
      );
      if (charges) {
        const invalid = [
          [q.card(blazingCindercharge).objectId],
          [q.card(chainedCharge).objectId],
          [p.card(blazingCindercharge, { zone: "graveyard" }).objectId],
          [p.card(chainedCharge, { zone: "banishment" }).objectId],
          [p.card(woodlandSquirrels, { zone: "hand" }).objectId],
          hand.map((c) => c.objectId),
          [hand[0]!.objectId, hand[0]!.objectId],
        ];
        for (const ids of invalid) {
          const pending = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
          expect(game.state).toEqual(pending);
        }
        expect(p.zone("main-deck")).toHaveLength(8);
        answerDecision(
          game,
          "resolve-effect-choice",
          selected.map((c) => c.objectId),
        );
        if (selected.length && hosts) {
          const weapon = p.card(legionsWingspan),
            other = p.card(trivariateDream);
          expect(p.zone("loaded")).toHaveLength(0);
          expect(p.zone("main-deck")).toHaveLength(8);
          for (const ids of [
            [],
            [q.card(legionsWingspan).objectId],
            [p.card(trainingSword).objectId],
            [hero.objectId],
            [weapon.objectId, other.objectId],
          ]) {
            const pending = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(pending);
          }
          answerDecision(game, "resolve-effect-choice", [weapon.objectId]);
        }
        passEffectsStack(game);
      }
      const loaded = hosts ? selected.length : 0;
      expect(game.state.decision).toBeNull();
      expect(p.zone("loaded")).toHaveLength(loaded);
      expect(p.zone("main-deck")).toHaveLength(8 - loaded);
      const fromMemory = selected.filter((c) =>
        memory.some((m) => m.objectId === c.objectId),
      ).length;
      expect(p.zone("memory")).toHaveLength(1 + memory.length - (hosts ? fromMemory : 0) + loaded);
      expect(p.zone("hand")).toHaveLength(
        1 + hand.length - (hosts ? selected.length - fromMemory : 0),
      );
      expect(q.zone("hand")).toHaveLength(1);
      expect(q.zone("memory")).toHaveLength(1);
      if (loaded) {
        for (const card of selected) expect(game.state.objects[card.objectId]!.zone).toBe("loaded");
        advanceToMain(game, p.id);
        const prior = game.state;
        expect(() =>
          p.declareAttack(hero, q.card(foe), { weaponIds: [p.card(trivariateDream).objectId] }),
        ).toThrow();
        expect(game.state).toEqual(prior);
        p.declareAttack(hero, q.card(foe), { weaponIds: [p.card(legionsWingspan).objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(foe).objectId]!.damage).toBe(1 + loaded);
        for (const card of selected)
          expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
      }
    });
  }
});

/** @covers wiztyu6o24-a3 */
describe("Diana Judgment's Arrow — inherited Ranged 1", () => {
  for (const position of ["material-deck", "current", "successor"] as const)
    for (const distant of [false, true])
      it(`position=${position}, distant=${distant}`, () => {
        const starter = lineageTestChampion("Diana", 0),
          opponent = lineageTestChampion("Opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage: [
              lineageTestChampion("Diana", 1),
              ...(position === "material-deck"
                ? []
                : [
                    dianaJudgmentsArrow,
                    ...(position === "successor" ? [lineageTestChampion("Diana", 3)] : []),
                  ]),
            ],
            zones: {
              "material-deck": position === "material-deck" ? [dianaJudgmentsArrow] : [],
              field: [trainingSword, woodlandSquirrels],
              hand: [backdash, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion: opponent },
        });
        const p = game.player("player-one"),
          hero = p.card(starter),
          target = game.player("player-two").card(opponent);
        if (distant) {
          p.activate(backdash, {
            targets: { "target-1": [hero.objectId] },
            reservePayment: [
              { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
          });
          passEffectsStack(game);
        }
        p.declareAttack(hero, target, { weaponIds: [p.card(trainingSword).objectId] });
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          distant && position !== "material-deck" ? 2 : 1,
        );
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          distant && position !== "material-deck" ? 3 : 2,
        );
      });
});
