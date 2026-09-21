import { describe, expect, it, vi } from "vitest";
import {
  FabMatchRuntime,
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "@tcg/flesh-and-blood-engine/runtime";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

function requiredCard(canonicalId: string) {
  const card = fleshAndBloodStructuredCardsByCanonicalId.get(canonicalId);
  if (!card) throw new Error(`Missing real FAB card ${canonicalId}.`);
  return card;
}

const bravo = requiredCard("tzTbzLkLhDzmW9QMJr9KF");
const dash = requiredCard("kftPnNkrBLJ7rPmFGgQCm");
const nimbleStrikeRed = requiredCard("tfgqfmpf8PtwhJqcBKDwB");
const crackedBaubleYellow = requiredCard("Dbhn6rRcrbdRnKbqdPdwh");

describe("FAB server adapter lifecycle baseline", () => {
  it("keeps a previously public pitch identity while redacting the opponent's drawn cards", () => {
    const fixture = FabTestEngine.start(
      {
        hero: bravo,
        hand: [],
        pitch: [crackedBaubleYellow],
        deck: [nimbleStrikeRed, nimbleStrikeRed, nimbleStrikeRed, nimbleStrikeRed],
      },
      { hero: dash, hand: [], deck: 8 },
      { autoPassPriority: false, autoPitch: false },
    );
    const actorId = fixture.as(bravo).id;
    const opponentId = fixture.as(dash).id;
    const pitchedId = fixture.findCardInZone(actorId, "pitch", crackedBaubleYellow.canonicalId);
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());
    const result = engine.dispatch(
      "end-turn",
      actorId,
      {},
      { gameId: "public-pitch-return", sourceAuthority: "server" },
    );
    expect(result.success).toBe(true);
    if (!result.success) throw new Error(result.error);
    const opponentPlan = engine.getViewerAnimationPlan(result.animationPlan ?? null, {
      role: "player",
      actorId: opponentId,
    });
    expect(opponentPlan?.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: { kind: "entity", id: pitchedId },
          from: expect.objectContaining({ id: `${actorId}:pitch` }),
          to: expect.objectContaining({ id: `${actorId}:deck` }),
        }),
      ]),
    );
    // Deck→hand draws collapse into one step per route whose `quantity`
    // preserves the count, and the opponent must not learn the drawn
    // identities (redaction renames the entity to `fab-hidden:`).
    const drawn = opponentPlan?.steps.filter(
      (step) => step.type === "entityTransfer" && step.to?.id === `${actorId}:hand`,
    );
    expect(drawn).toHaveLength(1);
    expect(drawn?.[0]).toMatchObject({ quantity: 4 });
    expect(drawn?.[0]?.entity.id.startsWith("fab-hidden:")).toBe(true);
  });

  it("continues a restored real-card payment decision without changing the host contract", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_234_567);
    const fixture = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeRed, crackedBaubleYellow],
        deck: 8,
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = fixture.as(bravo).id;
    const targetId = fixture.as(dash).id;
    const attackId = fixture.findCardInZone(actorId, "hand", nimbleStrikeRed.canonicalId);
    const pitchId = fixture.findCardInZone(actorId, "hand", crackedBaubleYellow.canonicalId);
    const uninterrupted = new FleshAndBloodServerEngine(fixture.getRuntime());

    const announced = uninterrupted.dispatch(
      "begin-play",
      actorId,
      { instanceId: attackId, target: targetId },
      { gameId: "arch-003-payment", sourceAuthority: "server" },
    );
    expect(announced).toMatchObject({ success: true, stateID: 1, undoable: true });
    const state = fixture.getRuntime().getState();
    const decision = state.decision;
    if (!decision || decision.kind !== "payment") {
      throw new Error("Expected a persisted FAB payment decision.");
    }

    const restored = new FleshAndBloodServerEngine(
      new FabMatchRuntime(
        restoreFabMatchSnapshot(
          serializeFabMatchSnapshot(state),
          createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
        ),
      ),
    );
    const payload = {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "payment", instanceIds: [pitchId] },
    };
    const context = { gameId: "arch-003-payment", sourceAuthority: "server" } as const;
    const uninterruptedResult = uninterrupted.dispatch(
      "answer-decision",
      actorId,
      payload,
      context,
    );
    const restoredResult = restored.dispatch("answer-decision", actorId, payload, context);

    expect(restoredResult).toEqual(uninterruptedResult);
    expect(restoredResult).toMatchObject({
      success: true,
      stateID: 2,
      undoable: false,
      processedCommand: { move: "answer-decision" },
      acceptedMoveRecord: {
        moveId: "answer-decision",
        processedCommand: { move: "answer-decision" },
      },
    });
    expect(restoredResult.animationPlan?.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "entityTransfer",
          entity: { kind: "entity", id: pitchId },
          from: expect.objectContaining({ id: `${actorId}:hand` }),
          to: expect.objectContaining({ id: `${actorId}:pitch` }),
          destinationFace: "hidden",
        }),
      ]),
    );
    expect(restored.getViewerState({ role: "spectator" })).toEqual(
      uninterrupted.getViewerState({ role: "spectator" }),
    );
  });
});
