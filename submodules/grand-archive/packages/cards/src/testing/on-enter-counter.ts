import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveOnEnterCounter({
  card,
  abilityId,
  counter,
  amount,
  self = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  counter: string;
  amount: number;
  self?: boolean;
}): void {
  const face = grandArchiveTestFace(card),
    cost = face.cost;
  if ((cost.kind !== "reserve" && cost.kind !== "memory") || typeof cost.amount !== "number")
    throw new Error("Expected fixed activation cost");
  const paymentAmount = cost.amount;
  const isChampion = face.typeLine.types.includes("CHAMPION");
  const champion = enableAllTestElements(
    isChampion
      ? lineageTestChampion(face.lineageName!, 0)
      : createClassBonusTestChampion(card, false, "activation-discount"),
  );
  for (const first of [true, false])
    it(`player ${first ? "one" : "two"} receives counters only when the separate entry trigger resolves`, () => {
      const payment = Array.from({ length: paymentAmount }, () => woodlandSquirrels);
      const zones = {
        hand: cost.kind === "reserve" ? [card, ...payment] : [],
        memory: cost.kind === "memory" ? payment : [],
        "material-deck": cost.kind === "memory" ? [card] : [],
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: first ? "playerOne" : "playerTwo",
        phase: cost.kind === "memory" ? "materialize" : "main",
        playerOne: { champion, zones: first ? zones : {} },
        playerTwo: { champion, zones: first ? {} : zones },
      });
      const p = game.player(first ? "player-one" : "player-two"),
        q = game.player(first ? "player-two" : "player-one");
      const hero = p.card(champion),
        source = p.card(card),
        target = self && !isChampion ? source : hero;
      if (cost.kind === "memory") p.materialize(source);
      else
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(0);
      p.pass();
      q.pass();
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
      expect(
        game.state.stack.some((s) => s.kind === "triggered-ability" && s.ability.id === abilityId),
      ).toBe(true);
      expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.counters[counter]).toBe(amount);
      expect(game.state.objects[q.card(champion).objectId]!.counters[counter] ?? 0).toBe(0);
      if (!isChampion)
        expect(game.state.objects[(self ? hero : source).objectId]!.counters[counter] ?? 0).toBe(0);
      if (isChampion)
        expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(card.canonicalId);
      expect(game.state.stack).toHaveLength(0);
    });
}
