import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveLoadBow } from "../../../testing/load-bow.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { igniteTheSoul } from "../../DOA/actions/ignite-the-soul.ts";
import { setAblaze } from "../actions/set-ablaze.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { intricateLongbow } from "../weapons/intricate-longbow.ts";
import { moltenArrow } from "./molten-arrow.ts";

/** @covers mvfcd0ukk6-a1 */
describe("Molten Arrow — load", () => {
  proveLoadBow({ card: moltenArrow, abilityId: "mvfcd0ukk6-a1" });
});

/** @covers mvfcd0ukk6-a2 */
describe("Molten Arrow — graveyard load", () => {
  it("banishes three other fire cards to load itself from the graveyard", () => {
    const champion = createClassBonusTestChampion(moltenArrow, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [intricateLongbow],
          graveyard: [moltenArrow, igniteTheSoul, setAblaze, fireball, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const arrow = player.card(moltenArrow, { zone: "graveyard" });
    const bow = player.card(intricateLongbow, { zone: "field" });
    const fireCards = [
      player.card(igniteTheSoul, { zone: "graveyard" }),
      player.card(setAblaze, { zone: "graveyard" }),
      player.card(fireball, { zone: "graveyard" }),
    ];
    const filler = player.card(woodlandSquirrels, { zone: "graveyard" });
    const before = game.state;
    expect(() =>
      player.activateAbility(arrow, "mvfcd0ukk6-a2", {
        targets: { "target-weapon": [bow.objectId] },
        costSelections: [[filler.objectId, fireCards[0]!.objectId, fireCards[1]!.objectId]],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activateAbility(arrow, "mvfcd0ukk6-a2", {
      targets: { "target-weapon": [bow.objectId] },
      costSelections: [fireCards.map((card) => card.objectId)],
    });
    expect(game.state.objects[arrow.objectId]!.zone).toBe("graveyard");
    passEffectsStack(game);
    expect(game.state.objects[arrow.objectId]!.zone).toBe("loaded");
    expect(game.state.objects[arrow.objectId]!.hostId).toBe(bow.objectId);
    for (const card of fireCards)
      expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
  });
});
