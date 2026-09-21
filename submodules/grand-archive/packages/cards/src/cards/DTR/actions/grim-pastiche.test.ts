import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { grimPastiche } from "./grim-pastiche.ts";
import { manaflareBarrage } from "./manaflare-barrage.ts";
import { cosmicAlignment } from "./cosmic-alignment.ts";
import { backdash } from "./backdash.ts";
import { extortingBlackjack } from "../attacks/extorting-blackjack.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { luxemSight } from "../../DOA/actions/luxem-sight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers akmv2ssjhu-a1 */
describe("Grim Pastiche — optional free activation of a copied action omen", () => {
  for (const card of [luxemSight, sparkAlight, manaflareBarrage])
    for (const accept of [false, true])
      for (const opposingTurn of [false, true])
        it(`${card.slug}, activate=${accept}, opposing turn=${opposingTurn}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(grimPastiche, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [condemnedTrinket],
                hand: [grimPastiche, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
                graveyard: [card, backdash],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            target = q.card(champion),
            original = p.card(card, { zone: "graveyard" });
          const payment = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          p.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: payment(3) });
          passEffectsStack(game);
          answerDecision(game, "resolve-effect-choice", [original.objectId]);
          passEffectsStack(game);
          if (opposingTurn) {
            advanceToMain(game, q.id);
            q.pass();
          }
          const before = game.state;
          expect(() =>
            p.activate(grimPastiche, {
              targets: { "target-omen": [original.objectId] },
              reservePayment: payment(1),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          const hand = p.zone("hand").length,
            deck = p.zone("main-deck").length;
          p.activate(grimPastiche, {
            targets: { "target-omen": [original.objectId] },
            reservePayment: payment(2),
          });
          expect(p.zone("hand")).toHaveLength(hand - 3);
          expect(p.zone("memory")).toHaveLength(5);
          expect(p.cards(card)).toHaveLength(1);
          passEffectsStack(game);
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          const copy = p.cards(card).find((c) => c.objectId !== original.objectId)!;
          expect(copy).toBeDefined();
          expect(game.state.objects[copy.objectId]!.counters.omen ?? 0).toBe(0);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          expect(p.zone("main-deck")).toHaveLength(deck);
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
          if (accept) {
            expect(game.state.decision?.kind).toBe("announce-effect-activation");
            answerDecision(
              game,
              "announce-effect-activation",
              card === sparkAlight ? { targets: { "target-1": [target.objectId] } } : {},
            );
            expect(game.state.objects[target.objectId]!.damage).toBe(0);
            expect(p.zone("main-deck")).toHaveLength(deck);
            passEffectsStack(game);
            if (game.state.decision?.kind === "resolve-optional-effect") {
              answerDecision(game, "resolve-optional-effect", false);
              passEffectsStack(game);
            }
          }
          expect(game.state.stack).toHaveLength(0);
          expect(game.state.decision).toBeFalsy();
          expect(game.state.objects[original.objectId]).toMatchObject({
            zone: "banishment",
            counters: { omen: 1 },
          });
          expect(game.state.objects[copy.objectId]).toBeUndefined();
          expect(p.cards(card)).toHaveLength(1);
          expect(p.zone("memory")).toHaveLength(5);
          expect(p.zone("main-deck")).toHaveLength(deck - (accept && card === luxemSight ? 1 : 0));
          expect(p.zone("hand")).toHaveLength(hand - 3 + (accept && card === luxemSight ? 1 : 0));
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            accept && card !== luxemSight ? 2 : 0,
          );
          expect(p.cards(grimPastiche, { zone: "graveyard" })).toHaveLength(1);
        });

  it("rejects non-omens, other owners, Skills, non-actions, and reserve cost six", () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(grimPastiche, false, "activation-discount"),
    );
    const omens = [
      sparkAlight,
      cosmicAlignment,
      grimPastiche,
      woodlandSquirrels,
      extortingBlackjack,
      condemnedTrinket,
    ];
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: omens.map(() => condemnedTrinket),
          hand: [grimPastiche, sparkAlight, ...Array.from({ length: 20 }, () => woodlandSquirrels)],
          graveyard: [...omens, sparkAlight],
          banishment: [sparkAlight],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [condemnedTrinket],
          hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [sparkAlight],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", {
      reservePayment: q
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    advanceToMain(game, p.id);
    const payment = (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const selected = [];
    for (const card of omens) {
      const original = p.cards(card, { zone: "graveyard" })[0]!;
      selected.push(original);
      p.activateAbility(p.cards(condemnedTrinket, { zone: "field" })[0]!, "21oy1nd4nw-a1", {
        reservePayment: payment(3),
      });
      passEffectsStack(game);
      answerDecision(game, "resolve-effect-choice", [original.objectId]);
      passEffectsStack(game);
    }
    const source = p.card(grimPastiche, { zone: "hand" }),
      valid = selected[0]!;
    const invalid = [
      ...selected.slice(1),
      p.card(sparkAlight, { zone: "hand" }),
      p.card(sparkAlight, { zone: "graveyard" }),
      p.cards(sparkAlight, { zone: "banishment" }).find((c) => c.objectId !== valid.objectId)!,
      q.card(sparkAlight, { zone: "banishment" }),
    ];
    for (const targets of [
      ...invalid.map((c) => [c.objectId]),
      [],
      [valid.objectId, valid.objectId],
    ]) {
      const before = game.state;
      expect(() =>
        p.activate(source, { targets: { "target-omen": targets }, reservePayment: payment(2) }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activate(source, {
      targets: { "target-omen": [valid.objectId] },
      reservePayment: payment(2),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);
    expect(p.cards(sparkAlight)).toHaveLength(4);
  });
  it("does not bypass the copied card's elemental requirements", () => {
    const champion = createClassBonusTestChampion(grimPastiche, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [condemnedTrinket],
          hand: [grimPastiche, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
          graveyard: [sparkAlight],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      original = p.card(sparkAlight);
    const payment = (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    p.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: payment(3) });
    passEffectsStack(game);
    p.activate(grimPastiche, {
      targets: { "target-omen": [original.objectId] },
      reservePayment: payment(2),
    });
    passEffectsStack(game);
    const before = game.state;
    expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
    expect(game.state).toEqual(before);
    answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);
    expect(p.cards(sparkAlight)).toHaveLength(1);
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.decision).toBeFalsy();
    expect(game.state.objects[original.objectId]).toMatchObject({
      zone: "banishment",
      counters: { omen: 1 },
    });
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
  });
});
