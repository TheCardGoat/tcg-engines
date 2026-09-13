import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { summonSentinels } from "../actions/summon-sentinels.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveReservable } from "../../../testing/reservable.ts";
import { fractalOfSnow } from "./fractal-of-snow.ts";

/** @covers uhuy4xippo-a1 */
describe("Fractal of Snow — Reservable", () => {
  proveReservable(fractalOfSnow);
});

/** @covers uhuy4xippo-a2 */
describe("Fractal of Snow — next simultaneous ally entry", () => {
  for (const owner of ["player-one", "player-two"] as const) {
    it(`rests both ${owner} tokens, but not a later ally`, () => {
      const base = createClassBonusTestChampion(fractalOfSnow, true, "activation-discount");
      if (base.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: { ...base.layout.face, elements: ["WATER", "NEOS"] as const },
        },
      };
      const hand = [
        fractalOfSnow,
        summonSentinels,
        ...Array.from({ length: 7 }, () => woodlandSquirrels),
      ];
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: owner === "player-one" ? "playerOne" : "playerTwo",
        playerOne: {
          champion,
          zones: { field: [fractalOfSnow], hand: owner === "player-one" ? hand : [] },
        },
        playerTwo: { champion, zones: { hand: owner === "player-two" ? hand : [] } },
        definitions: [automatonDrone],
      });
      const player = game.player("player-one");
      const actor = game.player(owner);
      if (owner === "player-two") actor.pass();
      player.activateAbility(player.card(fractalOfSnow, { zone: "field" }), "uhuy4xippo-a2");
      expect(player.cards(fractalOfSnow, { zone: "graveyard" })).toHaveLength(1);
      expect(game.state.replacementEffects).toHaveLength(0);
      passEffectsStack(game);
      expect(game.state.replacementEffects).toHaveLength(1);
      actor.activate(actor.card(fractalOfSnow, { zone: "hand" }), {
        reservePayment: actor
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      expect(
        game.state.objects[actor.card(fractalOfSnow, { zone: "field" }).objectId]!.states.has(
          "rested",
        ),
      ).toBe(false);
      actor.activate(summonSentinels, {
        reservePayment: actor
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      const tokens = actor.cards(automatonDrone, { zone: "field" });
      expect(tokens).toHaveLength(2);
      for (const token of tokens)
        expect(game.state.objects[token.objectId]!.states.has("rested")).toBe(true);
      actor.activate(woodlandSquirrels);
      passEffectsStack(game);
      const later = actor.card(woodlandSquirrels, { zone: "field" });
      expect(game.state.objects[later.objectId]!.states.has("rested")).toBe(false);
    });
  }
  it("cannot activate without Class Bonus and leaves its source available", () => {
    const champion = createClassBonusTestChampion(fractalOfSnow, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [fractalOfSnow], hand: [woodlandSquirrels] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state.stateVersion;
    expect(() => player.activateAbility(fractalOfSnow, "uhuy4xippo-a2")).toThrow();
    expect(game.state.stateVersion).toBe(before);
    expect(player.cards(fractalOfSnow, { zone: "field" })).toHaveLength(1);
    player.activate(woodlandSquirrels);
    passEffectsStack(game);
    expect(
      game.state.objects[player.card(woodlandSquirrels, { zone: "field" }).objectId]!.states.has(
        "rested",
      ),
    ).toBe(false);
  });
  it("rests a single activated ally, consuming the replacement before the next ally", () => {
    const champion = createClassBonusTestChampion(fractalOfSnow, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { field: [fractalOfSnow], hand: [woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const allies = player.cards(woodlandSquirrels, { zone: "hand" });
    player.activateAbility(fractalOfSnow, "uhuy4xippo-a2");
    passEffectsStack(game);
    player.activate(allies[0]!);
    passEffectsStack(game);
    expect(game.state.objects[allies[0]!.objectId]!.states.has("rested")).toBe(true);
    player.activate(allies[1]!);
    passEffectsStack(game);
    expect(game.state.objects[allies[1]!.objectId]!.states.has("rested")).toBe(false);
  });
  it("expires unused at turn end and does not rest an ally on the next turn", () => {
    const champion = createClassBonusTestChampion(fractalOfSnow, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [fractalOfSnow], "main-deck": [woodlandSquirrels] } },
      playerTwo: {
        champion,
        zones: { hand: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.activateAbility(fractalOfSnow, "uhuy4xippo-a2");
    passEffectsStack(game);
    advanceToRecollection(game, "player-two");
    for (let step = 0; step < 16 && game.state.turn.phase !== "main"; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected wait ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    opponent.activate(opponent.cards(woodlandSquirrels, { zone: "hand" })[0]!);
    passEffectsStack(game);
    expect(
      game.state.objects[opponent.card(woodlandSquirrels, { zone: "field" }).objectId]!.states.has(
        "rested",
      ),
    ).toBe(false);
  });
});
