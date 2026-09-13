import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { sanguineGoblet } from "./sanguine-goblet.ts";

function durableChampion() {
  const base = createClassBonusTestChampion(sanguineGoblet, true, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...base.layout.face, stats: { ...base.layout.face.stats, life: 25 } },
    },
  };
}

/** @covers mnz5kgifhd-a1 */
describe("Sanguine Goblet — blood from champion damage", () => {
  it("puts that many blood counters when the champion is dealt damage", () => {
    const champion = durableChampion();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [sanguineGoblet] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const goblet = player.card(sanguineGoblet, { zone: "field" });
    game.player("player-two").declareAttack(automatedGardener, player.card(champion));
    game.resolveCombatWithoutRetaliation();
    passEffectsStack(game);
    expect(game.state.objects[goblet.objectId]!.counters["named:blood"]).toBe(2);
  });
});

/** @covers mnz5kgifhd-a2 */
describe("Sanguine Goblet — draw at eight blood", () => {
  it("banishes itself to draw only with eight or more blood counters", () => {
    const champion = durableChampion();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { field: [sanguineGoblet], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: { field: Array.from({ length: 4 }, () => automatedGardener) },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const goblet = player.card(sanguineGoblet, { zone: "field" });
    const top = player.zone("main-deck")[0]!;
    const attackers = opponent.cards(automatedGardener, { zone: "field" });
    opponent.declareAttack(attackers[0]!, player.card(champion));
    game.resolveCombatWithoutRetaliation();
    passEffectsStack(game);
    const before = game.state;
    expect(() => player.activateAbility(goblet, "mnz5kgifhd-a2")).toThrow();
    expect(game.state).toEqual(before);
    for (const attacker of attackers.slice(1)) {
      opponent.declareAttack(attacker, player.card(champion));
      game.resolveCombatWithoutRetaliation();
      passEffectsStack(game);
    }
    expect(game.state.objects[goblet.objectId]!.counters["named:blood"]).toBe(8);
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== player.id)
      game.player(wait.playerId).pass();
    player.activateAbility(goblet, "mnz5kgifhd-a2");
    expect(player.cards(sanguineGoblet, { zone: "field" })).toHaveLength(0);
    expect(game.state.objects[top.objectId]?.zone).toBe("main-deck");
    passEffectsStack(game);
    expect(game.state.objects[top.objectId]?.zone).toBe("hand");
  });
});
