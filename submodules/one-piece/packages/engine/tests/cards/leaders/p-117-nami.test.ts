import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { getAllCards, validateDeckForFormat } from "@tcg/op-cards";
describe("p-117-nami", () => {
  test("damage with DON mills last deck card and wins instead of losing", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-117", deck: ["P-012"], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south.deckCount).toBe(0);
    expect(e.getView("south").winner).toBe("south");
    expect(e.getView("south").status).toBe("finished");
  });
  test("declines optional damage mill and remains active", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-117", deck: ["P-012"], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").status).toBe("active");
  });
  test("without DON damage cannot mill", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "P-117", deck: ["P-012"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
  test("public deck validator permits EastBlue and rejects other types", () => {
    const okay = validateDeckForFormat("standard", [
      { cardId: "P-117", quantity: 1 },
      { cardId: "OP03-044", quantity: 4 },
    ]);
    const bad = validateDeckForFormat("standard", [
      { cardId: "P-117", quantity: 1 },
      { cardId: "P-012", quantity: 4 },
    ]);
    expect(okay.rules.find((r) => r.kind === "leader-restrictions")?.passed).toBe(true);
    expect(bad.rules.find((r) => r.kind === "leader-restrictions")?.passed).toBe(false);
  });
  test("full fifty-card EastBlue deck is valid and replacing one slot with other type is invalid", () => {
    const cards = getAllCards()
      .filter(
        (c) =>
          c.cardType === "character" && c.color.includes("blue") && c.traits?.includes("East Blue"),
      )
      .slice(0, 13);
    expect(cards).toHaveLength(13);
    const deck = [
      { cardId: "P-117", quantity: 1 },
      ...cards.map((c, i) => ({ cardId: c.id, quantity: i === 12 ? 2 : 4 })),
    ];
    expect(validateDeckForFormat("standard", deck).valid).toBe(true);
    const changed = deck.map((c, i) => (i === 1 ? { cardId: "P-012", quantity: 4 } : c));
    expect(validateDeckForFormat("standard", changed).valid).toBe(false);
  });
});
