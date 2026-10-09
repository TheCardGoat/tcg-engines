import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { magusInitiate } from "../cards/PRD/allies/magus-initiate.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveBoonScavenge(card: Card, eligible: readonly Card[]) {
  for (const probe of eligible)
    for (const position of [0, 9, 10, "none", "short"] as const)
      it(`scavenges ${probe.slug}, first match=${position}`, () => {
        const champion = lineageTestChampion("Scavenge Boon", 0);
        function start(seed: number) {
          const player = (id: string): GrandArchivePantheonPlayerSetup => ({
            id,
            name: id,
            startingChampionDefinitionId: champion.canonicalId,
            mainDeck: [
              { definitionId: woodlandSquirrels.canonicalId, count: position === "short" ? 4 : 10 },
              { definitionId: magusInitiate.canonicalId, count: position === "short" ? 3 : 7 },
              ...(typeof position === "number"
                ? [{ definitionId: probe.canonicalId, count: 1 }]
                : []),
            ],
            materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
            pantheon: {
              lesserBoonDefinitionId: card.canonicalId,
              greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
              barrierDefinitionId: pantheonBarrier.canonicalId,
            },
          });
          return GrandArchiveTestEngine.start(
            [
              champion,
              card,
              probe,
              woodlandSquirrels,
              magusInitiate,
              greaterBoonOfHorses,
              pantheonBarrier,
            ],
            {
              mode: "pantheon",
              firstPlayerId: "player-one",
              randomSeed: seed,
              players: [player("player-one"), player("player-two"), player("player-three")],
            },
            { validateDeckConstruction: false, skipPregameForTests: true },
          );
        }
        let game = start(1);
        if (typeof position === "number") {
          let found = false;
          for (let seed = 1; seed <= 250; seed++) {
            game = start(seed);
            if (
              game
                .player("player-one")
                .zone("main-deck")
                .findIndex((ref) => ref.definitionId === probe.canonicalId) ===
              position + 2
            ) {
              found = true;
              break;
            }
          }
          expect(found).toBe(true);
        }
        const p = game.player("player-one");
        for (let i = 0; i < 2; i++) advanceToMain(game, p.id, game.state.turn.number);
        const boon = p.card(card, { zone: "pantheon" }),
          deck = p.zone("main-deck"),
          hand = p.zone("hand");
        expect(hand).toHaveLength(3);
        if (typeof position === "number")
          expect(deck.findIndex((ref) => ref.definitionId === probe.canonicalId)).toBe(position);
        const opponentStates = ["player-two", "player-three"].map((id) => ({
          id,
          hand: game.player(id).zone("hand"),
          deck: game.player(id).zone("main-deck"),
        }));
        const pay = (n: number) =>
          hand.slice(0, n).map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const before = game.state;
        expect(() =>
          p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment: pay(2) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment: pay(3) });
        expect(p.zone("main-deck")).toEqual(deck);
        expect(p.zone("memory")).toEqual(hand);
        passEffectsStack(game);
        const hit = typeof position === "number" && position < 10;
        const revealed = hit ? position + 1 : Math.min(10, deck.length);
        const taken = hit ? deck[position] : undefined;
        expect(p.zone("hand")).toEqual(taken ? [taken] : []);
        const remainder = deck.slice(0, revealed).filter((ref) => ref !== taken);
        const current = p.zone("main-deck");
        expect(current.slice(0, deck.length - revealed)).toEqual(deck.slice(revealed));
        expect(
          current
            .slice(deck.length - revealed)
            .map((ref) => ref.objectId)
            .sort(),
        ).toEqual(remainder.map((ref) => ref.objectId).sort());
        expect(game.state.objects[boon.objectId]!.facing).toBe("face-up");
        for (const other of opponentStates) {
          const player = game.player(other.id);
          expect(player.zone("hand")).toEqual(other.hand);
          expect(player.zone("main-deck")).toEqual(other.deck);
          expect(game.state.objects[player.card(card, { zone: "pantheon" }).objectId]!.facing).toBe(
            "face-down",
          );
        }
        const resolved = game.state;
        expect(() => p.execute({ move: "bestow-boon", cardId: boon.objectId })).toThrow();
        expect(game.state).toEqual(resolved);
      });
}
