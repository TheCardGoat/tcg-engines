import { describe, expect, it } from "vite-plus/test";

import { listLegalCommands } from "./legal-commands/index.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { prism } from "../../../cards/src/cards/heroes/prism.ts";
import { astralEtchingsRed } from "../../../cards/src/cards/actions/astral-etchings.ts";
import { sigilOfProtectionYellow } from "../../../cards/src/cards/actions/sigil-of-protection.ts";
import { widespreadAnnihilationBlue } from "../../../cards/src/cards/actions/widespread-annihilation.ts";
import { runechant } from "../../../cards/src/cards/tokens/runechant.ts";
import { spectralShield } from "../../../cards/src/cards/tokens/spectral-shield.ts";

describe("CR 5.1.3d play-permission selection", () => {
  it("enumerates ordinary and granted timing as distinct authoritative commands", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [astralEtchingsRed],
        arena: [sigilOfProtectionYellow, spectralShield],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actor = game.as(prism);
    const commands = listLegalCommands(game.getRuntime(), actor.id).filter(
      (command) =>
        command.move === "begin-play" &&
        command.sourceInstanceId !== undefined &&
        game.getState().objects[command.sourceInstanceId]?.canonicalId ===
          astralEtchingsRed.canonicalId,
    );

    expect(commands).toHaveLength(2);
    expect(commands.map((command) => command.payload.playPermissionId)).toEqual([
      "base",
      expect.stringMatching(/#/),
    ]);
    expect(commands.map((command) => command.label)).toEqual([
      expect.stringContaining("normally"),
      expect.stringContaining("as an instant"),
    ]);
  });

  it("enumerates Rune Gate as the explicit method for a legal banished play", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        banished: [widespreadAnnihilationBlue],
        arena: [runechant, runechant, runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actor = game.as(prism);
    const command = listLegalCommands(game.getRuntime(), actor.id).find(
      (candidate) =>
        candidate.move === "begin-play" &&
        candidate.sourceInstanceId !== undefined &&
        game.getState().objects[candidate.sourceInstanceId]?.canonicalId ===
          widespreadAnnihilationBlue.canonicalId,
    );

    expect(command?.payload.playPermissionId).toBe("keyword:rune-gate");
  });
});
