import { describe, expect, it } from "vitest";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { advanceToRecollection, proveAgingPotion } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { scavengeTheDistillery } from "../actions/scavenge-the-distillery.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { distilledAtrophy } from "./distilled-atrophy.ts";

/** @covers h38lrj5221-a1 */
describe("distilled-atrophy — Brew", () => {
  proveBrewPotion({
    card: distilledAtrophy,
    reserveCost: 3,
    ingredients: [blightroot, fraysia],
    wrongIngredients: [manaroot, fraysia],
  });
});

/** @covers h38lrj5221-a2 */
describe("Distilled Atrophy — aging", () => {
  proveAgingPotion({ card: distilledAtrophy });
});

/** @covers h38lrj5221-a3 */
describe("Distilled Atrophy — temporary level loss and damage", () => {
  for (const [age, originalLevel] of [
    [0, 0],
    [2, 1],
    [2, 2],
    [2, 3],
  ] as const) {
    it(`uses last-known age ${age} and checks the resulting level of a level-${originalLevel} champion`, () => {
      const champion = createClassBonusTestChampion(distilledAtrophy, true, "activation-discount");
      const defender = lineageTestChampion("Target", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [distilledAtrophy],
            hand: [scavengeTheDistillery, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: defender,
          lineage: Array.from({ length: originalLevel }, (_, i) =>
            lineageTestChampion("Target", i + 1),
          ),
          zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(defender, { zone: "field" });
      const level = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "level", {
          program: game.program,
          state: game.state,
          controllerId: game.player("player-two").id,
          bindings: {},
        });
      for (let turn = 0; turn < age; turn++) {
        advanceToRecollection(game, "player-one");
        passEffectsStack(game);
      }
      const potion = player.card(distilledAtrophy, { zone: "field" });
      expect(game.state.objects[potion.objectId]?.counters["named:age"] ?? 0).toBe(age);
      player.activateAbility(potion, "h38lrj5221-a3", {
        targets: { "target-champion": [target.objectId] },
      });
      expect(player.cards(distilledAtrophy, { zone: "field" })).toHaveLength(0);
      expect(level()).toBe(originalLevel);
      expect(game.state.objects[target.objectId]?.damage).toBe(0);
      passEffectsStack(game);
      expect(level()).toBe(originalLevel - age);
      const damage = originalLevel - age <= 0 ? age : 0;
      expect(game.state.objects[target.objectId]?.damage).toBe(damage);
      // Moving the source again must not retarget the modifier's last-known checkpoint.
      for (let step = 0; step < 32 && game.state.turn.phase !== "main"; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.state.turn.phase).toBe("main");
      player.activate(scavengeTheDistillery, {
        targets: { "target-card": [potion.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      expect(player.cards(distilledAtrophy, { zone: "hand" })).toHaveLength(1);
      expect(level()).toBe(originalLevel - age);
      const turn = game.state.turn.number;
      for (let step = 0; step < 32 && game.state.turn.number === turn; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(game.state.turn.number).toBe(turn + 1);
      expect(level()).toBe(originalLevel);
      expect(game.state.objects[target.objectId]?.damage).toBe(damage);
    });
  }
});
