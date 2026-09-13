import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { anothos } from "../weapons/anothos.ts";
import { halaBladesaintOfTheVow } from "./hala-bladesaint-of-the-vow.ts";

describe("Hala, Bladesaint of the Vow (AHA001) AAA", () => {
  it("happy: pay 3 and tap to Sharpen a sword you control", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [dawnbladeResplendent],
        hand: [],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(halaBladesaintOfTheVow);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Hala, dawnbladeResplendent).toHavePower(3);
    expectFabPlayer(Hala).toHaveAP(1);
    expectFabPlayer(Hala).toHaveResourceCount(0);
  });

  it("boundary: a hammer is not a legal Sharpen target", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        weapon1: [anothos],
        hand: [],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(halaBladesaintOfTheVow);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Hala, anothos).toHavePower(4);
  });
});
