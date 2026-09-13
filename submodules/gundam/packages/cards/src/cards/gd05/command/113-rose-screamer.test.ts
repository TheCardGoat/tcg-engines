import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05RoseScreamer113 } from "./113-rose-screamer.ts";

describe("Rose Screamer (GD05-113)", () => {
  /** @behavioral-proof complete: MF and AP gates, AP duration, optional self-pairing, and decline are public. */
  it("gives a friendly MF Unit with 4 or less AP AP+2 during this turn", () => {
    const target = createMockUnit({ name: "Gundam Rose", traits: ["mf"], ap: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05RoseScreamer113],
      play: [target],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const targetId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05RoseScreamer113));
    expectSuccess(p1.resolveEffect({ targets: [targetId] }));
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional pairing choice");
    }
    expectSuccess(
      p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
    );
    expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(6);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getVisibleCard(targetId)?.effectiveAp).toBe(4);
  });

  it("cannot choose an MF Unit with 5 AP", () => {
    const tooStrong = createMockUnit({ name: "Too Strong", traits: ["mf"], ap: 5 });
    const eligible = createMockUnit({ name: "Eligible", traits: ["mf"], ap: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05RoseScreamer113],
      play: [tooStrong, eligible],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const tooStrongId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05RoseScreamer113));
    expectFailure(p1.resolveEffect({ targets: [tooStrongId] }), "ILLEGAL_TARGET");
  });

  it("may pair itself from the trash with a friendly MF Unit", () => {
    const target = createMockUnit({ name: "Target", traits: ["mf"], ap: 4 });
    const host = createMockUnit({ name: "Host", traits: ["mf"] });
    const engine = GundamTestEngine.create({
      hand: [gd05RoseScreamer113],
      play: [target, host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const [targetId, hostId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(commandId));
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional pairing choice");
    }
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: true } }));
    expectSuccess(p1.resolveEffect({ targets: [hostId!] }));

    expect(p1.getPilotId(hostId!)).toBe(commandId);
  });

  it("may decline pairing after resolving Main", () => {
    const host = createMockUnit({ name: "MF Host", traits: ["mf"], ap: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05RoseScreamer113],
      play: [host],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05RoseScreamer113));
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional pairing choice");
    }
    expectSuccess(
      p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
    );

    expect(p1.getPilotId(hostId)).toBeUndefined();
  });
});
