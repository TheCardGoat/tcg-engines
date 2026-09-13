import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { spiritBladeAscension } from "./spirit-blade-ascension.ts";
import { spiritsBlessing } from "./spirits-blessing.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { curvedDagger } from "../weapons/curved-dagger.ts";
import { sealedBladeDoa } from "../weapons/sealed-blade-doa.ts";
import { excaliburCursedSword } from "../weapons/excalibur-cursed-sword.ts";
/** @covers N0ipz8UWwf-a1 @covers N0ipz8UWwf-a2 */
describe("Ascension returns an owned Sword as payment and puts a chosen regalia Sword directly onto the field", () => {
  for (const giveAway of [false, true])
    for (const zone of ["material-deck", "banishment"] as const)
      it(`owned payment controlled by opponent=${giveAway}, choose from ${zone}`, () => {
        const champion = createClassBonusTestChampion(spiritsBlessing, true, "activation-discount"),
          game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            playerOne: {
              champion,
              zones: {
                hand: [spiritBladeAscension, woodlandSquirrels],
                field: [curvedDagger, woodlandSquirrels],
                "material-deck": [
                  excaliburCursedSword,
                  ...(zone === "material-deck" ? [sealedBladeDoa] : []),
                ],
                banishment: [curvedDagger, ...(zone === "banishment" ? [sealedBladeDoa] : [])],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [trainingSword],
                "material-deck": [trainingSword],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(excaliburCursedSword);
        p.materialize(source);
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [giveAway ? q.id : p.id]);
        passEffectsStack(game);
        advanceToMain(game, p.id);
        expect(game.state.objects[source.objectId]!.controllerId).toBe(giveAway ? q.id : p.id);
        const pay = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 1)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          before = game.state;
        for (const bad of [
          q.card(trainingSword, { zone: "field" }),
          p.card(curvedDagger, { zone: "field" }),
          p.card(woodlandSquirrels, { zone: "field" }),
        ]) {
          expect(() =>
            p.activate(spiritBladeAscension, {
              reservePayment: pay,
              costSelections: [[bad.objectId]],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() => p.activate(spiritBladeAscension, { reservePayment: pay })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(spiritBladeAscension, {
          reservePayment: pay,
          costSelections: [[source.objectId]],
        });
        expect(game.state.objects[source.objectId]!.zone).toBe("material-deck");
        expect(p.zone("material-deck").map((c) => c.objectId)).toContain(source.objectId);
        passEffectsStack(game);
        const choice = game.state;
        for (const bad of [
          q.card(trainingSword, { zone: "material-deck" }),
          p.card(curvedDagger, { zone: "banishment" }),
          p.card(woodlandSquirrels, { zone: "field" }),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
          expect(game.state).toEqual(choice);
        }
        const selected = p.card(sealedBladeDoa, { zone });
        answerDecision(game, "resolve-effect-choice", [selected.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[selected.objectId]!.zone).toBe("field");
        expect(game.state.objects[selected.objectId]!.controllerId).toBe(p.id);
        expect(game.state.objects[selected.objectId]!.counters.durability).toBe(3);
        expect(p.zone("memory")).toHaveLength(1);
        expect(game.state.objects[source.objectId]!.zone).toBe("material-deck");
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(0);
      });
});
