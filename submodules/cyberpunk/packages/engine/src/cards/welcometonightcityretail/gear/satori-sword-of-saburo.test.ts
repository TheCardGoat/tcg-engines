import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailSatoriSwordOfSaburo,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Satori — Sword of Saburo (retail)", () => {
  it("draws 1 after the equipped attacker wins a fight against a rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        // Swordwise Huscle (5) > Corpo Security (2)
        deck: [alphaCorpoSecurity],
        field: [
          {
            card: alphaSwordwiseHuscle,
            spent: false,
            playedThisTurn: false,
            attachedGears: [welcomeToNightCityRetailSatoriSwordOfSaburo],
          },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attackUnit(alphaSwordwiseHuscle, alphaCorpoSecurity, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });

  it("does not draw on a direct attack (no fight, no win-fight trigger)", () => {
    // Printed text: "When this Unit wins a fight against a rival Unit, draw 1."
    // A direct attack on the rival doesn't enter the fight step, so the
    // win-fight trigger never fires even though the attacker "wins".
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaCorpoSecurity],
        field: [
          {
            card: alphaSwordwiseHuscle,
            spent: false,
            playedThisTurn: false,
            attachedGears: [welcomeToNightCityRetailSatoriSwordOfSaburo],
          },
        ],
      },
      {
        // No ready rival units → direct attack is the only option.
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
  });
});
