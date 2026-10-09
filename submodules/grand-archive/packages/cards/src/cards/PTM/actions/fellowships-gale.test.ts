import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { fellowshipsGale } from "./fellowships-gale.ts";
import { seekersAetherwing } from "../../P25/weapons/seekers-aetherwing.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers payjps7DkB-a1 */
/** @covers payjps7DkB-a2 */
describe("Fellowship's Gale loads and tracks the current controlled allies through combat", () => {
  for (const count of [0, 2, 4])
    for (const removal of ["none", "loaded", "intent"] as const)
      it(`allies=${count}, removal=${removal}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(fellowshipsGale, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                seekersAetherwing,
                seekersAetherwing,
                trainingSword,
                ...Array.from({ length: count }, () => woodlandSquirrels),
              ],
              hand: [fellowshipsGale, woodlandSquirrels, woodlandSquirrels],
              graveyard: [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [seekersAetherwing, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              hand: [fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(fellowshipsGale),
          weapons = p.cards(seekersAetherwing);
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        p.activate(source, {
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
        });
        expect(power()).toBe(1 + count);
        passEffectsStack(game);
        expect(game.state.decision?.kind).toBe("resolve-effect-choice");
        for (const invalid of [
          q.card(seekersAetherwing),
          p.card(trainingSword),
          p.card(champion),
        ]) {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "resolve-effect-choice", [weapons[0]!.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("loaded");
        expect(game.state.objects[source.objectId]!.hostId).toBe(weapons[0]!.objectId);
        expect(power()).toBe(1);
        const added = p.card(woodlandSquirrels, { zone: "hand" });
        p.activate(added);
        passEffectsStack(game);
        expect(power()).toBe(1);
        const remove = () => {
          p.pass();
          q.activate(fireball, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
            targets: { "target-1": [added.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[added.objectId]!.zone).toBe("graveyard");
          expect(power()).toBe(removal === "intent" ? 1 + count : 1);
        };
        if (removal === "loaded") remove();
        const before = game.state;
        expect(() =>
          p.declareAttack(p.card(champion), q.card(champion), {
            weaponIds: [weapons[1]!.objectId],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.declareAttack(p.card(champion), q.card(champion), { weaponIds: [weapons[0]!.objectId] });
        expect(game.state.objects[source.objectId]!.zone).toBe("intent");
        expect(game.state.objects[source.objectId]!.hostId).toBe(p.card(champion).objectId);
        expect(power()).toBe(1 + count + (removal === "loaded" ? 0 : 1));
        if (removal === "intent") remove();
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
          2 + count + (removal === "none" ? 1 : 0),
        );
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[weapons[0]!.objectId]!.counters.durability).toBe(2);
      });
});
