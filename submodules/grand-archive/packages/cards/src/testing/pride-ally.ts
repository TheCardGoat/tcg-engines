import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { lineageTestChampion } from "./champion-lineage.ts";
import { grandArchiveTestFace } from "./class-bonus-test-champion.ts";

/** Parameterized Pride N is card-specific: prove attack legality at the printed threshold. */
export function provePrideAlly({
  card,
  pride,
  power,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly pride: number;
  readonly power: number;
}): void {
  const face = grandArchiveTestFace(card);
  if (typeof face.stats.power !== "number") {
    throw new Error(`${face.name} must have printed power to prove Pride combat.`);
  }

  function setup(level: number) {
    const starter = lineageTestChampion("Pride", 0);
    return GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage: Array.from({ length: level }, (_, index) =>
          lineageTestChampion("Pride", index + 1),
        ),
        zones: { field: [card] },
      },
      playerTwo: { champion: lineageTestChampion("Pride opponent", 0) },
    });
  }

  it(`rejects an attack while the champion is below Pride ${pride}`, () => {
    const game = setup(Math.max(0, pride - 1));
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const before = game.state;
    expect(() =>
      player.declareAttack(
        player.card(card, { zone: "field" }),
        opponent.card(lineageTestChampion("Pride opponent", 0), { zone: "field" }),
      ),
    ).toThrow(/disobedient|cannot declare an attack/i);
    expect(game.state).toEqual(before);
  });

  it(`attacks for printed power once the champion reaches Pride ${pride}`, () => {
    const game = setup(pride);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(lineageTestChampion("Pride opponent", 0), { zone: "field" });
    player.declareAttack(player.card(card, { zone: "field" }), target);
    expect(game.state.objects[target.objectId]?.damage).toBe(0);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]?.damage).toBe(power);
  });
}
