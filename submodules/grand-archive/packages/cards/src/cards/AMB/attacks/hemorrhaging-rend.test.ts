import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { requireSingleFace } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { hemorrhagingRend } from "./hemorrhaging-rend.ts";

function poweredOpponent() {
  const champion = lineageTestChampion("Dealer", 0);
  const face = requireSingleFace(champion);
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...face, stats: { level: 0, life: 20, power: 30 } },
    },
  };
}

/** @covers xiazfnm292-a1 */
describe("Hemorrhaging Rend — [Damage 20+] Cleave", () => {
  it("cleaves only once the champion has 20 damage", () => {
    const { starter, lineage } = classBonusLeveledChampion(hemorrhagingRend, true, 0);
    const starterFace = requireSingleFace(starter);
    const tank = {
      ...starter,
      layout: {
        kind: "single-faced" as const,
        face: {
          ...starterFace,
          stats: { level: 0, life: 40 },
        },
      },
    };
    const dealer = poweredOpponent();
    const undamaged = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: tank,
        lineage,
        zones: {
          hand: [hemorrhagingRend, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion: dealer, zones: { field: [automatedGardener] } },
    });
    const player = undamaged.player("player-one");
    player.activate(hemorrhagingRend, {
      attackAttackerId: player.card(tank, { zone: "field" }).objectId,
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 4)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(undamaged);
    const hasCleave = (game: GrandArchiveTestEngine) =>
      game
        .player("player-one")
        .legalCommands()
        .some(
          (candidate) =>
            (candidate.command.move === "answer-decision" &&
              typeof candidate.command.answer === "object" &&
              candidate.command.answer !== null &&
              "cleavePlayerId" in candidate.command.answer) ||
            (candidate.command.move === "declare-attack" && "cleavePlayerId" in candidate.command),
        );
    expect(hasCleave(undamaged)).toBe(false);

    const damaged = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: tank,
        zones: {
          hand: [hemorrhagingRend, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: dealer,
        zones: {
          field: [automatedGardener],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const attacker = damaged.player("player-two");
    attacker.declareAttack(dealer, damaged.player("player-one").card(tank, { zone: "field" }));
    damaged.resolveCombatWithoutRetaliation();
    advanceToMain(damaged, damaged.player("player-one").id);
    const wounded = damaged.player("player-one").card(tank, { zone: "field" });
    expect(damaged.state.objects[wounded.objectId]!.damage).toBeGreaterThanOrEqual(20);
    damaged.player("player-one").activate(hemorrhagingRend, {
      attackAttackerId: wounded.objectId,
      reservePayment: damaged
        .player("player-one")
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 4)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(damaged);
    expect(hasCleave(damaged)).toBe(true);
  });
});
