import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09EustassCaptainKid075,
  op10EustassCaptainKid099,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe('OP09-075 Eustass"Captain"Kid', () => {
  test("may take the top Life before adding one active DON!! with a Kid Pirates Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10EustassCaptainKid099,
      hand: [op09EustassCaptainKid075],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op09EustassCaptainKid075.cost,
      donDeckCount: 1,
    });
    const topLifeId = engine.getState().players.south.life[0]!;

    engine.playCard(op09EustassCaptainKid075, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Kid's add-DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    expect(view.players.south).toMatchObject({ lifeCount: 1, activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the Life cost with another Leader but does not add DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09EustassCaptainKid075],
      life: [eb01Doma005],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op09EustassCaptainKid075.cost,
      donDeckCount: 1,
    });

    engine.playCard(op09EustassCaptainKid075, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ lifeCount: 0, activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
