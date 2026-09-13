import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { rustedWarshield } from "../items/rusted-warshield.ts";
import { turbulentBullet } from "../items/turbulent-bullet.ts";
import { rapidReload } from "./rapid-reload.ts";

function levelTwoChampion(classMatches: boolean) {
  const base = lineageTestChampion("Rapid Reload", 2);
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  const championClass = classMatches ? "RANGER" : "MAGE";
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        typeLine: {
          ...base.layout.face.typeLine,
          classes: [championClass],
          subtypes: [championClass],
        },
        elements: ["NORM", "WIND"] as const,
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

/** @covers ypwc8tuhuy-a1 */
describe("Rapid Reload — restricted Efficiency", () => {
  for (const classMatches of [false, true]) {
    it(`costs ${classMatches ? 1 : 3} at level two with class match=${classMatches}`, () => {
      const champion = levelTwoChampion(classMatches);
      const starter = lineageTestChampion("Rapid Reload", 0);
      const cost = classMatches ? 1 : 3;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: [lineageTestChampion("Rapid Reload", 1), champion],
          zones: {
            hand: [rapidReload, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            "material-deck": [turbulentBullet],
          },
        },
        playerTwo: { champion: lineageTestChampion("Opponent", 0) },
      });
      const player = game.player("player-one");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      const before = game.state;
      expect(() => player.activate(rapidReload, { reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      player.activate(rapidReload, { reservePayment: payment });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers ypwc8tuhuy-a2 */
describe("Rapid Reload — Bullet materialization", () => {
  it("selects and materializes a Bullet from its controller's material deck", () => {
    const champion = levelTwoChampion(true);
    const starter = lineageTestChampion("Rapid Reload", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Rapid Reload", 1), champion],
        zones: {
          hand: [rapidReload, woodlandSquirrels],
          "material-deck": [turbulentBullet, rustedWarshield],
        },
      },
      playerTwo: { champion: lineageTestChampion("Opponent", 0) },
    });
    const player = game.player("player-one");
    const bullet = player.card(turbulentBullet, { zone: "material-deck" });
    const nonBullet = player.card(rustedWarshield, { zone: "material-deck" });
    player.activate(rapidReload, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() => answerDecision(game, "resolve-effect-choice", [nonBullet.objectId])).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    answerDecision(game, "resolve-effect-choice", [bullet.objectId]);
    expect(game.state.decision?.kind).toBe("announce-effect-materialization");
    answerDecision(game, "announce-effect-materialization", {});
    passEffectsStack(game);

    expect(player.cards(turbulentBullet, { zone: "field" })).toHaveLength(1);
    expect(player.cards(rustedWarshield, { zone: "material-deck" })).toHaveLength(1);
  });
});
