import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { liuBeiOathkeeper } from "./liu-bei-oathkeeper.ts";

/** @covers a53rqmuqxf-a1 */
describe("Liu Bei, Oathkeeper — Ranged 2", () => {
  proveRangedAlly({ card: liuBeiOathkeeper, power: 2, ranged: 2, classBonus: false });
});

/** @covers a53rqmuqxf-a2 */
describe("Liu Bei, Oathkeeper — copy distant", () => {
  for (const subject of ["own-ally", "own-champion", "opposing-ally"] as const) {
    it(`${subject} becoming distant ${subject === "opposing-ally" ? "does not" : "does"} make Liu Bei distant`, () => {
      const champion = createClassBonusTestChampion(liuBeiOathkeeper, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [liuBeiOathkeeper, woodlandSquirrels],
            hand: [reposition, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const liuBei = player.card(liuBeiOathkeeper, { zone: "field" });
      const target =
        subject === "own-ally"
          ? player.card(woodlandSquirrels, { zone: "field" })
          : subject === "own-champion"
            ? player.card(champion, { zone: "field" })
            : opponent.card(woodlandSquirrels, { zone: "field" });
      player.activate(reposition, {
        targets: { "target-1": [target.objectId] },
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      expect(game.state.objects[liuBei.objectId]!.states.has("distant")).toBe(false);
      player.pass();
      opponent.pass();
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
      if (subject === "opposing-ally") {
        passEffectsStack(game);
        expect(game.state.objects[liuBei.objectId]!.states.has("distant")).toBe(false);
        return;
      }
      if (
        !game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "a53rqmuqxf-a2",
        )
      ) {
        expect(game.state.objects[liuBei.objectId]!.states.has("distant")).toBe(true);
        return;
      }
      expect(game.state.objects[liuBei.objectId]!.states.has("distant")).toBe(false);
      passEffectsStack(game);
      expect(game.state.objects[liuBei.objectId]!.states.has("distant")).toBe(true);
    });
  }
});
