import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailUnlikelyBond,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const bond = welcomeToNightCityRetailUnlikelyBond;
const readyFriendly = welcomeToNightCityRetailFieldOperator;
const spentRival = welcomeToNightCityRetailCorpoSecurity;

describe("Unlikely Bond", () => {
  it("has the exact blue Maelstrom/Mox identity and ordered if-you-do DSL", () => {
    expect(bond).toMatchObject({
      canonicalId: "unlikely-bond",
      slug: "unlikely-bond",
      name: "Unlikely Bond",
      displayName: "Unlikely Bond",
      type: "program",
      color: "blue",
      classifications: ["Maelstrom", "Mox"],
      cost: 4,
      ram: 2,
      hasSellTag: true,
      rarity: "Common",
      printNumber: "140",
      timingTriggers: ["play"],
      rulesText: "Bottom-deck a ready friendly Unit. If you do, bottom-deck a spent rival Unit.",
      reminderText: ["Discard programs after they resolve."],
      abilities: [
        {
          kind: "triggered",
          text: "Bottom-deck a ready friendly Unit. If you do, bottom-deck a spent rival Unit.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "ifYouDo",
              doEffect: {
                effect: "moveCard",
                target: {
                  selector: "card",
                  controller: "friendly",
                  zones: ["field"],
                  cardTypes: ["unit"],
                  state: "ready",
                  selection: { mode: "choose", min: 1, max: 1 },
                },
                destination: "deckBottom",
              },
              ifEffects: [
                {
                  effect: "moveCard",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    state: "spent",
                    selection: { mode: "choose", min: 1, max: 1 },
                  },
                  destination: "deckBottom",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 4 and rejects one less before resolving", () => {
    const success = CyberpunkTestEngine.createWithFixture({ hand: [bond], eddies: 4, field: [] });
    for (const legend of success.getCardsInZone("legendArea", P1)) {
      success.judgeSpendCard(legend, { as: P1 });
    }
    success.playCard(bond, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(bond.id);

    const short = CyberpunkTestEngine.createWithFixture({ hand: [bond], eddies: 3, field: [] });
    for (const legend of short.getCardsInZone("legendArea", P1)) {
      short.judgeSpendCard(legend, { as: P1 });
    }
    expect(short.expectFailure(() => short.playCard(bond, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
    expect(short.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(bond.id);
  });

  it("bottom-decks one ready friendly Unit, then one spent rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [bond],
        eddies: 4,
        deck: [spentRival],
        field: [
          { card: readyFriendly, spent: false },
          { card: spentRival, spent: true },
        ],
      },
      {
        deck: [readyFriendly],
        field: [
          { card: spentRival, spent: true },
          { card: readyFriendly, spent: false },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.playCard(bond, { as: P1 });
    const firstChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(firstChoice?.type).toBe("chooseTarget");
    if (firstChoice?.type === "chooseTarget") {
      expect(firstChoice.payload).toMatchObject({
        min: 1,
        max: 1,
        canDecline: false,
        eligibleIds: [engine.findCardId(readyFriendly, "field", P1)],
      });
    }
    engine.resolveEffectTarget(readyFriendly, {
      as: P1,
      allowPendingChoice: true,
      reason: "Unlikely Bond next requires choosing a spent rival Unit.",
    });

    const secondChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(secondChoice?.type).toBe("chooseTarget");
    if (secondChoice?.type === "chooseTarget") {
      expect(secondChoice.payload).toMatchObject({
        min: 1,
        max: 1,
        canDecline: false,
        eligibleIds: [engine.findCardId(spentRival, "field", P2)],
      });
    }
    engine.resolveEffectTarget(spentRival, { as: P1 });

    expect(engine.getCardsInZone("deck", P1).at(-1)?.definitionId).toBe(readyFriendly.id);
    expect(engine.getCardsInZone("deck", P2).at(-1)?.definitionId).toBe(spentRival.id);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      spentRival.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      readyFriendly.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(bond.id);
  });

  it("does nothing when no ready friendly Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [bond], eddies: 4, field: [{ card: readyFriendly, spent: true }] },
      { field: [{ card: spentRival, spent: true }] },
    );
    engine.playCard(bond, { as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      readyFriendly.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      spentRival.id,
    );
  });

  it("still bottom-decks the ready friendly Unit when no spent rival Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [bond], eddies: 4, field: [{ card: readyFriendly, spent: false }] },
      { field: [{ card: spentRival, spent: false }] },
    );
    engine.playCard(bond, { as: P1 });
    engine.resolveEffectTarget(readyFriendly, { as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("deck", P1).at(-1)?.definitionId).toBe(readyFriendly.id);
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      spentRival.id,
    );
  });
});
