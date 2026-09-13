import { describe, expect, it } from "vite-plus/test";

import type { GameCardData } from "../types.ts";
import { toSimulatorEntity } from "./to-simulator-entity.ts";

describe("toSimulatorEntity", () => {
  it("keeps fallback ids unique when duplicate cards provide a positional suffix", () => {
    const card: GameCardData = {
      name: "Duplicate Resource",
      cardNumber: "ST01-001",
      cardType: "resource",
    };

    const first = toSimulatorEntity(card, { zoneId: "resourceArea:player_one", entityIdSuffix: 0 });
    const second = toSimulatorEntity(card, {
      zoneId: "resourceArea:player_one",
      entityIdSuffix: 1,
    });

    expect(first.id).toBe("resourceArea:player_one:ST01-001:0");
    expect(second.id).toBe("resourceArea:player_one:ST01-001:1");
  });

  it("redacts card-specific DOM attributes for hidden cards", () => {
    const hiddenCard: GameCardData = {
      id: "engine-instance-ST01-999",
      name: "Secret Unit",
      cardNumber: "ST01-999",
      cardType: "unit",
      faceDown: true,
    };

    const entity = toSimulatorEntity(hiddenCard, {
      zoneId: "deck:player_two",
      entityIdSuffix: "top",
    });

    expect(entity.id).toBe("deck:player_two:hidden-card:top");
    expect(entity.title).toBe("Hidden card");
    expect(entity.face).toBe("hidden");
    expect(entity.dataAttributes).toEqual({
      "data-card-id": "deck:player_two:hidden-card:top",
      "data-entity-id": "deck:player_two:hidden-card:top",
      "data-sim-entity-id": "deck:player_two:hidden-card:top",
      "data-sim-zone-id": "deck:player_two",
    });
    expect(entity.details).toBeUndefined();
    expect(entity.activeEffects).toBeUndefined();
  });

  it("projects printed values, effects, Link, and paired Pilot details", () => {
    const entity = toSimulatorEntity({
      id: "unit-1",
      name: "Gundam",
      cardType: "unit",
      ap: 5,
      baseAp: 4,
      hp: 6,
      baseHp: 6,
      effect: "When paired, this Unit gets AP +1.",
      linkRequirement: "Pair with an Amuro Ray Pilot.",
      keywords: [{ keyword: "Blocker" }],
      activeEffects: [
        {
          sourceId: "pilot-1",
          sourceName: "Amuro Ray",
          kind: "stat-modifier",
          description: "AP +1",
        },
      ],
      pairedPilot: {
        id: "pilot-1",
        name: "Amuro Ray",
        cardType: "pilot",
      },
    });

    expect(entity.stats.find((stat) => stat.label === "AP")).toMatchObject({
      value: "5",
      baseValue: "4",
    });
    expect(entity.details?.rules.map((rule) => rule.label)).toEqual(["BLOCK", undefined, "Link"]);
    expect(entity.details?.rules[0]?.text).toBe(
      "Rest this Unit to change the attack target to it.",
    );
    expect(entity.details?.relationships).toEqual([
      {
        id: "paired-pilot:pilot-1",
        label: "Paired Pilot",
        entityIds: ["pilot-1"],
      },
    ]);
    expect(entity.activeEffects?.[0]).toMatchObject({
      sourceEntityId: "pilot-1",
      sourceLabel: "Amuro Ray",
      detail: "AP +1",
    });
  });

  it("surfaces a localized combat keyword before secondary effect text", () => {
    const entity = toSimulatorEntity({
      id: "kyrios",
      name: "Gundam Kyrios",
      cardType: "unit",
      keywords: [{ keyword: "FirstStrike" }],
      effectBlocks: ["【During Link】This Unit gets AP+2."],
    });

    expect(entity.details?.rules.slice(0, 2)).toEqual([
      {
        id: "keyword-0",
        kind: "keyword",
        label: "FIRST STRIKE",
        text: "This Unit deals battle damage before the opponent.",
      },
      {
        id: "effect-0",
        kind: "ability",
        label: "During Link",
        text: "This Unit gets AP+2.",
      },
    ]);
  });

  it("projects structured Gundam effects as compact labeled rule blocks", () => {
    const entity = toSimulatorEntity({
      id: "pilot-1",
      name: "Full Frontal",
      cardType: "pilot",
      effect: "【Burst】Add this card to your hand.<br>【When Paired】You may deploy 1 Unit card.",
      effectBlocks: [
        "【Burst】Add this card to your hand.",
        "【When Paired】You may deploy 1 Unit card.",
      ],
    });

    expect(entity.details?.rules).toEqual([
      {
        id: "effect-0",
        kind: "ability",
        label: "Burst",
        text: "Add this card to your hand.",
      },
      {
        id: "effect-1",
        kind: "ability",
        label: "When Paired",
        text: "You may deploy 1 Unit card.",
      },
    ]);
  });

  it.each([false, true])(
    "renders escaped keyword reminders as plain text (blocks: %s)",
    (useBlocks) => {
      const effect = "&lt;Blocker&gt; (Rest this Unit to change the attack target to it.)";
      const entity = toSimulatorEntity({
        name: "Demi Trainer",
        cardType: "unit",
        effect,
        effectBlocks: useBlocks ? [effect] : undefined,
      });

      expect(entity.details?.rules[0]?.text).toBe(
        "<Blocker> (Rest this Unit to change the attack target to it.)",
      );
    },
  );

  it("segments legacy HTML and Markdown effect text without interpreting its body", () => {
    const entity = toSimulatorEntity({
      id: "legacy-pilot",
      name: "Legacy Pilot",
      cardType: "pilot",
      effect: "**【Burst】Add this card to your hand.**<br>**【During Pair】【Attack】Draw 1.**",
    });

    expect(entity.details?.rules).toEqual([
      {
        id: "effect-0",
        kind: "ability",
        label: "Burst",
        text: "Add this card to your hand.",
      },
      {
        id: "effect-1",
        kind: "ability",
        label: "During Pair · Attack",
        text: "Draw 1.",
      },
    ]);
  });
});
