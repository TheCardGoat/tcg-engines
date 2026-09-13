import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05ChadChadan096 } from "./096-chad-chadan.ts";

describe("Chad Chadan (GD05-096)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05ChadChadan096);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05ChadChadan096],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05ChadChadan096, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("may damage its host after attacking to recover another Tekkadan Unit", () => {
    const host = createMockUnit({ ap: 2, hp: 5, traits: ["tekkadan"] });
    const recoveryTarget = createMockUnit({ hp: 5, traits: ["tekkadan"] });
    const outsider = createMockUnit({ hp: 5, traits: ["earth federation"] });
    const enemy = createMockUnit({ ap: 0, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05ChadChadan096],
        play: [host, { card: recoveryTarget, damage: 1 }, { card: outsider, damage: 1 }],
        resourceArea: activeResources(3),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, recoveryId, outsiderId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05ChadChadan096, hostId!));
    expectSuccess(p1.enterBattle(hostId!, enemyId));
    const optional = p1.getBoardView().pendingChoice;
    expect(optional).toMatchObject({ kind: "optional" });
    if (optional?.kind !== "optional") throw new Error("Expected Chad's optional damage choice");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [recoveryId],
    });
    expectSuccess(p1.resolveEffect({ targets: [recoveryId!] }));

    expect(p1.getDamage(hostId!)).toBe(1);
    expect(p1.getDamage(recoveryId!)).toBe(0);
    expect(p1.getDamage(outsiderId!)).toBe(1);
  });
});
