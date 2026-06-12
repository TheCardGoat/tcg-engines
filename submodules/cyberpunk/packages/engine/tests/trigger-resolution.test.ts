import { describe, expect, it } from "vite-plus/test";
import {
  alphaDyingNightVSPistol,
  alphaJackieWellesRideOrDieChoom,
  alphaKiroshiOptics,
  alphaRuthlessLowlife,
  alphaSatoriSwordOfSaburo,
  alphaTBugAmateurPhilosopher,
  alphaVCorporateExile,
  alphaViktorVektorSitDownAndRelax,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../src/testing/index.ts";

registerMatchers();

const highCredGigs: { dieType: "d6" | "d8"; faceValue: number }[] = [
  { dieType: "d8", faceValue: 4 },
  { dieType: "d6", faceValue: 3 },
];

describe("manual trigger resolution", () => {
  it("prompts the controller to choose among multiple ATTACK triggers", () => {
    // Satori intentionally omitted — its trigger fires on `fightResolved`
    // (post-fight), not on attack declaration. See packages/types/src/index.ts
    // FightResolvedEvent.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaTBugAmateurPhilosopher,
            spent: false,
            attachedGears: [alphaKiroshiOptics, alphaDyingNightVSPistol],
          },
        ],
        legendArea: [alphaVCorporateExile],
        gigArea: highCredGigs,
      },
      {
        field: [
          { card: alphaJackieWellesRideOrDieChoom, spent: true },
          {
            card: alphaRuthlessLowlife,
            spent: false,
            attachedGears: [alphaKiroshiOptics],
          },
        ],
      },
    );

    engine.attackUnit(alphaTBugAmateurPhilosopher, alphaJackieWellesRideOrDieChoom);

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") {
      throw new Error("Expected chooseTrigger");
    }
    expect(choice.payload.options.map((option) => option.cardName).sort()).toEqual([
      "Dying Night - V's Pistol",
      "Kiroshi Optics",
    ]);
    expect(engine.getState().G.attackState?.step).toBe("offensive");
  });

  it("lets the controller choose Dying Night's rival Gear target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaTBugAmateurPhilosopher,
            spent: false,
            attachedGears: [alphaSatoriSwordOfSaburo, alphaKiroshiOptics, alphaDyingNightVSPistol],
          },
        ],
        legendArea: [alphaVCorporateExile],
        gigArea: highCredGigs,
      },
      {
        field: [
          { card: alphaJackieWellesRideOrDieChoom, spent: true },
          {
            card: alphaRuthlessLowlife,
            spent: false,
            attachedGears: [alphaKiroshiOptics, alphaDyingNightVSPistol],
          },
        ],
      },
    );

    engine.attackUnit(alphaTBugAmateurPhilosopher, alphaJackieWellesRideOrDieChoom);

    const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (!triggerChoice || triggerChoice.type !== "chooseTrigger") {
      throw new Error("Expected chooseTrigger");
    }
    const dyingNight = triggerChoice.payload.options.find(
      (option) => option.cardName === "Dying Night - V's Pistol",
    );
    expect(dyingNight).toBeDefined();

    engine.executeMove("resolveTrigger", { args: { triggerId: dyingNight!.triggerId } }, P1);

    const targetChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (
      !targetChoice ||
      targetChoice.type !== "chooseTarget" ||
      targetChoice.payload.type !== "effectTarget"
    ) {
      throw new Error("Expected effectTarget choice");
    }
    expect(targetChoice.payload.eligibleIds).toHaveLength(2);

    const targetId = targetChoice.payload.eligibleIds![0]!;
    engine.executeMove("resolveEffectTarget", { args: { targetIds: [targetId] } }, P1);

    expect(engine.getCardsInZone("trash", P2).map((card) => card.instanceId)).toContain(targetId);
  });

  it("auto-resolves a single trigger and logs it before asking for a target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaRuthlessLowlife,
            spent: false,
            attachedGears: [alphaKiroshiOptics],
          },
        ],
        legendArea: [alphaVCorporateExile, alphaViktorVektorSitDownAndRelax],
      },
      { field: [{ card: alphaJackieWellesRideOrDieChoom, spent: true }] },
    );

    engine.attackUnit(alphaRuthlessLowlife, alphaJackieWellesRideOrDieChoom);

    expect(
      engine
        .getEvents("actionLog")
        .some((event) => event.type === "actionLog" && event.messageKey === "trigger.autoResolved"),
    ).toBe(true);
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected effectTarget choice");
    }
    expect(choice.payload.eligibleIds).toHaveLength(2);
  });
});
