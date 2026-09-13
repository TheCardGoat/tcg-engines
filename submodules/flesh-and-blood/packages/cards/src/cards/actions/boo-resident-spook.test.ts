import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { booResidentSpookYellow } from "./boo-resident-spook.ts";

describe("Boo, Resident Spook (PEN156) AAA", () => {
  it("happy: untapped Boo has Spellvoid 2", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, arena: [booResidentSpookYellow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabCard(game.as(gravyBones), booResidentSpookYellow).toHaveKeyword("spellvoid");
  });

  it("boundary: a tapped Boo does not have Spellvoid", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, arena: [booResidentSpookYellow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(booResidentSpookYellow, {
      abilityId: `${booResidentSpookYellow.canonicalId}:actionAttack`,
    });
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, booResidentSpookYellow).toBeTapped();
    expectFabCard(Gravy, booResidentSpookYellow).notToHaveKeyword("spellvoid");
  });

  it("timing: tap-Attack returns Boo to the arena", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, arena: [booResidentSpookYellow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(booResidentSpookYellow, {
      abilityId: `${booResidentSpookYellow.canonicalId}:actionAttack`,
    });
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, booResidentSpookYellow).toBeIn("arena");
  });
});
