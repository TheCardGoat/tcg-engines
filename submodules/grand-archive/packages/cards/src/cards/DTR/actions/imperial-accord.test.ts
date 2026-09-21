import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { spellwardScepter } from "../items/spellward-scepter.ts";
import { imperialAccord } from "./imperial-accord.ts";
import { royalOrdinance } from "./royal-ordinance.ts";
import { reckoningsWake } from "./reckonings-wake.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 1S7Q5fqX5u-a1 */
describe("Imperial Accord — Exalted and Water requirements", () => {
  for (const elements of [["WATER"], ["UMBRA"], ["EXALTED", "WATER"], ["WATER", "UMBRA"]] as const)
    it(`requires both enabled elements with champion ${elements.join("/")}`, () => {
      const base = createClassBonusTestChampion(imperialAccord, false, "activation-discount");
      const champion = {
        ...base,
        layout: { kind: "single-faced" as const, face: { ...requireSingleFace(base), elements } },
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { hand: [imperialAccord, woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: {
          champion: enableAllTestElements(
            createClassBonusTestChampion(royalOrdinance, false, "activation-discount"),
          ),
          zones: {
            hand: [royalOrdinance, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      q.activate(royalOrdinance, {
        reservePayment: q
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      const activation = game.state.stack.at(-1)!;
      q.pass();
      const options = {
        targets: { "target-activation": [activation.id] },
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      };
      if (elements.length === 2 && elements[1] === "UMBRA") {
        p.activate(imperialAccord, options);
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-payment", false);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        expect(q.cards(royalOrdinance, { zone: "banishment" })).toHaveLength(1);
      } else {
        const before = game.state;
        expect(() => p.activate(imperialAccord, options)).toThrow();
        expect(game.state).toEqual(before);
      }
    });
});

/** @covers 1S7Q5fqX5u-a2 */
describe("Imperial Accord — advanced activation payment and optional banishment", () => {
  for (const card of [reckoningsWake, royalOrdinance])
    for (const own of [false, true])
      for (const outcome of ["pay", "negate", "banish"] as const)
        it(`${card.slug}, own activation=${own}, ${outcome}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(imperialAccord, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [
                  imperialAccord,
                  ...(own ? [card] : []),
                  ...Array.from({ length: 10 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [
                  ...(own ? [] : [card]),
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = own ? p : q;
          const source = actor.card(card, { zone: "hand" });
          actor.activate(source, {
            reservePayment: actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          const activation = game.state.stack.at(-1)!;
          if (!own) q.pass();
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() =>
            p.activate(imperialAccord, {
              targets: { "target-activation": [activation.id] },
              reservePayment: payment.slice(0, 1),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(imperialAccord, {
            targets: { "target-activation": [activation.id] },
            reservePayment: payment,
          });
          passEffectsStack(game);
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-payment",
            playerId: actor.id,
          });
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          if (outcome === "pay") {
            const reserve = actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 6)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const pending = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-payment", {
                reservePayment: reserve.slice(0, 5),
              }),
            ).toThrow();
            expect(game.state).toEqual(pending);
            answerDecision(game, "resolve-effect-payment", { reservePayment: reserve });
            passEffectsStack(game);
            expect(game.state.decision).toBeNull();
          } else {
            answerDecision(game, "resolve-effect-payment", false);
            passEffectsStack(game);
            expect(game.state.decision).toMatchObject({
              kind: "resolve-optional-effect",
              playerId: p.id,
            });
            answerDecision(game, "resolve-optional-effect", outcome === "banish");
            passEffectsStack(game);
          }
          expect(game.state.objects[source.objectId]!.zone).toBe(
            outcome === "banish" ? "banishment" : "graveyard",
          );
          expect(game.state.stack).toHaveLength(0);
          expect(actor.zone("memory")).toHaveLength((own ? 4 : 2) + (outcome === "pay" ? 6 : 0));
          expect(actor.zone("main-deck")).toHaveLength(
            outcome === "pay" && card === royalOrdinance ? 0 : 1,
          );
          expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(
            outcome === "pay" && card === reckoningsWake ? 1 : 0,
          );
        });

  it("rejects a Norm ally activation even when the counter's elements and cost are available", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(imperialAccord, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { hand: [imperialAccord, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion, zones: { hand: [woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    q.activate(woodlandSquirrels);
    const activation = game.state.stack.at(-1)!;
    q.pass();
    const before = game.state;
    expect(() =>
      p.activate(imperialAccord, {
        targets: { "target-activation": [activation.id] },
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    passEffectsStack(game);
    expect(q.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
  });
  it("offers no banishment when the targeted activation cannot be negated", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(imperialAccord, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { hand: [imperialAccord, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: {
        champion,
        zones: {
          field: [spellwardScepter],
          hand: [royalOrdinance, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    q.activateAbility(spellwardScepter, "f6lxizyuml-a2");
    passEffectsStack(game);
    q.activate(royalOrdinance, {
      reservePayment: q
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    const activation = game.state.stack.at(-1)!;
    q.pass();
    p.activate(imperialAccord, {
      targets: { "target-activation": [activation.id] },
      reservePayment: p.cards(woodlandSquirrels).map((c) => ({ kind: "card", cardId: c.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision).toMatchObject({ kind: "resolve-effect-payment", playerId: q.id });
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(q.cards(royalOrdinance, { zone: "graveyard" })).toHaveLength(1);
    expect(q.zone("hand")).toHaveLength(1);
    expect(q.zone("main-deck")).toHaveLength(0);
    expect(q.zone("memory")).toHaveLength(2);
  });
});
