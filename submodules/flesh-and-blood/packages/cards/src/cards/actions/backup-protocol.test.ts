import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { fenderBenderBlue } from "./fender-bender.ts";
import { pulsewaveProtocolYellow } from "./pulsewave-protocol.ts";
import { backupProtocolBlue } from "./backup-protocol.ts";
import { fenderBenderRed } from "./fender-bender.ts";
import { backupProtocolRed } from "./backup-protocol.ts";
import { backupProtocolYellow } from "./backup-protocol.ts";

describe("Backup Protocol: BLUE (EVO083) AAA", () => {
  it("happy: Instant destroy this to return a blue Mechanologist AAC from graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolBlue, state: { steamCounters: 1 } }],
        graveyard: [fenderBenderBlue],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(backupProtocolBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, backupProtocolBlue).toBeIn("graveyard");
    expectFabCard(Teklo, fenderBenderBlue).toBeIn("hand");
  });

  it("boundary: a yellow Mechanologist AAC stays in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolBlue, state: { steamCounters: 1 } }],
        graveyard: [pulsewaveProtocolYellow],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(backupProtocolBlue);
    game.untilIdle();

    expectFabCard(Teklo, pulsewaveProtocolYellow).toBeIn("graveyard");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolBlue, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, backupProtocolBlue).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, backupProtocolBlue).toBeIn("arena");
  });
});

describe("Backup Protocol: RED (EVO081) AAA", () => {
  it("happy: Instant destroy this to return a red Mechanologist AAC from graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolRed, state: { steamCounters: 1 } }],
        graveyard: [fenderBenderRed],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(backupProtocolRed);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, backupProtocolRed).toBeIn("graveyard");
    expectFabCard(Teklo, fenderBenderRed).toBeIn("hand");
  });

  it("boundary: a yellow Mechanologist AAC stays in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolRed, state: { steamCounters: 1 } }],
        graveyard: [pulsewaveProtocolYellow],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(backupProtocolRed);
    game.untilIdle();

    expectFabCard(Teklo, pulsewaveProtocolYellow).toBeIn("graveyard");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolRed, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, backupProtocolRed).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, backupProtocolRed).toBeIn("arena");
  });
});

describe("Backup Protocol: YELLOW (EVO082) AAA", () => {
  it("happy: Instant destroy this to return a yellow Mechanologist AAC from graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolYellow, state: { steamCounters: 1 } }],
        graveyard: [pulsewaveProtocolYellow],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(backupProtocolYellow);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, backupProtocolYellow).toBeIn("graveyard");
    expectFabCard(Teklo, pulsewaveProtocolYellow).toBeIn("hand");
  });

  it("boundary: a red Mechanologist AAC stays in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolYellow, state: { steamCounters: 1 } }],
        graveyard: [fenderBenderRed],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.activate(backupProtocolYellow);
    game.untilIdle();

    expectFabCard(Teklo, fenderBenderRed).toBeIn("graveyard");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: backupProtocolYellow, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, backupProtocolYellow).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, backupProtocolYellow).toBeIn("arena");
  });
});
