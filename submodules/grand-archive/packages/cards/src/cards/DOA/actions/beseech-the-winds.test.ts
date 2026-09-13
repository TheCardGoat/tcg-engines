import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { beseechTheWinds } from "./beseech-the-winds.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { baubleOfMending } from "../items/bauble-of-mending.ts";
/** @covers 8qW1koLOK6-a1 */
describe("Beseech the Winds materializes from its controller's deck and still pays memory", () => {
  for (const paid of [false, true])
    it(`memory cost=${paid ? 1 : 0}`, () => {
      const champion = createClassBonusTestChampion(beseechTheWinds, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [beseechTheWinds, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "material-deck": [trainingSword, baubleOfMending],
              banishment: [trainingSword],
            },
          },
          playerTwo: { champion, zones: { "material-deck": [trainingSword] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = p.card(paid ? baubleOfMending : trainingSword, { zone: "material-deck" }),
        before = game.state;
      expect(() => p.materialize(target)).toThrow();
      expect(game.state).toEqual(before);
      expect(() =>
        p.activate(beseechTheWinds, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(beseechTheWinds, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      const choice = game.state;
      for (const bad of [
        q.card(trainingSword),
        p.card(trainingSword, { zone: "banishment" }),
        p.card(champion),
      ]) {
        expect(() => answerDecision(game, "resolve-effect-choice", [bad.objectId])).toThrow();
        expect(game.state).toEqual(choice);
      }
      answerDecision(game, "resolve-effect-choice", [target.objectId]);
      expect(game.state.objects[target.objectId]!.zone).toBe("material-deck");
      expect(p.zone("memory")).toHaveLength(3);
      expect(game.state.decision).toMatchObject({
        kind: "announce-effect-materialization",
        playerId: p.id,
        payCosts: true,
      });
      answerDecision(game, "announce-effect-materialization", {});
      expect(p.zone("memory")).toHaveLength(paid ? 2 : 3);
      expect(
        p.zone("banishment").filter((c) => c.definitionId === woodlandSquirrels.canonicalId),
      ).toHaveLength(paid ? 1 : 0);
      expect(game.state.objects[target.objectId]!.zone).toBe("effects-stack");
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
      expect(q.card(trainingSword, { zone: "material-deck" })).toBeDefined();
      expect(p.card(beseechTheWinds, { zone: "graveyard" })).toBeDefined();
    });
});
