import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { floodwardSergeant } from "./floodward-sergeant.ts";

/** @covers 64xGWbG9Xf-a2 */
describe("Floodward Sergeant — once-per-turn damage prevention", () => {
  it("prevents the first damage each turn and not the second", () => {
    const champion = createClassBonusTestChampion(floodwardSergeant, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [floodwardSergeant] } },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels, woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const sergeant = player.card(floodwardSergeant, { zone: "field" });
    const attackers = opponent.cards(woodlandSquirrels, { zone: "field" });
    opponent.declareAttack(attackers[0]!, sergeant);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[sergeant.objectId]!.damage).toBe(0);
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
      game.player(wait.playerId).pass();
    opponent.declareAttack(attackers[1]!, sergeant);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[sergeant.objectId]!.damage).toBe(1);
  });
});
