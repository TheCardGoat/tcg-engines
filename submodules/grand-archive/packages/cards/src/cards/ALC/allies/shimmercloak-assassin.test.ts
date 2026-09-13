import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { shimmercloakAssassin } from "./shimmercloak-assassin.ts";

/** @covers wklzjmwuir-a1 */
describe("Shimmercloak Assassin — Stealth", () => {
  it("cannot be selected by an attack without True Sight", () => {
    const champion = createClassBonusTestChampion(
      shimmercloakAssassin,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [shimmercloakAssassin] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const attacker = game.player("player-two");
    const assassin = game.player("player-one").card(shimmercloakAssassin);

    expect(() => attacker.declareAttack(automatedGardener, assassin)).toThrow(
      "legal attack target",
    );
    attacker.declareAttack(automatedGardener, game.player("player-one").card(champion));
    expect(game.state.combat?.targetIds).not.toContain(assassin.objectId);
  });
});
