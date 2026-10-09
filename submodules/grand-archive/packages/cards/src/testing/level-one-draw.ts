import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { cramSession } from "../cards/DOA/actions/cram-session.ts";

export function proveLevelOneDraw(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  targeted: boolean,
) {
  for (const matching of [false, true])
    for (const level of [0, 1, 2])
      for (const ownTurn of [false, true]) {
        it(`draw requires own current level: class=${matching}, level=${level}, own turn=${ownTurn}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(card, matching, "activation-discount"),
              level,
            ),
          );
          const opponent = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(card, false, "activation-discount"),
              4,
            ),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: ownTurn ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [card, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion: opponent, zones: { "main-deck": [woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          if (!ownTurn) q.pass();
          const targets = targeted ? { "target-1": [q.card(opponent).objectId] } : undefined;
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const amount of [1, 3]) {
            const before = game.state;
            expect(() =>
              p.activate(card, { targets, reservePayment: payment.slice(0, amount) }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const deck = p.zone("main-deck"),
            otherDeck = q.zone("main-deck");
          p.activate(card, { targets, reservePayment: payment.slice(0, 2) });
          const hand = p.zone("hand"),
            memory = p.zone("memory");
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          expect(p.zone("hand")).toEqual(level ? [...hand, deck[0]!] : hand);
          expect(p.zone("main-deck")).toEqual(level ? deck.slice(1) : deck);
          expect(p.zone("memory")).toEqual(memory);
          expect(q.zone("main-deck")).toEqual(otherDeck);
        });
      }
  for (const expired of [false, true])
    it(`uses temporary current level only before expiration=${expired}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, cramSession, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one");
      p.activate(cramSession, {
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      if (expired) advanceToMain(game, p.id, game.state.turn.number);
      const deck = p.zone("main-deck");
      p.activate(card, {
        ...(targeted ? { targets: { "target-1": [p.card(champion).objectId] } } : {}),
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      const hand = p.zone("hand");
      passEffectsStack(game);
      expect(p.zone("hand")).toEqual(expired ? hand : [...hand, deck[0]!]);
      expect(p.zone("main-deck")).toEqual(expired ? deck : deck.slice(1));
    });
}
