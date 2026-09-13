import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { caretakerDrone } from "./caretaker-drone.ts";

/** @covers urfp66pv4n-a1 */
describe("Caretaker Drone — Intercept", () => {
  it("may redirect an attack from its champion to itself", () => {
    const champion = createClassBonusTestChampion(caretakerDrone, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [caretakerDrone] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const defender = game.player("player-one");
    const attacker = game.player("player-two");
    const drone = defender.card(caretakerDrone);
    attacker.declareAttack(automatedGardener, defender.card(champion));
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);

    expect(game.state.combat?.targetIds).toEqual([drone.objectId]);
  });
});

/** @covers urfp66pv4n-a2 */
describe("Caretaker Drone — Class Bonus death trigger", () => {
  for (const matchingClass of [false, true]) {
    for (const deckSize of [0, 2, 5]) {
      it(`Glimpses exactly the available top four after its own death, class=${matchingClass}, deck=${deckSize}`, () => {
        const champion = createClassBonusTestChampion(
          caretakerDrone,
          matchingClass,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [caretakerDrone, woodlandSquirrels],
              "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [automatedGardener, automatedGardener],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const deck = player.zone("main-deck");
        const opponentDeck = opponent.zone("main-deck");
        const drone = player.card(caretakerDrone);
        const attackers = opponent.cards(automatedGardener);
        opponent.declareAttack(attackers[0]!, player.card(woodlandSquirrels, { zone: "field" }));
        game.resolveCombatWithoutRetaliation();
        expect(player.zone("main-deck")).toEqual(deck);
        expect(game.state.decision).toBeNull();
        expect(game.state.stack).toHaveLength(0);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
          game.player(wait.playerId).pass();
        opponent.declareAttack(attackers[1]!, drone);
        advanceCombatToTrigger(game, "urfp66pv4n-a2");
        expect(player.zone("graveyard")).toContainEqual(drone);
        expect(player.zone("main-deck")).toEqual(deck);
        expect(game.state.decision).toBeNull();
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "urfp66pv4n-a2",
          ),
        ).toBe(matchingClass);
        passEffectsStack(game);
        if (matchingClass && deckSize > 0) {
          const glimpse = game.state.decision;
          if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected death Glimpse");
          expect(glimpse.playerId).toBe(player.id);
          expect(glimpse.cardIds).toEqual(deck.slice(0, 4).map((ref) => ref.objectId));
          const seen = deck.slice(0, 4);
          const top = seen.slice(-1);
          const bottom = seen.slice(0, -1).reverse();
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: top.map((ref) => ref.objectId),
            bottom: bottom.map((ref) => ref.objectId),
          });
          passEffectsStack(game);
          expect(player.zone("main-deck")).toEqual([...top, ...deck.slice(4), ...bottom]);
        } else expect(player.zone("main-deck")).toEqual(deck);
        expect(game.state.decision).toBeNull();
        expect(player.zone("hand")).toHaveLength(0);
        expect(opponent.zone("main-deck")).toEqual(opponentDeck);
      });
    }
  }
});
