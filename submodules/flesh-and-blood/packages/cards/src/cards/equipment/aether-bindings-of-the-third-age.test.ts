import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { aetherBindingsOfTheThirdAge } from "./aether-bindings-of-the-third-age.ts";

describe("Aether Bindings of the Third Age (ROS163) AAA", () => {
  it("happy: Instant destroys this from arms", () => {
    const game = FabTestEngine.start(
      { hero: kano, arms: [aetherBindingsOfTheThirdAge], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    Kano.activate(aetherBindingsOfTheThirdAge);
    game.untilIdle();
    expectFabCard(Kano, aetherBindingsOfTheThirdAge).toBeIn("graveyard");
  });

  it("boundary: Dash cannot activate Kano's arms", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: kano, arms: [aetherBindingsOfTheThirdAge], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() => game.as(dash).activate(aetherBindingsOfTheThirdAge)).toThrow();
    expectFabCard(game.as(kano), aetherBindingsOfTheThirdAge).toBeIn("arms");
  });
});
