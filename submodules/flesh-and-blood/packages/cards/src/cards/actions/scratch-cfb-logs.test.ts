import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { snatchRed } from "./snatch.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { callForBackupRed } from "./call-for-backup.ts";

describe("scratch: Call for Backup player logs", () => {
  it("dumps both seats' narratives", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [callForBackupRed],
        graveyard: [snatchRed, woundingBlowBlue, commandAndConquerRed],
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Bravo.defendWith(callForBackupRed);
    game.passBoth();
    Bravo.targetRequired(snatchRed, woundingBlowBlue);
    Dash.targetRequired(snatchRed);

    for (const viewerId of [Dash.id, Bravo.id]) {
      console.log(`\n=== viewer ${viewerId} ===`);
      for (const line of game.renderedPlayerNarrative(viewerId)) {
        console.log(line);
      }
    }
    console.log("\n=== raw player log entries ===");
    for (const entry of game.playerLogs()) {
      console.log(`${entry.actorId} [${entry.move}] ${entry.message}`);
    }
    expect(true).toBe(true);
  });
});
