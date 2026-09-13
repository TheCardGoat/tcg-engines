import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveBowMustBeLoaded } from "../../../testing/bow-loaded.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { anathemasEnd } from "../../ALC/items/anathemas-end.ts";
import { seekersRifle } from "../../ALC/weapons/seekers-rifle.ts";
import { sojournersHunt } from "./sojourners-hunt.ts";

/** @covers aqlbuznsz4-a1 */
describe("Sojourner's Hunt — Bow", () => {
  proveBowMustBeLoaded({ card: sojournersHunt });
});

/** @covers aqlbuznsz4-a2 */
describe("Sojourner's Hunt — chosen weapon subtype", () => {
  it("becomes a Gun in addition to Bow until end of turn", () => {
    const { starter } = classBonusLeveledChampion(sojournersHunt, true, 0);
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [seekersRifle],
      playerOne: {
        champion: starter,
        zones: { field: [sojournersHunt, anathemasEnd] },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const bow = player.card(sojournersHunt, { zone: "field" });
    const before = game.state;
    expect(() =>
      player.activateAbility(anathemasEnd, "ii17fzcyfr-a1", {
        targets: { "target-weapon": [bow.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activateAbility(sojournersHunt, "aqlbuznsz4-a2");
    passEffectsStack(game);
    player.executeLegal(
      (candidate) =>
        candidate.command.move === "answer-decision" &&
        JSON.stringify(candidate.command.answer).toUpperCase().includes("GUN"),
      "choose Gun",
    );
    passEffectsStack(game);
    player.activateAbility(anathemasEnd, "ii17fzcyfr-a1", {
      targets: { "target-weapon": [bow.objectId] },
    });
    passEffectsStack(game);
    expect(player.cards(anathemasEnd, { zone: "loaded" })).toHaveLength(1);
  });
});
