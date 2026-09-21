import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
  theHeistRetailStarterDeckVCorporateExile,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, registerMatchers } from "../src/testing/index.ts";

registerMatchers();

const highCredGigs: { dieType: "d6" | "d8"; faceValue: number }[] = [
  { dieType: "d8", faceValue: 4 },
  { dieType: "d6", faceValue: 3 },
];

describe("manual trigger resolution", () => {
  it("logs the offered triggers and the player's selected resolution order", () => {
    // Satori intentionally omitted — its trigger fires on `fightResolved`
    // (post-fight), not on attack declaration. See packages/types/src/index.ts
    // FightResolvedEvent.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailTBugAmateurPhilosopher,
            spent: false,
            attachedGears: [
              welcomeToNightCityRetailKiroshiOptics,
              welcomeToNightCityRetailDyingNightVSPistol,
            ],
          },
        ],
        legendArea: [theHeistRetailStarterDeckVCorporateExile],
        gigArea: highCredGigs,
      },
      {
        field: [
          { card: welcomeToNightCityRetailJackieWellesRideOrDieChoom, spent: true },
          {
            card: welcomeToNightCityRetailSketchyRipper,
            spent: false,
            attachedGears: [welcomeToNightCityRetailKiroshiOptics],
          },
        ],
      },
    );

    const attackResult = engine.attackUnit(
      welcomeToNightCityRetailTBugAmateurPhilosopher,
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
    );

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTrigger") {
      throw new Error("Expected chooseTrigger");
    }
    expect(choice.payload.options.map((option) => option.cardName).sort()).toEqual([
      "Dying Night: V's Pistol",
      "Kiroshi Optics",
    ]);
    const pendingLog = attackResult.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "trigger.orderPending",
    );
    expect(pendingLog).toMatchObject({
      type: "action",
      playerId: choice.chooserId,
      messageKey: "trigger.orderPending",
      params: {
        triggerCount: 2,
        triggerIds: choice.payload.options.map((option) => option.triggerId),
        sourceCardIds: choice.payload.options.map((option) => option.sourceCardId),
        abilityIndexes: choice.payload.options.map((option) => String(option.abilityIndex)),
      },
    });

    const selected = choice.payload.options.find(
      (option) => option.cardName === "Dying Night: V's Pistol",
    );
    if (!selected) throw new Error("Expected Dying Night trigger option");
    const resolveResult = engine.executeMove(
      "resolveTrigger",
      { args: { triggerId: selected.triggerId } },
      choice.chooserId,
    );
    expect(resolveResult.success).toBe(true);
    if (!resolveResult.success) throw new Error(resolveResult.error);

    const selectedLog = resolveResult.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "trigger.orderSelected",
    );
    expect(selectedLog).toMatchObject({
      type: "action",
      playerId: choice.chooserId,
      messageKey: "trigger.orderSelected",
      params: {
        selectedTriggerId: selected.triggerId,
        selectedSourceCardId: selected.sourceCardId,
        selectedAbilityIndex: selected.abilityIndex,
        cardName: selected.cardName,
        remainingCount: 1,
        remainingTriggerIds: choice.payload.options
          .filter((option) => option.triggerId !== selected.triggerId)
          .map((option) => option.triggerId),
      },
    });
    expect(engine.getState().G.attackState?.step).toBe("attack");
  });
});
