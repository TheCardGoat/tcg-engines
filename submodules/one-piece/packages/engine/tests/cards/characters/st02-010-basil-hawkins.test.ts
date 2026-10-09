import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-010 Hawkins", () => {
  test("readies at battle end against a Character once per turn", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-010", attachedDon: 1, playedOnTurn: 0 }] },
      {
        character: [
          { cardId: "ST02-006", rested: true },
          { cardId: "ST02-006", rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST02-010");
    const targets = e
      .getView("south")
      .players.north.characters.filter((c) => c !== null)
      .map((c) => c.instanceId);
    e.declareAttack(id, targets[0]!, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(false);
    e.declareAttack(id, targets[1]!, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.north.trash).toHaveLength(2);
  });
  test("does not ready after battling a Leader", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-010", attachedDon: 1, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST02-010");
    e.declareAttack(id, e.leader("north"), "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
  });
  test("does not ready when its blocking opponent leaves before power comparison", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-010", attachedDon: 1, playedOnTurn: 0 }] },
      {
        character: [
          { cardId: "OP01-014", attachedDon: 1 },
          "ST02-006",
          "ST02-006",
          "ST02-006",
          "ST02-006",
        ],
        hand: ["ST01-007"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST02-010");
    const jinbe = e.findCardInZone("north", "character", "OP01-014");
    const nami = e.findCardInZone("north", "hand", "ST01-007");
    e.declareAttack(id, e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [jinbe] }, "north");
    e.resolveDecision("effectPlaySelection", { selectedIds: [nami] }, "north");
    e.resolveDecision("effectPlayCharacterReplacement", { selectedIds: [jinbe] }, "north");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(jinbe);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
  });
  test.each([0, 1])("a completed non-KO battle readies only with one DON: %i", (attachedDon) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-010", attachedDon, playedOnTurn: 0 }] },
      { character: [{ cardId: "OP01-120", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("south", "character", "ST02-010");
    e.declareAttack(id, e.findCardInZone("north", "character", "OP01-120"), "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(attachedDon === 0);
    expect(e.getView("south").players.north.characters.some((c) => c?.cardId === "OP01-120")).toBe(
      true,
    );
  });
});
