import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dromai } from "../heroes/dromai.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { nullruneGloves } from "../equipment/nullrune-gloves.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { vaporizeShockYellow } from "./vaporize-shock.ts";
import { coreReactionBlue, coreReactionRed, coreReactionYellow } from "./core-reaction.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];
const variants = [
  { label: "Core Reaction Red (OMN103)", card: coreReactionRed, amount: 4 },
  { label: "Core Reaction Yellow (OMN104)", card: coreReactionYellow, amount: 3 },
  { label: "Core Reaction Blue (OMN105)", card: coreReactionBlue, amount: 2 },
] as const;

for (const { label, card, amount } of variants) {
  describe(label, () => {
    for (const recipient of ["hero", "ally"] as const) {
      it(`waits for own action phase, then discharges to ${recipient}`, () => {
        const game = FabTestEngine.start(
          {
            hero: oscilio,
            life: 20,
            hand: [card, vaporizeShockYellow],
            resourcePoints: 2,
            actionPoints: 1,
            deck: padding(),
          },
          {
            hero: dromai,
            life: 20,
            hand: [],
            resourcePoints: 0,
            arena: [aetherAshwing],
            arms: [nullruneGloves],
            deck: padding(),
          },
          FAB_MANUAL_HARNESS,
        );
        const Oscilio = game.as(oscilio);
        const Dromai = game.as(dromai);
        Oscilio.play(card);
        game.passBoth();
        expectFabCard(Oscilio, card).toBeIn("arena");
        expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(0);
        expectFabPlayer(Dromai).toHaveLife(20).toHaveTokenCount("aether-ashwing", 1);
        Oscilio.endTurn();
        game.untilIdle({ optionals: "throw", entityTargets: "throw" });
        expectFabCard(Oscilio, card).toBeIn("arena");
        expectFabPlayer(Dromai).toBeActive().toHaveLife(20);
        Dromai.endTurn();
        game.untilIdle({ optionals: "throw", entityTargets: "pause" });
        expect(() => Oscilio.targetRequired(Dromai.ref(nullruneGloves))).toThrow(
          /not a legal target/i,
        );
        Oscilio.targetRequired(recipient === "hero" ? Dromai : Dromai.ref(aetherAshwing));
        game.passBoth();
        if (recipient === "hero") Dromai.chooseOptions();
        game.untilIdle({ optionals: "throw", entityTargets: "throw" });
        expectFabCard(Oscilio, card).toBeIn("graveyard");
        expectFabPlayer(Dromai)
          .toHaveLife(recipient === "hero" ? 20 - amount : 20)
          .toHaveTokenCount("aether-ashwing", recipient === "hero" ? 1 : 0);
        expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toBeActive();
        Oscilio.play(vaporizeShockYellow, {
          playMethod: { kind: "face", face: "right" },
          target: Dromai,
        });
        game.passBoth();
        // Gloves remain even when the Ashwing died, so decline their Barrier too.
        Dromai.chooseOptions();
        expectFabPlayer(Dromai).toHaveLife(recipient === "hero" ? 19 - amount : 19);
        expectFabPlayer(Oscilio)
          .toHaveLife(20)
          .toHaveAP(1)
          .toHaveResourceCount(0)
          .toHaveHandCount(3);
        expectFabCard(Oscilio, vaporizeShockYellow).toBeIn("graveyard");
        expectFabCard(Dromai, nullruneGloves).toBeIn("arms");
        expectWait(game).toBeIdle();
      });
    }
  });
}
