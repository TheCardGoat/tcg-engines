import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { maliciousMeanAndScary } from "@tcg/lorcana-cards/cards/010";
import { liloBundledUp, minnieMouseSpinningSkater } from "@tcg/lorcana-cards/cards/011";

/**
 * THE-988: Lilo – Bundled Up EXTRA LAYERS vs Malicious, Mean, and Scary (put damage) + challenge.
 * Rules: comprehensive rules 1.9.1.5 — a character takes damage when damage is dealt to, put on, or moved to it.
 */
describe("THE-988 Lilo EXTRA LAYERS vs put damage and challenge", () => {
  it("first MMS prevented, second MMS places 1, then challenge damage applies (lethal)", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: liloBundledUp, exerted: true, isDrying: false }],
        deck: 2,
      },
      {
        play: [{ card: minnieMouseSpinningSkater, isDrying: false }],
        hand: [maliciousMeanAndScary, maliciousMeanAndScary],
        inkwell: maliciousMeanAndScary.cost * 2,
        deck: 2,
      },
    );

    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(engine.asPlayerTwo().playCard(maliciousMeanAndScary)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);

    expect(engine.asPlayerTwo().playCard(maliciousMeanAndScary)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(liloBundledUp)).toBe(1);

    expect(
      engine.asPlayerTwo().challenge(minnieMouseSpinningSkater, liloBundledUp),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(liloBundledUp)).toBe("discard");
  });
});
