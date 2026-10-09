import { describe } from "vitest";
import { opticalControl } from "./optical-control.ts";

import { proveAsEntersChoice } from "../../../testing/as-enters-choice.ts";
/** @covers j4U5Tu76Lz-a1 */
describe("opticalControl — entry choice", () => {
  proveAsEntersChoice(opticalControl, "type");
});

import { proveChosenActivationTax } from "../../../testing/chosen-activation-tax.ts";
/** @covers j4U5Tu76Lz-a2 */
describe("opticalControl — chosen activation tax", () => {
  proveChosenActivationTax(opticalControl, "type");
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers j4U5Tu76Lz-a3 */
it("sacrifices and draws only at its controller's recollection, then stops taxing", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(opticalControl, false, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [opticalControl, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        field: [giantTortoise],
        "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion,
      zones: {
        hand: [glacialGuidance, woodlandSquirrels],
        "main-deck": [giantTortoise, giantTortoise, giantTortoise],
      },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    source = p.card(opticalControl);
  p.activate(source, {
    reservePayment: p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
  });
  passEffectsStack(game);
  answerDecision(game, "resolve-effect-choice", "ACTION");
  passEffectsStack(game);
  const originalDeck = p.zone("main-deck");
  advanceToMain(game, q.id);
  expect(p.zone("field")).toContainEqual(source);
  expect(p.zone("main-deck")).toEqual(originalDeck);
  for (let i = 0; i < 128; i++) {
    if (
      game.state.stack.some(
        (s) => s.kind === "triggered-ability" && s.ability.id === "j4U5Tu76Lz-a3",
      )
    )
      break;
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected wait ${wait.kind}`);
  }
  expect(game.state.turn).toMatchObject({ playerId: p.id, phase: "recollection" });
  expect(
    game.state.stack.some(
      (s) => s.kind === "triggered-ability" && s.ability.id === "j4U5Tu76Lz-a3",
    ),
  ).toBe(true);
  expect(p.zone("field")).toContainEqual(source);
  const options = {
    reservePayment: q
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
    targets: { "target-1": [p.card(giantTortoise).objectId] },
  };
  let wait = game.waitState();
  if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
  const before = game.state;
  expect(() => q.activate(glacialGuidance, options)).toThrow();
  expect(game.state).toEqual(before);
  const deck = p.zone("main-deck"),
    hand = p.zone("hand"),
    otherDeck = q.zone("main-deck");
  passEffectsStack(game);
  expect(p.zone("graveyard")).toContainEqual(source);
  expect(p.zone("main-deck")).toEqual(deck.slice(1));
  expect(p.zone("hand")).toHaveLength(hand.length + 1);
  expect(p.zone("hand")).toContainEqual(deck[0]);
  expect(q.zone("main-deck")).toEqual(otherDeck);
  wait = game.waitState();
  if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
  q.activate(glacialGuidance, options);
  passEffectsStack(game);
  expect(game.state.objects[p.card(giantTortoise).objectId]!.states.has("rested")).toBe(true);
});
