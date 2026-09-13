import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import {
  changeShiftingCurrents,
  startWithShiftingCurrentsNorth,
} from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { ruinousPillarsOfQidao } from "./ruinous-pillars-of-qidao.ts";

function kongmingLevel(level: number) {
  const champion = lineageTestChampion("Kongming", level);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        elements: ["NORM", "WATER", "WIND", "TERA", "FIRE", "LUXEM", "EXIA"] as const,
        typeLine: {
          ...champion.layout.face.typeLine,
          classes: ["MAGE"] as const,
          subtypes: ["MAGE", "HUMAN"] as const,
        },
      },
    },
  };
}

/** @covers pmx99jrukm-a1 */
describe("Ruinous Pillars of Qidao — Class Bonus On Enter", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "empowers and draws" : "does not trigger"} with class match=${classBonus}`, () => {
      const { starter } = classBonusLeveledChampion(ruinousPillarsOfQidao, classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            hand: [ruinousPillarsOfQidao, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const top = player.zone("main-deck")[0]!;
      player.activate(ruinousPillarsOfQidao, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      game.player("player-two").pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "pmx99jrukm-a1",
        ),
      ).toBe(classBonus);
      passEffectsStack(game);
      expect(game.state.players[player.id]?.states.empower ?? 0).toBe(classBonus ? 2 : 0);
      expect(game.state.objects[top.objectId]!.zone).toBe(classBonus ? "hand" : "main-deck");
    });
  }
});

/** @covers pmx99jrukm-a2 */
describe("Ruinous Pillars of Qidao — West to East sacrifice", () => {
  it("sacrifices itself and destroys an opposing non-champion when currents change West to East", () => {
    const game = startWithShiftingCurrentsNorth({
      lineage: [kongmingLevel(1)],
      playerOneZones: { field: [ruinousPillarsOfQidao] },
      playerTwoZones: { field: [automatedGardener] },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ally = opponent.card(automatedGardener, { zone: "field" });
    const source = player.card(ruinousPillarsOfQidao, { zone: "field" });
    changeShiftingCurrents(game, "west");
    expect(game.state.objects[source.objectId]!.zone).toBe("field");
    changeShiftingCurrents(game, "east");
    if (game.state.decision?.kind === "announce-triggered-ability") {
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [ally.objectId] },
      });
    }
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "pmx99jrukm-a2",
      ),
    ).toBe(true);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).not.toBe("field");
    expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
  });
});
