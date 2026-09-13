import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatonDrone } from "./automaton-drone.ts";

/** @covers-card mu6gvnta6q */
describe("Automaton Drone", () => {
  it("is an awake one-power Ally token that can attack", () => {
    const champion = createClassBonusTestChampion(automatonDrone, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [automatonDrone] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const token = player.card(automatonDrone);
    const target = game.player("player-two").card(champion);
    expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(false);
    player.declareAttack(token, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
    expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(true);
  });

  it("uses its one life and ceases instead of remaining in a graveyard after lethal damage", () => {
    const champion = createClassBonusTestChampion(automatonDrone, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [automatonDrone] } },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const token = player.card(automatonDrone);
    opponent.declareAttack(opponent.card(woodlandSquirrels), token);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[token.objectId]).toBeUndefined();
    expect(player.zone("graveyard")).toHaveLength(0);
  });
});
