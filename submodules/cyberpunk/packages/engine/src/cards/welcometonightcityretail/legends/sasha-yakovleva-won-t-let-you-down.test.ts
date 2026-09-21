import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, expectAttackCandidate } from "../../../testing/index.ts";
import type { ActionLogEvent } from "../../../types/game-events.ts";

describe("Sasha Yakovleva - Won't Let You Down", () => {
  it("has the exact blue Maine's Crew Merc Netrunner GO SOLO identity and both triggers", () => {
    expect(welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown).toMatchObject({
      canonicalId: "sasha-yakovleva-won-t-let-you-down",
      slug: "sasha-yakovleva-won-t-let-you-down",
      name: "Sasha Yakovleva",
      displayName: "Sasha Yakovleva: Won't Let You Down",
      subname: "Won't Let You Down",
      type: "legend",
      color: "blue",
      classifications: ["Maine's Crew", "Merc", "Netrunner"],
      cost: 5,
      power: 0,
      ram: 2,
      hasSellTag: true,
      rarity: "Secret",
      printNumber: "109",
      keywords: ["goSolo"],
      rulesText:
        "{Go Solo}\n{Attack} Reveal the top card of your deck and add it to your hand. This Unit gains power equal to that card's cost this turn.\n{Defeated} A Rival discards 1.",
      abilities: [
        { kind: "keyword", keyword: "goSolo" },
        {
          kind: "triggered",
          trigger: { trigger: "attack" },
          source: { selector: "self" },
          effects: [
            {
              effect: "revealTopCardAndModifyPowerByCost",
              player: "friendly",
              target: { selector: "self" },
              duration: "turn",
            },
          ],
        },
        {
          kind: "triggered",
          trigger: { trigger: "defeated" },
          source: { selector: "self" },
          effects: [{ effect: "discardFromHand", player: "rival", amount: 1 }],
        },
      ],
    });
  });

  it("goes solo as a ready Unit that can attack this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, faceDown: false }],
      eddies: 5,
    });
    const sashaId = engine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "legendArea",
      P1,
    );

    const result = engine.executeMove("goSolo", { args: { cardId: sashaId as string } }, P1);

    expect(result.success).toBe(true);
    expectAttackCandidate(engine, welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, {
      as: P1,
    });
  });

  it("uses its own Sell Tag toward the exact GO SOLO cost but rejects one less", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, faceDown: false }],
      eddies: 4,
    });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      if (legend.definitionId !== welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id) {
        successEngine.judgeSpendCard(legend, { as: P1 });
      }
    }
    const sashaId = successEngine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "legendArea",
      P1,
    );

    expect(successEngine.executeMove("goSolo", { args: { cardId: sashaId } }, P1).success).toBe(
      true,
    );
    expect(successEngine.getEddies(P1)).toBe(0);

    const failureEngine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, faceDown: false }],
      eddies: 3,
    });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      if (legend.definitionId !== welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id) {
        failureEngine.judgeSpendCard(legend, { as: P1 });
      }
    }
    const failureId = failureEngine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "legendArea",
      P1,
    );
    const failure = failureEngine.executeMove("goSolo", { args: { cardId: failureId } }, P1);
    expect(failure).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
  });

  it("reveals and adds the top deck card when attacking, then gains power equal to its cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            faceDown: false,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { preserveDeckOrder: true },
    );
    const sashaId = engine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "field",
      P1,
    );

    engine.attackRival(welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getEvents("cardsRevealed")).toHaveLength(1);
    const revealLog = engine
      .getEvents("actionLog")
      .find((event): event is ActionLogEvent => event.messageKey === "move.searchDeck.revealNamed");
    expect(revealLog?.params).toMatchObject({
      count: 1,
      revealedCardNames: "Corpo Security",
    });
    expect(getEffectivePower(engine.getState(), sashaId)).toBe(
      welcomeToNightCityRetailCorpoSecurity.cost,
    );

    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: engine.getGigDice(P2).map((die) => die.id) });
    engine.completeTurn({ as: P1 });

    expect(getEffectivePower(engine.getState(), sashaId)).toBe(0);
  });

  it("does not reveal, draw, or gain power when the deck is empty", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: 0,
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            faceDown: false,
            spent: false,
            hasLag: false,
          },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 2 }] },
    );
    const sashaId = engine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "field",
      P1,
    );

    engine.attackRival(welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getEvents("cardsRevealed")).toHaveLength(0);
    expect(getEffectivePower(engine.getState(), sashaId)).toBe(0);
  });

  it("makes the rival discard 1 when defeated", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailFieldOperator],
        field: [
          {
            card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
            faceDown: false,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        hand: [welcomeToNightCityRetailDyingNightVSPistol, welcomeToNightCityRetailOffdutyMalfini],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 5 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const discardChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (
      !discardChoice ||
      discardChoice.type !== "chooseTarget" ||
      discardChoice.payload.type !== "discardFromHand"
    ) {
      throw new Error("Expected the Rival to choose one card to discard.");
    }
    expect(discardChoice.chooserId).toBe(P2);
    expect(discardChoice.payload).toMatchObject({ amount: 1 });
    expect(discardChoice.payload.eligibleIds).toHaveLength(2);
    const dyingNightId = engine.getCard(
      welcomeToNightCityRetailDyingNightVSPistol,
      "hand",
      P2,
    ).instanceId;
    engine.resolveDiscardFromHand([dyingNightId], { as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDyingNightVSPistol.id,
    );
    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailOffdutyMalfini.id,
    ]);
  });
});
