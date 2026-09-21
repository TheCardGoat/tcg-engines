import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { candlelightHourglass } from "./candlelight-hourglass.ts";
import { twoOfHearts } from "../allies/two-of-hearts.ts";
import { astralShard } from "../tokens/astral-shard.ts";
import { spiritsBlessing } from "../../DOA/actions/spirits-blessing.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers fhomy86084-a1 */
it("Candlelight Hourglass draws for its controller only after the entry trigger resolves", () => {
  const champion = createClassBonusTestChampion(candlelightHourglass, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion,
      zones: {
        "material-deck": [candlelightHourglass],
        memory: [woodlandSquirrels],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    top = p.zone("main-deck")[0]!,
    source = p.card(candlelightHourglass);
  p.materialize(source);
  expect(p.zone("memory")).toHaveLength(0);
  expect(p.zone("banishment")).toHaveLength(1);
  expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
  p.pass();
  q.pass();
  expect(game.state.objects[source.objectId]!.zone).toBe("field");
  expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
  passEffectsStack(game);
  expect(game.state.objects[top.objectId]!.zone).toBe("hand");
  expect(q.zone("hand")).toHaveLength(0);
});

/** @covers fhomy86084-a2 */
it("Candlelight Hourglass charges only on its controller's recollection, taxes opposing ally abilities once, and stops when removed", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(candlelightHourglass, false, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [candlelightHourglass, twoOfHearts, twoOfHearts, giantTortoise],
        hand: [spiritsBlessing, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        field: [astralShard, ...Array.from({ length: 5 }, () => twoOfHearts)],
        hand: Array.from({ length: 10 }, () => woodlandSquirrels),
        "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    source = p.card(candlelightHourglass),
    own = p.cards(twoOfHearts),
    opposing = q.cards(twoOfHearts);
  const charge = () => game.state.objects[source.objectId]!.counters["named:charge"] ?? 0;
  const use = (player: typeof p, ally: typeof source, cost: number, targetAlly = false) => {
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, cost)
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const before = game.state;
    expect(() =>
      player.activateAbility(ally, "rufki4o41y-a1", { reservePayment: payment.slice(1) }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activateAbility(ally, "rufki4o41y-a1", { reservePayment: payment });
    passEffectsStack(game);
    const opponent = player.id === p.id ? q : p;
    const target = opponent.card(targetAlly ? giantTortoise : champion);
    const damage = game.state.objects[target.objectId]!.damage;
    player.declareAttack(ally, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(damage + 3);
  };
  expect(charge()).toBe(0);
  advanceToMain(game, q.id);
  expect(charge()).toBe(0);
  use(q, opposing[0]!, 1);
  advanceToMain(game, p.id);
  expect(charge()).toBe(1);
  use(p, own[0]!, 1);
  advanceToMain(game, q.id);
  expect(charge()).toBe(1);
  use(q, opposing[1]!, 1);
  advanceToMain(game, p.id);
  expect(charge()).toBe(2);
  use(p, own[1]!, 1);
  advanceToMain(game, q.id);
  use(q, opposing[2]!, 3);
  q.activate(q.cards(woodlandSquirrels, { zone: "hand" })[0]!);
  passEffectsStack(game);
  q.activateAbility(q.card(astralShard), "eP07Xxscuq-a1");
  passEffectsStack(game);
  const glimpse = game.state.decision;
  if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected untaxed item ability Glimpse");
  answerDecision(game, "resolve-glimpse", { kind: "reorder", top: glimpse.cardIds, bottom: [] });
  passEffectsStack(game);
  advanceToMain(game, p.id);
  expect(charge()).toBe(2);
  advanceToMain(game, q.id);
  use(q, opposing[3]!, 3);
  q.pass();
  p.activate(spiritsBlessing, {
    reservePayment: [
      { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
    ],
    costSelections: [[source.objectId]],
  });
  passEffectsStack(game);
  expect(game.state.objects[source.objectId]!.zone).toBe("material-deck");
  use(q, opposing[4]!, 1, true);
});
