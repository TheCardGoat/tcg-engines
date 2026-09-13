import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { snowFairy } from "../../DOA/allies/snow-fairy.ts";
import { raiManaWeaver } from "../../DOA/champions/rai-mana-weaver.ts";
import { morriganLostSpirit } from "../../P23/champions/morrigan-lost-spirit.ts";
import { shiraLostSpirit } from "../../P24/champions/shira-lost-spirit.ts";
import { explosiveRune } from "./explosive-rune.ts";

/** @covers 1bqry41lw9-a1 */
describe("Explosive Rune", () => {
  it("banishes itself to deal 1 damage to a non-attacking ally", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion: morriganLostSpirit, zones: { field: [explosiveRune] } },
      playerTwo: { champion: shiraLostSpirit, zones: { field: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const target = game.player("player-two").card(woodlandSquirrels, { zone: "field" });

    player.activateAbility(explosiveRune, "1bqry41lw9-a1", {
      targets: { "target-ally": [target.objectId] },
    });
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");

    expect(player.card(explosiveRune, { zone: "banishment" }).definitionId).toBe(
      explosiveRune.canonicalId,
    );
    expect(game.state.objects[target.objectId]?.zone).toBe("graveyard");
  });

  it("deals 2 damage to an attacking ally when Class Bonus is enabled", () => {
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: morriganLostSpirit,
        lineage: [raiManaWeaver],
        zones: { field: [explosiveRune] },
      },
      playerTwo: {
        champion: shiraLostSpirit,
        zones: { field: [snowFairy] },
      },
    });
    const defender = game.player("player-one");
    const attacker = game.player("player-two");
    const attackingAlly = attacker.card(snowFairy, { zone: "field" });
    const defendingChampion = defender.card(morriganLostSpirit, { zone: "field" });

    attacker.declareAttack(attackingAlly, defendingChampion);
    expect(game.state.combat?.attackerId).toBe(attackingAlly.objectId);
    attacker.pass();

    defender.activateAbility(explosiveRune, "1bqry41lw9-a1", {
      targets: { "target-ally": [attackingAlly.objectId] },
    });
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");

    expect(game.state.objects[attackingAlly.objectId]?.zone).toBe("graveyard");
    expect(
      game.state.eventHistory.some(
        (event) =>
          event.type === "damage-marked" &&
          event.objectId === attackingAlly.objectId &&
          event.amount === 2,
      ),
    ).toBe(true);
  });
});
