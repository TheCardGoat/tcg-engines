import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { utherIllustriousKing } from "../allies/uther-illustrious-king.ts";
import { ominousShadow } from "./ominous-shadow.ts";

function attackingChampion() {
  const champion = createClassBonusTestChampion(ominousShadow, false, "activation-discount");
  const face = requireSingleFace(champion);
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...face, stats: { ...face.stats, power: 1 } },
    },
  };
}

/** @covers gveirpdm44-a2 */
describe("Ominous Shadow — prevent 3 damage", () => {
  it("prevents exactly three from each damage event", () => {
    const champion = attackingChampion();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [ominousShadow] } },
      playerTwo: { champion, zones: { field: [utherIllustriousKing, woodlandSquirrels] } },
    });
    const defender = game.player("player-one");
    const attacker = game.player("player-two");
    const source = defender.card(ominousShadow);
    attacker.declareAttack(woodlandSquirrels, source);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[source.objectId]!.damage).toBe(0);
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== attacker.id)
      game.player(wait.playerId).pass();
    attacker.declareAttack(utherIllustriousKing, source);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[source.objectId]!.damage).toBe(1);
  });
});

/** @covers gveirpdm44-a3 */
describe("Ominous Shadow — champion combat-history restriction", () => {
  it("can attack only a unit its champion damaged in combat this turn", () => {
    const champion = attackingChampion();
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [ominousShadow] } },
      playerTwo: { champion, zones: { field: [giantTortoise, woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const source = player.card(ominousShadow);
    const marked = opponent.card(giantTortoise);
    const unmarked = opponent.card(woodlandSquirrels);
    const before = game.state;
    expect(() => player.declareAttack(source, marked)).toThrow();
    expect(game.state).toEqual(before);
    player.declareAttack(player.card(champion), marked);
    game.resolveCombatWithoutRetaliation();
    const afterChampionHit = game.state;
    expect(() => player.declareAttack(source, unmarked)).toThrow();
    expect(game.state).toEqual(afterChampionHit);
    player.declareAttack(source, marked);
    expect(game.state.combat?.targetIds).toEqual([marked.objectId]);
  });
});
