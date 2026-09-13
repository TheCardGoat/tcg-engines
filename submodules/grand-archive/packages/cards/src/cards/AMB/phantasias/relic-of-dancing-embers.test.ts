import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import {
  advanceToMain,
  answerDecision,
  currentDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ashfletchedBowman } from "../../RDO/allies/ashfletched-bowman.ts";
import { relicOfDancingEmbers } from "./relic-of-dancing-embers.ts";

/** @covers i8g5013x9j-a3 */
describe("Relic of Dancing Embers — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: relicOfDancingEmbers });
});

/** @covers i8g5013x9j-a2 */
describe("Relic of Dancing Embers — fire ally combat damage", () => {
  it("does not trigger while hindered, then may sacrifice while awake", () => {
    const { starter } = classBonusLeveledChampion(relicOfDancingEmbers, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [relicOfDancingEmbers, woodlandSquirrels, woodlandSquirrels],
          field: [ashfletchedBowman],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: starter,
        zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    player.activate(relicOfDancingEmbers, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    player.pass();
    game.player("player-two").pass();
    passEffectsStack(game);
    const source = player.card(relicOfDancingEmbers, { zone: "field" });
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    const ally = player.card(ashfletchedBowman, { zone: "field" });
    const target = game.player("player-two").card(starter, { zone: "field" });
    player.declareAttack(ally, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.objects[source.objectId]!.zone).toBe("field");
    advanceToMain(game, player.id, game.state.turn.number);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
    player.declareAttack(ally, target);
    for (let step = 0; step < 32; step++) {
      if (
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "i8g5013x9j-a2",
        ) ||
        game.state.decision?.kind === "resolve-optional-effect"
      )
        break;
      if (game.state.decision?.kind === "choose-retaliators")
        answerDecision(game, "choose-retaliators", []);
      else {
        const wait = game.waitState();
        if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected ${wait.kind} while awaiting Relic trigger`);
      }
    }
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "i8g5013x9j-a2",
      ) || game.state.decision?.kind === "resolve-optional-effect",
    ).toBe(true);
    if (game.state.decision?.kind === "resolve-optional-effect") {
      answerDecision(game, "resolve-optional-effect", true);
    } else {
      passEffectsStack(game);
      if (currentDecision(game)?.kind === "resolve-optional-effect")
        answerDecision(game, "resolve-optional-effect", true);
    }
    passEffectsStack(game);
    if (game.state.combat) game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[source.objectId]!.zone).not.toBe("field");
    expect(game.state.objects[target.objectId]!.damage).toBeGreaterThanOrEqual(4);
  });
});
