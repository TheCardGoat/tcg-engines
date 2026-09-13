import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "./airship-engineer.ts";
import { inzaliUnshackledBlaze } from "./inzali-unshackled-blaze.ts";

function champion(level: number, classBonus: boolean) {
  const base = createClassBonusTestChampion(
    inzaliUnshackledBlaze,
    classBonus,
    "activation-discount",
  );
  if (base.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  const canonicalId = `${base.canonicalId}-level-${level}`;
  return {
    ...base,
    canonicalId,
    slug: canonicalId,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        id: `${canonicalId}:face:default` as const,
        catalogId: canonicalId,
        lineageName: "Inzali Test",
        stats: { ...base.layout.face.stats, level },
      },
    },
  };
}

/** @covers ot4nmxqsm4-a1 */
describe("Inzali, Unshackled Blaze — Class Bonus attack trigger", () => {
  it("banishes a Fire card and damages every other unit", () => {
    const activeChampion = champion(0, true);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: activeChampion,
        zones: {
          field: [inzaliUnshackledBlaze, woodlandSquirrels],
          graveyard: [airshipEngineer],
        },
      },
      playerTwo: { champion: activeChampion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const inzali = player.card(inzaliUnshackledBlaze);
    const fireCard = player.card(airshipEngineer, { zone: "graveyard" });
    const ownChampion = player.card(activeChampion);
    const opposingChampion = opponent.card(activeChampion);
    const ownAlly = player.card(woodlandSquirrels);
    const opposingAlly = opponent.card(woodlandSquirrels);
    player.declareAttack(inzali, opposingChampion);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);

    expect(game.state.objects[fireCard.objectId]!.zone).toBe("banishment");
    expect(game.state.objects[inzali.objectId]!.damage).toBe(0);
    expect(
      [ownChampion, opposingChampion].map((object) => game.state.objects[object.objectId]!.damage),
    ).toEqual([1, 1]);
    expect(
      [ownAlly, opposingAlly].map((object) => game.state.objects[object.objectId]!.zone),
    ).toEqual(["graveyard", "graveyard"]);
  });
});

/** @covers ot4nmxqsm4-a2 */
describe("Inzali, Unshackled Blaze — Level and Memory thresholds", () => {
  for (const level of [2, 3]) {
    for (const memory of [3, 4]) {
      it(`deals ${level >= 3 && memory >= 4 ? 3 : 1} damage at level ${level}, memory ${memory}`, () => {
        const activeChampion = champion(0, false);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: activeChampion,
            lineage: Array.from({ length: level }, (_, index) => champion(index + 1, false)),
            zones: {
              field: [inzaliUnshackledBlaze],
              memory: Array.from({ length: memory }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion: activeChampion },
        });
        const target = game.player("player-two").card(activeChampion);
        game.player("player-one").declareAttack(inzaliUnshackledBlaze, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(level >= 3 && memory >= 4 ? 3 : 1);
      });
    }
  }
});
