import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { catalepticConstellation } from "./cataleptic-constellation.ts";
import { stellarionShift } from "../actions/stellarion-shift.ts";
import { astralShard } from "../tokens/astral-shard.ts";
import { enfeebledDagger } from "../items/enfeebled-dagger.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { secondWind } from "../../DOA/actions/second-wind.ts";
import { nocturnesOblivion } from "../../P25/actions/nocturnes-oblivion.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers lflzwiiewz-a1 @covers lflzwiiewz-a2 */
describe("Cataleptic Constellation — Imbue and entry wake prohibition", () => {
  for (const astra of [0, 1, 2])
    for (const reveal of [false, true])
      for (const own of [false, true]) run(astra, reveal, own, "none");
  for (const reveal of [false, true])
    for (const own of [false, true]) run(2, reveal, own, "source");
  for (const reveal of [false, true]) run(2, reveal, false, "target");
  run(2, true, true, "none", true);
  function run(
    astra: number,
    reveal: boolean,
    own: boolean,
    remove: "none" | "source" | "target",
    rested = false,
  ) {
    it(`Astra paid=${astra}, reveal=${reveal}, own ally=${own}, removed=${remove}, already rested=${rested}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(catalepticConstellation, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [astralShard],
        playerOne: {
          champion,
          zones: {
            hand: [
              catalepticConstellation,
              stellarionShift,
              stellarionShift,
              secondWind,
              secondWind,
              nocturnesOblivion,
              ...Array.from({ length: 16 }, () => woodlandSquirrels),
            ],
            field: [woodlandSquirrels, trainingSword],
            graveyard: [woodlandSquirrels],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [nocturnesOblivion, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [woodlandSquirrels, enfeebledDagger],
            "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        actor = own ? p : q;
      const source = p.card(catalepticConstellation),
        target = actor.card(woodlandSquirrels, { zone: "field" });
      const pay = (player: typeof p, n: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const opportunity = (id: string) => {
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        if (wait.playerId !== id) game.player(wait.playerId).pass();
      };
      if (rested) {
        p.declareAttack(target, q.card(champion));
        game.resolveCombatWithoutRetaliation();
      }
      const payment = [
        ...p
          .cards(stellarionShift)
          .slice(0, astra)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        ...pay(p, 2 - astra),
      ];
      const before = game.state;
      expect(() =>
        p.activate(source, { reservePayment: payment.slice(0, 1), revealForImbue: reveal }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, { reservePayment: payment, revealForImbue: reveal });
      const imbued = astra === 2 && reveal;
      expect(game.state.stack.at(-1)!.activationStates?.includes("imbued") ?? false).toBe(imbued);
      expect(p.zone("memory")).toHaveLength(2);
      expect(p.cards(astralShard, { zone: "field" })).toHaveLength(0);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(rested);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.activationStates.has("imbued")).toBe(imbued);
      expect(game.state.decision?.kind).toBe("announce-triggered-ability");
      for (const ids of [
        [],
        [p.card(champion).objectId],
        [p.card(trainingSword).objectId],
        [source.objectId],
        [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
        [target.objectId, target.objectId],
      ]) {
        const pending = game.state;
        expect(() =>
          answerDecision(game, "announce-triggered-ability", { targets: { "target-1": ids } }),
        ).toThrow();
        expect(game.state).toEqual(pending);
      }
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      expect(p.cards(astralShard, { zone: "field" })).toHaveLength(0);
      if (remove !== "none") {
        opportunity(q.id);
        if (remove === "source")
          q.activate(nocturnesOblivion, {
            reservePayment: pay(q, 3),
            targets: { "target-1": [source.objectId] },
          });
        else
          q.activateAbility(enfeebledDagger, "idpdon8f0h-a1", {
            targets: { "target-unit": [target.objectId] },
          });
      }
      passEffectsStack(game);
      const tokens = p.cards(astralShard, { zone: "field" });
      expect(tokens).toHaveLength(imbued && remove !== "target" ? 2 : 0);
      expect(q.cards(astralShard, { zone: "field" })).toHaveLength(0);
      if (remove === "target") {
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        return;
      }
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      if (remove === "none") {
        for (let i = 0; i < 2; i++) {
          advanceToMain(game, actor.id, game.state.turn.number);
          expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
        }
        opportunity(p.id);
        p.activate(p.cards(secondWind)[0]!, {
          reservePayment: pay(p, 3),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
        opportunity(p.id);
        p.activate(nocturnesOblivion, {
          reservePayment: pay(p, 3),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
      }
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
      opportunity(p.id);
      p.activate(p.cards(secondWind, { zone: "hand" })[0]!, {
        reservePayment: pay(p, 3),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
      if (tokens.length) {
        opportunity(p.id);
        const deck = p.zone("main-deck");
        p.activateAbility(tokens[0]!, "eP07Xxscuq-a1");
        passEffectsStack(game);
        expect(p.cards(astralShard, { zone: "field" })).toHaveLength(1);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-glimpse",
          playerId: p.id,
          cardIds: deck.slice(0, 2).map((c) => c.objectId),
        });
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: deck.slice(0, 2).map((c) => c.objectId),
          bottom: [],
        });
        passEffectsStack(game);
        expect(p.zone("main-deck")).toEqual(deck);
      }
    });
  }
});

/** @covers lflzwiiewz-a2 */
for (const beforeResolution of [false, true])
  it(`losing control of the source releases the wake restriction; before resolution=${beforeResolution}`, () => {
    const base = enableAllTestElements(
      createClassBonusTestChampion(catalepticConstellation, false, "activation-discount"),
    );
    const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
      ...base,
      layout: {
        kind: "single-faced",
        face: {
          ...requireSingleFace(base),
          abilities: [
            ...requireSingleFace(base).abilities,
            {
              id: `${base.canonicalId}-a9`,
              kind: "activated",
              text: "Give an opponent control of a Phantasia.",
              activation: "ability",
              cost: { kind: "pay-reserve", amount: 0 },
              targets: [
                {
                  id: "phantasia",
                  kind: "target",
                  declared: "announcement",
                  chooser: "controller",
                  unique: true,
                  count: { kind: "exactly", amount: 1 },
                  candidates: {
                    kind: "object",
                    zones: ["field"],
                    relationship: "controlled-by",
                    player: "controller",
                    filter: { kind: "type", oneOf: ["PHANTASIA"] },
                  },
                },
              ],
              effect: {
                kind: "change-control",
                subject: { kind: "bound", binding: "phantasia" },
                controller: "opponent",
              },
            },
          ],
        },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            catalepticConstellation,
            secondWind,
            ...Array.from({ length: 5 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(catalepticConstellation),
      target = q.card(woodlandSquirrels);
    const pay = (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    p.activate(source, { reservePayment: pay(2) });
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [target.objectId] },
    });
    if (!beforeResolution) {
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
    }
    p.activateAbility(p.card(champion), `${base.canonicalId}-a9`, {
      targets: { phantasia: [source.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).toBe("field");
    expect(game.state.objects[source.objectId]!.ownerId).toBe(p.id);
    expect(game.state.objects[source.objectId]!.controllerId).toBe(q.id);
    expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
    p.activate(secondWind, { reservePayment: pay(3), targets: { "target-1": [target.objectId] } });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(false);
  });
