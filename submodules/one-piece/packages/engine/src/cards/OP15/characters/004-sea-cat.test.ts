import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Krieg001 } from "../../../../../cards/src/cards/leaders/op15-001-krieg.ts";
import { op15SeaCat004 } from "../../../../../cards/src/cards/characters/op15-004-sea-cat.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-004 Sea Cat", () => {
  test("[On Play] gives an opposing Character -3000 power when the Leader has 0 power or less", () => {
    const leaderCard = op15Krieg001;
    const originalPower = leaderCard.power;
    leaderCard.power = 0;
    try {
      const engine = OnePieceTestEngine.create(
        { leaderCardId: op15Krieg001, hand: [op15SeaCat004], activeDon: 1 },
        { character: [eb01Doma005] },
      );
      const domaId = engine.findCardInZone("north", "character", eb01Doma005);

      engine.playCard(op15SeaCat004);

      const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (target?.kind !== "selectEntity") throw new Error("Expected Sea Cat's target.");
      expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
      engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

      expect(
        engine.getView("south").players.north.characters.find((card) => card?.instanceId === domaId)
          ?.power,
      ).toBe(0);
      expect(engine.getView("south").prompts).toHaveLength(0);
    } finally {
      leaderCard.power = originalPower;
    }
  });

  test("does not offer the effect while the Leader has more than 0 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001, hand: [op15SeaCat004], activeDon: 1 },
      { character: [eb01Doma005] },
    );

    engine.playCard(op15SeaCat004);

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId)?.power,
    ).toBe(3000);
  });
});
