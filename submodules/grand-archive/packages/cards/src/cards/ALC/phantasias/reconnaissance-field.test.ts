import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { reconnaissanceField } from "./reconnaissance-field.ts";
import { loneGunslinger } from "../allies/lone-gunslinger.ts";
import { shimmercloakAssassin } from "../allies/shimmercloak-assassin.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";

/** @covers 2rz308kuz0-a2 */
describe("Reconnaissance Field — temporary combat keywords", () => {
  for (const distant of [false, true]) {
    for (const grants of [1, 2]) {
      it(`adds ${grants} ranged instances to an existing Ranged ally with distant ${distant}`, () => {
        const champion = createClassBonusTestChampion(
          reconnaissanceField,
          true,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [reconnaissanceField, reconnaissanceField, loneGunslinger],
              hand: [reposition, woodlandSquirrels],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const ally = player.card(loneGunslinger, { zone: "field" });
        const fields = player.cards(reconnaissanceField, { zone: "field" });
        if (distant) {
          player.activate(reposition, {
            targets: { "target-1": [ally.objectId] },
            reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
          });
          passEffectsStack(game);
        }
        for (const source of fields.slice(0, grants)) {
          const before = game.state;
          expect(() =>
            player.activateAbility(source, "2rz308kuz0-a2", {
              targets: { "target-1": [fields[0]!.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          player.activateAbility(source, "2rz308kuz0-a2", {
            targets: { "target-1": [ally.objectId] },
          });
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
          expect(() =>
            player.activateAbility(source, "2rz308kuz0-a2", {
              targets: { "target-1": [ally.objectId] },
            }),
          ).toThrow();
          passEffectsStack(game);
        }
        const target = game.player("player-two").card(champion, { zone: "field" });
        player.declareAttack(ally, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(1 + (distant ? 1 + grants : 0));
      });
    }
  }

  it("rejects the activation without Class Bonus before resting", () => {
    const champion = createClassBonusTestChampion(
      reconnaissanceField,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [reconnaissanceField, loneGunslinger] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.activateAbility(reconnaissanceField, "2rz308kuz0-a2", {
        targets: { "target-1": [player.card(loneGunslinger).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });

  for (const expires of [false, true]) {
    it(`grants True Sight only on resolution and expires at the current turn end (${expires})`, () => {
      const champion = createClassBonusTestChampion(
        reconnaissanceField,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: expires ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: {
            field: [reconnaissanceField, loneGunslinger, woodlandSquirrels],
            hand: [reposition, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [shimmercloakAssassin],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const ally = player.card(loneGunslinger, { zone: "field" });
      const hidden = opponent.card(shimmercloakAssassin);
      if (expires) opponent.pass();
      player.activate(reposition, {
        targets: { "target-1": [ally.objectId] },
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error("Expected Opportunity");
      if (wait.playerId !== player.id) game.player(wait.playerId).pass();
      if (!expires) expect(() => player.declareAttack(ally, hidden)).toThrow();
      player.activateAbility(reconnaissanceField, "2rz308kuz0-a2", {
        targets: { "target-1": [ally.objectId] },
      });
      if (!expires) expect(() => player.declareAttack(ally, hidden)).toThrow();
      passEffectsStack(game);
      if (expires) {
        advanceToRecollection(game, player.id);
        for (let step = 0; step < 16 && game.state.turn.phase !== "main"; step++) {
          const next = game.waitState();
          if (next.kind !== "opportunity") throw new Error(`Unexpected ${next.kind}`);
          game.player(next.playerId).pass();
        }
        expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);
        expect(() => player.declareAttack(ally, hidden)).toThrow();
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(ally, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(2);
      } else {
        expect(() =>
          player.declareAttack(player.card(woodlandSquirrels, { zone: "field" }), hidden),
        ).toThrow();
        player.declareAttack(ally, hidden);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[hidden.objectId]!.zone).toBe("graveyard");
      }
    });
  }
});

/** @covers 2rz308kuz0-a1 */
describe("Reconnaissance Field — inspect opponent's hand and memory", () => {
  for (const handCount of [0, 2]) {
    for (const memoryCount of [0, 2]) {
      it(`shows ${handCount} hand and ${memoryCount} memory cards to its controller only on entry-trigger resolution`, () => {
        const champion = createClassBonusTestChampion(
          reconnaissanceField,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [reconnaissanceField, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              memory: [reposition],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [woodlandSquirrels, reposition].slice(0, handCount),
              memory: [reposition, woodlandSquirrels].slice(0, memoryCount),
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const hand = opponent.zone("hand");
        const memory = opponent.zone("memory");
        player.activate(reconnaissanceField, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        const ownMemory = player.zone("memory");
        passEffectsStack(game);
        expect(player.cards(reconnaissanceField, { zone: "field" })).toHaveLength(1);
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
        const before = game.state;
        expect(() =>
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-opponent": [player.id] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-opponent": [opponent.id] },
        });
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
        passEffectsStack(game);
        const looked = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
        if (handCount + memoryCount > 0) {
          expect(looked).toHaveLength(1);
          expect(looked[0]).toMatchObject({
            playerId: player.id,
            objectIds: expect.arrayContaining([...hand, ...memory].map((ref) => ref.objectId)),
          });
          if (looked[0]?.type === "cards-looked-at")
            expect(looked[0].objectIds).toHaveLength(handCount + memoryCount);
        } else expect(looked).toHaveLength(0);
        expect(opponent.zone("hand")).toEqual(hand);
        expect(opponent.zone("memory")).toEqual(memory);
        expect(player.zone("memory")).toEqual(ownMemory);
        expect(opponent.zone("main-deck")).toHaveLength(1);
      });
    }
  }
});
