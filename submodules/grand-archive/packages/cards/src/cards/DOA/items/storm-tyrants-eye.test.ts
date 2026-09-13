import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { stormTyrantsEye } from "./storm-tyrants-eye.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { fireball } from "../actions/fireball.ts";
import { arcaneSight } from "../actions/arcane-sight.ts";
import { spellshieldArcane } from "../actions/spellshield-arcane.ts";
/** @covers EQZZsiUDyl-a1 */
describe("Storm Tyrant's Eye damages for every reveal and randomizes the complete unchosen remainder", () => {
  for (const match of ["arcane", "other", "missing", "empty"] as const)
    it(`selected=${match}`, () => {
      const arcanePositions = new Set<number>();
      for (const randomSeed of [1, 2, 3, 4, 5, 6, 7, 8]) {
        const champion = createClassBonusTestChampion(stormTyrantsEye, true, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            randomSeed,
            playerOne: {
              champion,
              zones: {
                field: [stormTyrantsEye],
                hand: [spellshieldArcane, woodlandSquirrels, woodlandSquirrels],
                "main-deck":
                  match === "empty"
                    ? []
                    : [
                        woodlandSquirrels,
                        eagerPage,
                        fireball,
                        ...(match === "missing" ? [] : [arcaneSight, woodlandSquirrels]),
                      ],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [arcaneSight] } },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(stormTyrantsEye),
          hero = p.card(champion),
          deck = p.zone("main-deck"),
          arcane = deck.find((c) => c.definitionId === arcaneSight.canonicalId),
          index = arcane ? deck.findIndex((c) => c.objectId === arcane.objectId) : deck.length,
          looked = deck.slice(0, index + (arcane ? 1 : 0)),
          chosen = match === "arcane" ? arcane : looked[0];
        p.activate(spellshieldArcane, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        p.activateAbility(source, "EQZZsiUDyl-a1");
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(looked.length);
        expect(game.state.objects[hero.objectId]!.counters.enlighten ?? 0).toBe(0);
        expect(
          game.state.eventHistory.filter((e) => e.type === "card-revealed").map((e) => e.objectId),
        ).toEqual(looked.map((c) => c.objectId));
        if (chosen) {
          const before = game.state;
          for (const bad of [q.zone("main-deck")[0]!, ...deck.slice(looked.length)]) {
            expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          passEffectsStack(game);
        }
        expect(p.zone("hand")).toEqual(chosen ? [chosen] : []);
        const untouched = deck.slice(looked.length),
          remainder = looked.filter((c) => c.objectId !== chosen?.objectId);
        expect(p.zone("main-deck").slice(0, untouched.length)).toEqual(untouched);
        expect(
          p
            .zone("main-deck")
            .slice(untouched.length)
            .map((c) => c.objectId)
            .sort(),
        ).toEqual(remainder.map((c) => c.objectId).sort());
        expect(q.zone("hand")).toHaveLength(0);
        expect(() => p.activateAbility(source, "EQZZsiUDyl-a1")).toThrow();
        if (arcane && chosen?.objectId !== arcane.objectId)
          arcanePositions.add(p.zone("main-deck").findIndex((c) => c.objectId === arcane.objectId));
      }
      if (match === "other") expect(arcanePositions.size).toBeGreaterThan(1);
    });
});
