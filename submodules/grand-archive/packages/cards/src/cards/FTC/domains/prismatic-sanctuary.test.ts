import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { prismaticSanctuary } from "./prismatic-sanctuary.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { windriderMage } from "../../DOA/allies/windrider-mage.ts";
import { spirelleSchwartzQueen } from "../../DTR/allies/spirelle-schwartz-queen.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 9w0ejcyuvu-a2 */
describe("Prismatic Sanctuary — enabled elements", () => {
  for (const [probe, cost, enabled] of [
    [blitzMage, 3, true],
    [giantTortoise, 4, true],
    [windriderMage, 2, true],
    [spirelleSchwartzQueen, 2, false],
  ] as const)
    it(`enables ${probe.slug}=${enabled} only while its controller's Sanctuary is active`, () => {
      const champion = lineageTestChampion("Sanctuary", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              prismaticSanctuary,
              probe,
              probe,
              ...Array.from({ length: 10 }, () => woodlandSquirrels),
            ],
            graveyard: [prismaticSanctuary],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [probe, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(prismaticSanctuary, { zone: "hand" });
      const attempt = (id: string) => {
        const owner = game.player(id);
        owner.activate(owner.cards(probe, { zone: "hand" })[0]!, {
          reservePayment: owner
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      };
      const reject = (id: string) => {
        const before = game.state;
        expect(() => attempt(id)).toThrow();
        expect(game.state).toEqual(before);
      };
      reject(p.id);
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      if (enabled) {
        attempt(p.id);
        passEffectsStack(game);
        expect(p.cards(probe, { zone: "field" })).toHaveLength(1);
      } else reject(p.id);
      advanceToMain(game, q.id);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      reject(q.id);
      advanceToMain(game, p.id);
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      reject(p.id);
    });
});
