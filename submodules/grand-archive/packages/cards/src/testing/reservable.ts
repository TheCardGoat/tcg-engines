import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { reposition } from "../cards/ALC/actions/reposition.ts";
import { oasisTradingPost } from "../cards/ALC/domains/oasis-trading-post.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

/** Public cost-payment contract for an unconditional Reservable object. */
export function proveReservable(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>): void {
  it("rests to pay one reserve before resolution and cannot pay again while rested", () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [card], hand: [reposition, reposition] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const source = player.card(card, { zone: "field" });
    const target = player.card(champion, { zone: "field" });
    const actions = player.cards(reposition, { zone: "hand" });
    const options = {
      reservePayment: [{ kind: "reservable" as const, objectId: source.objectId }],
      targets: { "target-1": [target.objectId] },
    };
    player.activate(actions[0]!, options);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[source.objectId]!.zone).toBe("field");
    expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
    expect(player.zone("memory")).toHaveLength(0);
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
    const before = game.state.stateVersion;
    expect(() => player.activate(actions[1]!, options)).toThrow(/Reservable payment sources/);
    expect(game.state.stateVersion).toBe(before);
    expect(game.state.objects[actions[1]!.objectId]!.zone).toBe("hand");
  });

  it("can pay an activated ability alongside hand cards, but cannot pay twice with one object", () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [card, oasisTradingPost],
          hand: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, reposition],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const source = player.card(card, { zone: "field" });
    const domain = player.card(oasisTradingPost, { zone: "field" });
    const payment = { kind: "reservable" as const, objectId: source.objectId };
    const before = game.state.stateVersion;
    expect(() =>
      player.activateAbility(domain, "uy4xippor7-a1", {
        reservePayment: [payment, payment, payment],
      }),
    ).toThrow(/cannot pay more than one/);
    expect(game.state.stateVersion).toBe(before);
    const hand = player.zone("hand");
    const deck = player.zone("main-deck");
    player.activateAbility(domain, "uy4xippor7-a1", {
      reservePayment: [
        payment,
        ...hand.map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      ],
    });
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[domain.objectId]!.states.has("rested")).toBe(true);
    expect(player.zone("memory")).toEqual(hand);
    expect(game.state.decision).toBeNull();
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-glimpse");
    answerDecision(game, "resolve-glimpse", {
      kind: "reorder",
      top: deck.map((ref) => ref.objectId),
      bottom: [],
    });
    expect(player.zone("main-deck")).toEqual(deck);
  });

  for (const invalidSource of ["opponent", "graveyard", "without-keyword"] as const) {
    it(`rejects a ${invalidSource} payment source without paying any costs`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [woodlandSquirrels], graveyard: [card], hand: [reposition] },
        },
        playerTwo: { champion, zones: { field: [card] } },
      });
      const player = game.player("player-one");
      const source =
        invalidSource === "opponent"
          ? game.player("player-two").card(card, { zone: "field" })
          : invalidSource === "graveyard"
            ? player.card(card, { zone: "graveyard" })
            : player.card(woodlandSquirrels, { zone: "field" });
      const before = game.state.stateVersion;
      expect(() =>
        player.activate(reposition, {
          reservePayment: [{ kind: "reservable", objectId: source.objectId }],
          targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
        }),
      ).toThrow(/Reservable payment sources/);
      expect(game.state.stateVersion).toBe(before);
      expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
    });
  }
}
