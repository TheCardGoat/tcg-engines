import {
  cascadingRound,
  dianaDeadlyDuelist,
  dianaDuskstalker,
  dianaKeenHuntress,
  morriganLostSpirit,
  woodlandSquirrels,
} from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";

import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

describe("Champion materialization element exemption — Champion / Leveling Up 3", () => {
  it("enumerates and resolves a new-element champion without that element already enabled", () => {
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: morriganLostSpirit,
        lineage: [dianaKeenHuntress, dianaDeadlyDuelist],
        zones: {
          "material-deck": [dianaDuskstalker],
          memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: morriganLostSpirit },
    });
    const player = game.player("player-one");
    const card = player.card(dianaDuskstalker, { zone: "material-deck" });
    const champion = player.card(morriganLostSpirit, { zone: "field" });
    expect(
      player
        .legalCommands()
        .some(({ command }) => command.move === "materialize" && command.cardId === card.objectId),
    ).toBe(true);
    player.materialize(card);
    player.pass();
    game.player("player-two").pass();
    expect(game.state.objects[champion.objectId]?.activeDefinitionId).toBe(
      dianaDuskstalker.canonicalId,
    );
  });

  it("still rejects off-element regalia in both enumeration and admission", () => {
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: { champion: morriganLostSpirit, zones: { "material-deck": [cascadingRound] } },
      playerTwo: { champion: morriganLostSpirit },
    });
    const player = game.player("player-one");
    const card = player.card(cascadingRound, { zone: "material-deck" });
    expect(
      player
        .legalCommands()
        .some(({ command }) => command.move === "materialize" && command.cardId === card.objectId),
    ).toBe(false);
    const before = game.state;
    expect(() => player.materialize(card)).toThrow("every element required");
    expect(game.state).toEqual(before);
  });
});
