import { describe } from "vitest";
import { babySilverSlime } from "./baby-silver-slime.ts";
import { proveConditionalOtherTaunt } from "../../../testing/conditional-other-taunt.ts";
/** @covers 62lVDTOToR-a1 */
describe("Baby Silver Slime — another Slime ally grants Taunt", () =>
  proveConditionalOtherTaunt(babySilverSlime, false));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { blueSlime } from "../../DOA/allies/blue-slime.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 62lVDTOToR-a2 */
describe("Baby Silver Slime — optional Slime reveal after death", () => {
  for (const zone of ["hand", "memory", "graveyard", "opponent", "none"])
    for (const accept of [false, true]) {
      it(`Slime location=${zone}, accept=${accept}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(babySilverSlime, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [babySilverSlime],
              hand: [woodlandSquirrels, ...(zone === "hand" ? [blueSlime, blueSlime] : [])],
              memory: zone === "memory" ? [blueSlime, blueSlime] : [],
              graveyard: zone === "graveyard" ? [blueSlime] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [
                fireball,
                ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ...(zone === "opponent" ? [blueSlime] : []),
              ],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(babySilverSlime),
          hand = p.zone("hand").length,
          deck = p.zone("main-deck"),
          valid = zone === "hand" || zone === "memory";
        q.activate(fireball, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(p.zone("main-deck")).toEqual(deck);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          if (!valid) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "resolve-optional-effect", false);
          } else answerDecision(game, "resolve-optional-effect", accept);
        } else expect(valid).toBe(false);
        passEffectsStack(game);
        if (valid && accept) {
          const before = game.state;
          for (const ids of [
            [],
            [source.objectId],
            [p.card(woodlandSquirrels, { zone: "hand" }).objectId],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          const shown = p.cards(blueSlime)[0]!;
          answerDecision(game, "resolve-effect-choice", [shown.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[shown.objectId]!.zone).toBe(zone);
        }
        const drawn = valid && accept ? 1 : 0;
        expect(p.zone("hand")).toHaveLength(hand + drawn);
        expect(p.zone("main-deck")).toHaveLength(2 - drawn);
        if (drawn) expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("hand");
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
      });
    }
});
