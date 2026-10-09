import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "./champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { blitzMage } from "../cards/DOA/allies/blitz-mage.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { windriderMage } from "../cards/DOA/allies/windrider-mage.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";

export function proveElementBoon(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  enabled: "FIRE" | "WATER" | "WIND",
): void {
  for (const [probe, cost, element] of [
    [blitzMage, 3, "FIRE"],
    [giantTortoise, 4, "WATER"],
    [windriderMage, 2, "WIND"],
  ] as const)
    it(`enables ${element}=${enabled === element} only after its controller bestows it`, () => {
      const champion = lineageTestChampion("Element Boon", 0);
      const player = (id: string): GrandArchivePantheonPlayerSetup => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [{ definitionId: probe.canonicalId, count: 20 }],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        pantheon: {
          lesserBoonDefinitionId: card.canonicalId,
          greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
          barrierDefinitionId: pantheonBarrier.canonicalId,
        },
      });
      const game = GrandArchiveTestEngine.start(
        [champion, card, probe, greaterBoonOfHorses, pantheonBarrier],
        {
          mode: "pantheon",
          randomSeed: 43,
          firstPlayerId: "player-one",
          players: [player("player-one"), player("player-two"), player("player-three")],
        },
        { validateDeckConstruction: false, skipPregameForTests: true },
      );
      const p = game.player("player-one"),
        boon = p.card(card, { zone: "pantheon" });
      for (let n = 0; n < cost + 1; n++) advanceToMain(game, p.id, game.state.turn.number);
      const attempt = (id: string) => {
        const owner = game.player(id),
          [source, ...rest] = owner.cards(probe, { zone: "hand" });
        owner.activate(source!, {
          reservePayment: rest.slice(0, cost).map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      };
      expect(game.state.objects[boon.objectId]!.facing).toBe("face-down");
      const before = game.state;
      expect(() => attempt(p.id)).toThrow();
      expect(game.state).toEqual(before);
      p.execute({ move: "bestow-boon", cardId: boon.objectId });
      passEffectsStack(game);
      expect(game.state.objects[boon.objectId]!.facing).toBe("face-up");
      if (element === enabled) {
        attempt(p.id);
        passEffectsStack(game);
        expect(p.cards(probe, { zone: "field" })).toHaveLength(1);
      } else {
        const before = game.state;
        expect(() => attempt(p.id)).toThrow();
        expect(game.state).toEqual(before);
      }
      for (const id of ["player-two", "player-three"]) {
        advanceToMain(game, id);
        const before = game.state;
        expect(() => attempt(id)).toThrow();
        expect(game.state).toEqual(before);
      }
    });
}
