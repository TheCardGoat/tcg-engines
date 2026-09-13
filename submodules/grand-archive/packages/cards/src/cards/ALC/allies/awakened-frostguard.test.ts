import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { deployGunshield } from "../actions/deploy-gunshield.ts";
import { organizeTheAlliance } from "../actions/organize-the-alliance.ts";
import { firetunedAutomaton } from "./firetuned-automaton.ts";
import { awakenedFrostguard } from "./awakened-frostguard.ts";

function reachMain(game: GrandArchiveTestEngine) {
  for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
  expect(game.state.turn.phase).toBe("main");
}

/** @covers mnu1xhs5jw-a1 @covers mnu1xhs5jw-a3 */
describe("Awakened Frostguard — conditional Foster and Vigor", () => {
  for (const classBonus of [false, true]) {
    for (const damaged of [false, true]) {
      it(`Class Bonus=${classBonus}, damaged since the previous end=${damaged}`, () => {
        const champion = createClassBonusTestChampion(
          awakenedFrostguard,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [awakenedFrostguard],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ally = player.card(awakenedFrostguard);
        if (damaged) {
          opponent.declareAttack(woodlandSquirrels, ally);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[ally.objectId]!.damage).toBe(1);
        }
        advanceToRecollection(game, player.id);
        expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(false);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect")
          answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
        const fostered = classBonus && !damaged;
        expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(fostered);
        reachMain(game);
        player.declareAttack(ally, opponent.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
        for (let step = 0; game.state.turn.phase !== "end" && step < 16; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.phase).toBe("end");
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.stack).toHaveLength(fostered ? 1 : 0);
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(!fostered);
      });
    }
  }
});

/** @covers mnu1xhs5jw-a2 */
describe("Awakened Frostguard — optional Floating Memory banishment", () => {
  it("can resolve without rewards when no graveyard card has active Floating Memory", () => {
    const champion = createClassBonusTestChampion(awakenedFrostguard, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [awakenedFrostguard],
          hand: [organizeTheAlliance, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [firetunedAutomaton, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const ally = player.card(awakenedFrostguard);
    const deck = player.zone("main-deck");
    player.activate(organizeTheAlliance, {
      targets: { "target-1": [ally.objectId] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", true);
    if (game.state.decision?.kind === "resolve-effect-choice")
      answerDecision(game, "resolve-effect-choice", []);
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(true);
    expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
    expect(player.zone("banishment")).toHaveLength(0);
    expect(player.zone("hand")).toHaveLength(0);
    expect(player.zone("main-deck")).toEqual(deck);
    expect(game.state.decision).toBeNull();
    expect(game.state.stack).toHaveLength(0);
  });
  for (const classBonus of [false, true]) {
    for (const count of [-1, 0, 1, 2]) {
      it(`externally fostered, Class Bonus=${classBonus}, banishes=${count < 0 ? "decline" : count}`, () => {
        const champion = createClassBonusTestChampion(
          awakenedFrostguard,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [awakenedFrostguard],
              hand: [
                organizeTheAlliance,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                deployGunshield,
              ],
              graveyard: [
                deployGunshield,
                deployGunshield,
                deployGunshield,
                firetunedAutomaton,
                woodlandSquirrels,
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { graveyard: [deployGunshield] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ally = player.card(awakenedFrostguard);
        player.activate(organizeTheAlliance, {
          targets: { "target-1": [ally.objectId] },
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        player.pass();
        opponent.pass();
        expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(true);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "mnu1xhs5jw-a2",
          ),
        ).toBe(true);
        const hand = player.zone("hand");
        const deck = player.zone("main-deck");
        const graveyard = player.zone("graveyard");
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", count >= 0);
        const eligible = player.cards(deployGunshield, { zone: "graveyard" });
        const conditional = player.card(firetunedAutomaton);
        const selected =
          count > 0
            ? [eligible[0]!, ...(count === 2 ? [classBonus ? conditional : eligible[1]!] : [])]
            : [];
        if (count >= 0) {
          for (const invalid of [
            [player.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
            [opponent.card(deployGunshield).objectId],
            [player.card(deployGunshield, { zone: "hand" }).objectId],
            eligible.map((ref) => ref.objectId),
            [eligible[0]!.objectId, eligible[0]!.objectId],
            ...(!classBonus ? [[conditional.objectId]] : []),
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(
            game,
            "resolve-effect-choice",
            selected.map((ref) => ref.objectId),
          );
        }
        passEffectsStack(game);
        expect(player.zone("banishment")).toEqual(selected);
        expect(player.zone("graveyard")).toEqual(
          graveyard.filter((ref) => !selected.some((chosen) => chosen.objectId === ref.objectId)),
        );
        expect(player.zone("hand")).toEqual([...hand, ...deck.slice(0, selected.length)]);
        expect(player.zone("main-deck")).toEqual(deck.slice(selected.length));
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(selected.length);
        expect(opponent.zone("graveyard")).toHaveLength(1);
        const target = opponent.card(champion);
        player.declareAttack(ally, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(1 + selected.length);
        // Vigor depends on being fostered, not on having Class Bonus.
        for (let step = 0; game.state.turn.phase !== "end" && step < 16; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(false);
      });
    }
  }
});
