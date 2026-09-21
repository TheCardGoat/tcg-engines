import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dromai } from "../heroes/dromai.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { vaporizeShockYellow } from "./vaporize-shock.ts";
import { sigilOfAetherBlue } from "./sigil-of-aether.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

describe("Sigil of Aether (ROS168)", () => {
  for (const recipient of ["hero", "ally"] as const) {
    it(`leaves at own action phase and damages ${recipient}, then amps only the next packet`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [sigilOfAetherBlue, vaporizeShockYellow, vaporizeShockYellow],
          resourcePoints: 0,
          actionPoints: 1,
          deck: padding(),
        },
        {
          hero: dromai,
          life: 20,
          hand: [],
          arena: [aetherAshwing],
          resourcePoints: 0,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dromai = game.as(dromai);
      Oscilio.play(sigilOfAetherBlue);
      game.passBoth();
      expectFabCard(Oscilio, sigilOfAetherBlue).toBeIn("arena");
      expectFabPlayer(Dromai).toHaveLife(20).toHaveTokenCount("aether-ashwing", 1);
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0);
      Oscilio.endTurn();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabCard(Oscilio, sigilOfAetherBlue).toBeIn("arena");
      expectFabPlayer(Dromai).toHaveLife(20).toBeActive();
      Dromai.endTurn();
      game.untilIdle({ optionals: "throw", entityTargets: "pause" });
      Oscilio.targetRequired(recipient === "hero" ? Dromai : Dromai.ref(aetherAshwing));
      game.passBoth();
      if (recipient === "hero") Dromai.chooseOptions();
      game.untilIdle({ optionals: "throw", entityTargets: "throw" });
      expectFabCard(Oscilio, sigilOfAetherBlue).toBeIn("graveyard");
      expectFabPlayer(Dromai)
        .toHaveLife(recipient === "hero" ? 19 : 20)
        .toHaveTokenCount("aether-ashwing", recipient === "hero" ? 1 : 0);
      Oscilio.play(vaporizeShockYellow, {
        playMethod: { kind: "face", face: "right" },
        target: Dromai,
      });
      game.passBoth();
      if (recipient === "hero") Dromai.chooseOptions();
      expectFabPlayer(Dromai).toHaveLife(recipient === "hero" ? 17 : 18);
      Oscilio.play(vaporizeShockYellow, {
        playMethod: { kind: "face", face: "right" },
        target: Dromai,
      });
      game.passBoth();
      if (recipient === "hero") Dromai.chooseOptions();
      expectFabPlayer(Dromai).toHaveLife(recipient === "hero" ? 16 : 17);
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0).toHaveHandCount(2);
      expectWait(game).toBeIdle();
    });
  }
});
