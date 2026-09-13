import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { shiraLostSpirit } from "../../P24/champions/shira-lost-spirit.ts";
import { morriganLostSpirit } from "./morrigan-lost-spirit.ts";

/** @covers 0rapy8v7x0-a1 */
describe("Morrigan, Lost Spirit", () => {
  it("starts as the level 0 champion with its printed life boundary", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion: morriganLostSpirit },
      playerTwo: { champion: shiraLostSpirit },
    });
    const champion = game.player("player-one").card(morriganLostSpirit, { zone: "field" });
    const face = game.program.cardsById[champion.definitionId];
    const printed =
      face?.layout.kind === "single-faced" ? face.layout.face : face?.layout.defaultFace;

    expect(printed?.stats).toMatchObject({ level: 0, life: 15 });
    expect(game.state.objects[champion.objectId]?.zone).toBe("field");
  });

  it("draws seven cards when the starting champion enters through pre-game", () => {
    const openingDeck = Array.from({ length: 7 }, () => woodlandSquirrels);
    const game = GrandArchiveTestEngine.startFixture({
      pregame: "resolve",
      playerOne: {
        champion: morriganLostSpirit,
        zones: { "main-deck": openingDeck },
      },
      playerTwo: {
        champion: shiraLostSpirit,
        zones: { "main-deck": openingDeck },
      },
    });
    const player = game.player("player-one");

    expect(game.state.status).toBe("playing");
    expect(player.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(7);
    expect(player.zone("main-deck")).toHaveLength(0);
    expect(player.card(morriganLostSpirit, { zone: "field" }).definitionId).toBe(
      morriganLostSpirit.canonicalId,
    );
  });

  it("arranges a requested card from the zone reached during pre-game", () => {
    const game = GrandArchiveTestEngine.startFixture({
      pregame: "resolve",
      playerOne: {
        champion: morriganLostSpirit,
        zones: { memory: [woodlandSquirrels] },
      },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");

    expect(player.cards(woodlandSquirrels, { zone: "memory" })).toHaveLength(1);
    expect(player.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(0);
  });
});
