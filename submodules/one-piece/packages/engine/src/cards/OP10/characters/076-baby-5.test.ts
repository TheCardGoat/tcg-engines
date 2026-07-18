import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op05DonquixoteRosinante022,
  op10Baby5076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-076 Baby 5", () => {
  test("after trashing a hand card, an included Donquixote Leader adds one active DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05DonquixoteRosinante022,
      hand: [op10Baby5076, eb01Doma005, eb01Fourtricks025],
      activeDon: op10Baby5076.cost,
      donDeckCount: 1,
    });
    const trashedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op10Baby5076, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (payment?.kind !== "payCost") throw new Error("Expected Baby 5's hand-trash cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [trashedId] }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedId);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 3, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may trash the card before a nonmatching Leader prevents the DON!! addition", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Baby5076, eb01Doma005, eb01Fourtricks025],
      activeDon: op10Baby5076.cost,
      donDeckCount: 1,
    });
    const trashedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op10Baby5076, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [trashedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
