import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { ordinaryHorse } from "./ordinary-horse.ts";
import { caoCaoAspirantOfChaos } from "./cao-cao-aspirant-of-chaos.ts";

/** @covers d5og6z31q9-a1 */
describe("Cao Cao, Aspirant of Chaos — Equestrian activation discount", () => {
  for (const horse of [false, true]) {
    it(`${horse ? "costs 2" : "costs 5"} with a Horse ally=${horse}`, () => {
      const champion = createClassBonusTestChampion(
        caoCaoAspirantOfChaos,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [caoCaoAspirantOfChaos, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            field: horse ? [galesMare] : [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [galesMare] } },
      });
      const player = game.player("player-one");
      const payments = player.cards(woodlandSquirrels, { zone: "hand" });
      const cost = horse ? 2 : 5;
      const before = game.state;
      expect(() =>
        player.activate(caoCaoAspirantOfChaos, {
          reservePayment: payments
            .slice(0, cost - 1)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(caoCaoAspirantOfChaos, {
        reservePayment: payments
          .slice(0, cost)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers d5og6z31q9-a2 */
describe("Cao Cao, Aspirant of Chaos — Class Bonus On Attack banish", () => {
  for (const classBonus of [false, true]) {
    for (const banish of [false, true]) {
      it(`Class Bonus=${classBonus}, banish floating memory=${banish}`, () => {
        const champion = createClassBonusTestChampion(
          caoCaoAspirantOfChaos,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [caoCaoAspirantOfChaos],
              graveyard: [ordinaryHorse, woodlandSquirrels],
              hand: [glacialGuidance, woodlandSquirrels],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const rested = opponent.cards(woodlandSquirrels, { zone: "field" })[0]!;
        const awake = opponent.cards(woodlandSquirrels, { zone: "field" })[1]!;
        player.activate(glacialGuidance, {
          targets: { "target-1": [rested.objectId] },
          reservePayment: [
            { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        passEffectsStack(game);
        expect(game.state.objects[rested.objectId]!.states.has("rested")).toBe(true);
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(caoCaoAspirantOfChaos, target);
        if (!classBonus) {
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[rested.objectId]!.damage).toBe(0);
          expect(player.cards(ordinaryHorse, { zone: "graveyard" })).toHaveLength(1);
          return;
        }
        advanceCombatToTrigger(game, "d5og6z31q9-a2");
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", banish);
          passEffectsStack(game);
        }
        if (banish && game.state.decision?.kind === "resolve-effect-choice") {
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [
              player.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
            ]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", [
            player.card(ordinaryHorse, { zone: "graveyard" }).objectId,
          ]);
          passEffectsStack(game);
        }
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[awake.objectId]!.damage).toBe(0);
        if (banish) {
          expect(opponent.zone("graveyard")).toContainEqual(rested);
          expect(player.cards(ordinaryHorse, { zone: "banishment" })).toHaveLength(1);
        } else {
          expect(game.state.objects[rested.objectId]!.damage).toBe(0);
          expect(player.cards(ordinaryHorse, { zone: "graveyard" })).toHaveLength(1);
        }
      });
    }
  }
});
