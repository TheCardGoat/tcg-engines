import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard, Duration, EventCard } from "@tcg/op-types";
import { op13Higuma013 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const HIGUMA_POWER = 3000;
const LEADER_POWER = 5000;

function copyBasePowerEvent(id: string, duration: Duration): EventCard {
  const name = `Test Set Base Power From (${duration})`;
  return {
    id,
    canonicalId: id,
    slug: id.toLowerCase(),
    name,
    printings: [],
    cardType: "event",
    color: ["green"],
    rarity: "C",
    setId: "TEST",
    cost: 0,
    traits: [],
    effect:
      "[Main] Set 1 of your Characters' base power to the base power of your opponent's Leader.",
    effects: {
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "setBasePowerFrom",
              target: { player: "self", zones: ["character"], count: { amount: 1 } },
              source: { player: "opponent", zones: ["leader"], count: { amount: 1 } },
              duration,
            },
          ],
        },
      ],
    },
    i18n: { en: { name } },
  };
}

const copyPowerCharacter: CharacterCard = {
  id: "TEST-COPY-POWER-OPP-LEADER",
  canonicalId: "TEST-COPY-POWER-OPP-LEADER",
  slug: "test-copy-power-opp-leader",
  name: "Test Copy Power Activate",
  printings: [],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "TEST",
  cost: 0,
  power: HIGUMA_POWER,
  traits: [],
  effect:
    "[Activate: Main] This Character's base power becomes the same as the power of your opponent's Leader until the end of the opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "copyPower",
            target: { player: "opponent", zones: ["leader"], count: { amount: 1 } },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: { en: { name: "Test Copy Power Activate" } },
};

const swapBasePowerCharacter: CharacterCard = {
  id: "TEST-SWAP-BASE-POWER-OPP-LEADER",
  canonicalId: "TEST-SWAP-BASE-POWER-OPP-LEADER",
  slug: "test-swap-base-power-opp-leader",
  name: "Test Swap Base Power Activate",
  printings: [],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "TEST",
  cost: 0,
  power: HIGUMA_POWER,
  traits: [],
  effect:
    "[Activate: Main] Swap this Character's base power with your opponent's Leader's base power until the end of the opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "swapBasePower",
            target: { player: "self", zones: ["character"], count: { amount: 1 } },
            pairedTarget: { player: "opponent", zones: ["leader"], count: { amount: 1 } },
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: { en: { name: "Test Swap Base Power Activate" } },
};

registerCards([
  copyBasePowerEvent("TEST-SETBASEPOWERFROM-OPP-NEXT-ENDPHASE", "untilEndOfOpponentNextEndPhase"),
  copyBasePowerEvent("TEST-SETBASEPOWERFROM-YOUR-NEXT-TURN", "untilEndOfYourNextTurn"),
  copyBasePowerEvent("TEST-SETBASEPOWERFROM-THIS-TURN", "thisTurn"),
  copyPowerCharacter,
  swapBasePowerCharacter,
]);

function southCharacterPower(engine: OnePieceTestEngine, instanceId: string): number | undefined {
  return (
    engine.getView("south").players.south.characters.find((card) => card?.instanceId === instanceId)
      ?.power ?? undefined
  );
}

describe("base-power copy-family multi-turn expiry", () => {
  test("setBasePowerFrom expires at the end of the opponent's next End Phase", () => {
    const card = copyBasePowerEvent(
      "TEST-SETBASEPOWERFROM-OPP-NEXT-ENDPHASE",
      "untilEndOfOpponentNextEndPhase",
    );
    const engine = OnePieceTestEngine.create({
      hand: [card],
      character: [op13Higuma013],
      activeDon: 1,
    });
    const targetId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.playCard(card);
    expect(southCharacterPower(engine, targetId)).toBe(LEADER_POWER);

    engine.endTurn("south");
    expect(southCharacterPower(engine, targetId)).toBe(LEADER_POWER);

    engine.endTurn("north");
    expect(southCharacterPower(engine, targetId)).toBe(HIGUMA_POWER);
  });

  test("setBasePowerFrom expires at the end of the controller's next turn", () => {
    const card = copyBasePowerEvent(
      "TEST-SETBASEPOWERFROM-YOUR-NEXT-TURN",
      "untilEndOfYourNextTurn",
    );
    const engine = OnePieceTestEngine.create({
      hand: [card],
      character: [op13Higuma013],
      activeDon: 1,
    });
    const targetId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.playCard(card);
    expect(southCharacterPower(engine, targetId)).toBe(LEADER_POWER);

    engine.endTurn("south");
    expect(southCharacterPower(engine, targetId)).toBe(LEADER_POWER);

    engine.endTurn("north");
    expect(southCharacterPower(engine, targetId)).toBe(LEADER_POWER);

    engine.endTurn("south");
    expect(southCharacterPower(engine, targetId)).toBe(HIGUMA_POWER);
  });

  test("setBasePowerFrom thisTurn still expires at the end of the current turn", () => {
    const card = copyBasePowerEvent("TEST-SETBASEPOWERFROM-THIS-TURN", "thisTurn");
    const engine = OnePieceTestEngine.create({
      hand: [card],
      character: [op13Higuma013],
      activeDon: 1,
    });
    const targetId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.playCard(card);
    expect(southCharacterPower(engine, targetId)).toBe(LEADER_POWER);

    engine.endTurn("south");
    expect(southCharacterPower(engine, targetId)).toBe(HIGUMA_POWER);
  });

  test("copyPower expires at the end of the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({ character: [copyPowerCharacter] });
    const sourceId = engine.findCardInZone("south", "character", copyPowerCharacter);

    engine.activateEffect(sourceId, "activateMain", "south");
    expect(southCharacterPower(engine, sourceId)).toBe(LEADER_POWER);

    engine.endTurn("south");
    expect(southCharacterPower(engine, sourceId)).toBe(LEADER_POWER);

    engine.endTurn("north");
    expect(southCharacterPower(engine, sourceId)).toBe(HIGUMA_POWER);
  });

  test("swapBasePower restores both sides at the end of the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create({ character: [swapBasePowerCharacter] });
    const sourceId = engine.findCardInZone("south", "character", swapBasePowerCharacter);

    engine.activateEffect(sourceId, "activateMain", "south");
    expect(southCharacterPower(engine, sourceId)).toBe(LEADER_POWER);
    expect(engine.getView("south").players.north.leader.power).toBe(HIGUMA_POWER);

    engine.endTurn("south");
    expect(southCharacterPower(engine, sourceId)).toBe(LEADER_POWER);
    expect(engine.getView("south").players.north.leader.power).toBe(HIGUMA_POWER);

    engine.endTurn("north");
    expect(southCharacterPower(engine, sourceId)).toBe(HIGUMA_POWER);
    expect(engine.getView("south").players.north.leader.power).toBe(LEADER_POWER);
  });
});
