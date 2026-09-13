import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
import { describe } from "vitest";
import { niaMistveiledScout } from "./nia-mistveiled-scout.ts";

/** @covers PZM9uvCFai-a1 */
describe("Nia, Mistveiled Scout \u2014 resolution", () => {
  proveClassBonusStealth(niaMistveiledScout);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { blitzMage } from "./blitz-mage.ts";
import { giantTortoise } from "./giant-tortoise.ts";
/** @covers PZM9uvCFai-a2 @covers PZM9uvCFai-a3 */
for (const empty of [false, true])
  it(`Nia may name a card absent from the inspected memory and taxes both players until she leaves: empty=${empty}`, () => {
    const champion = createClassBonusTestChampion(niaMistveiledScout, false, "activation-discount"),
      game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [niaMistveiledScout, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [woodlandSquirrels, woodlandSquirrels],
            memory: empty ? [] : [giantTortoise],
            field: [blitzMage],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(niaMistveiledScout),
      inspected = q.zone("memory").map((c) => c.objectId);
    p.activate(source, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    });
    passEffectsStack(game);
    const before = game.state;
    expect(() =>
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-opponent": [p.id] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    answerDecision(game, "announce-triggered-ability", { targets: { "target-opponent": [q.id] } });
    passEffectsStack(game);
    expect(
      game.state.eventHistory
        .filter((e) => e.type === "cards-looked-at")
        .flatMap((e) => (e.type === "cards-looked-at" ? e.objectIds : [])),
    ).toEqual(inspected);
    answerDecision(game, "resolve-effect-choice", "Woodland Squirrels");
    passEffectsStack(game);
    const own = p.cards(woodlandSquirrels, { zone: "hand" });
    expect(() => p.activate(own[0]!)).toThrow();
    p.activate(own[0]!, { reservePayment: [{ kind: "card", cardId: own[1]!.objectId }] });
    passEffectsStack(game);
    advanceToMain(game, q.id);
    const theirs = q.cards(woodlandSquirrels, { zone: "hand" });
    expect(() => q.activate(theirs[0]!)).toThrow();
    q.activate(theirs[0]!, { reservePayment: [{ kind: "card", cardId: theirs[1]!.objectId }] });
    passEffectsStack(game);
    q.declareAttack(blitzMage, source);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
    advanceToMain(game, p.id);
    const final = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
    p.activate(final);
    passEffectsStack(game);
    expect(game.state.objects[final.objectId]!.zone).toBe("field");
  });
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
/** @covers PZM9uvCFai-a2 @covers PZM9uvCFai-a3 */
it("Nia's chosen-name cost also applies to an opponent's materialization", () => {
  const champion = createClassBonusTestChampion(niaMistveiledScout, false, "activation-discount"),
    game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [niaMistveiledScout, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { memory: [woodlandSquirrels], "material-deck": [trainingSword] },
      },
    });
  const p = game.player("player-one"),
    q = game.player("player-two");
  p.activate(niaMistveiledScout, {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
  });
  passEffectsStack(game);
  answerDecision(game, "announce-triggered-ability", { targets: { "target-opponent": [q.id] } });
  passEffectsStack(game);
  answerDecision(game, "resolve-effect-choice", "Training Sword");
  passEffectsStack(game);
  for (
    let i = 0;
    i < 96 && !(game.state.turn.playerId === q.id && game.state.turn.phase === "materialize");
    i++
  ) {
    const w = game.waitState();
    if (w.kind !== "opportunity") throw new Error("Expected opportunity");
    game.player(w.playerId).pass();
  }
  const payment = q.card(woodlandSquirrels, { zone: "memory" });
  q.materialize(trainingSword);
  expect(game.state.objects[payment.objectId]!.zone).toBe("banishment");
  passEffectsStack(game);
  expect(q.card(trainingSword, { zone: "field" })).toBeDefined();
});
