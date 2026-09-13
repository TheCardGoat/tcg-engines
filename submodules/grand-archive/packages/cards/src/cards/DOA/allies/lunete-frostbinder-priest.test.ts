import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { disorientingWinds } from "../actions/disorienting-winds.ts";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";
import { describe } from "vitest";
import { luneteFrostbinderPriest } from "./lunete-frostbinder-priest.ts";

/** @covers TqCo3xlf93-a2 */
describe("Lunete, Frostbinder Priest \u2014 resolution", () => {
  proveAllyCombatStats({ card: luneteFrostbinderPriest, power: 1, life: 4, hand: 0, memory: 0 });
});

describe("other condition boundaries", () => {
  proveAllyCombatStats({ card: luneteFrostbinderPriest, power: 1, life: 4, hand: 2, memory: 2 });
  proveAllyCombatStats({ card: luneteFrostbinderPriest, power: 1, life: 1, hand: 1, memory: 0 });
  proveAllyCombatStats({ card: luneteFrostbinderPriest, power: 1, life: 1, hand: 0, memory: 1 });
});

/** @covers TqCo3xlf93-a1 */
it("only opposing allies enter rested, and new entries stop resting after Lunete leaves", () => {
  const base = createClassBonusTestChampion(luneteFrostbinderPriest, false, "activation-discount"),
    face = requireSingleFace(base),
    champion = {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...face, elements: [...face.elements, "WIND" as const] },
      },
    };
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [luneteFrostbinderPriest],
        hand: [woodlandSquirrels],
        "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: {
        hand: [disorientingWinds, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
        "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    own = p.card(woodlandSquirrels);
  p.activate(own);
  passEffectsStack(game);
  expect(game.state.objects[own.objectId]!.states.has("rested")).toBe(false);
  advanceToMain(game, q.id);
  const first = q.cards(woodlandSquirrels, { zone: "hand" })[0]!,
    second = q.cards(woodlandSquirrels, { zone: "hand" })[1]!;
  q.activate(first);
  passEffectsStack(game);
  expect(game.state.objects[first.objectId]!.states.has("rested")).toBe(true);
  q.activate(disorientingWinds, {
    reservePayment: q
      .cards(woodlandSquirrels, { zone: "hand" })
      .filter((c) => c.objectId !== second.objectId)
      .slice(0, 5)
      .map((c) => ({ kind: "card", cardId: c.objectId })),
    targets: { "target-1": [p.card(luneteFrostbinderPriest).objectId] },
  });
  passEffectsStack(game);
  expect(p.cards(luneteFrostbinderPriest, { zone: "hand" })).toHaveLength(1);
  q.activate(second);
  passEffectsStack(game);
  expect(game.state.objects[second.objectId]!.states.has("rested")).toBe(false);
  expect(game.state.objects[first.objectId]!.states.has("rested")).toBe(true);
});
