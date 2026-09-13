import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { morriganLostSpirit } from "../../P23/champions/morrigan-lost-spirit.ts";
import { shiraLostSpirit } from "../../P24/champions/shira-lost-spirit.ts";
import { lorraineWanderingWarrior } from "../../DEMO22/champions/lorraine-wandering-warrior.ts";
import { trainingSword } from "./training-sword.ts";

/** @covers-card b0qlk9j6le */
describe("Training Sword", () => {
  it("materializes with two durability counters", () => {
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion: morriganLostSpirit,
        zones: { "material-deck": [trainingSword] },
      },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");

    player.materialize(trainingSword);
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");

    const weapon = player.card(trainingSword, { zone: "field" });
    expect(game.state.objects[weapon.objectId]?.counters.durability).toBe(2);
  });

  it("adds its power to an attack and loses one durability after dealing combat damage", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: morriganLostSpirit,
        lineage: [lorraineWanderingWarrior],
        zones: { field: [trainingSword] },
      },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");
    const champion = player.card(morriganLostSpirit, { zone: "field" });
    const weapon = player.card(trainingSword, { zone: "field" });
    const target = game.player("player-two").card(shiraLostSpirit, { zone: "field" });

    player.declareAttack(champion, target, { weaponIds: [weapon.objectId] });
    expect(game.state.objects[weapon.objectId]?.states.has("wielded")).toBe(true);
    game.resolveCombatWithoutRetaliation();

    expect(game.state.objects[weapon.objectId]?.counters.durability).toBe(1);
    expect(game.state.objects[target.objectId]?.damage).toBe(1);
    expect(game.state.combat).toBeNull();
  });
});
