import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
import { supplyDrone } from "../../ALC/allies/supply-drone.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { overlordMkIii } from "./overlord-mk-iii.ts";

/** @covers sl7ddcgw05-a1 */
describe("Overlord Mk III — four-Powercell activation cost", () => {
  for (const count of [3, 4]) {
    it(`${count === 4 ? "accepts" : "rejects"} exactly ${count} available Powercells`, () => {
      const champion = createClassBonusTestChampion(overlordMkIii, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [powercell],
        playerOne: {
          champion,
          zones: {
            hand: [
              overlordMkIii,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            field: Array.from({ length: count }, () => powercell),
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const cells = player.cards(powercell, { zone: "field" });
      const options = {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        costSelections: [cells.map((card) => card.objectId)],
      };
      if (count < 4) {
        const before = game.state;
        expect(() => player.activate(overlordMkIii, options)).toThrow();
        expect(game.state).toEqual(before);
      } else {
        player.activate(overlordMkIii, options);
        expect(player.cards(powercell, { zone: "field" })).toHaveLength(0);
        passEffectsStack(game);
        expect(player.cards(overlordMkIii, { zone: "field" })).toHaveLength(1);
      }
    });
  }
});

/** @covers sl7ddcgw05-a2 */
describe("Overlord Mk III — defensive keyword suite", () => {
  it("uses True Sight to attack Stealth and Steadfast to retaliate while rested", () => {
    const champion = lineageTestChampion("Overlord", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [overlordMkIii],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [shimmercloakAssassin, automatedGardener],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const source = player.card(overlordMkIii);
    player.declareAttack(source, opponent.card(shimmercloakAssassin));
    game.resolveCombatWithoutRetaliation();
    expect(opponent.cards(shimmercloakAssassin, { zone: "graveyard" })).toHaveLength(1);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);

    advanceToMain(game, opponent.id);
    const attacker = opponent.card(automatedGardener);
    opponent.declareAttack(attacker, source);
    let retaliated = false;
    for (let step = 0; game.state.combat && step < 64; step += 1) {
      if (game.state.decision?.kind === "choose-retaliators") {
        answerDecision(game, "choose-retaliators", [source.objectId]);
        retaliated = true;
      } else {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
    }
    expect(retaliated).toBe(true);
    expect(game.state.objects[attacker.objectId]!.zone).toBe("graveyard");
  });

  it("uses Intercept to redirect an attack from its champion", () => {
    const champion = createClassBonusTestChampion(overlordMkIii, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [overlordMkIii] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const defender = game.player("player-one");
    game.player("player-two").declareAttack(automatedGardener, defender.card(champion));
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.combat?.targetIds).toEqual([defender.card(overlordMkIii).objectId]);
  });

  it("rejects targeting by an opposing Spell ability through Spellshroud", () => {
    const champion = createClassBonusTestChampion(overlordMkIii, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [overlordMkIii] } },
      playerTwo: { champion, zones: { hand: [glacialGuidance, woodlandSquirrels] } },
    });
    const opponent = game.player("player-two");
    const before = game.state;
    expect(() =>
      opponent.activate(glacialGuidance, {
        targets: { "target-1": [game.player("player-one").card(overlordMkIii).objectId] },
        reservePayment: [
          { kind: "card", cardId: opponent.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
});

/** @covers sl7ddcgw05-a3 */
describe("Overlord Mk III — end-phase Automaton conversion", () => {
  for (const accept of [false, true]) {
    it(`${accept ? "banishes, buffs, and draws" : "declines without changing zones"}`, () => {
      const champion = createClassBonusTestChampion(overlordMkIii, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [overlordMkIii],
            graveyard: [supplyDrone],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const source = player.card(overlordMkIii);
      const fuel = player.card(supplyDrone, { zone: "graveyard" });
      for (let step = 0; game.state.turn.phase !== "end" && step < 64; step += 1) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", accept);
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-effect-choice") {
        answerDecision(game, "resolve-effect-choice", [fuel.objectId]);
        passEffectsStack(game);
      }
      expect(game.state.objects[fuel.objectId]!.zone).toBe(accept ? "banishment" : "graveyard");
      expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(accept ? 1 : 0);
      expect(player.zone("hand")).toHaveLength(accept ? 1 : 0);
    });
  }
});
