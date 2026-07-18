import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05ZoroJuurou067 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-067 Zoro-Juurou", () => {
  test("at three Life, may add one active DON!! when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05ZoroJuurou067, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025, eb01Doma005],
        donDeckCount: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zoroId = engine.findCardInZone("south", "character", op05ZoroJuurou067);

    engine.declareAttack(zoroId, engine.leader("north"), "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Zoro-Juurou's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("above three Life, attacking does not offer or add DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05ZoroJuurou067, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
        donDeckCount: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zoroId = engine.findCardInZone("south", "character", op05ZoroJuurou067);

    engine.declareAttack(zoroId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
