import { describe, expect, it } from "vite-plus/test";
import {
  boxTopperRetailVCorporateExile,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Sandevistan (retail)", () => {
  it("readies the equipped Unit host at the end of its controller's turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          spent: true,
          playedThisTurn: false,
          attachedGears: [welcomeToNightCityRetailSandevistan],
        },
      ],
    });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      true,
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
  });

  it("readies an equipped face-up Legend at the end of its controller's turn", () => {
    // Printed text: "(Equip to a friendly Unit or face-up Legend.) At the end
    // of your turn, ready this Unit or Legend." Exercise the Legend branch.
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: boxTopperRetailVCorporateExile,
          faceDown: false,
          attachedGears: [welcomeToNightCityRetailSandevistan],
        },
      ],
    });

    // Fixture setup auto-readies legends; spend it explicitly so Sandevistan
    // has work to do at end of turn.
    engine.judgeSpendCard(boxTopperRetailVCorporateExile, { as: P1 });
    expect(engine.getCard(boxTopperRetailVCorporateExile, "legendArea", P1).meta.spent).toBe(true);

    engine.completeTurn({ as: P1 });

    expect(engine.getCard(boxTopperRetailVCorporateExile, "legendArea", P1).meta.spent).toBe(false);
  });
});
