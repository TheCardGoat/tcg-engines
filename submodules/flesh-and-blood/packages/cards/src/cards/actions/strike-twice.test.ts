import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { dromai } from "../heroes/dromai.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nullruneGloves } from "../equipment/nullrune-gloves.ts";
import { vaporizeShockYellow } from "../instants/vaporize-shock.ts";
import { snatchRed } from "./snatch.ts";
import { strikeTwiceRed } from "./strike-twice.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

describe("Strike Twice (PEN238)", () => {
  it("as an action deals three arcane and consumes its action point", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [strikeTwiceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: dash, life: 20, hand: [], resourcePoints: 0, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);
    Oscilio.play(strikeTwiceRed, { target: Dash });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0).toHaveLife(20);
    expectFabCard(Oscilio, strikeTwiceRed).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("without prior damage cannot bypass zero action points", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [strikeTwiceRed],
        resourcePoints: 1,
        actionPoints: 0,
        deck: padding(),
      },
      { hero: dash, life: 20, hand: [], resourcePoints: 0, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);
    expectFabUnplayable(() => Oscilio.play(strikeTwiceRed, { target: Dash }), /action.point/i);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(1).toHaveHandCount(1);
    expectFabCard(Oscilio, strikeTwiceRed).toBeIn("hand");
    expectWait(game).toBeIdle();
  });

  it("without prior damage cannot respond to an opposing attack as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: 20,
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: oscilio, life: 20, hand: [strikeTwiceRed], resourcePoints: 1, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oscilio = game.as(oscilio);
    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    expectFabUnplayable(
      () => Oscilio.play(strikeTwiceRed, { target: Dash }),
      /action card is not legal in the current layer position/i,
    );
    expectFabCard(Oscilio, strikeTwiceRed).toBeIn("hand");
    expectFabPlayer(Oscilio).toHaveResourceCount(1).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(20);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Oscilio).toHaveLife(16);
    expectWait(game).toBeIdle();
  });

  for (const recipient of ["self", "opponent"] as const) {
    it(`first Strike Twice hits ${recipient}: only opposing-hero damage grants instant timing`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [strikeTwiceRed, strikeTwiceRed],
          resourcePoints: 2,
          actionPoints: 1,
          deck: padding(),
        },
        { hero: dash, life: 20, hand: [], resourcePoints: 0, deck: padding() },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dash = game.as(dash);
      Oscilio.play(strikeTwiceRed, { target: recipient === "self" ? Oscilio : Dash });
      game.passBoth();
      expectFabPlayer(Oscilio)
        .toHaveAP(0)
        .toHaveResourceCount(1)
        .toHaveLife(recipient === "self" ? 17 : 20);
      expectFabPlayer(Dash).toHaveLife(recipient === "self" ? 20 : 17);
      const remaining = Oscilio.cardIn("hand", strikeTwiceRed);
      if (recipient === "self") {
        expectFabUnplayable(() => Oscilio.play(remaining, { target: Dash }), /action.point/i);
        expectFabCard(Oscilio, remaining).toBeIn("hand");
        expectFabPlayer(Oscilio)
          .toHaveAP(0)
          .toHaveResourceCount(1)
          .toHaveHandCount(1)
          .toHaveLife(17);
        expectFabPlayer(Dash).toHaveLife(20);
      } else {
        Oscilio.play(remaining, { target: Dash });
        game.passBoth();
        expectFabPlayer(Dash).toHaveLife(14);
        expectFabPlayer(Oscilio)
          .toHaveAP(0)
          .toHaveResourceCount(0)
          .toHaveHandCount(0)
          .toHaveLife(20);
        expectFabCard(Oscilio, remaining).toBeIn("graveyard");
      }
      expectWait(game).toBeIdle();
    });
  }
  for (const prevent of [true, false]) {
    it(`Arcane Barrier ${prevent ? "prevents" : "does not prevent"} Shock: only dealt damage enables instant play`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [vaporizeShockYellow, snatchRed, strikeTwiceRed],
          resourcePoints: 1,
          actionPoints: 1,
          deck: padding(),
        },
        {
          hero: dash,
          life: 20,
          hand: [],
          arms: [nullruneGloves],
          resourcePoints: 1,
          deck: padding(),
        },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Dash = game.as(dash);
      Oscilio.play(vaporizeShockYellow, {
        playMethod: { kind: "face", face: "right" },
        targetInstanceId: Dash.ref(dash).instanceId,
      });
      game.passBoth();
      if (prevent) Dash.choose("arcane-barrier");
      else Dash.chooseOptions();
      expectFabPlayer(Dash)
        .toHaveLife(prevent ? 20 : 19)
        .toHaveResourceCount(prevent ? 0 : 1);
      expectFabCard(Dash, nullruneGloves).toBeIn("arms");
      Oscilio.playAttack(snatchRed);
      game.closeCombat({ optionals: "throw" });
      expectFabPlayer(Oscilio).toHaveAP(0).toHaveHandCount(2);
      expectFabPlayer(Dash).toHaveLife(prevent ? 16 : 15);
      if (prevent) {
        expectFabUnplayable(() => Oscilio.play(strikeTwiceRed, { target: Dash }), /action.point/i);
        expectFabCard(Oscilio, strikeTwiceRed).toBeIn("hand");
        expectFabPlayer(Oscilio).toHaveResourceCount(1).toHaveHandCount(2);
      } else {
        Oscilio.play(strikeTwiceRed, { target: Dash });
        game.passBoth();
        Dash.chooseOptions();
        expectFabPlayer(Dash).toHaveLife(12).toHaveResourceCount(1);
        expectFabPlayer(Oscilio).toHaveResourceCount(0).toHaveHandCount(1);
        expectFabCard(Oscilio, strikeTwiceRed).toBeIn("graveyard");
      }
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0);
      expectWait(game).toBeIdle();
    });
  }

  for (const recipient of ["ally", "hero"] as const) {
    it(`Shock hits opposing ${recipient}: only hero damage enables Strike at zero AP`, () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          life: 20,
          hand: [vaporizeShockYellow, strikeTwiceRed],
          resourcePoints: 1,
          actionPoints: 0,
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
      Oscilio.play(vaporizeShockYellow, {
        playMethod: { kind: "face", face: "right" },
        targetInstanceId:
          recipient === "ally"
            ? Dromai.ref(aetherAshwing).instanceId
            : Dromai.ref(dromai).instanceId,
      });
      game.passBoth();
      expectFabPlayer(Dromai).toHaveLife(recipient === "ally" ? 20 : 19);
      expectFabCard(Oscilio, vaporizeShockYellow).toBeIn("graveyard");
      if (recipient === "ally") {
        expectFabPlayer(Dromai).toHaveTokenCount("aether-ashwing", 0);
        expectFabUnplayable(
          () => Oscilio.play(strikeTwiceRed, { target: Dromai }),
          /action.point/i,
        );
        expectFabCard(Oscilio, strikeTwiceRed).toBeIn("hand");
        expectFabPlayer(Oscilio).toHaveResourceCount(1).toHaveHandCount(1);
      } else {
        expectFabCard(Dromai, aetherAshwing).toBeIn("arena");
        Oscilio.play(strikeTwiceRed, { target: Dromai });
        game.passBoth();
        expectFabPlayer(Dromai).toHaveLife(16);
        expectFabCard(Oscilio, strikeTwiceRed).toBeIn("graveyard");
        expectFabPlayer(Oscilio).toHaveResourceCount(0).toHaveHandCount(0);
      }
      expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0);
      expectWait(game).toBeIdle();
    });
  }

  it("any target includes an opposing ally without enabling instant timing", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [strikeTwiceRed, strikeTwiceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: dromai,
        life: 20,
        hand: [],
        arena: [aetherAshwing],
        arms: [nullruneGloves],
        resourcePoints: 0,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dromai = game.as(dromai);
    Oscilio.play(strikeTwiceRed, { targetInstanceId: Dromai.ref(aetherAshwing).instanceId });
    game.passBoth();
    expectFabPlayer(Dromai).toHaveLife(20).toHaveTokenCount("aether-ashwing", 0);
    expectFabCard(Dromai, nullruneGloves).toBeIn("arms");
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0).toHaveResourceCount(1).toHaveHandCount(1);
    const remaining = Oscilio.cardIn("hand", strikeTwiceRed);
    expectFabUnplayable(() => Oscilio.play(remaining, { target: Dromai }), /action.point/i);
    expectFabCard(Oscilio, remaining).toBeIn("hand");
    expectWait(game).toBeIdle();
  });

  it("any target excludes nonliving equipment without spending costs", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [strikeTwiceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: dromai,
        life: 20,
        hand: [],
        arena: [aetherAshwing],
        arms: [nullruneGloves],
        resourcePoints: 0,
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dromai = game.as(dromai);
    // Explicit public play drive leaves non-forced target selection to the player.
    game.playInstance(Oscilio.id, Oscilio.ref(strikeTwiceRed).instanceId, {}, "explicit");
    expect(() => Oscilio.targetRequired(Dromai.ref(nullruneGloves))).toThrow(/not a legal target/i);
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(1).toHaveHandCount(1);
    expectFabPlayer(Dromai).toHaveLife(20).toHaveTokenCount("aether-ashwing", 1);
    expectFabCard(Dromai, nullruneGloves).toBeIn("arms");
    expectFabCard(Oscilio, strikeTwiceRed).toBeIn("hand");
    Oscilio.targetRequired(Dromai);
    game.passBoth();
    expectFabPlayer(Dromai).toHaveLife(17).toHaveTokenCount("aether-ashwing", 1);
    expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0).toHaveHandCount(0);
    expectFabCard(Oscilio, strikeTwiceRed).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });
});
