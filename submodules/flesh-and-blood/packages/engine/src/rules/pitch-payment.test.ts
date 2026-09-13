import { describe, expect, it } from "vitest";

import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { wreckerRompBlue } from "../../../cards/src/cards/actions/wrecker-romp.ts";
import { rhinar } from "../../../cards/src/cards/heroes/rhinar.ts";
import { alphaRampageRed } from "../../../cards/src/cards/actions/alpha-rampage.ts";
import { sinkBelowRed } from "../../../cards/src/cards/defense-reactions/sink-below.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "../testing/index.ts";

function alphaRampagePaymentGame() {
  const game = FabTestEngine.start(
    {
      hero: rhinar,
      hand: [alphaRampageRed, sinkBelowRed, wreckerRompBlue, snatchRed],
      resourcePoints: 0,
      deck: 8,
    },
    { hero: dash, hand: [], deck: 8 },
    { ...FAB_MANUAL_HARNESS, seed: "alpha-rampage-pitch-payment" },
  );
  return { game, Rhinar: game.as(rhinar), Defender: game.as(dash) };
}

describe("resource payment pitching", () => {
  it("pitches red then blue one at a time for Alpha Rampage and leaves one resource floating", () => {
    const { game, Rhinar, Defender } = alphaRampagePaymentGame();
    const alphaRampageId = Rhinar.findCardInZone("hand", alphaRampageRed);
    const sinkBelowId = Rhinar.findCardInZone("hand", sinkBelowRed);
    const blueId = Rhinar.findCardInZone("hand", wreckerRompBlue);

    Rhinar.exec({
      move: "begin-play",
      payload: { instanceId: alphaRampageId, target: Defender.id },
    });
    expect(Rhinar.expectDecision("payment")).toMatchObject({ amount: 3, oneAtATime: true });

    game.answerDecision(Rhinar.id, { kind: "payment", instanceIds: [sinkBelowId] });
    expect(Rhinar.expectDecision("payment")).toMatchObject({ amount: 2, oneAtATime: true });
    for (const viewer of [
      { role: "player", actorId: Rhinar.id } as const,
      { role: "player", actorId: Defender.id } as const,
      { role: "spectator" } as const,
      { role: "replay" } as const,
    ]) {
      expect(game.getView(viewer).players[Rhinar.id]!.zones.pitch).toEqual([sinkBelowId]);
    }
    expect(
      game.getView({ role: "player", actorId: Rhinar.id }).players[Rhinar.id]!.resourcePoints,
    ).toBe(1);

    game.answerDecision(Rhinar.id, { kind: "payment", instanceIds: [blueId] });

    expect(Rhinar.hasPriority()).toBe(true);
    expectFabPlayer(Rhinar).toHaveResourceCount(1);
    expectFabCard(Rhinar, sinkBelowRed).toBeIn("pitch");
    expectFabCard(Rhinar, wreckerRompBlue).toBeIn("pitch");
    expectFabCard(Rhinar, alphaRampageRed).toBeIn("stack");
    expectFabCard(Rhinar, snatchRed).toBeIn("graveyard");
  });

  it("ends payment as soon as a blue covers the cost and does not allow another pitch", () => {
    const { game, Rhinar, Defender } = alphaRampagePaymentGame();
    const alphaRampageId = Rhinar.findCardInZone("hand", alphaRampageRed);
    const blueId = Rhinar.findCardInZone("hand", wreckerRompBlue);

    Rhinar.exec({
      move: "begin-play",
      payload: { instanceId: alphaRampageId, target: Defender.id },
    });
    game.answerDecision(Rhinar.id, { kind: "payment", instanceIds: [blueId] });

    expect(Rhinar.hasPriority()).toBe(true);
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    expectFabCard(Rhinar, wreckerRompBlue).toBeIn("pitch");
    expect(Rhinar.zone("pitch")).toHaveLength(1);
    expect(() =>
      game.answerDecision(Rhinar.id, {
        kind: "payment",
        instanceIds: ["extra-pitch-after-payment"],
      }),
    ).toThrow(/No pending decision/);
  });

  it("rejects selecting multiple pitch cards in one payment answer without moving either card", () => {
    const { game, Rhinar, Defender } = alphaRampagePaymentGame();
    const alphaRampageId = Rhinar.findCardInZone("hand", alphaRampageRed);
    const sinkBelowId = Rhinar.findCardInZone("hand", sinkBelowRed);
    const blueId = Rhinar.findCardInZone("hand", wreckerRompBlue);

    Rhinar.exec({
      move: "begin-play",
      payload: { instanceId: alphaRampageId, target: Defender.id },
    });
    expect(() =>
      game.answerDecision(Rhinar.id, {
        kind: "payment",
        instanceIds: [sinkBelowId, blueId],
      }),
    ).toThrow(/exactly one card at a time/);

    expectWait(game).toHaveDecision("payment");
    expectFabCard(Rhinar, sinkBelowRed).toBeIn("hand");
    expectFabCard(Rhinar, wreckerRompBlue).toBeIn("hand");
    expect(Rhinar.zone("pitch")).toEqual([]);
  });

  it("restores hand, pitch, and resources when the player cancels after the first pitch", () => {
    const { game, Rhinar, Defender } = alphaRampagePaymentGame();
    const alphaRampageId = Rhinar.findCardInZone("hand", alphaRampageRed);
    const sinkBelowId = Rhinar.findCardInZone("hand", sinkBelowRed);

    Rhinar.exec({
      move: "begin-play",
      payload: { instanceId: alphaRampageId, target: Defender.id },
    });
    game.answerDecision(Rhinar.id, { kind: "payment", instanceIds: [sinkBelowId] });
    expect(
      game.getView({ role: "player", actorId: Rhinar.id }).players[Rhinar.id]!.zones.pitch,
    ).toEqual([sinkBelowId]);

    game.answerDecision(Rhinar.id, { kind: "cancel" });

    expect(Rhinar.hasPriority()).toBe(true);
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    expectFabCard(Rhinar, alphaRampageRed).toBeIn("hand");
    expectFabCard(Rhinar, sinkBelowRed).toBeIn("hand");
    expect(Rhinar.zone("pitch")).toEqual([]);
  });
});
