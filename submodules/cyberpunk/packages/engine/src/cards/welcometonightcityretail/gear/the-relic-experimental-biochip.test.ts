import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailLiveWithTheAftermath,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { createMockUnit } from "../../../testing/card-mocks.ts";

const aftermath = welcomeToNightCityRetailLiveWithTheAftermath;

describe("The Relic — Experimental Biochip", () => {
  it("has the exact yellow Arasaka/Cyberware identity, attachment, and defeated-host DSL", () => {
    const card = welcomeToNightCityRetailTheRelicExperimentalBiochip;
    expect(card).toMatchObject({
      canonicalId: "the-relic-experimental-biochip",
      slug: "the-relic-experimental-biochip",
      name: "The Relic",
      subname: "Experimental Biochip",
      displayName: "The Relic: Experimental Biochip",
      type: "gear",
      color: "yellow",
      classifications: ["Arasaka", "Cyberware"],
      cost: 5,
      power: 3,
      ram: 4,
      hasSellTag: true,
      rarity: "Epic",
      printNumber: "063",
      rulesText:
        "{Defeated} Play another Unit with cost 9 or less from your trash for free. Then, bottom-deck this Unit.",
      attachment: {
        text: "Equip to a friendly Unit or face-up Legend.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "defeated" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedUnit",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["trash"],
                cardTypes: ["unit"],
                maxCost: 9,
                excludeOf: { selector: "host" },
                selection: { mode: "choose", min: 0, max: 1 },
              },
            },
          ],
          effects: [
            {
              effect: "playCard",
              target: { selector: "bound", id: "selectedUnit" },
              free: true,
            },
            {
              effect: "moveCard",
              target: { selector: "host" },
              destination: "deckBottom",
            },
          ],
        },
      ],
    });
  });

  it("attaches to a friendly unit and pays cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      eddies: 5,
    });

    engine.attachGear(
      welcomeToNightCityRetailTheRelicExperimentalBiochip,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );

    expect(
      engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.attachedGearIds,
    ).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("rejects one less than its exact 5 cost and a face-down Legend host", () => {
    const underpaid = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
      field: [welcomeToNightCityRetailFieldOperator],
      eddies: 4,
    });
    for (const legend of underpaid.getCardsInZone("legendArea", P1)) {
      underpaid.judgeSpendCard(legend, { as: P1 });
    }
    expect(
      underpaid.expectFailure(() =>
        underpaid.attachGear(
          welcomeToNightCityRetailTheRelicExperimentalBiochip,
          welcomeToNightCityRetailFieldOperator,
          { as: P1 },
        ),
      ).errorCode,
    ).toBe("INSUFFICIENT_EDDIES");

    const faceDown = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
      legendArea: [{ card: welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: true }],
      eddies: 5,
    });
    expect(
      faceDown.expectFailure(() =>
        faceDown.attachGear(
          welcomeToNightCityRetailTheRelicExperimentalBiochip,
          welcomeToNightCityRetailJackieWellesMamaSFavorite,
          { as: P1 },
        ),
      ).errorCode,
    ).toBe("INVALID_CHOICE");
  });

  it("offers a cost-9 Unit but excludes a cost-10 Unit from the free-play choice", () => {
    const costNine = createMockUnit({
      id: "mock-relic-cost-nine",
      slug: "mock-relic-cost-nine",
      name: "Cost Nine",
      cost: 9,
      power: 1,
    });
    const costTen = createMockUnit({
      id: "mock-relic-cost-ten",
      slug: "mock-relic-cost-ten",
      name: "Cost Ten",
      cost: 10,
      power: 1,
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
        ],
        trash: [costNine, costTen],
        deck: [welcomeToNightCityRetailDelamainCab],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
            powerModifier: 5,
          },
        ],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Unit choice");
    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toContain(costNine.id);
    expect(eligibleDefinitions).not.toContain(costTen.id);
  });

  it("bottom-decks the defeated host even when no other eligible Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
        ],
        trash: [],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
            powerModifier: 5,
          },
        ],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected optional Unit choice");
    expect(choice.payload.eligibleIds).toHaveLength(0);
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    engine.expectNoPendingChoice();
    const deck = engine.getCardsInZone("deck", P1);
    expect(deck[deck.length - 1]?.definitionId).toBe(welcomeToNightCityRetailFieldOperator.id);
  });

  it("fires Defeated when its host is defeated, free-plays another Unit, and bottom-decks the host", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
        ],
        trash: [welcomeToNightCityRetailSwordwiseHuscle],
        deck: [welcomeToNightCityRetailDelamainCab],
      },
      {
        field: [
          {
            // Base power 4 + modifier so it beats Field Operator (2) + Relic (3).
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
            powerModifier: 5,
          },
        ],
      },
    );

    const hostInstanceId = engine.getCard(
      welcomeToNightCityRetailFieldOperator,
      "field",
      P1,
    ).instanceId;

    // Strong rival attacks and defeats the equipped host.
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });

    // Binding: choose another Unit from trash (host must not be eligible).
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      const eligible = choice.payload.eligibleIds ?? [];
      expect(eligible).not.toContain(hostInstanceId);
      engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    }

    // Free-play puts Swordwise on the field.
    expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );

    // Host is bottom-decked (not left in trash); gear stays out of field.
    expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    const deckIds = engine.getCardsInZone("deck", P1).map((c) => c.definitionId);
    expect(deckIds[deckIds.length - 1]).toBe(welcomeToNightCityRetailFieldOperator.id);
  });

  it("fires Defeated when its host is defeated by an effect (Live with the Aftermath)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [aftermath],
        eddies: 3,
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
        ],
        trash: [welcomeToNightCityRetailSwordwiseHuscle],
        deck: [welcomeToNightCityRetailDelamainCab],
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(aftermath, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "the rival must now choose their own Unit",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, {
      as: P2,
      allowPendingChoice: true,
      reason: "The Relic's {Defeated} trigger still needs a Unit from trash",
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    // Free-play puts Swordwise on the field and the host is bottom-decked.
    expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).toContain(
      welcomeToNightCityRetailSwordwiseHuscle.id,
    );
    expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    const deckIds = engine.getCardsInZone("deck", P1).map((c) => c.definitionId);
    expect(deckIds[deckIds.length - 1]).toBe(welcomeToNightCityRetailFieldOperator.id);
    // The gear itself went to trash with the Program.
    expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).toEqual(
      expect.arrayContaining([
        aftermath.id,
        welcomeToNightCityRetailTheRelicExperimentalBiochip.id,
      ]),
    );
  });
});
