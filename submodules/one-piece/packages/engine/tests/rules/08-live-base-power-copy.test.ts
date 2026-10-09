import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("synthetic resolved base-power copy uses the live base but excludes additive power", () => {
  const card = getCard("EB01-005");
  const original = card.effects;
  try {
    // Explicit action-contract fixture: no printed active card currently uses
    // setBasePowerFrom. Vista's real continuous effect has separate coverage.
    card.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "setBasePower",
              target: { player: "self", zones: ["leader"], count: { amount: 1 } },
              value: 7000,
              duration: "thisTurn",
            },
            {
              action: "modifyPower",
              target: { player: "self", zones: ["leader"], count: { amount: 1 } },
              value: 2000,
              duration: "thisTurn",
            },
            {
              action: "setBasePowerFrom",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
              source: { player: "self", zones: ["leader"], count: { amount: 1 } },
              duration: "thisTurn",
            },
          ],
        },
      ],
    };
    const engine = OnePieceTestEngine.create({ leaderCardId: "ST01-001", character: [card] }, {});
    const source = engine.findCardInZone("south", "character", card);
    engine.asSouth().activateMain(source);
    expect(engine.getView("south").players.south.leader.power).toBe(9000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === source)?.power,
    ).toBe(7000);
    engine.asSouth().endTurn();
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === source)?.power,
    ).toBe(3000);
  } finally {
    card.effects = original;
  }
});
