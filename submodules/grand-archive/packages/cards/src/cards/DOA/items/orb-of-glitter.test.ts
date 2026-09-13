import { proveBanishDrawItem } from "../../../testing/banish-draw-item.ts";
import { describe } from "vitest";
import { orbOfGlitter } from "./orb-of-glitter.ts";

/** @covers P7hHZBVScB-a2 */
describe("Orb of Glitter \u2014 resolution", () => {
  proveBanishDrawItem({ card: orbOfGlitter, abilityId: "P7hHZBVScB-a2" });
});
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers P7hHZBVScB-a1 */
describe("Orb's own recollection glimpse", () => {
  for (const bottom of [false, true])
    it(`looks before draw, bottom=${bottom}`, () => {
      const champion = createClassBonusTestChampion(orbOfGlitter, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [orbOfGlitter],
              "main-deck": [giantTortoise, woodlandSquirrels, giantTortoise],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two");
      advanceToMain(game, q.id);
      expect(game.state.decision).toBeNull();
      expect(p.zone("hand")).toHaveLength(0);
      const deck = p.zone("main-deck");
      for (let i = 0; i < 64 && !game.state.decision; i++) {
        const w = game.waitState();
        if (w.kind === "opportunity") game.player(w.playerId).pass();
        else if (w.kind === "materialization-choice")
          game.player(w.playerId).execute({ move: "skip-materialization" });
        else throw new Error(w.kind);
      }
      const d = game.state.decision;
      if (d?.kind !== "resolve-glimpse") throw new Error("Expected recollection glimpse");
      expect(game.state.turn.phase).toBe("recollection");
      expect(d.playerId).toBe(p.id);
      expect(d.cardIds).toEqual([deck[0]!.objectId]);
      expect(p.zone("hand")).toHaveLength(0);
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: bottom ? [] : d.cardIds,
        bottom: bottom ? d.cardIds : [],
      });
      advanceToMain(game, p.id);
      expect(p.zone("hand").map((c) => c.objectId)).toEqual([deck[bottom ? 1 : 0]!.objectId]);
      expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(
        bottom ? [deck[2]!.objectId, deck[0]!.objectId] : deck.slice(1).map((c) => c.objectId),
      );
    });
});
