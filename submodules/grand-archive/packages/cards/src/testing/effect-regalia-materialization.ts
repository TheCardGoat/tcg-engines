import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { signaltechXUltra } from "../cards/PRD/items/signaltech-x-ultra.ts";
import { fastCure } from "../cards/P23/actions/fast-cure.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { deepSeaFractal } from "../cards/FTC/phantasias/deep-sea-fractal.ts";

export function proveEffectRegaliaMaterialization(
  source: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  fromBanishment: boolean,
) {
  const nextChampion = lineageTestChampion("Other", 1);
  const origins: readonly ("material-deck" | "banishment")[] = fromBanishment
    ? ["material-deck", "banishment"]
    : ["material-deck"];
  for (const matching of [false, true])
    for (const origin of origins)
      for (const entry of [
        { card: trainingSword, cost: 0 },
        { card: signaltechXUltra, cost: 1 },
      ])
        for (const reserve of ["cards", "reservable"] as const)
          for (const funding of [
            { memory: 0, floating: false },
            { memory: 2, floating: false },
            { memory: 0, floating: true },
          ])
            it(`class=${matching}, origin=${origin}, regalia=${entry.card.slug}, reserve=${reserve}, memory=${funding.memory}, floating=${funding.floating}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(source, matching, "activation-discount"),
              );
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      source,
                      entry.card,
                      woodlandSquirrels,
                      woodlandSquirrels,
                      woodlandSquirrels,
                    ],
                    field: [deepSeaFractal, deepSeaFractal, deepSeaFractal],
                    "material-deck": [
                      nextChampion,
                      ...(origin === "material-deck" ? [entry.card] : []),
                    ],
                    banishment: origin === "banishment" ? [entry.card] : [],
                    graveyard: [entry.card, ...(funding.floating ? [fastCure] : [])],
                    memory: Array.from({ length: funding.memory }, () => woodlandSquirrels),
                  },
                },
                playerTwo: {
                  champion,
                  zones: { "material-deck": [entry.card], banishment: [entry.card] },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two");
              const chosen = p.card(entry.card, { zone: origin });
              const sourceRef = p.card(source, { zone: "hand" });
              const before = game.state;
              expect(() => p.materialize(chosen)).toThrow();
              expect(game.state).toEqual(before);
              const reservePayment =
                reserve === "cards"
                  ? p
                      .cards(woodlandSquirrels, { zone: "hand" })
                      .map((c) => ({ kind: "card" as const, cardId: c.objectId }))
                  : p
                      .cards(deepSeaFractal, { zone: "field" })
                      .map((c) => ({ kind: "reservable" as const, objectId: c.objectId }));
              p.activate(sourceRef, { reservePayment });
              passEffectsStack(game);
              const atChoice = game.state;
              const invalid = [
                sourceRef,
                p.card(entry.card, { zone: "hand" }),
                p.card(entry.card, { zone: "graveyard" }),
                p.card(nextChampion, { zone: "material-deck" }),
                q.card(entry.card, { zone: "material-deck" }),
                q.card(entry.card, { zone: "banishment" }),
              ];
              for (const bad of invalid) {
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [bad.objectId]),
                ).toThrow();
                expect(game.state).toEqual(atChoice);
              }
              for (const bad of [[], [chosen.objectId, chosen.objectId]]) {
                expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
                expect(game.state).toEqual(atChoice);
              }
              answerDecision(game, "resolve-effect-choice", [chosen.objectId]);
              passEffectsStack(game);
              expect(game.state.decision).toMatchObject({
                kind: "announce-effect-materialization",
                playerId: p.id,
                cardId: chosen.objectId,
                payCosts: true,
              });
              const memory = p.zone("memory");
              const banished = p.zone("banishment").filter((c) => c.objectId !== chosen.objectId);
              const affordable = memory.length + (funding.floating ? 1 : 0) >= entry.cost;
              const floatingPayment =
                funding.floating && memory.length < entry.cost
                  ? p.cards(fastCure, { zone: "graveyard" })
                  : [];
              if (affordable) {
                const before = game.state;
                expect(() =>
                  answerDecision(game, "announce-effect-materialization", false),
                ).toThrow();
                expect(game.state).toEqual(before);
                answerDecision(game, "announce-effect-materialization", {
                  floatingMemoryCardIds: floatingPayment.map((c) => c.objectId),
                });
                expect(game.state.objects[chosen.objectId]?.zone).toBe("effects-stack");
                expect(game.state.stack.at(-1)).toMatchObject({
                  kind: "materialization",
                  cardId: chosen.objectId,
                });
                expect(p.zone("memory")).toHaveLength(
                  memory.length - entry.cost + floatingPayment.length,
                );
                const paid = memory.filter(
                  (c) => !p.zone("memory").some((x) => x.objectId === c.objectId),
                );
                expect(paid).toHaveLength(entry.cost - floatingPayment.length);
                expect(p.zone("banishment").map((c) => c.objectId)).toEqual([
                  ...banished.map((c) => c.objectId),
                  ...floatingPayment.map((c) => c.objectId),
                  ...paid.map((c) => c.objectId),
                ]);
                passEffectsStack(game);
                expect(p.card(entry.card, { zone: "field" })).toEqual(chosen);
              } else {
                const before = game.state;
                expect(() => answerDecision(game, "announce-effect-materialization", {})).toThrow();
                expect(game.state).toEqual(before);
                expect(
                  game
                    .legalCommands(p.id)
                    .some(
                      ({ command }) =>
                        command.move === "answer-decision" && command.answer === false,
                    ),
                ).toBe(true);
                answerDecision(game, "announce-effect-materialization", false);
                passEffectsStack(game);
                expect(p.card(entry.card, { zone: origin })).toEqual(chosen);
                expect(p.zone("memory")).toHaveLength(0);
              }
              expect(game.state.decision).toBeNull();
              expect(game.state.stack).toHaveLength(0);
              expect(p.card(source, { zone: "graveyard" })).toEqual(sourceRef);
              expect(q.card(entry.card, { zone: "material-deck" })).toBeDefined();
              expect(q.card(entry.card, { zone: "banishment" })).toBeDefined();
              expect(game.state.turn.phase).toBe("main");
            });
  for (const matching of [false, true])
    it(`finishes without an eligible regalia: class=${matching}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(source, matching, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [source, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "material-deck": [nextChampion],
            banishment: fromBanishment ? [] : [trainingSword],
          },
        },
        playerTwo: { champion, zones: { "material-deck": [trainingSword] } },
      });
      const p = game.player("player-one");
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
      expect(p.card(source, { zone: "graveyard" })).toBeDefined();
      expect(p.zone("memory")).toHaveLength(3);
      expect(p.cards(trainingSword, { zone: "field" })).toHaveLength(0);
    });
}
