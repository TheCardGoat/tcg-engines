import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { blissfulCalling } from "./blissful-calling.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { grayWolf } from "../allies/gray-wolf.ts";
import { eagerPage } from "../allies/eager-page.ts";
import { acceptedContract } from "./accepted-contract.ts";
/** @covers YOjdZJpOO1-a1 */
describe("Blissful Calling permits either Animal or Beast and orders only the looked-at remainder", () => {
  for (const choice of ["animal", "beast", "none"] as const)
    it(`choice=${choice}`, () => {
      const champion = createClassBonusTestChampion(blissfulCalling, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [blissfulCalling, woodlandSquirrels],
              "main-deck": [
                woodlandSquirrels,
                grayWolf,
                eagerPage,
                acceptedContract,
                woodlandSquirrels,
                grayWolf,
              ],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck"),
        looked = deck.slice(0, 5),
        chosen =
          choice === "none"
            ? undefined
            : looked.find(
                (c) =>
                  c.definitionId ===
                  (choice === "animal" ? woodlandSquirrels : grayWolf).canonicalId,
              );
      if (choice !== "none" && !chosen) throw new Error("Missing expected candidate");
      p.activate(blissfulCalling, {
        reservePayment: [
          { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      const before = game.state;
      for (const bad of [
        deck[5]!,
        q.zone("main-deck")[0]!,
        ...looked.filter((c) =>
          [eagerPage.canonicalId, acceptedContract.canonicalId].includes(c.definitionId),
        ),
      ]) {
        expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "resolve-effect-choice", chosen ? [chosen.objectId] : []);
      passEffectsStack(game);
      const remainder = looked
        .filter((c) => c.objectId !== chosen?.objectId)
        .reverse()
        .map((c) => c.objectId);
      if (chosen)
        expect(() =>
          answerDecision(game, "resolve-effect-choice", [chosen.objectId, ...remainder.slice(1)]),
        ).toThrow();
      answerDecision(game, "resolve-effect-choice", remainder);
      passEffectsStack(game);
      expect(p.zone("hand")).toEqual(chosen ? [chosen] : []);
      expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([deck[5]!.objectId, ...remainder]);
      const reveals = game.state.eventHistory.filter((e) => e.type === "card-revealed");
      expect(reveals).toHaveLength(chosen ? 1 : 0);
      for (const event of reveals)
        if (event.type === "card-revealed") expect(event.objectId).toBe(chosen?.objectId);
      expect(q.zone("hand")).toHaveLength(0);
    });
});
