import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  createMockGear,
  createMockProgram,
  createMockUnit,
} from "../testing/index.ts";
import type { StructuredGearCard } from "../testing/card-mocks.ts";
import type { CardInstanceId } from "../types/branded.ts";
import { listLegalGearAttachHosts } from "./gear-attachment.ts";

describe("Gear attachment eligibility", () => {
  it("uses each Gear's host rule for public choices and rejects a submitted illegal host", () => {
    const merc = createMockUnit({ name: "Eligible Merc", classifications: ["Merc"] });
    const rocker = createMockUnit({ name: "Ineligible Rocker", classifications: ["Rocker"] });
    const gear: StructuredGearCard = {
      ...createMockGear({ name: "Merc-only Gear" }),
      attachment: {
        text: "Equip to a friendly Merc Unit.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          classifications: ["Merc"],
        },
      },
    };
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [gear],
      field: [merc, rocker],
    });
    const gearId = engine.findCardId(gear, "hand", P1) as CardInstanceId;
    const mercId = engine.findCardId(merc, "field", P1) as CardInstanceId;
    const rockerId = engine.findCardId(rocker, "field", P1) as CardInstanceId;

    expect(listLegalGearAttachHosts(engine.getState(), gearId, P1)).toEqual([mercId]);
    engine.judgeSetPendingChoice({
      type: "chooseCardToPlay",
      chooserId: P1,
      effectId: "restricted-gear-play",
      payload: {
        cardIds: [gearId],
        free: true,
        sourceCardId: gearId,
        sourcePlayerId: P1,
        abilityIndex: 0,
      },
    });

    const invalid = engine.expectFailure(() =>
      engine.resolveCardToPlay(gear, { as: P1, attachToId: rockerId }),
    );
    expect(invalid.errorCode).toBe("INVALID_CHOICE");
    expect(engine.getCard(gear, "hand", P1).zone).toBe("hand");

    expect(engine.resolveCardToPlay(gear, { as: P1, attachToId: mercId }).success).toBe(true);
    expect(engine.getCard(gear, "field", P1).meta.attachedToId).toBe(mercId);
  });

  it("offers the player each legal host when an effect plays a bound Gear", () => {
    const firstMerc = createMockUnit({ name: "First Merc", classifications: ["Merc"] });
    const secondMerc = createMockUnit({ name: "Second Merc", classifications: ["Merc"] });
    const rocker = createMockUnit({ name: "Rocker", classifications: ["Rocker"] });
    const gear: StructuredGearCard = {
      ...createMockGear({ name: "Merc-only Effect Gear" }),
      attachment: {
        text: "Equip to a friendly Merc Unit.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          classifications: ["Merc"],
        },
      },
    };
    const source = createMockProgram({
      name: "Play Bound Gear",
      cost: 0,
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          text: "Trash 1. Play it for free.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            { effect: "trashFromDeck", player: "friendly", amount: 1, outputBinding: "gear" },
            { effect: "playCard", target: { selector: "bound", id: "gear" }, free: true },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [source],
        deck: [gear],
        field: [firstMerc, secondMerc, rocker],
      },
      {},
      { preserveDeckOrder: true },
    );
    const secondMercId = engine.findCardId(secondMerc, "field", P1) as CardInstanceId;
    const rockerId = engine.findCardId(rocker, "field", P1) as CardInstanceId;

    engine.playCard(source, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(gear, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected a Gear host choice");
    }
    expect(choice.payload.eligibleIds).toContain(secondMercId);
    expect(choice.payload.eligibleIds).not.toContain(rockerId);

    engine.resolveEffectTarget(secondMerc, { as: P1 });
    expect(engine.getCard(gear, "field", P1).meta.attachedToId).toBe(secondMercId);
  });

  it("resolves the selected Gear's own host rule after choosing among different Gears", () => {
    const merc = createMockUnit({ name: "Merc Host", classifications: ["Merc"] });
    const rocker = createMockUnit({ name: "Rocker Host", classifications: ["Rocker"] });
    const mercGear: StructuredGearCard = {
      ...createMockGear({ name: "Merc Gear" }),
      attachment: {
        text: "Equip to a Merc Unit.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          classifications: ["Merc"],
        },
      },
    };
    const rockerGear: StructuredGearCard = {
      ...createMockGear({ name: "Rocker Gear" }),
      attachment: {
        text: "Equip to a Rocker Unit.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          classifications: ["Rocker"],
        },
      },
    };
    const source = createMockProgram({
      name: "Choose Gear",
      cost: 0,
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          text: "Play a Gear from your hand for free.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "playCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["gear"],
              },
              free: true,
              attachTo: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [source, mercGear, rockerGear],
      field: [merc, rocker],
    });
    const mercId = engine.findCardId(merc, "field", P1) as CardInstanceId;
    const rockerId = engine.findCardId(rocker, "field", P1) as CardInstanceId;

    engine.playCard(source, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(rockerGear, { as: P1 });
    const hostChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (!hostChoice || hostChoice.type !== "chooseTarget") {
      throw new Error("Expected a host choice for Rocker Gear");
    }
    expect(hostChoice.payload.eligibleIds).toContain(rockerId);
    expect(hostChoice.payload.eligibleIds).not.toContain(mercId);

    engine.resolveEffectTarget(rocker, { as: P1 });
    expect(engine.getCard(rockerGear, "field", P1).meta.attachedToId).toBe(rockerId);
    expect(engine.getCard(mercGear, "hand", P1).zone).toBe("hand");
  });

  it("does not attach a Gear through an effect when its own host rule rejects the target", () => {
    const merc = createMockUnit({ name: "Merc Host", classifications: ["Merc"] });
    const rocker = createMockUnit({ name: "Rocker Host", classifications: ["Rocker"] });
    const gear: StructuredGearCard = {
      ...createMockGear({ name: "Merc-only Attached Gear" }),
      attachment: {
        text: "Equip to a Merc Unit.",
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          classifications: ["Merc"],
        },
      },
    };
    const source = createMockProgram({
      name: "Attach Gear Effect",
      cost: 0,
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          text: "Attach a Gear to a Unit.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "attachCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["gear"],
              },
              attachTo: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                classifications: ["Rocker"],
              },
              free: true,
            },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [source, gear],
      field: [merc, rocker],
    });

    engine.playCard(source, { as: P1 });

    engine.expectNoPendingChoice();
    expect(engine.getCard(gear, "hand", P1).zone).toBe("hand");
  });

  it("keeps a bound host through a pending attachCard choice among Gears", () => {
    const host = createMockUnit({ name: "Chosen Host" });
    const firstGear = createMockGear({ name: "First Choice Gear" });
    const secondGear = createMockGear({ name: "Second Choice Gear" });
    const source = createMockProgram({
      name: "Choose a Gear to Attach",
      cost: 0,
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          text: "Equip a Gear to a friendly Unit.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedUnit",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
          effects: [
            {
              effect: "attachCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["gear"],
              },
              attachTo: { selector: "bound", id: "selectedUnit" },
              free: true,
            },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [source, firstGear, secondGear],
      field: [host],
    });
    const hostId = engine.findCardId(host, "field", P1) as CardInstanceId;

    engine.playCard(source, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(host, {
      as: P1,
      allowPendingChoice: true,
      reason: "the player must choose which Gear to attach to the bound host",
    });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(secondGear, { as: P1 });

    expect(engine.getCard(secondGear, "field", P1).meta.attachedToId).toBe(hostId);
    expect(engine.getCard(firstGear, "hand", P1).zone).toBe("hand");
  });

  it("requires full payment for a paid attachCard effect", () => {
    const host = createMockUnit({ name: "Paid Gear Host" });
    const gear = createMockGear({ name: "Paid Effect Gear", cost: 3 });
    const source = createMockProgram({
      name: "Paid Attach Effect",
      cost: 0,
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          text: "Trash 1. Play it and equip it to a friendly Unit.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            { effect: "trashFromDeck", player: "friendly", amount: 1, outputBinding: "paidGear" },
            {
              effect: "attachCard",
              target: { selector: "bound", id: "paidGear" },
              attachTo: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
              },
            },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [source],
        deck: [gear],
        field: [host],
        eddies: 0,
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();

    engine.playCard(source, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    const failure = engine.expectFailure(() => engine.resolveCardToPlay(gear, { as: P1 }));
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getCard(gear, "trash", P1).zone).toBe("trash");
  });

  it("lets the player choose a host for one non-bound Gear play", () => {
    const firstHost = createMockUnit({ name: "First Host" });
    const secondHost = createMockUnit({ name: "Second Host" });
    const gear = createMockGear({ name: "Single Choice Gear" });
    const source = createMockProgram({
      name: "Play One Gear",
      cost: 0,
      timingTriggers: ["play"],
      abilities: [
        {
          kind: "triggered",
          text: "Play a Gear from your hand for free.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "playCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["hand"],
                cardTypes: ["gear"],
              },
              free: true,
              attachTo: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [source, gear],
      field: [firstHost, secondHost],
    });
    const secondHostId = engine.findCardId(secondHost, "field", P1) as CardInstanceId;

    engine.playCard(source, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    engine.resolveCardToPlay(gear, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(secondHost, { as: P1 });

    expect(engine.getCard(gear, "field", P1).meta.attachedToId).toBe(secondHostId);
  });
});
