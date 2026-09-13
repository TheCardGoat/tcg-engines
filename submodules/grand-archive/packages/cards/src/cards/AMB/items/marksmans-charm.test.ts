import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { snowFairy } from "../../DOA/allies/snow-fairy.ts";
import { marksmansCharm } from "./marksmans-charm.ts";

/** @covers zqw6ms798w-a1 */
describe("Marksman's Charm — True Sight", () => {
  it("banishes itself to grant True Sight so the unit can attack Stealth", () => {
    const champion = createClassBonusTestChampion(marksmansCharm, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [marksmansCharm, woodlandSquirrels] },
      },
      playerTwo: { champion, zones: { field: [snowFairy] } },
    });
    const player = game.player("player-one");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const hidden = game.player("player-two").card(snowFairy, { zone: "field" });
    expect(() => player.declareAttack(ally, hidden)).toThrow();

    player.activateAbility(marksmansCharm, "zqw6ms798w-a1", {
      targets: { "target-1": [ally.objectId] },
    });
    expect(player.cards(marksmansCharm, { zone: "field" })).toHaveLength(0);
    expect(() => player.declareAttack(ally, hidden)).toThrow();
    passEffectsStack(game);
    player.declareAttack(ally, hidden);
    expect(game.state.combat?.targetIds).toEqual([hidden.objectId]);
  });
});
