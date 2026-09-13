import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { curvedDagger } from "../../DOA/weapons/curved-dagger.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { dianaKeenHuntress } from "./diana-keen-huntress.ts";

/** @covers e3z4pyx8bd-a1 */
describe("Diana, Keen Huntress — Lineage Release a Gun", () => {
  it("banishes only the inner-lineage source before choosing and materializing a controlled-deck Gun", () => {
    const starter = lineageTestChampion("Diana", 0);
    const activeChampion = lineageTestChampion("Diana", 2);
    const opponentChampion = lineageTestChampion("Opponent", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: [dianaKeenHuntress, activeChampion],
        zones: {
          "material-deck": [seekersRifle, curvedDagger],
          hand: [dianaKeenHuntress, seekersRifle],
        },
      },
      playerTwo: {
        champion: opponentChampion,
        zones: { "material-deck": [seekersRifle] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const source = player.card(dianaKeenHuntress, { zone: "inner-lineage" });
    const invalidSource = player.card(dianaKeenHuntress, { zone: "hand" });
    const beforeInvalidSource = game.state;
    expect(() => player.activateAbility(invalidSource, "e3z4pyx8bd-a1")).toThrow();
    expect(game.state).toEqual(beforeInvalidSource);

    player.activateAbility(source, "e3z4pyx8bd-a1");
    expect(player.cards(dianaKeenHuntress, { zone: "banishment" })).toEqual([source]);
    expect(player.cards(seekersRifle, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-effect-choice");
    for (const invalid of [
      player.card(curvedDagger, { zone: "material-deck" }),
      player.card(seekersRifle, { zone: "hand" }),
      opponent.card(seekersRifle, { zone: "material-deck" }),
    ]) {
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
      expect(game.state).toEqual(before);
    }
    const gun = player.card(seekersRifle, { zone: "material-deck" });
    answerDecision(game, "resolve-effect-choice", [gun.objectId]);
    passEffectsStack(game);
    expect(game.state.decision).toMatchObject({
      kind: "announce-effect-materialization",
      playerId: player.id,
      cardId: gun.objectId,
      payCosts: true,
    });
    answerDecision(game, "announce-effect-materialization", {});
    passEffectsStack(game);

    expect(player.cards(seekersRifle, { zone: "field" })).toEqual([gun]);
    expect(player.cards(seekersRifle, { zone: "material-deck" })).toHaveLength(0);
    expect(game.state.objects[gun.objectId]!.controllerId).toBe(player.id);
    expect(game.state.decision).toBeNull();
  });
});
