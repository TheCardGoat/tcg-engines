import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sealedBladeDoa } from "../../DOA/weapons/sealed-blade-doa.ts";
import { magebaneLash } from "../weapons/magebane-lash.ts";
import { attuneWithFlames } from "./attune-with-flames.ts";

function fixture(classBonus: boolean, firstPlayer: "playerOne" | "playerTwo" = "playerOne") {
  const champion = createClassBonusTestChampion(
    attuneWithFlames,
    classBonus,
    "activation-discount",
  );
  const game = GrandArchiveTestEngine.startFixture({
    firstPlayer,
    playerOne: {
      champion,
      zones: {
        hand: [attuneWithFlames, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
        field: [magebaneLash, sealedBladeDoa],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [magebaneLash],
        "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
      },
    },
  });
  return { game, champion };
}

function options(game: GrandArchiveTestEngine, reserve: number) {
  const player = game.player("player-one");
  return {
    reservePayment: player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, reserve)
      .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    targets: { "target-1": [player.card(magebaneLash, { zone: "field" }).objectId] },
  };
}

function reachOpponentRecollection(game: GrandArchiveTestEngine): void {
  advanceToRecollection(game, "player-two");
  game.player("player-two").pass();
}

function advanceToOwnMain(game: GrandArchiveTestEngine, afterTurn: number): void {
  for (let step = 0; step < 192; step++) {
    if (
      game.state.turn.number > afterTurn &&
      game.state.turn.playerId === "player-one" &&
      game.state.turn.phase === "main"
    )
      return;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  throw new Error("Did not reach player one's main phase");
}

/** @covers nvx7mnu1xh-a1 */
describe("Attune with Flames — Class Bonus discount", () => {
  for (const classBonus of [false, true]) {
    it(`requires exactly ${classBonus ? 4 : 6} reserve with Class Bonus ${classBonus}`, () => {
      const cost = classBonus ? 4 : 6;
      const { game } = fixture(classBonus);
      reachOpponentRecollection(game);
      const player = game.player("player-one");
      const before = game.state;
      expect(() => player.activate(attuneWithFlames, options(game, cost - 1))).toThrow();
      expect(game.state).toEqual(before);
      player.activate(attuneWithFlames, options(game, cost));
    });
  }
});

/** @covers nvx7mnu1xh-a2 */
describe("Attune with Flames — opponent recollection restriction", () => {
  it("rejects both players' main phases without paying costs", () => {
    for (const firstPlayer of ["playerOne", "playerTwo"] as const) {
      const { game } = fixture(true, firstPlayer);
      if (firstPlayer === "playerTwo") {
        game.player("player-two").pass();
      }
      const player = game.player("player-one");
      const before = game.state;
      expect(() => player.activate(attuneWithFlames, options(game, 4))).toThrow();
      expect(game.state).toEqual(before);
    }
  });
});

/** @covers nvx7mnu1xh-a3 */
describe("Attune with Flames — Guardian weapon bonus", () => {
  it("rejects wrong targets and grants +5 through the end of the controller's next turn", () => {
    const { game, champion } = fixture(true);
    reachOpponentRecollection(game);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    for (const invalid of [
      player.card(sealedBladeDoa, { zone: "field" }),
      opponent.card(magebaneLash, { zone: "field" }),
      player.card(champion, { zone: "field" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(attuneWithFlames, {
          ...options(game, 4),
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }

    const activationTurn = game.state.turn.number;
    player.activate(attuneWithFlames, options(game, 4));
    passEffectsStack(game);
    advanceToOwnMain(game, activationTurn);
    const attacker = player.card(champion, { zone: "field" });
    const defender = opponent.card(champion, { zone: "field" });
    const weapon = player.card(magebaneLash, { zone: "field" });
    player.declareAttack(attacker, defender, { weaponIds: [weapon.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(5);

    const protectedTurn = game.state.turn.number;
    advanceToOwnMain(game, protectedTurn);
    player.declareAttack(attacker, defender, { weaponIds: [weapon.objectId] });
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(5);
  }, 15_000);
});
