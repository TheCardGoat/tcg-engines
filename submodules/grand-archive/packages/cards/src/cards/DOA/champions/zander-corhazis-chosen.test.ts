import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { stillwaterPatrol } from "../allies/stillwater-patrol.ts";
import { fireball } from "../actions/fireball.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { proveChampionLineage, lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { zanderCorhazisChosen } from "./zander-corhazis-chosen.ts";

/** @covers gSNyXOQ4Iw-a1 */
describe("Zander, Corhazi's Chosen \u2014 gSNyXOQ4Iw-a1", () => {
  proveChampionLineage({
    card: zanderCorhazisChosen,
    lineageName: "Zander",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers gSNyXOQ4Iw-a2 */
describe("Zander Corhazi's Chosen's entry protection", () => {
  for (const protection of ["stealth", "spellshroud"] as const)
    it(`grants preparation and ${protection} until the next own turn begins`, () => {
      const starter = lineageTestChampion("Zander", 0);
      const opponent = createClassBonusTestChampion(fireball, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: starter,
          lineage: [lineageTestChampion("Zander", 1), lineageTestChampion("Zander", 2)],
          zones: {
            "material-deck": [zanderCorhazisChosen],
            memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [giantTortoise],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            field: protection === "stealth" ? [woodlandSquirrels, stillwaterPatrol] : [],
            hand:
              protection === "spellshroud"
                ? [
                    fireball,
                    fireball,
                    woodlandSquirrels,
                    woodlandSquirrels,
                    woodlandSquirrels,
                    woodlandSquirrels,
                  ]
                : [],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(starter),
        other = p.card(giantTortoise);
      p.materialize(zanderCorhazisChosen);
      expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(1);
      advanceToMain(game, q.id);
      const pay = () =>
        q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      if (protection === "stealth") {
        expect(() => q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), hero)).toThrow();
        expect(game.state).toEqual(before);
        q.declareAttack(stillwaterPatrol, hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(3);
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), other);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[other.objectId]!.damage).toBe(1);
        advanceToMain(game, p.id);
        advanceToMain(game, q.id);
        q.declareAttack(q.card(woodlandSquirrels, { zone: "field" }), hero);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hero.objectId]!.damage).toBe(4);
      } else {
        expect(() =>
          q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
            reservePayment: pay(),
            targets: { "target-1": [hero.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
          reservePayment: pay(),
          targets: { "target-1": [other.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[other.objectId]!.damage).toBe(1);
        advanceToMain(game, p.id);
        p.pass();
        q.activate(q.card(fireball, { zone: "hand" }), {
          reservePayment: pay(),
          targets: { "target-1": [hero.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
      }
      expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(1);
    });
});
