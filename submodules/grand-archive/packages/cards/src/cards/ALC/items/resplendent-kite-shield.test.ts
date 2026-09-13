import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { igniteTheSoul } from "../../DOA/actions/ignite-the-soul.ts";
import { resplendentKiteShield } from "./resplendent-kite-shield.ts";

function materializeShield(classBonus: boolean, withOpponentSpells = false) {
  const champion = createClassBonusTestChampion(
    resplendentKiteShield,
    classBonus,
    "activation-discount",
  );
  const opponentChampion = createClassBonusTestChampion(
    igniteTheSoul,
    false,
    "activation-discount",
  );
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion,
      zones: {
        "material-deck": [resplendentKiteShield],
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion: opponentChampion,
      zones: withOpponentSpells
        ? {
            hand: [igniteTheSoul, igniteTheSoul, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          }
        : { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
    },
  });
  const player = game.player("player-one");
  player.materialize(resplendentKiteShield);
  player.pass();
  game.player("player-two").pass();
  passEffectsStack(game);
  for (let step = 0; game.state.turn.phase !== "main" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  return { game, champion };
}

/** @covers a5uhjxhkur-a1 */
describe("Resplendent Kite Shield — refinement on entry", () => {
  for (const classBonus of [false, true]) {
    it(`gets ${classBonus ? 2 : 1} refinement with Class Bonus ${classBonus}`, () => {
      const { game } = materializeShield(classBonus);
      const shield = game.player("player-one").card(resplendentKiteShield, { zone: "field" });
      expect(game.state.objects[shield.objectId]!.counters["named:refinement"]).toBe(
        classBonus ? 2 : 1,
      );
    });
  }
});

/** @covers a5uhjxhkur-a2 */
describe("Resplendent Kite Shield — one-point prevention", () => {
  it("pays rest and refinement up front, then prevents only the next champion damage", () => {
    const { game, champion } = materializeShield(false, true);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const shield = player.card(resplendentKiteShield, { zone: "field" });
    const target = player.card(champion, { zone: "field" });
    player.activateAbility(resplendentKiteShield, "a5uhjxhkur-a2");
    expect(game.state.objects[shield.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[shield.objectId]!.counters["named:refinement"] ?? 0).toBe(0);
    const afterPayment = game.state;
    expect(() => player.activateAbility(resplendentKiteShield, "a5uhjxhkur-a2")).toThrow();
    expect(game.state).toEqual(afterPayment);
    passEffectsStack(game);

    for (const expectedDamage of [0, 1]) {
      player.pass();
      const spell = opponent.cards(igniteTheSoul, { zone: "hand" })[0]!;
      const payment = opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!;
      opponent.activate(spell, {
        reservePayment: [{ kind: "card", cardId: payment.objectId }],
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.damage).toBe(expectedDamage);
    }
  });
});
