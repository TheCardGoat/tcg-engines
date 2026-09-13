import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { morriganLostSpirit } from "../../P23/champions/morrigan-lost-spirit.ts";
import { shiraLostSpirit } from "../../P24/champions/shira-lost-spirit.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";

/** @covers-card 6W5AJwF3Y3 */
describe("Woodland Squirrels", () => {
  it("resolves from hand as an awake ally on the field", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion: morriganLostSpirit, zones: { hand: [woodlandSquirrels] } },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");

    player.activate(woodlandSquirrels);
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");

    const ally = player.card(woodlandSquirrels, { zone: "field" });
    expect(game.state.objects[ally.objectId]?.states.has("rested")).toBe(false);
  });

  it("cannot be activated from the main deck", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion: morriganLostSpirit, zones: { "main-deck": [woodlandSquirrels] } },
      playerTwo: { champion: shiraLostSpirit },
    });

    expect(() => game.player("player-one").activate(woodlandSquirrels)).toThrow();
  });

  it("can attack while awake and rests when the attack is declared", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: morriganLostSpirit,
        zones: { field: [woodlandSquirrels] },
      },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const target = game.player("player-two").card(shiraLostSpirit, { zone: "field" });

    player.declareAttack(ally, target);

    expect(game.state.combat?.attackerId).toBe(ally.objectId);
    expect(game.state.objects[ally.objectId]?.states.has("attacking")).toBe(true);
    expect(game.state.objects[ally.objectId]?.states.has("rested")).toBe(true);
  });
});
