import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03MAVTactics106 } from "./106-m-a-v-tactics.ts";

describe("M.A.V. Tactics (GD03-106)", () => {
  it("【Main】 deploys rested GQuuuuuuX and Red Gundam Clan tokens", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03MAVTactics106],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd03MAVTactics106));

    const tokens = p1.getCardsInZone("battleArea");
    expect(tokens.length).toBe(2);
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const defs = tokens.map((id) => framework.cards.getDefinition(id));
    expect(defs.map((def) => def?.name)).toEqual(["GQuuuuuuX (Omega Psycommu)", "Red Gundam"]);
    expect(defs.map((def) => ("ap" in def! ? def!.ap : undefined))).toEqual([3, 2]);
    expect(defs.map((def) => ("hp" in def! ? def!.hp : undefined))).toEqual([2, 3]);
    expect(tokens.every((id) => engine.getG().exhausted[id] === true)).toBe(true);
  });

  it("cannot be played during the action step because it is main-only", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03MAVTactics106],
      resourceArea: activeResources(6),
    });
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd03MAVTactics106), "WRONG_TIMING");
  });
});
