import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { gobletOfBloodrunWineBlue } from "./goblet-of-bloodrun-wine.ts";

describe("Goblet of Bloodrun Wine (HVY133) AAA", () => {
  it("happy: creates an Agility and a Vigor token and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, hand: [gobletOfBloodrunWineBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dorinthea = game.as(dorinthea);

    Dorinthea.play(gobletOfBloodrunWineBlue);
    game.helpers.resolveUntilIdle();

    expect(Dorinthea.zone("arena")).toContain("token:agility");
    expect(Dorinthea.zone("arena")).toContain("token:vigor");
    expectFabCard(Dorinthea, gobletOfBloodrunWineBlue).toBeIn("graveyard");
    expectFabPlayer(Dorinthea).toHaveAP(1);
  });

  it("boundary: the tokens seat under the controller, not the opponent", () => {
    const game = FabTestEngine.start(
      { hero: dorinthea, hand: [gobletOfBloodrunWineBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dorinthea = game.as(dorinthea);
    const Dash = game.as(dash);

    Dorinthea.play(gobletOfBloodrunWineBlue);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arena")).not.toContain("token:agility");
    expect(Dash.zone("arena")).not.toContain("token:vigor");
    expect(Dorinthea.zone("arena").filter((id) => id === "token:agility")).toHaveLength(1);
    expect(Dorinthea.zone("arena").filter((id) => id === "token:vigor")).toHaveLength(1);
  });
});
