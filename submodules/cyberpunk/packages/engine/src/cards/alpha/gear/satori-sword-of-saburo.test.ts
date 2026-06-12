import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaSatoriSwordOfSaburo,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Satori - Sword of Saburo", () => {
  it("draws after the equipped attacker wins a fight against a rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaCorpoSecurity],
        field: [
          {
            card: alphaTBugAmateurPhilosopher,
            spent: false,
            playedThisTurn: false,
            attachedGears: [alphaSatoriSwordOfSaburo],
          },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.attackUnit(alphaTBugAmateurPhilosopher, alphaCorpoSecurity, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });
});
