import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { reposition } from "../actions/reposition.ts";
import { falseStep } from "../actions/false-step.ts";
import { supplyDrone } from "./supply-drone.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { gloamspireWraith } from "./gloamspire-wraith.ts";

/** @covers xrpx8jypwc-a1 */
describe("Gloamspire Wraith — Class Bonus Ranged 2", () => {
  proveRangedAlly({ card: gloamspireWraith, power: 3, ranged: 2, classBonus: true });
});

/** @covers xrpx8jypwc-a2 */
describe("Gloamspire Wraith — distant hit recovery", () => {
  for (const classBonus of [false, true]) {
    for (const lethal of [false, true]) {
      it(`recovers from retaliation, Class Bonus=${classBonus}, lethal return damage=${lethal}`, () => {
        const champion = createClassBonusTestChampion(
          gloamspireWraith,
          classBonus,
          "activation-discount",
        );
        const attackerCard = lethal ? automatedGardener : woodlandSquirrels;
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [gloamspireWraith],
              hand: [umbraSight, umbraSight, reposition, woodlandSquirrels],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { field: [attackerCard] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion);
        const wraith = player.card(gloamspireWraith);
        opponent.pass();
        for (let index = 0; index < 2; index++) {
          const opportunity = game.waitState();
          if (opportunity.kind === "opportunity" && opportunity.playerId !== player.id)
            game.player(opportunity.playerId).pass();
          player.activate(player.cards(umbraSight, { zone: "hand" })[0]!);
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
        }
        const opportunity = game.waitState();
        if (opportunity.kind === "opportunity" && opportunity.playerId !== player.id)
          game.player(opportunity.playerId).pass();
        player.activate(reposition, {
          targets: { "target-1": [wraith.objectId] },
          reservePayment: [
            {
              kind: "card",
              cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
            },
          ],
        });
        passEffectsStack(game);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(6);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
          game.player(wait.playerId).pass();
        opponent.declareAttack(attackerCard, wraith);
        for (let step = 0; step < 64; step++) {
          if (
            game.state.stack.some(
              (item) =>
                item.kind === "triggered-ability" && item.ability.id === "granted-zjtwd7-a1",
            ) ||
            !game.state.combat
          )
            break;
          if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", [wraith.objectId]);
          else {
            const next = game.waitState();
            if (next.kind !== "opportunity") throw new Error(`Unexpected ${next.kind}`);
            game.player(next.playerId).pass();
          }
        }
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(6);
        expect(
          game.state.stack.filter(
            (item) => item.kind === "triggered-ability" && item.ability.id === "granted-zjtwd7-a1",
          ),
        ).toHaveLength(1);
        passEffectsStack(game);
        // Ranged improves attacks, not retaliation; only three damage was dealt.
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(3);
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        expect(opponent.cards(attackerCard, { zone: "graveyard" })).toHaveLength(1);
        expect(player.cards(gloamspireWraith, { zone: "graveyard" })).toHaveLength(lethal ? 1 : 0);
      });
    }
  }
  const scenarios = [
    ...(["none", "distant", "expired"] as const).flatMap((distance) =>
      [0, 1, 2].map((curses) => ({ distance, curses, targetKind: "champion" as const })),
    ),
    { distance: "distant" as const, curses: 2, targetKind: "ally" as const },
    { distance: "distant" as const, curses: 2, targetKind: "shielded" as const },
  ];
  for (const classBonus of [false, true]) {
    for (const { distance, curses, targetKind } of scenarios) {
      it(`Class Bonus=${classBonus}, ${distance}, Curses=${curses}, target=${targetKind}`, () => {
        const champion = createClassBonusTestChampion(
          gloamspireWraith,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [gloamspireWraith],
              hand: [
                reposition,
                woodlandSquirrels,
                ...Array.from({ length: curses }, () => umbraSight),
              ],
              "main-deck": Array.from({ length: 7 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [supplyDrone],
              hand: [falseStep, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ownChampion = player.card(champion);
        const opposingChampion = opponent.card(champion);
        const wraith = player.card(gloamspireWraith);
        const ready = () => {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId !== player.id)
            game.player(wait.playerId).pass();
        };
        for (let index = 0; index < curses; index++) {
          ready();
          player.activate(player.cards(umbraSight, { zone: "hand" })[0]!);
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", true);
          passEffectsStack(game);
        }
        const initialDamage = curses * (curses + 1);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(initialDamage);
        if (distance !== "none") {
          ready();
          player.activate(reposition, {
            targets: { "target-1": [wraith.objectId] },
            reservePayment: [
              {
                kind: "card",
                cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
              },
            ],
          });
          passEffectsStack(game);
        }
        if (distance === "expired") {
          advanceToRecollection(game, opponent.id);
          advanceToRecollection(game, player.id);
          for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        const distant = distance === "distant";
        expect(game.state.objects[wraith.objectId]!.states.has("distant")).toBe(distant);
        if (targetKind === "shielded") {
          ready();
          player.pass();
          opponent.activate(falseStep, {
            reservePayment: [
              { kind: "card", cardId: opponent.card(woodlandSquirrels, { zone: "hand" }).objectId },
            ],
          });
          passEffectsStack(game);
        }
        ready();
        const target = targetKind === "ally" ? opponent.card(supplyDrone) : opposingChampion;
        player.declareAttack(wraith, target);
        for (let step = 0; step < 64; step++) {
          if (
            game.state.stack.some(
              (item) =>
                item.kind === "triggered-ability" && item.ability.id === "granted-zjtwd7-a1",
            ) ||
            !game.state.combat
          )
            break;
          if (game.state.decision?.kind === "choose-retaliators")
            answerDecision(game, "choose-retaliators", []);
          else if (game.state.decision?.kind === "resolve-optional-effect")
            answerDecision(game, "resolve-optional-effect", false);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        const dealt = 3 + (classBonus && distant ? 2 : 0) - (targetKind === "shielded" ? 2 : 0);
        if (targetKind === "ally" && dealt >= 4)
          expect(opponent.zone("graveyard")).toContainEqual(target);
        else expect(game.state.objects[target.objectId]!.damage).toBe(dealt);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(initialDamage);
        expect(
          game.state.stack.filter(
            (item) => item.kind === "triggered-ability" && item.ability.id === "granted-zjtwd7-a1",
          ),
        ).toHaveLength(distant ? 1 : 0);
        passEffectsStack(game);
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(
          distant ? Math.max(0, initialDamage - dealt) : initialDamage,
        );
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[opposingChampion.objectId]!.damage).toBe(
          targetKind === "ally" ? 0 : dealt,
        );
      });
    }
  }
});
