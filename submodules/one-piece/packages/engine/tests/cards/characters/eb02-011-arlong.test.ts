import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01TonyTonyChopper006,
  eb02Arlong011,
  eb02Sabo002,
  op02ParadiseTotsuka047,
  op03Arlong022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-011 Arlong", () => {
  test("gives rested DON!! and prevents the chosen Character from attacking or paying a rest cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        hand: [eb02Arlong011],
        activeDon: 3,
        restedDon: 1,
      },
      { character: [{ card: eb02Sabo002, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const saboId = engine.findCardInZone("north", "character", eb02Sabo002);

    engine.playCard(eb02Arlong011, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Arlong's DON!! count choice.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Arlong's Character choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([saboId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [saboId] }, "south");

    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: saboId,
        targetId: engine.leader("south"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "north",
        sourceInstanceId: saboId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === saboId)
        ?.rested,
    ).toBe(false);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(saboId, engine.leader("south"), "north");
    expect(
      engine.getView("north").players.north.characters.find((card) => card?.instanceId === saboId)
        ?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("removes a protected Blocker from the public Blocker candidates", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Arlong022,
        hand: [eb02Arlong011],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [{ card: eb01TonyTonyChopper006, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);

    engine.playCard(eb02Arlong011, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [blockerId] }, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");

    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test.each(["protected", "unprotected"])(
    "allows selecting the %s Character but prevents only the protected rest",
    (state) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: op03Arlong022,
          hand: [eb02Arlong011, op02ParadiseTotsuka047],
          activeDon: 4,
        },
        { character: [eb02Sabo002, eb01TonyTonyChopper006] },
      );
      const protectedId = engine.findCardInZone("north", "character", eb02Sabo002);
      const restableId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);

      engine.playCard(eb02Arlong011, "south");
      engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");
      engine.playCard(op02ParadiseTotsuka047, "south");

      const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      expect(rest?.kind).toBe("selectEntity");
      if (rest?.kind !== "selectEntity") throw new Error("Expected an effect-rest choice.");
      expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([
        protectedId,
        restableId,
      ]);
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [state === "protected" ? protectedId : restableId] },
        "south",
      );

      const view = engine.getView("south");
      expect(
        view.players.north.characters.find((card) => card?.instanceId === protectedId)?.rested,
      ).toBe(false);
      expect(
        view.players.north.characters.find((card) => card?.instanceId === restableId)?.rested,
      ).toBe(state === "unprotected");
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    },
  );
  test("wrong Leader prevents both DON transfer and rest prohibition", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST02-001", hand: ["EB02-011"], activeDon: 4 },
      { character: ["EB01-005"] },
    );
    e.asSouth().play("EB02-011");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    e.asSouth().endTurn();
    const id = e.findCardInZone("north", "character", "EB01-005");
    e.asNorth().attack(id, e.leader("south"));
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
  });
});
