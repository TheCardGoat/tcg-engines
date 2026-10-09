import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { spellshieldWind } from "./spellshield-wind.ts";

/** @covers 99sx6q3p6i-a1 */
describe("spellshield-wind — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: spellshieldWind, discount: 1 });
});

/** @covers 99sx6q3p6i-a2 */
describe("Spellshield: Wind — next champion damage", () => {
  for (const damage of [2, 3]) {
    it(`prevents ${damage}, ${damage >= 3 ? "adds" : "does not add"} a buff, and is consumed once`, () => {
      const champion = createClassBonusTestChampion(spellshieldWind, true, "activation-discount");
      const damagingAlly = damage === 2 ? automatedGardener : ferventBeastmaster;
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [spellshieldWind, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            field: [giantTortoise],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [automatedGardener, damagingAlly, damagingAlly] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const protectedChampion = player.card(champion, { zone: "field" });
      const buffTarget = player.card(giantTortoise, { zone: "field" });
      opponent.pass();
      player.activate(spellshieldWind, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      passEffectsStack(game);
      const resolveCombat = () => {
        for (let step = 0; step < 128; step++) {
          if (!game.state.combat && !game.state.stack.length && !game.state.decision) return;
          if (game.state.decision?.kind === "resolve-effect-choice")
            answerDecision(game, "resolve-effect-choice", [buffTarget.objectId]);
          else if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", []);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        throw new Error("Combat and its counter choice did not finish");
      };

      opponent.declareAttack(opponent.cards(automatedGardener, { zone: "field" })[0]!, buffTarget);
      resolveCombat();
      expect(game.state.objects[buffTarget.objectId]!.damage).toBe(2);
      expect(game.state.objects[buffTarget.objectId]!.counters.buff ?? 0).toBe(0);

      const attackers = opponent.cards(damagingAlly, { zone: "field" });
      opponent.declareAttack(attackers[damage === 2 ? 1 : 0]!, protectedChampion);
      resolveCombat();
      expect(game.state.objects[protectedChampion.objectId]!.damage).toBe(0);
      expect(game.state.objects[buffTarget.objectId]!.counters.buff ?? 0).toBe(damage >= 3 ? 1 : 0);

      opponent.declareAttack(attackers[damage === 2 ? 2 : 1]!, protectedChampion);
      resolveCombat();
      expect(game.state.objects[protectedChampion.objectId]!.damage).toBe(damage);
      expect(game.state.objects[buffTarget.objectId]!.counters.buff ?? 0).toBe(damage >= 3 ? 1 : 0);
    });
  }
});
