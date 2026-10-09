import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-017-flame-dragon-king", () => {
  test("Counter grants 4000 then reorders mixed-face Life without changing orientations", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-013", playedOnTurn: 0 }] },
      {
        hand: ["ST13-017"],
        activeDon: 2,
        life: [{ cardId: "ST02-002", faceUp: true, publicKnowledge: true }, "ST02-006"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const [up, down] = e.getState().players.north.life;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-013"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "ST13-017")] },
      "north",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    e.resolveDecision("effectRearrangeLifeOrder", { selectedIds: [down!, up!] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getState().players.north.life).toEqual([down, up]);
    expect(e.getState().cards[up!]!.faceUp).toBe(true);
    expect(e.getState().cards[down!]!.faceUp).toBe(false);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });
  test("declining Counter power still permits the Life order", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-012", playedOnTurn: 0 }] },
      { hand: ["ST13-017"], activeDon: 2, life: ["ST02-002", "ST02-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const life = [...e.getState().players.north.life];
    e.declareAttack(e.findCardInZone("south", "character", "ST02-012"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "ST13-017")] },
      "north",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    e.resolveDecision("effectRearrangeLifeOrder", { selectedIds: life.reverse() }, "north");
    expect(e.getState().players.north.life).toEqual(life);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });

  test("Trigger pays bottom Life and can return that newly added card to top Life", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST13-017", "ST02-002", "ST02-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paid = e.getState().players.north.life[2]!;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [paid] }, "north");
    expect(e.getState().players.north.life[0]).toBe(paid);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getState().cards[paid]!.faceUp).toBe(false);
  });
  test("declines the optional Trigger Life payment", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST13-017", "ST02-002", "ST02-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectOptional", { optionId: "no" }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
