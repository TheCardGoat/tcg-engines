import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFoolOnTheHill,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Fool on the Hill", () => {
  it("is cataloged from the official retail printing", () => {
    expect(welcomeToNightCityRetailFoolOnTheHill).toMatchObject({
      id: "c5d2fed1-1470-4ac5-9f84-bf66705901ce",
      slug: "fool-on-the-hill",
      name: "Fool on the Hill",
      type: "program",
      color: "green",
      classifications: ["Merc"],
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      printNumber: "099",
      rarity: "Rare",
      hasSellTag: true,
      ram: 3,
      cost: 2,
      power: null,
    });
    expect(welcomeToNightCityRetailFoolOnTheHill.printings).toEqual([
      {
        id: "7751b719-978b-44b1-a82f-b2881d3a416e",
        artId: "7751b719-978b-44b1-a82f-b2881d3a416e",
        collectorNumber: "099",
        setCode: "welcometonightcityretail",
        rarity: "Rare",
        imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/099.webp",
      },
      {
        id: "04511c2f-c766-4d1a-9176-66f913789667",
        artId: "04511c2f-c766-4d1a-9176-66f913789667",
        collectorNumber: "β099",
        setCode: "welcometonightcitybeta",
        rarity: "Rare",
        imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b099.webp",
      },
    ]);
  });

  it("models the printed rival destination choice", () => {
    expect(welcomeToNightCityRetailFoolOnTheHill.rulesText).toBe(
      "Reveal the top 2 cards of your deck. A Rival chooses whether you add them to your hand or trash them. If you trash them, draw 2.",
    );
    expect(welcomeToNightCityRetailFoolOnTheHill.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "play" },
        effects: [
          {
            effect: "rivalRevealChoice",
            player: "friendly",
            lookCount: 2,
            destinations: ["hand", "trash"],
            drawIfDestination: {
              destination: "trash",
              player: "friendly",
              amount: 2,
            },
          },
        ],
      }),
    ]);
  });

  it("lets the rival add the revealed cards to the caster's hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFoolOnTheHill],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailRidingNomad,
        ],
        eddies: 2,
      },
      {},
      { preserveDeckOrder: true },
    );

    const playResult = engine.playCard(welcomeToNightCityRetailFoolOnTheHill, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("revealDestination");
    if (!choice || choice.type !== "revealDestination") {
      throw new Error("Expected revealDestination choice.");
    }
    expect(choice.chooserId).toBe(P2);
    expect(
      choice.payload.revealedCardIds.map((id) => engine.getState().G.cardIndex[id]!.definitionId),
    ).toEqual([welcomeToNightCityRetailCorpoSecurity.id, welcomeToNightCityRetailFieldOperator.id]);

    const failure = engine.expectFailure(() => engine.resolveRevealDestination("hand", { as: P1 }));
    expect(failure.errorCode).toBe("NOT_YOUR_CHOICE");

    const revealSteps = playResult.animationScript.steps.filter(
      (step) => step.kind === "cardReveal",
    );
    expect(revealSteps.map((step) => step.cardId)).toEqual(choice.payload.revealedCardIds);
    const revealLog = engine
      .getEvents("actionLog")
      .find((log) => log.messageKey === "move.searchDeck.revealNamed");
    expect(revealLog ? formatActionLog(revealLog, enMessages) : "").toBe(
      "Revealed the top 2 cards of the deck: Corpo Security, Field Operator.",
    );

    const resolveResult = engine.resolveRevealDestination("hand", { as: P2 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailFieldOperator.id,
    ]);
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailRidingNomad.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFoolOnTheHill.id,
    ]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();

    const moveSteps = resolveResult.animationScript.steps.filter(
      (step) => step.kind === "cardMove",
    );
    expect(moveSteps.map((step) => [step.cardId, step.fromZone, step.toZone])).toEqual([
      [choice.payload.revealedCardIds[0], "deck", "hand"],
      [choice.payload.revealedCardIds[1], "deck", "hand"],
    ]);
    const actionLog = engine
      .getEvents("actionLog")
      .findLast((event) => event.messageKey === "move.resolveRevealDestination");
    expect(actionLog?.params).toMatchObject({
      chooserId: P2,
      chooserLabel: "Rival",
      destination: "hand",
    });
    expect(actionLog ? formatActionLog(actionLog, enMessages) : "").toBe(
      "Rival chose hand: moved 2 revealed card(s) to hand.",
    );
  });

  it("lets the rival trash the revealed cards so the caster draws two", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFoolOnTheHill],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailRidingNomad,
          welcomeToNightCityRetailSketchyRipper,
        ],
        eddies: 2,
      },
      {},
      { preserveDeckOrder: true },
    );

    const playResult = engine.playCard(welcomeToNightCityRetailFoolOnTheHill, { as: P1 });
    const revealSteps = playResult.animationScript.steps.filter(
      (step) => step.kind === "cardReveal",
    );
    expect(revealSteps).toHaveLength(2);

    const resolveResult = engine.resolveRevealDestination("trash", { as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFoolOnTheHill.id,
      welcomeToNightCityRetailCorpoSecurity.id,
      welcomeToNightCityRetailFieldOperator.id,
    ]);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailRidingNomad.id,
      welcomeToNightCityRetailSketchyRipper.id,
    ]);
    const remainingDeckDefinitions = engine
      .getCardsInZone("deck", P1)
      .map((card) => card.definitionId);
    expect(remainingDeckDefinitions).not.toContain(welcomeToNightCityRetailCorpoSecurity.id);
    expect(remainingDeckDefinitions).not.toContain(welcomeToNightCityRetailFieldOperator.id);
    expect(remainingDeckDefinitions).not.toContain(welcomeToNightCityRetailRidingNomad.id);
    expect(remainingDeckDefinitions).not.toContain(welcomeToNightCityRetailSketchyRipper.id);

    const moveSteps = resolveResult.animationScript.steps.filter(
      (step) => step.kind === "cardMove",
    );
    expect(moveSteps.map((step) => [step.fromZone, step.toZone])).toEqual([
      ["deck", "trash"],
      ["deck", "trash"],
    ]);
    const actionLog = engine
      .getEvents("actionLog")
      .findLast((event) => event.messageKey === "move.resolveRevealDestination");
    expect(actionLog?.params).toMatchObject({
      chooserId: P2,
      chooserLabel: "Rival",
      destination: "trash",
    });
    expect(actionLog ? formatActionLog(actionLog, enMessages) : "").toBe(
      "Rival chose trash: moved 2 revealed card(s) to trash.",
    );
    const drawLog = engine
      .getEvents("actionLog")
      .find((log) => log.messageKey === "effect.draw.resolved");
    expect(drawLog?.params).toMatchObject({
      sourceCardName: "Fool on the Hill",
      drawnCount: 2,
    });
    expect(formatActionLog(drawLog!, enMessages)).toBe("Fool on the Hill drew 2 card(s).");
    expect(drawLog?.params.drawnCardNames).toMatchObject({
      __private: true,
      value: "Riding Nomad, Sketchy Ripper",
      visibleTo: [P1],
    });
  });
});
