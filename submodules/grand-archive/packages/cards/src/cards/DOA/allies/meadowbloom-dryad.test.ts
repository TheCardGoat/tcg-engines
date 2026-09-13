import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { meadowbloomDryad } from "./meadowbloom-dryad.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers cVRIUJdTW5-a2 */
describe("Meadowbloom Dryad's own-entry counter trigger", () => {
  for (const classBonus of [false, true])
    for (const ownTarget of [false, true])
      it(`class=${classBonus}, target own=${ownTarget}`, () => {
        const champion = createClassBonusTestChampion(
            meadowbloomDryad,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [meadowbloomDryad, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [woodlandSquirrels],
                field: [giantTortoise],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          dryad = p.card(meadowbloomDryad),
          target = (ownTarget ? p : q).card(giantTortoise);
        p.activate(dryad, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        if (classBonus) {
          expect(game.state.decision?.kind).toBe("announce-triggered-ability");
          const before = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [p.card(champion).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(classBonus ? 1 : 0);
        p.activate(p.card(woodlandSquirrels, { zone: "hand" }));
        passEffectsStack(game);
        if (classBonus) {
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [dryad.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[dryad.objectId]!.counters.buff ?? 0).toBe(classBonus ? 1 : 0);
        if (ownTarget) {
          p.declareAttack(target, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(classBonus ? 2 : 1);
        }
        advanceToMain(game, q.id);
        q.activate(q.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[dryad.objectId]!.counters.buff ?? 0).toBe(classBonus ? 1 : 0);
        expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(classBonus ? 1 : 0);
      });
});
