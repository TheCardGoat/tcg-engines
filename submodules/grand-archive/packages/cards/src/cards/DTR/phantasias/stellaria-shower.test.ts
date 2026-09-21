import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { stellariaShower } from "./stellaria-shower.ts";
import { astralShard } from "../tokens/astral-shard.ts";
import { aethercloakSentinel } from "../allies/aethercloak-sentinel.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers xmtjrvfpuc-a1 @covers xmtjrvfpuc-a3 */
describe("Stellaria Shower — Starcalling and Spell entry damage", () => {
  for (const called of [false, true])
    for (const extra of [0, 2])
      for (const own of [false, true])
        for (const ally of [false, true]) run(called, extra, own, ally);
  for (const remove of ["source", "other", "target"] as const) run(true, 2, false, true, remove);
  run(true, 0, false, false, "source");
  run(true, 0, false, false, "none", true);
  run(true, 2, true, true, "none", true);

  function run(
    called: boolean,
    extra: number,
    own: boolean,
    ally: boolean,
    remove: "none" | "source" | "other" | "target" = "none",
    opposingTurn = false,
  ) {
    it(`starcalled=${called}, other phantasias=${extra}, own=${own}, ally=${ally}, remove=${remove}, opposing turn=${opposingTurn}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(stellariaShower, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: opposingTurn ? "playerTwo" : "playerOne",
        playerOne: {
          champion,
          zones: {
            hand: [
              stellariaShower,
              nocturnesOblivion,
              ...Array.from({ length: 7 }, () => woodlandSquirrels),
            ],
            field: [
              giantTortoise,
              trainingSword,
              aethercloakSentinel,
              ...Array.from({ length: extra + (called ? 1 : 0) }, () => astralShard),
            ],
            graveyard: [stellariaShower],
            banishment: [stellariaShower],
            "main-deck": Array.from({ length: 4 }, () => stellariaShower),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise, aethercloakSentinel, astralShard, astralShard, astralShard],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        actor = own ? p : q;
      const target = actor.card(ally ? giantTortoise : champion);
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      let source = p.card(stellariaShower, { zone: "hand" });
      if (opposingTurn) {
        q.pass();
        const before = game.state;
        expect(() => p.activate(source, { reservePayment: pay(1) })).toThrow();
        expect(game.state).toEqual(before);
      }
      if (called) {
        p.activateAbility(p.cards(astralShard)[0]!, "eP07Xxscuq-a1");
        passEffectsStack(game);
        const glimpse = game.state.decision;
        if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
        const deck = p.zone("main-deck");
        source = p
          .cards(stellariaShower, { zone: "main-deck" })
          .find((c) => c.objectId === glimpse.cardIds[0])!;
        const bottom = glimpse.cardIds.filter((id) => id !== source.objectId);
        for (const invalid of [
          { kind: "starcall", cardId: source.objectId, bottom, reservePayment: [] },
          { kind: "starcall", cardId: deck[2]!.objectId, bottom, reservePayment: pay(1) },
          { kind: "starcall", cardId: source.objectId, bottom: [], reservePayment: pay(1) },
          {
            kind: "starcall",
            cardId: source.objectId,
            bottom: [bottom[0], bottom[0]],
            reservePayment: pay(1),
          },
        ])
          expect(() => answerDecision(game, "resolve-glimpse", invalid)).toThrow();
        answerDecision(game, "resolve-glimpse", {
          kind: "starcall",
          cardId: source.objectId,
          bottom,
          reservePayment: pay(1),
        });
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
          ...deck.slice(2).map((c) => c.objectId),
          ...bottom,
        ]);
      } else {
        const before = game.state;
        expect(() => p.activate(source, { reservePayment: [] })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { reservePayment: pay(1) });
      }
      expect(p.zone("memory")).toHaveLength(1);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.activationStates.has("starcalled")).toBe(called);
      expect(game.state.decision?.kind).toBe("announce-triggered-ability");
      for (const invalid of [
        [],
        [target.objectId, target.objectId],
        [p.card(trainingSword).objectId],
        [source.objectId],
        [p.card(stellariaShower, { zone: "graveyard" }).objectId],
        [q.card(aethercloakSentinel).objectId],
        [p.card(aethercloakSentinel).objectId],
      ]) {
        expect(() =>
          answerDecision(game, "announce-triggered-ability", { targets: { "target-1": invalid } }),
        ).toThrow();
      }
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      if (remove !== "none") {
        const removed =
          remove === "source" ? source : remove === "target" ? target : p.cards(astralShard)[0]!;
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        if (wait.playerId !== p.id) game.player(wait.playerId).pass();
        p.activate(nocturnesOblivion, {
          reservePayment: pay(3),
          targets: { "target-1": [removed.objectId] },
        });
      }
      passEffectsStack(game);
      const damage = called ? extra + 1 - (remove === "source" || remove === "other" ? 1 : 0) : 0;
      if (remove === "target") expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
      else expect(game.state.objects[target.objectId]!.damage).toBe(damage);
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.decision).toBeNull();
    });
  }
});
