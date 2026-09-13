import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FabTestEngine,
} from "../../../../engine/src/testing/index.ts";
import { dash } from "../heroes/dash.ts";
import { copper } from "../tokens/copper.ts";
import { gold } from "../tokens/gold.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { cintariSellsword } from "../tokens/cintari-sellsword.ts";
import { raiseAnArmyYellow } from "./raise-an-army.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Raise an Army (HVY105)", () => {
  it("declares X, destroys exactly the chosen Gold, and creates X Sellswords", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [raiseAnArmyYellow],
        arena: [gold, gold, gold, copper],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // Arrange — three legal Gold and one similarly named resource token are
    // controlled; X and the exact payers have not yet been declared.
    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", raiseAnArmyYellow) },
    });
    expectWait(game).toHaveDecision("numeric");

    // Act — choose X=2, then choose two exact Gold objects as the cost.
    Kassai.chooseNumeric(2);
    const [firstGold, secondGold] = Kassai.cardsIn("arena", gold);
    Kassai.chooseTargets(firstGold!, secondGold!);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.passBoth();

    // Assert — payment and connected X resolution agree exactly; the third
    // Gold and Copper remain and the action's go again refunds the AP.
    expect(Kassai.cardsIn("arena", gold)).toHaveLength(1);
    expect(Kassai.cardsIn("arena", copper)).toHaveLength(1);
    expectFabPlayer(Kassai).toHaveTokenCount("cintari-sellsword", 2);
    expectFabCard(Kassai, raiseAnArmyYellow).toBeIn("graveyard");
    expectFabPlayer(Kassai).toHaveAP(1);
  });

  it("allows X=0 without destroying resources or creating Sellswords", () => {
    const game = FabTestEngine.start(
      { hero: kassaiOfTheGoldenSand, hand: [raiseAnArmyYellow], arena: [gold], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // Arrange / Act — declare the legal zero value and resolve the action.
    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", raiseAnArmyYellow) },
    });
    Kassai.chooseNumeric(0);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.passBoth();

    // Assert — X=0 is retained through resolution and no cost target prompt
    // or token movement is synthesized.
    expect(Kassai.cardsIn("arena", gold)).toHaveLength(1);
    expect(Kassai.cardsIn("arena", cintariSellsword)).toHaveLength(0);
    expectFabPlayer(Kassai).toHaveAP(1);
  });

  it("does not count Copper as a legal destroy-X payer", () => {
    const game = FabTestEngine.start(
      { hero: kassaiOfTheGoldenSand, hand: [raiseAnArmyYellow], arena: [gold, copper], deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.exec({
      move: "begin-play",
      payload: { instanceId: Kassai.findCardInZone("hand", raiseAnArmyYellow) },
    });

    expectWait(game).toHaveDecision("numeric");
    expect(() => Kassai.chooseNumeric(2)).toThrow();
  });
});
