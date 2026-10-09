import type { GrandArchiveTargetId } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { astralShard } from "../cards/DTR/tokens/astral-shard.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { enableAllTestElements, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveStarcallingCard(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  starcallCost: number,
  result: "meteor" | "focus" | "ally" | "bolt" | "glow",
) {
  for (const [called, opposingTurn] of [
    [false, false],
    [true, false],
    [true, true],
  ])
    it(`resolves with printed behavior, starcalled=${called}, opposing turn=${opposingTurn}`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Starcalling", 0));
      const printed = grandArchiveTestFace(card).cost;
      if (printed.kind !== "reserve" || typeof printed.amount !== "number")
        throw new Error("Expected fixed reserve cost");
      const cost = called ? starcallCost : printed.amount;
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: {
            hand: [card, ...Array.from({ length: cost + 1 }, () => woodlandSquirrels)],
            field: [astralShard, giantTortoise, trainingSword],
            "main-deck": Array.from({ length: 4 }, () => card),
          },
        },
        playerTwo: {
          champion,
          zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const hero = p.card(champion),
        foe = q.card(champion),
        ownAlly = p.card(giantTortoise),
        otherAlly = q.card(giantTortoise);
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const targets: Readonly<Record<string, readonly GrandArchiveTargetId[]>> | undefined =
        result === "bolt" || result === "glow"
          ? { "target-1": [foe.objectId] }
          : result === "meteor" && !called
            ? { "destroyed-object": [otherAlly.objectId] }
            : undefined;
      let source = p.card(card, { zone: "hand" });
      if (opposingTurn) q.pass();
      if (called) {
        const before = game.state;
        expect(() =>
          p.activate(p.cards(card, { zone: "main-deck" })[0]!, {
            activationMethod: "starcalling",
            reservePayment: pay(cost),
            targets,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(astralShard, "eP07Xxscuq-a1");
        passEffectsStack(game);
        const glimpse = game.state.decision;
        if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
        const deck = p.zone("main-deck").map((c) => c.objectId),
          id = glimpse.cardIds[0]!;
        source = p.cards(card, { zone: "main-deck" }).find((c) => c.objectId === id)!;
        const bottom = glimpse.cardIds.filter((c) => c !== id);
        const answer = {
          kind: "starcall",
          cardId: id,
          bottom,
          reservePayment: pay(cost),
          ...(targets ? { targets } : {}),
        };
        const beforeChoice = game.state;
        for (const invalid of [
          { ...answer, cardId: deck[2] },
          { ...answer, cardId: p.card(card, { zone: "hand" }).objectId },
          { ...answer, bottom: [] },
          { ...answer, bottom: [bottom[0], bottom[0]] },
          { ...answer, reservePayment: pay(cost + 1) },
          ...(cost ? [{ ...answer, reservePayment: pay(cost - 1) }] : []),
          ...(targets
            ? [{ ...answer, targets: { "target-1": [p.card(trainingSword).objectId] } }]
            : []),
        ]) {
          expect(() => answerDecision(game, "resolve-glimpse", invalid)).toThrow();
          expect(game.state).toEqual(beforeChoice);
        }
        answerDecision(game, "resolve-glimpse", answer);
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([...deck.slice(2), ...bottom]);
      } else {
        const before = game.state;
        if (cost) {
          expect(() => p.activate(source, { reservePayment: pay(cost - 1), targets })).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, { reservePayment: pay(cost), targets });
      }
      expect(p.zone("memory")).toHaveLength(cost);
      expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
      expect(game.state.objects[source.objectId]!.activationStates.has("starcalled")).toBe(called);
      passEffectsStack(game);
      if (result === "focus") {
        expect(game.state.objects[hero.objectId]!.states.has("distant")).toBe(true);
        answerDecision(game, "resolve-optional-effect", false);
        passEffectsStack(game);
      }
      if (result === "meteor") {
        expect(game.state.objects[hero.objectId]!.damage).toBe(0);
        expect(game.state.objects[foe.objectId]!.damage).toBe(called ? 3 : 0);
        expect(game.state.objects[ownAlly.objectId]!.damage).toBe(called ? 3 : 0);
        expect(game.state.objects[otherAlly.objectId]!.zone).toBe(called ? "field" : "graveyard");
        if (called) expect(game.state.objects[otherAlly.objectId]!.damage).toBe(3);
      }
      if (result === "bolt" || result === "glow")
        expect(game.state.objects[foe.objectId]!.damage).toBe(result === "bolt" ? 4 : 2);
      expect(game.state.objects[source.objectId]!.zone).toBe(
        result === "ally" ? "field" : result === "glow" && called ? "memory" : "graveyard",
      );
      expect(game.state.decision).toBeNull();
    });
}
