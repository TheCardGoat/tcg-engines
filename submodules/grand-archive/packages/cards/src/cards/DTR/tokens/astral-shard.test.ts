import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { astralShard } from "./astral-shard.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers eP07Xxscuq-a1 */
describe("Astral Shard — sacrifice then Glimpse 2", () => {
  for (const size of [0, 1, 4])
    for (const placement of ["top", "bottom", "split"] as const)
      it(`orders ${size} available cards with ${placement} placement after paying the sacrifice`, () => {
        const champion = createClassBonusTestChampion(astralShard, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [astralShard],
              "main-deck": Array.from({ length: size }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { field: [astralShard], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(astralShard),
          deck = p.zone("main-deck");
        const before = game.state;
        expect(() => p.activateAbility(q.card(astralShard), "eP07Xxscuq-a1")).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, "eP07Xxscuq-a1");
        expect(p.zone("field").some((c) => c.objectId === source.objectId)).toBe(false);
        expect(p.zone("main-deck")).toEqual(deck);
        const paid = game.state;
        expect(() => p.activateAbility(source, "eP07Xxscuq-a1")).toThrow();
        expect(game.state).toEqual(paid);
        passEffectsStack(game);
        const looked = deck.slice(0, 2).reverse();
        const top = placement === "top" ? looked : placement === "split" ? looked.slice(0, 1) : [];
        const bottom = looked.filter((c) => !top.includes(c));
        if (size) {
          const decision = game.state.decision;
          expect(decision).toMatchObject({
            kind: "resolve-glimpse",
            playerId: p.id,
            cardIds: deck.slice(0, 2).map((c) => c.objectId),
          });
          for (const badTop of [
            [q.zone("main-deck")[0]!.objectId],
            [looked[0]!.objectId, looked[0]!.objectId],
          ]) {
            const checkpoint = game.state;
            expect(() =>
              answerDecision(game, "resolve-glimpse", { kind: "reorder", top: badTop, bottom: [] }),
            ).toThrow();
            expect(game.state).toEqual(checkpoint);
          }
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: top.map((c) => c.objectId),
            bottom: bottom.map((c) => c.objectId),
          });
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        expect(p.zone("main-deck")).toEqual([...top, ...deck.slice(2), ...bottom]);
        expect(p.zone("hand")).toHaveLength(0);
        expect(q.zone("field")).toHaveLength(2);
        expect(q.zone("main-deck")).toHaveLength(1);
      });
});
