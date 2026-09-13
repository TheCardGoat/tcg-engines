import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { igniteTheSoul } from "../../DOA/actions/ignite-the-soul.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { prismaticPerseverance } from "./prismatic-perseverance.ts";

function championAt(level: number) {
  const base = createClassBonusTestChampion(prismaticPerseverance, true, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  const leveled = grantTestChampionLevel(
    {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...base.layout.face, stats: { ...base.layout.face.stats, life: 30 } },
      },
    },
    level,
  );
  return leveled;
}

/** @covers x3ljhn5iu9-a1 */
describe("Prismatic Perseverance — all elements", () => {
  it("enables all elements only at level 2 with 15 or more damage", () => {
    const low = championAt(2);
    const undamaged = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: low,
        zones: {
          field: [prismaticPerseverance],
          hand: [igniteTheSoul, woodlandSquirrels],
        },
      },
      playerTwo: { champion: low },
    });
    const undamagedPlayer = undamaged.player("player-one");
    const before = undamaged.state;
    expect(() =>
      undamagedPlayer.activate(igniteTheSoul, {
        targets: { "target-1": [undamaged.player("player-two").card(low).objectId] },
        reservePayment: [
          { kind: "card", cardId: undamagedPlayer.card(woodlandSquirrels).objectId },
        ],
      }),
    ).toThrow();
    expect(undamaged.state).toEqual(before);

    const champion = championAt(2);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [prismaticPerseverance],
          hand: [igniteTheSoul, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: Array.from({ length: 8 }, () => automatedGardener),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const attackers = opponent.cards(automatedGardener, { zone: "field" });
    for (const attacker of attackers) {
      opponent.declareAttack(attacker, player.card(champion));
      game.resolveCombatWithoutRetaliation();
    }
    expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(16);
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== player.id)
      game.player(wait.playerId).pass();
    player.activate(igniteTheSoul, {
      targets: { "target-1": [opponent.card(champion).objectId] },
      reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
    });
    expect(player.cards(igniteTheSoul, { zone: "effects-stack" })).toHaveLength(1);
  });
});
