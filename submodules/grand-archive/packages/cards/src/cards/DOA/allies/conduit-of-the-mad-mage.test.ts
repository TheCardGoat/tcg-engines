import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { channelTheWind } from "../actions/channel-the-wind.ts";
import { glacialGuidance } from "../actions/glacial-guidance.ts";
import { shroudInMist } from "../actions/shroud-in-mist.ts";
import { cramSession } from "../actions/cram-session.ts";
import { conduitOfTheMadMage } from "./conduit-of-the-mad-mage.ts";

/** @covers 6SXL09rEzS-a1 @covers 6SXL09rEzS-a2 */
describe("Conduit of the Mad Mage", () => {
  for (const [action, cost, triggers] of [
    [channelTheWind, 2, true],
    [cramSession, 1, false],
    [shroudInMist, 5, false],
    [woodlandSquirrels, 0, false],
  ] as const) {
    it(`only ${action.slug} being a Mage Spell action wakes and strengthens Conduit`, () => {
      const base = createClassBonusTestChampion(conduitOfTheMadMage, false, "activation-discount");
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...requireSingleFace(base),
            elements: ["NORM", "WIND", "WATER", "ARCANE"] as const,
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [conduitOfTheMadMage],
            hand: [action, action, ...Array.from({ length: cost * 2 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [glacialGuidance, woodlandSquirrels], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(conduitOfTheMadMage);
      const power = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      p.pass();
      q.activate(glacialGuidance, {
        reservePayment: [
          { kind: "card", cardId: q.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
        targets: { "target-1": [source.objectId] },
      });
      passEffectsStack(game);
      expect(power()).toBe(0);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
      for (const expected of [1, 2]) {
        const card = p.cards(action, { zone: "hand" })[0]!;
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .filter((c) => c.objectId !== card.objectId)
            .slice(0, cost)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        passEffectsStack(game);
        expect(power()).toBe(triggers ? expected : 0);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(!triggers);
        if (triggers) {
          p.declareAttack(source, q.card(champion));
          game.resolveCombatWithoutRetaliation();
        }
      }
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(triggers ? 3 : 0);
      expect(p.cards(conduitOfTheMadMage, { zone: "field" })).toHaveLength(1);
      advanceToMain(game, q.id);
      expect(p.cards(conduitOfTheMadMage, { zone: "graveyard" })).toHaveLength(1);
    });
  }
});
