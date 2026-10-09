import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveNumericProperty,
  type GrandArchivePantheonPlayerSetup,
  type GrandArchiveObjectId,
} from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { greaterBoonOfFlock } from "./greater-boon-of-flock.ts";
import { lesserBoonOfApollo } from "../../PP1/boons/lesser-boon-of-apollo.ts";
import { pantheonBarrier } from "../../PP1/tokens/pantheon-barrier.ts";
import { gaiasSongbird } from "../../DOA/allies/gaias-songbird.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fledgling } from "../../HVN/tokens/fledgling.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers vp83TimzWT-a1 */
describe("Greater Boon of Flock — Bird cascade and permanent anthem", () => {
  for (const recipient of ["songbird", "token"] as const) {
    it(`counts external Bird entries, chooses ${recipient}, grants the tenth-step anthem`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(greaterBoonOfFlock, false, "activation-discount"),
      );
      const setup = (id: string): GrandArchivePantheonPlayerSetup => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [
          { definitionId: gaiasSongbird.canonicalId, count: 16 },
          { definitionId: woodlandSquirrels.canonicalId, count: 4 },
        ],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        pantheon: {
          lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
          greaterBoonDefinitionId: greaterBoonOfFlock.canonicalId,
          barrierDefinitionId: pantheonBarrier.canonicalId,
        },
      });
      const game = GrandArchiveTestEngine.start(
        [
          champion,
          greaterBoonOfFlock,
          lesserBoonOfApollo,
          pantheonBarrier,
          gaiasSongbird,
          woodlandSquirrels,
          fledgling,
        ],
        {
          mode: "pantheon",
          firstPlayerId: "player-one",
          randomSeed: 43,
          players: [setup("player-one"), setup("player-two"), setup("player-three")],
        },
        { validateDeckConstruction: false, skipPregameForTests: true },
      );
      const p = game.player("player-one"),
        q = game.player("player-two");
      for (
        let n = 0;
        n < 12 &&
        (p.zone("hand").length < 6 ||
          p.cards(woodlandSquirrels, { zone: "hand" }).length === 0 ||
          p.cards(gaiasSongbird, { zone: "hand" }).length === 0);
        n++
      )
        advanceToMain(game, p.id, game.state.turn.number);
      const ordinary = p.cards(woodlandSquirrels, { zone: "hand" })[0]!,
        firstBird = p.cards(gaiasSongbird, { zone: "hand" })[0]!;
      p.execute({
        move: "bestow-boon",
        cardId: p.card(greaterBoonOfFlock, { zone: "pantheon" }).objectId,
        reservePayment: p
          .zone("hand")
          .filter((c) => c.objectId !== ordinary.objectId && c.objectId !== firstBird.objectId)
          .slice(0, 3)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      p.activate(ordinary);
      passEffectsStack(game);
      expect(p.cards(fledgling)).toHaveLength(0);
      const stat = (id: GrandArchiveObjectId, property: "power" | "life") =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      let lastBird = firstBird;
      for (let n = 1; n <= 11; n++) {
        if (n > 1) advanceToMain(game, p.id, game.state.turn.number, true);
        const bird = n === 1 ? firstBird : p.cards(gaiasSongbird, { zone: "hand" })[0]!;
        lastBird = bird;
        const payment = p.zone("hand").find((c) => c.objectId !== bird.objectId);
        if (!payment) throw Error("Missing Bird payment");
        p.activate(bird, { reservePayment: [{ kind: "card", cardId: payment.objectId }] });
        passEffectsStack(game);
        if (n >= 5 && n <= 9) {
          const chosen = recipient === "songbird" ? firstBird : p.cards(fledgling)[0]!;
          const before = game.state;
          for (const ids of [[], [ordinary.objectId], [p.card(champion).objectId]]) {
            expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
          passEffectsStack(game);
        }
        expect(game.state.decision, `external Bird entry ${n}`).toBeNull();
        const boon = p.card(greaterBoonOfFlock, { zone: "pantheon" });
        expect(game.state.objects[boon.objectId]!.cascadeCounts["vp83TimzWT-a1"]).toBe(n);
        const summons = game.state.eventHistory.filter(
          (event) =>
            event.type === "tokens-summoned" &&
            event.playerId === p.id &&
            event.objects.some((object) => object.definitionId === fledgling.canonicalId),
        );
        expect(summons).toHaveLength(Math.min(n, 4));
        for (const event of summons)
          expect(event.cause).toMatchObject({
            kind: "stack-item",
            stackItemKind: "triggered-ability",
            abilityId: "vp83TimzWT-a1",
            controllerId: p.id,
          });
        expect(p.cards(fledgling, { zone: "field" })).toHaveLength(Math.min(n, 4));
        const chosen = recipient === "songbird" ? firstBird : p.cards(fledgling)[0]!;
        expect(game.state.objects[chosen.objectId]!.counters.buff ?? 0).toBe(
          Math.min(5, Math.max(0, n - 4)),
        );
        const unbuffed = p.cards(fledgling)[recipient === "token" ? 1 : 0];
        if (unbuffed) expect(stat(unbuffed.objectId, "power")).toBe(n >= 10 ? 1 : 0);
      }
      expect(stat(lastBird.objectId, "power")).toBe(2);
      expect(stat(ordinary.objectId, "power")).toBe(1);
      p.declareAttack(lastBird, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      p.declareAttack(ordinary, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[lastBird.objectId]!.states.has("rested")).toBe(true);
      advanceToMain(game, q.id, -1, true);
      expect(game.state.objects[lastBird.objectId]!.states.has("rested")).toBe(false);
      expect(game.state.objects[ordinary.objectId]!.states.has("rested")).toBe(true);
      const opposingBird = q.cards(gaiasSongbird, { zone: "hand" })[0]!,
        payment = q.zone("hand").find((c) => c.objectId !== opposingBird.objectId)!;
      q.activate(opposingBird, { reservePayment: [{ kind: "card", cardId: payment.objectId }] });
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(p.cards(fledgling, { zone: "field" })).toHaveLength(4);
      expect(stat(opposingBird.objectId, "power")).toBe(1);
      expect(stat(lastBird.objectId, "power")).toBe(2);
    });
  }
});
