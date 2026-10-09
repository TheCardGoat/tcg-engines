import { expect, test } from "vite-plus/test";
import { getCard } from "@tcg/op-cards";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
function parsed(id: string, run: () => void) {
  const c = getCard(id),
    original = c.effects;
  try {
    c.effects = buildCardEffects(c.effect ?? "");
    run();
  } finally {
    c.effects = original;
  }
}

test.each(["OP05-065", "OP06-119"])(
  "parsed Soba Mask discounts for %s then returns every matching name",
  (high) =>
    parsed("ST26-001", () => {
      const e = OnePieceTestEngine.create({
        hand: ["ST26-001"],
        activeDon: 2,
        character: [high, "ST01-004", "ST01-004", "ST02-002"],
      });
      const selected = e
        .getView("south")
        .players.south.characters.slice(0, 3)
        .map((c) => c!.instanceId);
      const unrelated = e.findCardInZone("south", "character", "ST02-002");
      e.playCard("ST26-001");
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(selected);
      expect(
        e
          .getView("south")
          .players.south.characters.filter(Boolean)
          .map((c) => c?.instanceId),
      ).toContain(unrelated);
      expect(
        e.getView("south").players.south.characters.find((c) => c?.cardId === "ST26-001")?.cost,
      ).toBe(7);
      expect(e.getView("south").players.south.activeDon).toBe(0);
    }),
);

test("parsed Soba Mask rejects current-power-only and wrong-name discounts", () =>
  parsed("ST26-001", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST26-001"],
      activeDon: 5,
      character: ["ST01-004", "ST15-002"],
    });
    const sanji = e.findCardInZone("south", "character", "ST01-004");
    e.asSouth().attachDon(sanji, 3);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(
      e.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: e.findCardInZone("south", "hand", "ST26-001"),
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.activeDon).toBe(2);
  }));

test.each([0, 3, 4, 7, 8])(
  "parsed Wolf has Leader-gated Blocker and floor(trash/4) cost at %s",
  (count) =>
    parsed("ST27-004", () => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "OP09-081", character: ["ST27-004"], trash: Array(count).fill("ST02-002") },
        { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(4 + Math.floor(count / 4));
      e.asNorth().attack(e.findCardInZone("north", "character", "ST15-002"), e.leader("south"));
      e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST27-004"));
      expect(e.getView("south").players.south.lifeCount).toBe(5);
      expect(e.getView("south").players.south.trash.some((c) => c.cardId === "ST27-004")).toBe(
        true,
      );
    }),
);

test("parsed Wolf discards on play and updates cost at a group boundary", () =>
  parsed("ST27-004", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP16-080",
      hand: ["ST27-004", "ST02-002", "ST02-006"],
      activeDon: 4,
      trash: Array(3).fill("ST02-012"),
    });
    e.playCard("ST27-004");
    const paid = e.findCardInZone("south", "hand", "ST02-002");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paid] }, "south");
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(5);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
  }));

test("parsed Wolf wrong Leader has neither conditional benefit", () =>
  parsed("ST27-004", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST27-004"], trash: Array(8).fill("ST02-002") },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(4);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  }));

test("parsed Momonosuke pays attached DON to rested cost area and attacks on its play turn", () =>
  parsed("ST28-004", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST28-004"], activeDon: 8, life: 2, donDeckCount: 2 },
      { life: 3 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.playCard("ST28-004");
    const momo = e.findCardInZone("south", "character", "ST28-004");
    e.asSouth().attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(momo);
    e.asSouth().acceptOptional();
    expect(e.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 8,
      donDeckCount: 2,
    });
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    expect(e.getView("south").players.south.leader.power).toBe(6000);
    e.asSouth().attack(momo, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  }));

test("parsed Momonosuke may decline attached cost and does not gain Rush or power", () =>
  parsed("ST28-004", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST28-004"], activeDon: 8, life: 3 },
      {},
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.playCard("ST28-004");
    const momo = e.findCardInZone("south", "character", "ST28-004");
    e.asSouth().attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(momo);
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.leader.attachedDon).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: momo,
        targetId: e.leader("north"),
      }).reason,
    ).toBeTruthy();
  }));
