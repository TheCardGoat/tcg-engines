import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { shoutAtYourPets } from "./shout-at-your-pets.ts";
import { proveConditionalPetLevel } from "../../../testing/conditional-pet-level.ts";
/** @covers gvXQa57cxe-a1 */
describe("shout-at-your-pets conditional level", () => {
  proveConditionalPetLevel(shoutAtYourPets);
});

/** @covers gvXQa57cxe-a2 */
describe("Shout at Your Pets' optional discard before draw", () => {
  for (const classBonus of [false, true])
    for (const accept of [false, true])
      for (const count of [0, 2])
        it(`class=${classBonus}, accept=${accept}, hand after payment=${count}`, () => {
          const champion = createClassBonusTestChampion(
              shoutAtYourPets,
              classBonus,
              "activation-discount",
            ),
            game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [
                    shoutAtYourPets,
                    woodlandSquirrels,
                    ...Array.from({ length: count }, () => giantTortoise),
                  ],
                  "main-deck": [woodlandSquirrels],
                },
              },
              playerTwo: { champion, zones: { hand: [giantTortoise] } },
            });
          const p = game.player("player-one"),
            q = game.player("player-two");
          p.activate(shoutAtYourPets, {
            reservePayment: [
              { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
          });
          passEffectsStack(game);
          if (classBonus && game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
          }
          if (classBonus && accept && count) {
            expect(game.state.decision?.kind).toBe("resolve-effect-choice");
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [q.card(giantTortoise).objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "resolve-effect-choice", [
              p.cards(giantTortoise, { zone: "hand" })[0]!.objectId,
            ]);
            passEffectsStack(game);
          }
          const used = classBonus && accept && count > 0;
          expect(p.cards(giantTortoise, { zone: "graveyard" })).toHaveLength(used ? 1 : 0);
          expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(used ? 1 : 0);
          expect(p.zone("hand")).toHaveLength(count);
          expect(p.zone("main-deck")).toHaveLength(used ? 0 : 1);
          expect(q.zone("hand")).toHaveLength(1);
        });
});
