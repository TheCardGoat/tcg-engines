import { describe, expect, it } from "vite-plus/test";
import type { SwuCardDefinition } from "@tcg/star-wars-unlimited-types";
import {
  damagedCard,
  expectSuccessfulCommand,
  fixtureCard,
  shieldedCard,
  swuFixture,
  SwuTestEngine,
  testCardIdentity,
} from "./index.ts";

function testUnit(
  id: string,
  title: string,
  overrides: Partial<SwuCardDefinition> = {},
): SwuCardDefinition {
  return {
    ...testCardIdentity(id, title),
    title,
    subtitle: null,
    cost: 1,
    hp: 3,
    power: 2,
    text: null,
    deployBox: null,
    epicAction: null,
    unique: false,
    rules: null,
    id,
    internalName: id,
    cardType: "unit",
    types: ["unit"],
    aspects: [],
    traits: [],
    arena: "ground",
    keywords: [],
    abilities: [],
    ...overrides,
  };
}

const triggerUnit = testUnit("test-trigger-unit", "Trigger Unit", {
  abilities: [
    {
      kind: "triggered",
      text: "When played, deal 2 damage to an enemy base.",
      trigger: { event: "played" },
      effects: [{ type: "damage", amount: 2, target: { type: "base", controller: "opponent" } }],
    },
  ],
});

const optionalUnit = testUnit("test-optional-unit", "Optional Unit", {
  abilities: [
    {
      kind: "action",
      text: "You may draw a card.",
      effects: [
        { type: "optional", effects: [{ type: "draw", controller: "friendly", amount: 1 }] },
      ],
    },
  ],
});

const resourceTraderUnit = testUnit("test-resource-trader", "Resource Trader", {
  abilities: [
    {
      kind: "triggered",
      text: "When played, return a resource and resource the top card of your deck.",
      trigger: { event: "played" },
      effects: [
        {
          type: "sequential",
          effects: [
            {
              type: "move",
              target: { type: "card", controller: "friendly", zones: ["resource"], limit: 1 },
              to: "hand",
            },
            {
              type: "resource",
              target: { type: "card", controller: "friendly", zones: ["deck"], limit: 1 },
            },
          ],
        },
      ],
    },
  ],
});

const trainingUpgrade: SwuCardDefinition = {
  ...testCardIdentity("test-training-upgrade", "Training Upgrade"),
  title: "Training Upgrade",
  subtitle: null,
  cost: 1,
  hp: null,
  power: null,
  text: "Attached unit gains Sentinel.",
  deployBox: null,
  epicAction: null,
  unique: false,
  rules: null,
  id: "test-training-upgrade",
  internalName: "test-training-upgrade",
  cardType: "upgrade",
  types: ["upgrade"],
  aspects: [],
  traits: [],
  arena: null,
  keywords: [],
  upgradeHp: 1,
  upgradePower: 1,
  pilotText: "Attached unit gains Sentinel.",
  abilities: [
    {
      kind: "constant",
      text: "Attached unit gains Sentinel.",
      effects: [
        {
          type: "gainKeyword",
          target: { type: "attachedUnit" },
          keyword: "sentinel",
          duration: "continuous",
        },
        {
          type: "modifyStats",
          target: { type: "attachedUnit" },
          power: 1,
          hp: 1,
          duration: "continuous",
        },
      ],
    },
  ],
};

const raidUnit = testUnit("test-raid-unit", "Raid Unit", {
  abilities: [
    {
      kind: "triggered",
      text: "On attack, gain +1/+0 for this attack.",
      trigger: { event: "attack" },
      effects: [{ type: "modifyStats", target: { type: "self" }, power: 1, duration: "attack" }],
    },
  ],
});

