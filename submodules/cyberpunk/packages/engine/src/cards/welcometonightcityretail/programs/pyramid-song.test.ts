import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailEvelynParkerSchemingSiren,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMaelstromZealots,
  welcomeToNightCityRetailPyramidSong,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Pyramid Song", () => {
  it("has the exact printed identity and conditional modal ability", () => {
    const card = welcomeToNightCityRetailPyramidSong;
    expect(card).toMatchObject({
      canonicalId: "pyramid-song",
      slug: "pyramid-song",
      name: "Pyramid Song",
      displayName: "Pyramid Song",
      type: "program",
      color: "blue",
      classifications: ["Braindance"],
      cost: 3,
      ram: 3,
      hasSellTag: true,
      timingTriggers: ["play"],
      printNumber: "135",
      rarity: "Rare",
      rulesText:
        "Choose one effect. If a friendly d4 is a min Gig, choose both instead.\nGive a rival Unit -5 power this turn. // Bottom-deck a rival Unit with power 0.",
      reminderText: ["Discard programs after they resolve."],
    });
    expect(card.abilities).toMatchObject([
      {
        kind: "triggered",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        effects: [
          {
            effect: "chooseEffect",
            options: [
              {
                id: "both",
                effects: [
                  { effect: "modifyPower", value: -5, duration: "turn" },
                  { effect: "moveCard", destination: "deckBottom" },
                ],
              },
              {
                id: "power-down",
                effects: [{ effect: "modifyPower", value: -5, duration: "turn" }],
              },
              { id: "bottom-deck", effects: [{ effect: "moveCard", destination: "deckBottom" }] },
            ],
          },
        ],
      },
    ]);
  });

  it("plays for exactly 3 Eddies", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailPyramidSong],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailPyramidSong, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseEffect");
  });

  it("offers a modal when friendly d4 is not a min Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPyramidSong],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailMaelstromZealots, spent: true },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailPyramidSong, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseEffect");
    if (choice?.type === "chooseEffect") {
      const optionIds = choice.payload.options.map((o) => o.id).sort();
      expect(optionIds).toEqual(["bottom-deck", "power-down"]);
    }
  });

  it("offers the same one-effect modal when no friendly d4 exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPyramidSong],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }] },
    );

    engine.playCard(welcomeToNightCityRetailPyramidSong, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type !== "chooseEffect") throw new Error("Expected a modal choice");
    expect(choice.payload.options.map((option) => option.id).sort()).toEqual([
      "bottom-deck",
      "power-down",
    ]);
  });

  it("auto-applies both effects when friendly d4 is a min Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPyramidSong],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailMaelstromZealots, spent: true },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailPyramidSong, { as: P1 });

    // Both modes auto-resolve; drain sequential target choices if opened.
    let guard = 0;
    while (engine.getState().G.turnMetadata.pendingChoice && guard < 6) {
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (choice?.type !== "chooseTarget") break;
      const eligible = choice.payload.eligibleIds ?? [];
      if (eligible.length === 0) break;
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [eligible[0]!] } }, P1);
      guard += 1;
    }

    expect(engine.getCardsInZone("deck", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailPyramidSong.id,
    );
  });

  it("can give a rival Unit -5 power via the power-down option", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPyramidSong],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailPyramidSong, { as: P1 });
    engine.resolveChooseEffect("power-down", { as: P1 });

    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    }

    const operatorId = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2)
      .instanceId as string;
    expect(getEffectivePower(engine.getState(), operatorId)).toBe(0); // 2 - 5 clamped to 0
  });

  it("bottom-deck mode offers only rival field Units with current power 0", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPyramidSong],
        field: [welcomeToNightCityRetailEvelynParkerSchemingSiren],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        field: [
          welcomeToNightCityRetailEvelynParkerSchemingSiren,
          welcomeToNightCityRetailFieldOperator,
        ],
        deck: [welcomeToNightCityRetailMaelstromZealots],
      },
      { preserveDeckOrder: true },
    );
    engine.playCard(welcomeToNightCityRetailPyramidSong, { as: P1 });
    engine.resolveChooseEffect("bottom-deck", { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type !== "chooseTarget") throw new Error("Expected a Unit choice");
    const rivalZero = engine.findCardId(
      welcomeToNightCityRetailEvelynParkerSchemingSiren,
      "field",
      P2,
    );

    expect(choice.payload.eligibleIds).toEqual([rivalZero]);
    engine.resolveEffectTarget(welcomeToNightCityRetailEvelynParkerSchemingSiren, { as: P1 });
    expect(engine.getCardsInZone("deck", P2).at(-1)?.definitionId).toBe(
      welcomeToNightCityRetailEvelynParkerSchemingSiren.id,
    );
  });

  it("both path continues after the first target prompt (power-down then bottom-deck)", () => {
    // Friendly min d4 auto-selects the multi-effect "both" body. The first effect
    // suspends for a unit target; resume must still run the second (bottom-deck).
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPyramidSong],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailMaelstromZealots, spent: true },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailPyramidSong, { as: P1 });

    // First suspend: choose rival unit for -5 power (opens second target for bottom-deck).
    const first = engine.getState().G.turnMetadata.pendingChoice;
    expect(first?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "both mode still needs a bottom-deck target after -5 power",
    });

    // Second suspend: bottom-deck a rival unit with power 0 (operator is now 0).
    const second = engine.getState().G.turnMetadata.pendingChoice;
    expect(second?.type).toBe("chooseTarget");
    if (second?.type === "chooseTarget") {
      const eligible = second.payload.eligibleIds ?? [];
      const operatorId = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2)
        .instanceId as string;
      expect(eligible).toContain(operatorId);
    }
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("field", P2).map((c) => c.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("deck", P2).map((c) => c.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).toContain(
      welcomeToNightCityRetailPyramidSong.id,
    );
  });
});
