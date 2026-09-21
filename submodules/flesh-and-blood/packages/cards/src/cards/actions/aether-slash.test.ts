import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dromai } from "../heroes/dromai.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { nullruneGloves } from "../equipment/nullrune-gloves.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { aetherSlashRed, aetherSlashYellow, aetherSlashBlue } from "./aether-slash.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];
const variants = [
  { color: "red", card: aetherSlashRed, power: 4 },
  { color: "yellow", card: aetherSlashYellow, power: 3 },
  { color: "blue", card: aetherSlashBlue, power: 2 },
] as const;

for (const { color, card, power } of variants) {
  describe(`Aether Slash ${color}`, () => {
    for (const target of ["hero", "ally"] as const) {
      it(`nonattack pitch deals one arcane to ${target} before physical combat`, () => {
        const game = FabTestEngine.start(
          {
            hero: viserai,
            life: 20,
            resourcePoints: 0,
            hand: [card, nimblismBlue],
            actionPoints: 1,
            deck: padding(),
          },
          {
            hero: dromai,
            life: 20,
            resourcePoints: 0,
            hand: [],
            arena: [aetherAshwing],
            arms: [nullruneGloves],
            deck: padding(),
          },
          FAB_MANUAL_HARNESS,
        );
        const Viserai = game.as(viserai);
        const Dromai = game.as(dromai);
        Viserai.playAttack(card, { pitch: [nimblismBlue], stopAt: "on-attack" });
        expect(() => Viserai.targetRequired(Dromai.ref(nullruneGloves))).toThrow(
          /not a legal target/i,
        );
        Viserai.targetRequired(target === "hero" ? Dromai : Dromai.ref(aetherAshwing));
        game.toReaction("defender");
        expectFabPlayer(Dromai)
          .toHaveLife(target === "hero" ? 19 : 20)
          .toHaveTokenCount("aether-ashwing", target === "hero" ? 1 : 0);
        expectCombat(game).toHaveAttackPower(power);
        expectFabPlayer(Viserai).toHaveResourceCount(2).toHaveTokenCount("runechant", 0);
        game.closeCombat({ optionals: "throw" });
        expectFabPlayer(Dromai).toHaveLife(20 - power - (target === "hero" ? 1 : 0));
        expectFabPlayer(Viserai).toHaveLife(20).toHaveAP(0).toHaveHandCount(0);
        expectFabCard(Viserai, card).toBeIn("graveyard");
        expectFabCard(Viserai, nimblismBlue).toBeIn("pitch");
        expectFabCard(Dromai, nullruneGloves).toBeIn("arms");
        expectWait(game).toBeIdle();
      });
    }

    for (const payment of ["attack pitch", "floating resource"] as const) {
      it(`${payment} does not enable the arcane trigger`, () => {
        const game = FabTestEngine.start(
          {
            hero: viserai,
            life: 20,
            resourcePoints: payment === "attack pitch" ? 0 : 1,
            hand: payment === "attack pitch" ? [card, snatchRed] : [card],
            actionPoints: 1,
            deck: padding(),
          },
          {
            hero: dromai,
            life: 20,
            resourcePoints: 0,
            hand: [],
            arena: [aetherAshwing],
            deck: padding(),
          },
          FAB_MANUAL_HARNESS,
        );
        const Viserai = game.as(viserai);
        const Dromai = game.as(dromai);
        Viserai.playAttack(card, {
          ...(payment === "attack pitch" ? { pitch: [snatchRed] } : {}),
          stopAt: "on-attack",
        });
        game.toReaction("defender");
        expectFabPlayer(Dromai).toHaveLife(20).toHaveTokenCount("aether-ashwing", 1);
        expectCombat(game).toHaveAttackPower(power);
        game.closeCombat({ optionals: "throw" });
        expectFabPlayer(Dromai)
          .toHaveLife(20 - power)
          .toHaveTokenCount("aether-ashwing", 1);
        expectFabPlayer(Viserai)
          .toHaveLife(20)
          .toHaveAP(0)
          .toHaveResourceCount(0)
          .toHaveHandCount(0)
          .toHaveTokenCount("runechant", 0);
        expectFabCard(Viserai, card).toBeIn("graveyard");
        if (payment === "attack pitch") expectFabCard(Viserai, snatchRed).toBeIn("pitch");
        expectWait(game).toBeIdle();
      });
    }
  });
}
