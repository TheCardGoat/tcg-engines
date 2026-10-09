import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-017 Straw Sword", () => {
  test("Main rests a chosen opposing Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST02-017"], activeDon: 2 },
      { character: ["ST02-006"] },
    );
    const id = e.findCardInZone("north", "character", "ST02-006");
    e.playCard("ST02-017", "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === id)?.rested,
    ).toBe(true);
  });
  test("Trigger plays a cost<=2 Supernovas card and excludes wrong types and cost", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST02-017"], hand: ["ST02-003", "ST02-005", "ST02-011"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("north", "hand", "ST02-003");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const step = e.pendingDecision("effectPlaySelection", "north").steps[0];
    if (step?.kind !== "selectEntity") throw Error("play choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.resolveDecision("effectPlaySelection", { selectedIds: [id] }, "north");
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === id)).toBe(
      true,
    );
  });
});
