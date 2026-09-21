import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { restoringEmbers } from "../../AMB/actions/restoring-embers.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { marchHareMottledHost } from "./march-hare-mottled-host.ts";
import { astarteCelestialDawn } from "./astarte-celestial-dawn.ts";

/** @covers f0ht2tsn0y-a1 */
describe("Astarte, Celestial Dawn — Class Bonus Fast Activation", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "permits" : "rejects"} activation on a non-empty Effects Stack`, () => {
      const champion = createClassBonusTestChampion(
        astarteCelestialDawn,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              woodlandSquirrels,
              astarteCelestialDawn,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      player.activate(player.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      expect(game.state.stack).toHaveLength(1);
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (classBonus) {
        player.activate(astarteCelestialDawn, { reservePayment: payment });
        expect(game.state.stack).toHaveLength(2);
      } else {
        const before = game.state;
        expect(() => player.activate(astarteCelestialDawn, { reservePayment: payment })).toThrow(
          /Slow cards require the turn player's empty-stack Main phase/,
        );
        expect(game.state).toEqual(before);
      }
    });
  }
});

/** @covers f0ht2tsn0y-a2 */
describe("Astarte, Celestial Dawn — opponent field-entry replacement", () => {
  it("banishes face down an opposing object entering outside the Effects Stack", () => {
    const astarteChampion = createClassBonusTestChampion(
      astarteCelestialDawn,
      false,
      "activation-discount",
    );
    const fireChampion = createClassBonusTestChampion(
      marchHareMottledHost,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion: astarteChampion, zones: { field: [astarteCelestialDawn] } },
      playerTwo: {
        champion: fireChampion,
        zones: {
          hand: [restoringEmbers],
          graveyard: [marchHareMottledHost, fireball, fireball, fireball],
          "main-deck": [fireball],
        },
      },
    });
    const opponent = game.player("player-two");
    const source = opponent.card(marchHareMottledHost, { zone: "graveyard" });
    opponent.activate(restoringEmbers, {
      kindleCardIds: [
        source.objectId,
        ...opponent.cards(fireball, { zone: "graveyard" }).map((card) => card.objectId),
      ],
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]).toMatchObject({
      zone: "banishment",
      facing: "face-down",
    });
  });

  it("allows an opposing object to enter by resolving from the Effects Stack", () => {
    const champion = createClassBonusTestChampion(
      astarteCelestialDawn,
      false,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [astarteCelestialDawn] } },
      playerTwo: { champion, zones: { hand: [woodlandSquirrels] } },
    });
    const opponent = game.player("player-two");
    const ally = opponent.card(woodlandSquirrels, { zone: "hand" });
    opponent.activate(ally);
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]).toMatchObject({ zone: "field", facing: "face-up" });
  });
});
