import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { fanOfInsight } from "./fan-of-insight.ts";

function championAt(level: number, classBonus: boolean) {
  return grantTestChampionLevel(
    createClassBonusTestChampion(fanOfInsight, classBonus, "activation-discount"),
    level,
  );
}

/** @covers sz1ty7vq6z-a1 */
describe("Fan of Insight — Class Bonus Level 2 On Enter", () => {
  for (const classBonus of [false, true]) {
    for (const level of [1, 2]) {
      it(`${classBonus && level >= 2 ? "draws" : "does not draw"} at class=${classBonus} level=${level}`, () => {
        const champion = championAt(level, classBonus);
        const game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              "material-deck": [fanOfInsight],
              memory: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const top = player.zone("main-deck")[0]!;
        player.materialize(fanOfInsight);
        player.pass();
        game.player("player-two").pass();
        const shouldDraw = classBonus && level >= 2;
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "sz1ty7vq6z-a1",
          ),
        ).toBe(shouldDraw);
        passEffectsStack(game);
        expect(game.state.objects[top.objectId]?.zone).toBe(shouldDraw ? "memory" : "main-deck");
      });
    }
  }
});

/** @covers sz1ty7vq6z-a2 */
describe("Fan of Insight — return from memory", () => {
  it("banishes itself to return a chosen memory card to hand", () => {
    const champion = createClassBonusTestChampion(fanOfInsight, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [fanOfInsight], memory: [woodlandSquirrels, reposition] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const chosen = player.card(reposition, { zone: "memory" });
    const other = player.card(woodlandSquirrels, { zone: "memory" });
    player.activateAbility(fanOfInsight, "sz1ty7vq6z-a2");
    expect(player.cards(fanOfInsight, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[chosen.objectId]!.zone).toBe("hand");
    expect(game.state.objects[other.objectId]!.zone).toBe("memory");
  });
});
