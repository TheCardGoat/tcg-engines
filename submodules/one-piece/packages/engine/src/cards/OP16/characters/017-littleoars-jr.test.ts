import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

type CharacterFixture = NonNullable<
  NonNullable<Parameters<typeof OnePieceTestEngine.create>[0]>["character"]
>;

function oarsPower(characterFixture: CharacterFixture) {
  const engine = OnePieceTestEngine.create({ character: characterFixture }, {});
  return engine
    .getView("south")
    .players.south.characters.flatMap((card) =>
      card?.cardId === "OP16-017" ? [card.power] : [],
    )[0];
}

describe("OP16-017 LittleOars Jr.", () => {
  test("Blocker redirects a Leader attack and protects Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-017"], hand: [], life: 3 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", "OP16-017");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("gives itself -4000 power without a cost-8+ Whitebeard Pirates Character", () => {
    expect(oarsPower([{ cardId: "OP16-017" }])).toBe(4000);
  });

  test("keeps its 8000 power alongside an 8000+ cost-8 Whitebeard Pirates Character", () => {
    expect(oarsPower([{ cardId: "OP16-017" }, { cardId: "OP16-003" }])).toBe(8000);
  });

  test("a Whitebeard Pirates Character below cost 8 does not satisfy the condition", () => {
    // Curiel has the required type but costs only seven.
    expect(oarsPower([{ cardId: "OP16-017" }, { cardId: "OP16-004" }])).toBe(4000);
  });
});
