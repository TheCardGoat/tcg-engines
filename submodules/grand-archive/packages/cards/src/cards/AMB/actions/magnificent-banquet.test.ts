import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { magnificentBanquet } from "./magnificent-banquet.ts";

function fixture(damage: number) {
  const champion = createClassBonusTestChampion(magnificentBanquet, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer: "playerTwo",
    playerOne: {
      champion,
      zones: {
        hand: [magnificentBanquet, woodlandSquirrels, woodlandSquirrels],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: Array.from({ length: damage }, () => woodlandSquirrels),
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  const player = game.player("player-one");
  const opponent = game.player("player-two");
  const target = player.card(champion, { zone: "field" });
  for (const attacker of opponent.cards(woodlandSquirrels, { zone: "field" })) {
    opponent.declareAttack(attacker, target);
    game.resolveCombatWithoutRetaliation();
  }
  opponent.pass();
  for (let step = 0; step < 64; step++) {
    if (game.state.turn.playerId === player.id && game.state.turn.phase === "main") break;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  return { game, player, champion, target };
}

/** @covers TQoTD8eGQH-a1 */
describe("Magnificent Banquet — recover then preserve", () => {
  it("recovers five and puts itself into the material deck preserved", () => {
    const { game, player, target } = fixture(6);
    expect(game.state.objects[target.objectId]!.damage).toBe(6);
    player.activate(magnificentBanquet, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
    const banquet = player.card(magnificentBanquet, { zone: "material-deck" });
    expect(game.state.objects[banquet.objectId]!.states.has("preserved")).toBe(true);
  });
});

/** @covers TQoTD8eGQH-a2 */
describe("Magnificent Banquet — preserved recollection recover", () => {
  it("recovers one on the controller's recollection only while preserved in the material deck", () => {
    const { game, player, target, champion } = fixture(6);
    player.activate(magnificentBanquet, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
    advanceToRecollection(game, game.player("player-two").id);
    expect(game.state.objects[target.objectId]!.damage).toBe(1);
    advanceToRecollection(game, player.id);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(0);
    expect(
      game.state.objects[game.player("player-two").card(champion, { zone: "field" }).objectId]!
        .damage,
    ).toBe(0);
  });
});