describe("SwuTestEngine fixture DSL", () => {
  it("creates deterministic card fixtures and player drivers", () => {
    const engine = SwuTestEngine.fromFixture({
      definitions: [triggerUnit],
      playerOne: { hand: [triggerUnit], resource: 2 },
      playerTwo: { deck: 1 },
    });

    expect(engine.state.phase).toBe("action");
    expect(engine.playerOne.cardsIn("hand")).toHaveLength(1);
    expect(engine.state.players["player-one"].resources).toBe(2);
    expect(engine.state.players["player-one"].readyResources).toBe(2);
  });

  it("supports card-state fixture helpers for readable scenario setup", () => {
    const engine = SwuTestEngine.fromFixture({
      definitions: [raidUnit],
      playerOne: {
        groundArena: [
          damagedCard("wounded", raidUnit, 2),
          shieldedCard("protected", raidUnit),
          swuFixture.exhausted("resting", raidUnit),
          swuFixture.experienced("veteran", raidUnit, 2),
        ],
      },
    });

    engine.asPlayerOne().expectCard("wounded").toHaveDamage(2);
    engine.asPlayerOne().expectCard("protected").toHaveShield(1);
    engine.asPlayerOne().expectCard("resting").toBeExhausted();
    engine.asPlayerOne().expectCard("veteran").toHaveExperience(2);
    engine.asPlayerOne().expectZoneCount("groundArena", 4);
  });

  it("executes played triggers from typed card definitions", () => {
    const engine = SwuTestEngine.fromFixture({
      definitions: [triggerUnit],
      playerOne: { hand: [fixtureCard("trigger", triggerUnit)] },
    });
    const enemyBase = engine.playerTwo.cardsIn("base")[0];

    expectSuccessfulCommand(engine.asPlayerOne().playCard("trigger"));

    engine.asPlayerOne().expectCard("trigger").toBeInZone("groundArena");
    engine.expectLogEntry("trigger.resolve");
    expect(enemyBase.damage).toBe(2);
  });

  it("keeps resource totals correct when cards enter and leave the resource zone", () => {
    const replacement = testUnit("test-resource-replacement", "Replacement Resource");
    const engine = SwuTestEngine.fromFixture({
      definitions: [resourceTraderUnit, replacement],
      playerOne: {
        hand: [fixtureCard("trader", resourceTraderUnit)],
        deck: [fixtureCard("replacement", replacement)],
        resource: [fixtureCard("returned", raidUnit)],
      },
    });

    expect(engine.state.players["player-one"].resources).toBe(1);
    expect(engine.state.players["player-one"].readyResources).toBe(1);

    engine.asPlayerOne().expectSuccess(engine.asPlayerOne().playCard("trader"));

    engine.asPlayerOne().expectCard("returned", "hand");
    engine.asPlayerOne().expectCard("replacement", "resource").toBeExhausted();
    expect(engine.state.players["player-one"].resources).toBe(1);
    expect(engine.state.players["player-one"].readyResources).toBe(0);
  });

  it("surfaces optional effects as pending choices", () => {
    const engine = SwuTestEngine.fromFixture({
      definitions: [optionalUnit],
      playerOne: { groundArena: [fixtureCard("optional", optionalUnit)], deck: 1 },
    });

    engine.playerOne.activateAbility("optional");

    engine.asPlayerOne().expectPendingChoice("Resolve optional effect?");
    engine.asPlayerOne().resolveYes();
    engine.asPlayerOne().expectNoPendingChoices();
    engine.asPlayerOne().expectZoneCount("hand", 1);
    expect(engine.playerOne.cardsIn("hand")).toHaveLength(1);
  });

  it("can resolve the first available pending option through the player driver", () => {
    const engine = SwuTestEngine.fromFixture({
      definitions: [optionalUnit],
      playerOne: { groundArena: [swuFixture.card("optional", optionalUnit)], deck: 1 },
    });

    engine.asPlayerOne().activateAbility("optional");
    engine.asPlayerOne().resolveFirstChoice();

    engine.asPlayerOne().expectNoPendingChoices();
    engine.asPlayerOne().expectZoneCount("hand", 1);
  });

  it("uses named fixtures and card assertions for attached upgrade scenarios", () => {
    const engine = SwuTestEngine.fromFixture({
      definitions: [raidUnit, trainingUpgrade],
      playerOne: {
        hand: [fixtureCard("training", trainingUpgrade)],
        groundArena: [fixtureCard("student", raidUnit)],
      },
    });

    engine.playCard("training", { as: "player-one", target: "student" });

    engine.expectCard("training").toBeInZone("groundArena").toBeAttachedTo("student");
    engine
      .expectCard("student")
      .toHaveKeyword("sentinel")
      .toHaveEffectivePower(4)
      .toHaveEffectiveHp(5);
    engine.expectLogEntry("framework.upgrade.attach");
  });

  it("executes attack triggers before combat damage and defeats lethal units", () => {
    const defender = testUnit("test-defender", "Defender", { hp: 3, power: 0 });
    const engine = SwuTestEngine.fromFixture({
      definitions: [raidUnit, defender],
      playerOne: { groundArena: [raidUnit] },
      playerTwo: { groundArena: [defender] },
    });

    engine.playerOne.attack(raidUnit, defender);

    expect(engine.playerTwo.findCard(defender).zone).toBe("discard");
    expect(engine.playerOne.findCard(raidUnit).exhausted).toBe(true);
  });

  it("records units defeated this phase for conditional abilities", () => {
    const casualty = testUnit("test-casualty", "Casualty", { hp: 1, power: 0 });
    const payoffUnit = testUnit("test-phase-payoff", "Phase Payoff", {
      abilities: [
        {
          kind: "triggered",
          text: "When played, if a friendly unit was defeated this phase, create a Credit token.",
          trigger: { event: "played" },
          conditions: [
            {
              type: "unitsDefeatedThisPhase",
              controller: "friendly",
              comparison: { operator: "gte", value: 1 },
            },
          ],
          effects: [{ type: "createToken", token: "credit", amount: 1 }],
        },
      ],
    });
    const attacker = testUnit("test-phase-attacker", "Phase Attacker", { hp: 3, power: 2 });
    const engine = SwuTestEngine.fromFixture({
      activePlayer: "player-two",
      definitions: [attacker, casualty, payoffUnit],
      playerOne: {
        hand: [fixtureCard("payoff", payoffUnit)],
        groundArena: [fixtureCard("casualty", casualty)],
      },
      playerTwo: {
        groundArena: [fixtureCard("attacker", attacker)],
      },
    });

    engine.playerTwo.attack("attacker", "casualty");
    engine.playerOne.playCard("payoff");

    expect(engine.state.phaseHistory.unitsDefeatedByController["player-one"]).toBe(1);
    expect(engine.state.players["player-one"].credits).toBe(1);
  });

  it("projects hidden deck and opponent hand information by viewer", () => {
    const engine = SwuTestEngine.fromFixture({
      playerOne: { hand: 1, deck: 1 },
      playerTwo: { hand: 1, deck: 1 },
    });

    const projected = engine.getProjectedState("player-one");

    expect(
      projected.cards.some(
        (card) => card.controller === "player-two" && card.zone === "hand" && card.title === null,
      ),
    ).toBe(true);
    expect(
      projected.cards.some(
        (card) => card.controller === "player-one" && card.zone === "hand" && card.title !== null,
      ),
    ).toBe(true);
  });
});
