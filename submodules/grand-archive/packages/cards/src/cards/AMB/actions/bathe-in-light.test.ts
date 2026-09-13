import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { batheInLight } from "./bathe-in-light.ts";

function durableChampion() {
  const base = createClassBonusTestChampion(batheInLight, false, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: { ...base.layout.face, stats: { ...base.layout.face.stats, life: 40 } },
    },
  };
}

function damagedGame() {
  const champion = durableChampion();
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [batheInLight, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: Array.from({ length: 4 }, () => ferventBeastmaster),
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const ownChampion = player.card(champion, { zone: "field" });
  for (const attacker of opponent.cards(ferventBeastmaster, { zone: "field" })) {
    opponent.declareAttack(attacker, ownChampion);
    game.resolveCombatWithoutRetaliation();
  }
  for (let step = 0; step < 128; step++) {
    if (game.state.turn.playerId === "player-one" && game.state.turn.phase === "main") break;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  return { game, player, ownChampion };
}

/** @covers d9zax2g20h-a1 */
describe("Bathe in Light — Recover 4", () => {
  it("recovers 4 damage immediately as it resolves", () => {
    const { game, player, ownChampion } = damagedGame();
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(12);
    player.activate(batheInLight, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
    });
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(12);
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(8);
  });
});

/** @covers d9zax2g20h-a2 */
describe("Bathe in Light — next recollection recover", () => {
  it("recovers 4 at the controller's next recollection and not the opponent's", () => {
    const { game, player, ownChampion } = damagedGame();
    player.activate(batheInLight, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
    });
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(8);
    advanceToRecollection(game, "player-two");
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(8);
    advanceToRecollection(game, "player-one");
    expect(game.state.stack).not.toHaveLength(0);
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(4);
  });
});
