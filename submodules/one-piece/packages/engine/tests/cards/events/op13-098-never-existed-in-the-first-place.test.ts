import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op13MonkeyDLuffy001,
  op13NeverExistedInTheFirstPlace098,
  op13TheEmptyThrone099,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function withImuLeader(run: () => void): void {
  const originalName = op13MonkeyDLuffy001.name;
  const originalEnglishName = op13MonkeyDLuffy001.i18n.en.name;
  op13MonkeyDLuffy001.name = "Imu";
  op13MonkeyDLuffy001.i18n.en.name = "Imu";
  try {
    run();
  } finally {
    op13MonkeyDLuffy001.name = originalName;
    op13MonkeyDLuffy001.i18n.en.name = originalEnglishName;
  }
}

describe("OP13-098 Never Existed... in the First Place...", () => {
  test("Main rests one DON!! and K.O.s the opposing cost-7 Stage with an Imu Leader", () => {
    withImuLeader(() => {
      const engine = OnePieceTestEngine.create(
        { hand: [op13NeverExistedInTheFirstPlace098], activeDon: 2 },
        { stage: op13TheEmptyThrone099 },
      );
      const stageId = engine.findCardInZone("north", "stage", op13TheEmptyThrone099);

      engine.playCard(op13NeverExistedInTheFirstPlace098);
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [stageId] }, "south");

      const view = engine.getView("south");
      expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
      expect(view.players.north.trash.map((card) => card.instanceId)).toContain(stageId);
      expect(view.prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    });
  });

  test("Main does not offer its DON!! payment or Stage K.O. without an Imu Leader", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13NeverExistedInTheFirstPlace098], activeDon: 2 },
      { stage: op13TheEmptyThrone099 },
    );
    const stageId = engine.findCardInZone("north", "stage", op13TheEmptyThrone099);

    engine.playCard(op13NeverExistedInTheFirstPlace098);

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.players.north.stage?.instanceId).toBe(stageId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter gives no power without an Imu Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13NeverExistedInTheFirstPlace098], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op13NeverExistedInTheFirstPlace098);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter gives an Imu Leader +4000 for the battle", () => {
    withImuLeader(() => {
      const engine = OnePieceTestEngine.create(
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        { hand: [op13NeverExistedInTheFirstPlace098], activeDon: 1 },
        SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
      );
      const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
      const eventId = engine.findCardInZone("north", "hand", op13NeverExistedInTheFirstPlace098);
      const lifeBefore = engine.getView("north").players.north.lifeCount;

      engine.declareAttack(attackerId, engine.leader("north"), "south");
      engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
      engine.resolveDecision(
        "effectTargetSelection",
        { selectedIds: [engine.leader("north")] },
        "north",
      );

      expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
      expect(engine.getView("north").prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    });
  });
});
