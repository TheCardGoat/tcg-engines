import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "../actions/barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultYellow } from "../actions/brutal-assault.ts";
import { hoistEmUpRed } from "./hoist-em-up.ts";

/**
 * Hoist 'Em Up, Red (SEA055) — Pirate Necromancer Block, 4{d}.
 * Printed: When this defends, you may {t} an ally you control. If you do, this
 * gets +1{d}.
 */

describe("Hoist 'Em Up (SEA055) AAA", () => {
  it("happy: tapping an ally you control grants +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultYellow], deck: 6 },
      {
        hero: gravyBones,
        hand: [hoistEmUpRed],
        arena: [barnacleYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).attackWith(brutalAssaultYellow);
    Gravy.defendWith(hoistEmUpRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Gravy.target(barnacleYellow);

    expectFabCard(Gravy, barnacleYellow).toBeTapped();
    expectFabCard(Gravy, hoistEmUpRed).toHaveDefense(5);
    expectFabPlayer(Gravy).toHaveLife(20);
  });

  it("boundary: declining the tap leaves printed 4{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultYellow], deck: 6 },
      {
        hero: gravyBones,
        hand: [hoistEmUpRed],
        arena: [barnacleYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).attackWith(brutalAssaultYellow);
    Gravy.defendWith(hoistEmUpRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Gravy, barnacleYellow).toBeIn("arena");
    expectFabCard(Gravy, hoistEmUpRed).toHaveDefense(4);
    expectFabPlayer(Gravy).toHaveLife(19);
  });

  it("timing: with no ally the optional cannot grant +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultYellow], deck: 6 },
      { hero: gravyBones, hand: [hoistEmUpRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).attackWith(brutalAssaultYellow);
    Gravy.defendWith(hoistEmUpRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Gravy, hoistEmUpRed).toHaveDefense(4);
    expectFabPlayer(Gravy).toHaveLife(19);
  });
});
