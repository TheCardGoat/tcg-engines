import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { greaterBoonOfAstraeus } from "./greater-boon-of-astraeus.ts";
import { lesserBoonOfApollo } from "./lesser-boon-of-apollo.ts";
import { pantheonBarrier } from "../tokens/pantheon-barrier.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { scatteringGusts } from "../../DOA/actions/scattering-gusts.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers B9RzxSut57-a2 */
describe("Greater Boon of Astraeus — this turn's own suppression count", () => {
  for (const mode of [0, 1, 2, 3, "opponent", "previous-turn"] as const)
    it(`draw count with suppression=${mode}`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Astraeus", 0));
      const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [
          { definitionId: woodlandSquirrels.canonicalId, count: 50 },
          { definitionId: scatteringGusts.canonicalId, count: 50 },
        ],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        pantheon: {
          lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
          greaterBoonDefinitionId: greaterBoonOfAstraeus.canonicalId,
          barrierDefinitionId: pantheonBarrier.canonicalId,
        },
      });
      const game = GrandArchiveTestEngine.start(
        [
          champion,
          woodlandSquirrels,
          scatteringGusts,
          lesserBoonOfApollo,
          greaterBoonOfAstraeus,
          pantheonBarrier,
        ],
        {
          mode: "pantheon",
          randomSeed: 43,
          firstPlayerId: "player-one",
          players: [setup("player-one"), setup("player-two"), setup("player-three")],
        },
        { validateDeckConstruction: false, skipPregameForTests: true },
      );
      const p = game.player("player-one"),
        q = game.player("player-two");
      for (let n = 0; n < 20; n++) advanceToMain(game, p.id, game.state.turn.number);
      for (const ref of p.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 3)) {
        p.activate(ref);
        passEffectsStack(game);
      }
      advanceToMain(game, q.id);
      for (const ref of q.cards(woodlandSquirrels, { zone: "hand" }).slice(0, 3)) {
        q.activate(ref);
        passEffectsStack(game);
      }
      const suppress = (actor: typeof p, owner: typeof p, n: number) => {
        for (let left = n; left > 0; left -= 2) {
          const spell = actor.cards(scatteringGusts, { zone: "hand" })[0]!;
          const targets = owner
            .cards(woodlandSquirrels, { zone: "field" })
            .slice(0, Math.min(2, left));
          expect(targets).toHaveLength(Math.min(2, left));
          actor.activate(spell, {
            targets: { "target-allies": targets.map((c) => c.objectId) },
            reservePayment: actor
              .zone("hand")
              .filter((c) => c.objectId !== spell.objectId)
              .slice(0, 4)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          for (const ref of targets)
            expect(game.state.objects[ref.objectId]!.zone).toBe("banishment");
        }
      };
      advanceToMain(game, p.id);
      if (mode === "opponent") {
        // Fast Scattering Gusts can be played by an opponent in this same turn.
        p.pass();
        suppress(q, p, 2);
      } else suppress(p, q, typeof mode === "number" ? mode : 2);
      if (mode === "previous-turn") advanceToMain(game, p.id, game.state.turn.number, true);
      // Return opportunity to the active player without crossing a phase boundary.
      for (let i = 0; i < 8; i++) {
        const wait = game.waitState();
        if (wait.kind !== "opportunity" || wait.playerId === p.id) break;
        game.player(wait.playerId).pass();
      }
      const boon = p.card(greaterBoonOfAstraeus, { zone: "pantheon" });
      const deck = p.zone("main-deck"),
        hand = p.zone("hand");
      const otherDeck = q.zone("main-deck");
      p.execute({
        move: "bestow-boon",
        cardId: boon.objectId,
        reservePayment: hand.slice(0, 5).map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      const draw = typeof mode === "number" ? Math.min(2, mode) : 0;
      expect(game.state.objects[boon.objectId]!.facing).toBe("face-up");
      expect(p.zone("hand")).toHaveLength(hand.length - 5 + draw);
      expect(p.zone("main-deck")).toEqual(deck.slice(draw));
      for (const ref of deck.slice(0, draw)) expect(p.zone("hand")).toContainEqual(ref);
      expect(q.zone("main-deck")).toEqual(otherDeck);
    });
});
