import { getCard } from "@tcg/op-cards";
import { expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

test("synthetic continuous base-power copy obeys its action condition and excludes Leader DON power", () => {
  const card = getCard("EB01-005");
  const original = card.effects;
  try {
    // Native action-contract fixture; this is not Doma's printed ability.
    card.effects = {
      permanentEffects: [
        {
          actions: [
            {
              action: "setBasePowerFrom",
              target: { player: "self", zones: ["character"], self: true, count: { amount: 1 } },
              source: { player: "self", zones: ["leader"], count: { amount: 1 } },
              condition: { condition: "donAttached", amount: 1 },
              duration: "permanent",
            },
          ],
        },
      ],
    };
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      character: [card],
      activeDon: 2,
    });
    const id = e.findCardInZone("south", "character", card);
    e.asSouth().attachDon(e.leader("south"), 1);
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      power: 3000,
      attachedDon: 0,
    });
    e.asSouth().attachDon(id, 1);
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      power: 6000,
      attachedDon: 1,
    });
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]).toMatchObject({
      power: 5000,
      attachedDon: 1,
    });
    expect(e.getView("south").prompts).toHaveLength(0);
  } finally {
    card.effects = original;
  }
});
