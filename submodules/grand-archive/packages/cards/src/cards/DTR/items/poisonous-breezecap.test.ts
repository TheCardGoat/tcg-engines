import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { poisonousBreezecap } from "./poisonous-breezecap.ts";
import { babyGreenSlime } from "../../P24/allies/baby-green-slime.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers e3ldc3r8j7-a1 @covers e3ldc3r8j7-a2 */
describe("Poisonous Breezecap — entry memory and optional sacrifice instead of Suppress", () => {
  for (const setup of [
    { own: true, memory: 0 },
    { own: true, memory: 1 },
    { own: true, memory: 3 },
    { own: false, memory: 0 },
  ])
    for (const accept of [false, true])
      it(`suppression by ${setup.own ? "self" : "opponent"}, starting memory=${setup.memory}, sacrifice=${accept}`, () => {
        const champion = createClassBonusTestChampion(
          poisonousBreezecap,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                poisonousBreezecap,
                ...(setup.own ? [babyGreenSlime] : []),
                ...Array.from({ length: setup.own ? 5 : 3 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: [...(setup.own ? [] : [babyGreenSlime]), woodlandSquirrels, woodlandSquirrels],
              memory: Array.from({ length: setup.memory }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(poisonousBreezecap),
          deck = p.zone("main-deck");
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => p.activate(source, { reservePayment: payment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment: payment });
        p.pass();
        q.pass();
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(p.zone("memory")).toHaveLength(3);
        expect(p.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        expect(p.zone("memory")).toHaveLength(4);
        expect(p.zone("main-deck")).toEqual(deck.slice(1));
        if (!setup.own) advanceToMain(game, q.id);
        const actor = setup.own ? p : q;
        actor.activate(babyGreenSlime, {
          reservePayment: actor
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.decision).toMatchObject({
          kind: "announce-triggered-ability",
          playerId: actor.id,
        });
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.decision).toMatchObject({ kind: "choose-replacement", playerId: p.id });
        const memory = q.zone("memory"),
          ownMemory = p.zone("memory"),
          hand = q.zone("hand"),
          ownDeck = p.zone("main-deck");
        answerDecision(game, "choose-replacement", accept);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[source.objectId]!.zone).toBe(accept ? "graveyard" : "banishment");
        const lost = accept && memory.length ? 1 : 0;
        expect(q.zone("memory")).toHaveLength(memory.length - lost);
        expect(q.zone("banishment")).toHaveLength(lost);
        for (const card of q.zone("banishment")) expect(memory).toContainEqual(card);
        expect(p.zone("memory")).toEqual(ownMemory);
        expect(q.zone("hand")).toEqual(hand);
        expect(p.zone("main-deck")).toEqual(ownDeck);
        advanceToMain(game, setup.own ? q.id : p.id);
        expect(game.state.objects[source.objectId]!.zone).toBe(accept ? "graveyard" : "field");
        const returned = accept ? 0 : 1;
        // When the opponent suppressed it, its owner's new turn draws once more after recollection.
        expect(p.zone("main-deck")).toEqual(ownDeck.slice(returned + (setup.own ? 0 : 1)));
        if (setup.own) expect(p.zone("memory")).toHaveLength(ownMemory.length + returned);
      });
});
