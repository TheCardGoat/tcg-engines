import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST11-001 Uta", () => {
  test("reveals only the top FILM card, adds it, and cannot repeat after becoming active", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST11-001",
        activeDon: 4,
        hand: ["ST11-005"],
        deck: ["ST05-002", "ST05-009", "ST04-012", "ST02-002", "ST04-012"],
      },
      { life: 5, deck: 20 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const top = e.findCardInZone("south", "deck", "ST05-002");
    const second = e.findCardInZone("south", "deck", "ST05-009");
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").logs.some((l) => l.message.includes("reveals Ain"))).toBe(true);
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([top]);
    e.resolveDecision("effectSearchSelection", { selectedIds: [top] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(top);
    const revealLogs = e
      .getView("north")
      .logs.filter(
        (l) => l.sourceInstanceId === e.leader("south") && l.message.includes("reveals "),
      ).length;
    e.asSouth().play("ST11-005");
    e.asSouth().chooseTargets(e.leader("south"));
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).not.toContain(second);
    expect(
      e
        .getView("north")
        .logs.filter(
          (l) => l.sourceInstanceId === e.leader("south") && l.message.includes("reveals "),
        ),
    ).toHaveLength(revealLogs);
    e.asSouth().endTurn();
    e.asNorth().endTurn();
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    // The next top card is not FILM. A new public reveal proves the once-per-turn reset.
    expect(
      e
        .getView("north")
        .logs.filter(
          (l) => l.sourceInstanceId === e.leader("south") && l.message.includes("reveals "),
        ),
    ).toHaveLength(revealLogs + 1);
  });
  test("declines a revealed FILM card and puts that same card at the bottom", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", activeDon: 1, deck: ["ST05-002", "ST05-009", "ST04-012"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const top = e.findCardInZone("south", "deck", "ST05-002");
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").logs.some((l) => l.message.includes("reveals Ain"))).toBe(true);
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.handCount).toBe(0);
    // Hidden-zone identity proves the printed bottom-deck instruction.
    expect(e.getState().players.south.deck.at(-1)).toBe(top);
  });
  test("reveals a non-FILM card and bottoms it without offering another deck card", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", activeDon: 1, deck: ["ST04-012", "ST05-002", "ST05-009"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const top = e.findCardInZone("south", "deck", "ST04-012");
    e.attachDon(e.leader("south"), 1);
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getView("north").logs.some((l) => l.message.includes("reveals "))).toBe(true);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getState().players.south.deck.at(-1)).toBe(top);
  });
  test("does not reveal or move the top card without an attached DON", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST11-001", deck: ["ST05-002", "ST05-009"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const top = e.findCardInZone("south", "deck", "ST05-002");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.getState().players.south.deck[0]).toBe(top);
    expect(e.getView("north").logs.some((l) => l.message.includes("reveals "))).toBe(false);
  });
});
