import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { spiritOfSereneFire } from "../../FTC/champions/spirit-of-serene-fire.ts";
import { aliceDistortedQueen } from "./alice-distorted-queen.ts";
import { phantasmagoria } from "../masteries/phantasmagoria.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers GiQxfpKTUC-a1 */
describe("Alice, Distorted Queen entry mastery", () => {
  it("gains Phantasmagoria and puts two haunt counters on the mastery", () => {
    const starter = lineageTestChampion("Alice", 0);
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [phantasmagoria],
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: { "material-deck": [aliceDistortedQueen], memory: [woodlandSquirrels] },
      },
      playerTwo: { champion: lineageTestChampion("Other", 0) },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    p.materialize(aliceDistortedQueen);
    expect(game.state.players[p.id]!.mastery).toBeUndefined();
    passEffectsStack(game);
    expect(game.state.players[p.id]!.mastery?.counters["named:haunt"]).toBe(2);
    expect(game.state.objects[p.card(starter).objectId]!.counters["named:haunt"] ?? 0).toBe(0);
    expect(game.state.players[q.id]!.mastery).toBeUndefined();
  });
});

/** @covers GiQxfpKTUC-a2 */
describe("Alice, Distorted Queen lineage release", () => {
  for (const previousLevel of [1, 2]) {
    for (const { damage, releaseBase } of [
      ...[0, 3, 8].map((damage) => ({ damage, releaseBase: false })),
      { damage: 14, releaseBase: true },
    ]) {
      it(`counts remaining lineage at level ${previousLevel + 1} with ${damage} damage and base release ${releaseBase}`, () => {
        const starter = releaseBase ? spiritOfSereneFire : lineageTestChampion("Alice", 0);
        const middle = lineageTestChampion("Alice", 2);
        const successor = lineageTestChampion("Alice", previousLevel + 1);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: starter,
            lineage: previousLevel === 1 ? [aliceDistortedQueen] : [aliceDistortedQueen, middle],
            zones: {
              "material-deck": [successor],
              memory: Array.from({ length: previousLevel + 1 }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: lineageTestChampion("Opponent", 0),
            zones: {
              field: Array.from({ length: damage }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(starter, { zone: "field" });
        const alice = p.card(aliceDistortedQueen, { zone: "inner-lineage" });
        p.materialize(successor);
        passEffectsStack(game);
        advanceToMain(game, q.id);
        for (const squirrel of q.cards(woodlandSquirrels, { zone: "field" })) {
          q.declareAttack(squirrel, hero);
          game.resolveCombatWithoutRetaliation();
        }
        advanceToMain(game, p.id);
        const before = game.state;
        expect(() => q.activateAbility(alice, "GiQxfpKTUC-a2")).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(alice, "GiQxfpKTUC-a2");
        expect(game.state.objects[alice.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        if (releaseBase) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
          p.activateAbility(hero, `${spiritOfSereneFire.canonicalId}-a2`);
          expect(game.state.stack).toHaveLength(2);
        }
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          Math.max(0, damage - (previousLevel + 3) - (releaseBase ? 5 : 0)),
        );
        expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(successor.canonicalId);
        const after = game.state;
        expect(() => p.activateAbility(alice, "GiQxfpKTUC-a2")).toThrow();
        expect(game.state).toEqual(after);
      });
    }
  }
});
