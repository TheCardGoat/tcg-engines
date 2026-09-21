import { nimblismBlue } from "../actions/nimblism.ts";
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
  expectWait,
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
      {
        hero: dash,
        resourcePoints: 2,
        hand: [brutalAssaultYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: gravyBones,
        life: 20,
        hand: [hoistEmUpRed],
        arena: [barnacleYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).playAttack(brutalAssaultYellow);
    Gravy.defendWith(hoistEmUpRed);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.accept();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Gravy, barnacleYellow).toBeTapped();
    expectFabCard(Gravy, hoistEmUpRed).toHaveDefense(5);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Gravy).toHaveLife(20);
    expectFabCard(Gravy, hoistEmUpRed).toBeIn("graveyard").toHaveDefense(4);
    expectCombat(game).toBeClosed();
  });

  it("boundary: declining the tap leaves printed 4{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        resourcePoints: 2,
        hand: [brutalAssaultYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: gravyBones,
        life: 20,
        hand: [hoistEmUpRed],
        arena: [barnacleYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).playAttack(brutalAssaultYellow);
    Gravy.defendWith(hoistEmUpRed);
    game.advanceToDecision(Gravy, "boolean");
    Gravy.decline();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Gravy, barnacleYellow).toBeIn("arena").toBeReady();
    expectFabCard(Gravy, hoistEmUpRed).toHaveDefense(4);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Gravy).toHaveLife(19);
    expectFabCard(Gravy, hoistEmUpRed).toBeIn("graveyard").toHaveDefense(4);
    expectWait(game).notToHaveDecision();
  });

  it("timing: with no ally the optional cannot grant +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        resourcePoints: 2,
        hand: [brutalAssaultYellow],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: gravyBones,
        life: 20,
        hand: [hoistEmUpRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).playAttack(brutalAssaultYellow);
    Gravy.defendWith(hoistEmUpRed);
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Gravy, hoistEmUpRed).toHaveDefense(4);
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Gravy).toHaveLife(19);
    expectFabCard(Gravy, hoistEmUpRed).toBeIn("graveyard").toHaveDefense(4);
    expectWait(game).notToHaveDecision();
  });
});
