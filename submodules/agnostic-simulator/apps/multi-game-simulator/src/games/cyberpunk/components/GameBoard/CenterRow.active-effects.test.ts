import { describe, expect, test } from "vite-plus/test";
import { collectTemporaryEffects } from "./CenterRow";

describe("collectTemporaryEffects", () => {
  test("keeps expiring effects and excludes permanent card rules", () => {
    const effects = collectTemporaryEffects([
      {
        ownerSide: "player",
        playerEffects: [],
        cards: [
          [
            {
              id: "static-cant-attack",
              targetKind: "card",
              targetId: "corpo-security",
              sourceName: "Corpo Security",
              label: "CANT ATTACK",
              detail: "Permanent rule",
              effectKind: "grantRule",
              tone: "neutral",
              isTemporary: false,
              defeatsAtEndOfTurn: false,
            },
            {
              id: "temporary-power",
              targetKind: "card",
              targetId: "target",
              sourceName: "Program",
              label: "+2 PWR",
              detail: "This turn",
              effectKind: "powerModifier",
              tone: "buff",
              isTemporary: true,
              defeatsAtEndOfTurn: false,
            },
          ].map((activeEffect) => ({ activeEffects: [activeEffect] })),
        ],
      },
    ]);

    expect(effects.map((effect) => effect.id)).toEqual(["temporary-power"]);
    expect(effects[0]?.ownerSide).toBe("player");
  });
});
