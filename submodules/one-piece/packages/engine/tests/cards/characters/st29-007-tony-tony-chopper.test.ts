import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-007 Chopper", () => {
  test.each(["top", "bottom"])("On KO pays %s Life then places chosen hand on top", (position) => {
    let e = OnePieceTestEngine.create(
      {},
      {
        character: [{ cardId: "ST29-007", rested: true }],
        life: ["ST02-002", "ST02-006"],
        hand: ["ST01-006"],
      },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const source = e.findCardInZone("north", "character", "ST29-007"),
      hand = e.findCardInZone("north", "hand", "ST01-006"),
      life = [...e.getState().players.north.life];
    e.asSouth().attack(e.leader("south"), source);
    // No usable Counter remains, so the Counter Step ends automatically.
    e.asNorth().acceptOptional();
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectCostAddLifeToHand", { optionId: position }, "north");
    e.asNorth().chooseTargets(hand);
    expect(e.getState().players.north.life[0]).toBe(hand);
    expect(e.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(
      life[position === "top" ? 0 : 1],
    );
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(source);
  });
  test("declines optional Life cost on KO", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "ST29-007", rested: true }], life: 2 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const life = [...e.getState().players.north.life];
    e.asSouth().attack(e.leader("south"), e.findCardInZone("north", "character", "ST29-007"));
    e.asNorth().declineOptional();
    expect(e.getState().players.north.life).toEqual(life);
    expect(e.getView("north").players.north.handCount).toBe(0);
  });
  test("zero Life cannot pay On KO", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "ST29-007", rested: true }], life: 0 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.leader("south"), e.findCardInZone("north", "character", "ST29-007"));
    expect(e.getView("north").prompts).toHaveLength(0);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toContain("ST29-007");
  });
  test.each(["leader", "character"])(
    "Trigger buffs named %s only and expires this turn",
    (kind) => {
      const e = OnePieceTestEngine.create(
        {},
        {
          leaderCardId: "ST29-001",
          character: ["ST29-012", "ST29-010"],
          life: ["ST29-007", "ST02-002"],
        },
        { activeSeat: "south", firstPlayer: "north" },
      );
      e.asSouth().attack(e.leader("south"), e.leader("north"));
      e.asNorth().activateLifeTrigger();
      const character = e.findCardInZone("north", "character", "ST29-012"),
        wrong = e.findCardInZone("north", "character", "ST29-010");
      const p = e.pendingDecision("effectTargetSelection", "north").steps[0];
      if (p?.kind !== "selectEntity") throw Error("target");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(wrong);
      e.asNorth().chooseTargets(kind === "leader" ? e.leader("north") : character);
      expect(
        kind === "leader"
          ? e.getView("north").players.north.leader.power
          : e.getView("north").players.north.characters[0]?.power,
      ).toBe(kind === "leader" ? 7000 : 2000);
      e.asSouth().endTurn();
      expect(
        kind === "leader"
          ? e.getView("north").players.north.leader.power
          : e.getView("north").players.north.characters[0]?.power,
      ).toBe(kind === "leader" ? 5000 : 0);
    },
  );
  test("can add zero after paying Life cost", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "ST29-007", rested: true }], life: ["ST02-002", "ST02-006"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.leader("south"), e.findCardInZone("north", "character", "ST29-007"));
    e.asNorth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "north");
    e.asNorth().chooseTargets();
    expect(e.getView("north").players.north.lifeCount).toBe(1);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
});
