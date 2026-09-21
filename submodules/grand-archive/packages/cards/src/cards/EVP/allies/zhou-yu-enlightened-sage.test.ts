import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import {
  createClassBonusTestChampion,
  grandArchiveTestFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { artOfWar } from "../../HVN/items/art-of-war.ts";
import { wornDiary } from "../../MRC/items/worn-diary.ts";
import { zhouYuEnlightenedSage } from "./zhou-yu-enlightened-sage.ts";

/** @covers 55d7vo62fc-a1 */
describe("Zhou Yu, Enlightened Sage — Class Bonus materialization", () => {
  for (const materialCard of [wornDiary, artOfWar]) {
    it(`materializes ${grandArchiveTestFace(materialCard).name} as an eligible Book or Scripture`, () => {
      const champion = createClassBonusTestChampion(
        zhouYuEnlightenedSage,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [zhouYuEnlightenedSage, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "material-deck": [materialCard],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const chosen = player.card(materialCard, { zone: "material-deck" });
      player.activate(zhouYuEnlightenedSage, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
      expect(game.state.decision?.kind).toBe("announce-effect-materialization");
      answerDecision(game, "announce-effect-materialization", {});
      passEffectsStack(game);
      expect(game.state.objects[chosen.objectId]!.zone).toBe("field");
    });
  }

  it("does not offer materialization without the Class Bonus", () => {
    const champion = createClassBonusTestChampion(
      zhouYuEnlightenedSage,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [zhouYuEnlightenedSage, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          "material-deck": [wornDiary],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(zhouYuEnlightenedSage, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.decision).toBeNull();
    expect(game.state.objects[player.card(wornDiary).objectId]!.zone).toBe("material-deck");
  });
});

/** @covers 55d7vo62fc-a2 */
describe("Zhou Yu, Enlightened Sage — recollection enlightenment", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "adds" : "does not add"} an enlighten counter with a controlled Book`, () => {
      const champion = createClassBonusTestChampion(
        zhouYuEnlightenedSage,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [zhouYuEnlightenedSage, wornDiary],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const championId = player.card(champion).objectId;
      advanceToRecollection(game, player.id);
      passEffectsStack(game);
      expect(game.state.objects[championId]!.counters.enlighten ?? 0).toBe(classBonus ? 1 : 0);
    });
  }
});
