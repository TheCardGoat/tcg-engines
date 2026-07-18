import type { CardEffect } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";
import {
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "../../index.ts";

const drawOnDeploy: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【Deploy】Draw 1.",
};

const drawWhenPaired: CardEffect = {
  type: "triggered",
  activation: { timing: ["whenPaired"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【When Paired】Draw 1.",
};

describe("source-owned trigger routing", () => {
  it("runs a card's Deploy effect once without repeating it for later deployments", () => {
    const source = createMockUnit({
      name: "Deploy Source",
      level: 0,
      cost: 0,
      effects: [drawOnDeploy],
    });
    const laterUnit = createMockUnit({ name: "Later Unit", level: 0, cost: 0 });
    const laterBase = createMockBase({ name: "Later Base", level: 0, cost: 0 });
    const engine = GundamTestEngine.create({
      hand: [source, laterUnit, laterBase],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(source));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);

    expectSuccess(p1.deployUnit(laterUnit));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);

    expectSuccess(p1.deployBase(laterBase));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);
  });

  it("does not repeat a paired Pilot's own effect for a later unrelated Pair", () => {
    const firstHost = createMockUnit({ name: "First Host" });
    const secondHost = createMockUnit({ name: "Second Host" });
    const sourcePilot = createMockPilot({
      name: "Pair Source",
      level: 0,
      cost: 0,
      effects: [drawWhenPaired],
    });
    const laterPilot = createMockPilot({ name: "Later Pilot", level: 0, cost: 0 });
    const engine = GundamTestEngine.create({
      hand: [sourcePilot, laterPilot],
      play: [firstHost, secondHost],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [firstHostId, secondHostId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(sourcePilot, firstHostId!));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);

    expectSuccess(p1.assignPilot(laterPilot, secondHostId!));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);
  });

  it("keeps explicitly event-qualified deploy and pairing observers active", () => {
    const deployObserverEffect: CardEffect = {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "blue" }],
            },
          },
        ],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "When you deploy a blue Unit, draw 1.",
    };
    const pairObserverEffect: CardEffect = {
      type: "triggered",
      activation: {
        timing: ["whenPaired"],
        conditions: [
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "blue" }],
            },
          },
        ],
      },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "When you pair a Pilot with a blue Unit, draw 1.",
    };
    const deployObserver = createMockUnit({
      name: "Deploy Observer",
      effects: [deployObserverEffect],
    });
    const pairObserver = createMockUnit({ name: "Pair Observer", effects: [pairObserverEffect] });
    const blueHost = createMockUnit({ name: "Blue Host", color: "blue", level: 0, cost: 0 });
    const pilot = createMockPilot({ level: 0, cost: 0 });
    const engine = GundamTestEngine.create({
      hand: [blueHost, pilot],
      play: [deployObserver, pairObserver],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(blueHost));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(4);
    const hostId = p1.getCardsInZone("battleArea")[2]!;

    expectSuccess(p1.assignPilot(pilot, hostId));
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(3);
  });
});
