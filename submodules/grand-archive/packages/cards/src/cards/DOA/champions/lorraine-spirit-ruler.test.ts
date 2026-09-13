import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { swordOfAvarice } from "../weapons/sword-of-avarice.ts";
import { galatineSwordOfSunlight } from "../weapons/galatine-sword-of-sunlight.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { proveChampionLineage, lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { lorraineSpiritRuler } from "./lorraine-spirit-ruler.ts";

/** @covers n2TKqNaODR-a1 */
describe("Lorraine, Spirit Ruler \u2014 n2TKqNaODR-a1", () => {
  proveChampionLineage({
    card: lorraineSpiritRuler,
    lineageName: "Lorraine",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers n2TKqNaODR-a2 */
describe("Lorraine Spirit Ruler's Sword return with entry durability", () => {
  for (const selected of [trainingSword, galatineSwordOfSunlight, undefined])
    it(`returns ${selected?.slug ?? "nothing when no eligible Sword exists"}`, () => {
      const starter = lineageTestChampion("Lorraine", 0),
        game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion: starter,
            lineage: [lineageTestChampion("Lorraine", 1), lineageTestChampion("Lorraine", 2)],
            zones: {
              "material-deck": [lorraineSpiritRuler],
              memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              banishment: [
                curvedDagger,
                swordOfAvarice,
                ...(selected ? [trainingSword, galatineSwordOfSunlight] : []),
              ],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion: starter, zones: { banishment: [trainingSword] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.materialize(lorraineSpiritRuler);
      passEffectsStack(game);
      expect(p.zone("memory")).toHaveLength(0);
      if (!selected) {
        expect(game.state.decision).toBeNull();
        expect(p.cards(curvedDagger, { zone: "banishment" })).toHaveLength(1);
        expect(p.cards(swordOfAvarice, { zone: "banishment" })).toHaveLength(1);
        return;
      }
      const sword = p.card(selected);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      for (const illegal of [p.card(curvedDagger), p.card(swordOfAvarice), q.card(trainingSword)]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", [illegal.objectId])).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-choice", [sword.objectId]);
      passEffectsStack(game);
      const total = selected === trainingSword ? 5 : 4;
      expect(game.state.objects[sword.objectId]!.zone).toBe("field");
      expect(game.state.objects[sword.objectId]!.counters.durability).toBe(total);
      const entry = game.state.eventHistory.find(
        (e) =>
          e.type === "object-moved" &&
          e.objectId === sword.objectId &&
          e.from === "banishment" &&
          e.to === "field",
      );
      if (entry?.type !== "object-moved") throw new Error("Missing returned Sword entry");
      expect(entry.initialCounters?.durability).toBe(total);
      advanceToMain(game, p.id);
      p.declareAttack(p.card(starter), q.card(starter), { weaponIds: [sword.objectId] });
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(starter).objectId]!.damage).toBe(
        selected === trainingSword ? 1 : 2,
      );
      expect(game.state.objects[sword.objectId]!.counters.durability).toBe(total - 1);
    });
});
