import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { battlefieldSpotter } from "./battlefield-spotter.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { loneGunslinger } from "./lone-gunslinger.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { reposition } from "../actions/reposition.ts";
import { magebaneLash } from "../weapons/magebane-lash.ts";

function windChampion(level: number) {
  const card = lineageTestChampion("Spotter test", level);
  if (card.layout.kind !== "single-faced") throw new Error("Expected single face");
  return {
    ...card,
    layout: {
      kind: "single-faced" as const,
      face: { ...card.layout.face, elements: ["NORM", "WIND"] as const },
    },
  };
}

/** @covers 44vm5kt3q2-a2 */
describe("Battlefield Spotter — level-based grant to other controlled units", () => {
  for (const level of [1, 2, 3]) {
    for (const subject of ["ally", "champion", "self", "opposing"] as const) {
      for (const distant of [false, true]) {
        it(`level=${level}, subject=${subject}, distant=${distant}`, () => {
          const champion = windChampion(0);
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: subject === "opposing" ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              lineage: Array.from({ length: level }, (_, i) => windChampion(i + 1)),
              zones: {
                field: [battlefieldSpotter, loneGunslinger, magebaneLash],
                hand: [reposition, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [loneGunslinger], hand: [reposition, woodlandSquirrels] },
            },
          });
          const player = game.player(subject === "opposing" ? "player-two" : "player-one");
          const opponent = game.player(subject === "opposing" ? "player-one" : "player-two");
          const attacker = player.card(
            subject === "champion"
              ? champion
              : subject === "self"
                ? battlefieldSpotter
                : loneGunslinger,
          );
          if (distant) {
            player.activate(reposition, {
              targets: { "target-1": [attacker.objectId] },
              reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
            });
            passEffectsStack(game);
          }
          const target = opponent.card(champion);
          player.declareAttack(
            attacker,
            target,
            subject === "champion" ? { weaponIds: [player.card(magebaneLash).objectId] } : {},
          );
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          game.resolveCombatWithoutRetaliation();
          const base = subject === "champion" ? 0 : 1;
          const intrinsic = subject === "ally" || subject === "opposing" ? 1 : 0;
          const granted = level >= 2 && (subject === "ally" || subject === "champion") ? 1 : 0;
          expect(game.state.objects[target.objectId]!.damage).toBe(
            base + (distant ? intrinsic + granted : 0),
          );
        });
      }
    }
  }

  for (const removeOne of [false, true]) {
    it(`stacks separate sources and removes the departed source's grant (${removeOne})`, () => {
      const champion = windChampion(0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          lineage: [windChampion(1), windChampion(2)],
          zones: {
            field: [battlefieldSpotter, battlefieldSpotter, loneGunslinger],
            hand: [reposition, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [automatedGardener], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      if (removeOne) {
        const removed = player.cards(battlefieldSpotter)[0]!;
        opponent.declareAttack(automatedGardener, removed);
        game.resolveCombatWithoutRetaliation();
        expect(player.zone("graveyard")).toEqual([removed]);
      }
      advanceToRecollection(game, player.id);
      for (let step = 0; game.state.turn.phase !== "main" && step < 10; step++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      const attacker = player.card(loneGunslinger);
      player.activate(reposition, {
        targets: { "target-1": [attacker.objectId] },
        reservePayment: [
          { kind: "card", cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      const target = opponent.card(champion);
      player.declareAttack(attacker, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(removeOne ? 3 : 4);
    }, 15_000);
  }
});

/** @covers 44vm5kt3q2-a1 */
describe("Battlefield Spotter — another controlled ally becomes distant", () => {
  for (const classBonus of [false, true]) {
    for (const available of [false, true]) {
      it(`requires Class Bonus (${classBonus}) and another ally (${available}) at entry`, () => {
        const champion = createClassBonusTestChampion(
          battlefieldSpotter,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [battlefieldSpotter, woodlandSquirrels, woodlandSquirrels],
              field: available ? [woodlandSquirrels, woodlandSquirrels] : [],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(battlefieldSpotter, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        player.pass();
        opponent.pass();
        const spotter = player.card(battlefieldSpotter, { zone: "field" });
        const allies = player.cards(woodlandSquirrels, { zone: "field" });
        for (const ref of [spotter, ...allies])
          expect(game.state.objects[ref.objectId]!.states.has("distant")).toBe(false);
        if (classBonus && available) {
          for (const invalid of [
            spotter,
            player.card(champion),
            opponent.card(woodlandSquirrels),
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [allies[1]!.objectId] },
          });
          expect(game.state.objects[allies[1]!.objectId]!.states.has("distant")).toBe(false);
          passEffectsStack(game);
          expect(game.state.objects[allies[1]!.objectId]!.states.has("distant")).toBe(true);
          expect(game.state.objects[allies[0]!.objectId]!.states.has("distant")).toBe(false);
          advanceToRecollection(game, "player-two");
          expect(game.state.objects[allies[1]!.objectId]!.states.has("distant")).toBe(false);
        } else {
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          for (const ally of allies)
            expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
        }
        for (const ref of [spotter, player.card(champion), opponent.card(woodlandSquirrels)])
          expect(game.state.objects[ref.objectId]!.states.has("distant")).toBe(false);
      });
    }
  }
});
