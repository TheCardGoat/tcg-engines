import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
import { fledgling } from "../cards/HVN/tokens/fledgling.ts";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

export function subtypeBoonFixture(card: Card, probe: Card) {
  const champion = lineageTestChampion("Subtype Boon", 0);
  const player = (id: string): GrandArchivePantheonPlayerSetup => ({
    id,
    name: id,
    startingChampionDefinitionId: champion.canonicalId,
    mainDeck: [{ definitionId: probe.canonicalId, count: 30 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    pantheon: {
      lesserBoonDefinitionId: card.canonicalId,
      greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
      barrierDefinitionId: pantheonBarrier.canonicalId,
    },
  });
  const game = GrandArchiveTestEngine.start(
    [champion, card, probe, greaterBoonOfHorses, pantheonBarrier, fledgling, powercell],
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
  for (let n = 0; n < 10; n++) advanceToMain(game, p.id, game.state.turn.number);
  const pay = (amount: number) =>
    p
      .cards(probe, { zone: "hand" })
      .slice(-amount)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
  return { game, p, boon, pay };
}

export function proveSubtypeElementBoon(
  card: Card,
  probes: readonly (readonly [Card, boolean])[],
  summonsFledgling = false,
): void {
  for (const [probe, qualifies] of probes)
    it(`ignores only the allowed element and subtype: ${probe.slug}`, () => {
      const { game, p, boon, pay } = subtypeBoonFixture(card, probe);
      const face = grandArchiveTestFace(probe),
        boonFace = grandArchiveTestFace(card);
      if (
        face.cost.kind !== "reserve" ||
        typeof face.cost.amount !== "number" ||
        boonFace.cost.kind !== "reserve" ||
        typeof boonFace.cost.amount !== "number"
      )
        throw new Error("Expected fixed reserve costs");
      const cost = face.cost.amount,
        boonCost = boonFace.cost.amount;
      const normal = face.elements.every((e) => e === "NORM");
      const cast = (id: string) => {
        const owner = game.player(id),
          [source, ...payment] = owner.cards(probe, { zone: "hand" });
        owner.activate(source!, {
          reservePayment: payment.slice(0, cost).map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      };
      if (normal) {
        cast(p.id);
        passEffectsStack(game);
      } else {
        const before = game.state;
        expect(() => cast(p.id)).toThrow();
        expect(game.state).toEqual(before);
      }
      expect(p.cards(fledgling, { zone: "field" })).toHaveLength(0);
      if (boonCost > 0) {
        const before = game.state;
        expect(() =>
          p.execute({
            move: "bestow-boon",
            cardId: boon.objectId,
            reservePayment: pay(boonCost - 1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.execute({
        move: "bestow-boon",
        cardId: boon.objectId,
        reservePayment: boonCost ? pay(boonCost) : [],
      });
      passEffectsStack(game);
      expect(game.state.objects[boon.objectId]!.facing).toBe("face-up");
      expect(p.cards(fledgling, { zone: "field" })).toHaveLength(summonsFledgling ? 1 : 0);
      if (normal || qualifies) {
        cast(p.id);
        passEffectsStack(game);
        expect(p.cards(probe, { zone: "field" })).toHaveLength(normal ? 2 : 1);
      } else {
        const before = game.state;
        expect(() => cast(p.id)).toThrow();
        expect(game.state).toEqual(before);
      }
      for (const id of ["player-two", "player-three"]) {
        advanceToMain(game, id);
        const owner = game.player(id);
        expect(owner.cards(fledgling, { zone: "field" })).toHaveLength(0);
        if (normal) {
          cast(id);
          passEffectsStack(game);
          expect(owner.cards(probe, { zone: "field" })).toHaveLength(1);
        } else {
          const before = game.state;
          expect(() => cast(id)).toThrow();
          expect(game.state).toEqual(before);
        }
      }
    });
}
