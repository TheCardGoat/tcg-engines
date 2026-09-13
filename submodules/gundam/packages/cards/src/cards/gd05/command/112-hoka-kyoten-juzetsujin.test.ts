import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05HokaKyotenJuzetsujin112 } from "./112-hoka-kyoten-juzetsujin.ts";

describe("Hoka Kyoten Juzetsujin (GD05-112)", () => {
  /** @behavioral-proof complete: MF and no-Breach targeting, Breach 3 grant, optional self-pairing, and decline are public. */
  it("grants Breach 3 to a friendly MF Unit without Breach", () => {
    const host = createMockUnit({ name: "Dragon Gundam", traits: ["mf"] });
    const engine = GundamTestEngine.create({
      hand: [gd05HokaKyotenJuzetsujin112],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05HokaKyotenJuzetsujin112));
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional pairing choice");
    }
    expectSuccess(
      p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
    );

    expect(p1.getVisibleCard(hostId)?.keywords).toContain("Breach");
    expect(p1.getVisibleCard(hostId)?.keywordEffects).toContainEqual({
      keyword: "Breach",
      value: 3,
    });
  });

  it("cannot choose an MF Unit that already has Breach", () => {
    const withBreach = createMockUnit({
      name: "Existing Breach",
      traits: ["mf"],
      keywordEffects: [{ keyword: "Breach", value: 1 }],
    });
    const eligible = createMockUnit({ name: "Eligible MF", traits: ["mf"] });
    const engine = GundamTestEngine.create({
      hand: [gd05HokaKyotenJuzetsujin112],
      play: [withBreach, eligible],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [withBreachId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd05HokaKyotenJuzetsujin112));
    expectFailure(p1.resolveEffect({ targets: [withBreachId!] }), "ILLEGAL_TARGET");
  });

  it("may pair itself from the trash with a friendly MF Unit", () => {
    const target = createMockUnit({ name: "Target MF", traits: ["mf"] });
    const host = createMockUnit({ name: "Pilot Host", traits: ["mf"] });
    const engine = GundamTestEngine.create({
      hand: [gd05HokaKyotenJuzetsujin112],
      play: [target, host],
      resourceArea: activeResources(4),
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

  it("may decline pairing after granting Breach", () => {
    const host = createMockUnit({ name: "MF Host", traits: ["mf"] });
    const engine = GundamTestEngine.create({
      hand: [gd05HokaKyotenJuzetsujin112],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05HokaKyotenJuzetsujin112));
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
