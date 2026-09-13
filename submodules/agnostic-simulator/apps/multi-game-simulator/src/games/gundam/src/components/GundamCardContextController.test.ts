import { describe, expect, it } from "vite-plus/test";

import {
  automaticActionsForCard,
  commandTimingDisabledReason,
  effectActionPresentation,
  structuralActions,
} from "./GundamCardContextController.tsx";

const deployAction = {
  id: "deployUnit:gm",
  sourceEntityId: "gm",
  label: "Deploy Unit",
  order: 10,
  activation: "begin-selection" as const,
  commandRef: "deployUnit",
  availability: { kind: "enabled" as const },
};

const blockAction = {
  ...deployAction,
  id: "declareBlock:gm",
  label: "Block",
  commandRef: "declareBlock",
};

const attackAction = {
  ...deployAction,
  id: "enterBattle:gm:player",
  label: "Attack player",
  commandRef: "enterBattle:player",
};

describe("automaticActionsForCard", () => {
  it("requires an explicit action-sheet choice before playing a hand card", () => {
    expect(
      automaticActionsForCard({ name: "GM", cardType: "unit", zoneId: "hand:player_one" }, [
        deployAction,
      ]),
    ).toEqual([]);
  });

  it("keeps single-action battlefield responses eligible for one-tap use", () => {
    expect(
      automaticActionsForCard({ name: "GM", cardType: "unit", zoneId: "battleArea:player_one" }, [
        blockAction,
      ]),
    ).toEqual([blockAction]);
  });

  it("requires an explicit action-sheet choice before declaring an attack", () => {
    expect(
      automaticActionsForCard(
        { name: "Gundam", cardType: "unit", zoneId: "battleArea:player_one" },
        [attackAction],
      ),
    ).toEqual([]);
  });
});

describe("effectActionPresentation", () => {
  it("uses a single keyword ability as the action name", () => {
    expect(effectActionPresentation("<Support 2>", 1, 0)).toEqual({
      label: "Use Support 2",
      detail: "Rest this Unit to give another friendly Unit +2 AP this turn.",
    });
  });

  it("names a simple temporary stat ability by its outcome", () => {
    expect(
      effectActionPresentation(
        "【Activate·Main】【Once per Turn】①：This Unit gets AP+2 during this turn.",
        1,
        0,
      ),
    ).toEqual({
      label: "Gain +2 AP",
      detail: "This Unit gets +2 AP this turn.",
    });
  });

  it("keeps descriptive and multiple effects distinguishable", () => {
    expect(effectActionPresentation("Rest an enemy Unit.", 1, 0)).toEqual({
      label: "Activate Effect",
      detail: "Rest an enemy Unit.",
    });
    expect(effectActionPresentation("Draw 1.", 2, 1)).toEqual({
      label: "Activate Effect 2",
      detail: "Draw 1.",
    });
  });
});

describe("structuralActions", () => {
  it("does not present a triggered ability as a manual action", () => {
    expect(
      structuralActions({
        name: "Triggered Unit",
        cardType: "unit",
        zoneId: "battleArea:player_one",
        effect: "【Attack】Draw 1.",
        hasActivatedAbility: false,
      }),
    ).toEqual(["enterBattle"]);

    expect(
      structuralActions({
        name: "Support Unit",
        cardType: "unit",
        zoneId: "battleArea:player_one",
        effect: "<Support 2>",
        hasActivatedAbility: true,
      }),
    ).toEqual(["enterBattle", "activateAbility"]);
  });
});

describe("commandTimingDisabledReason", () => {
  it("explains an Action-only Command without deployment terminology", () => {
    expect(
      commandTimingDisabledReason("【Burst】Draw 1.\n【Action】Choose 1 rested friendly Unit."),
    ).toBe("This Command can only be played during a battle's Action Step.");
  });

  it("uses timing-window language for other unavailable Commands", () => {
    expect(commandTimingDisabledReason("【Main】Draw 1.")).toBe(
      "This Command cannot be played in the current timing window.",
    );
  });
});
