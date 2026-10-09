import { describe, expect, test } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailAfterpartyAtLizzieS,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSandevistan,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailBootlegBlackSapphireShow,
} from "@tcg/cyberpunk-cards";
import type { CommandSuccess } from "@tcg/cyberpunk-engine";
import { cyberpunkAnimationPlan } from "@tcg/cyberpunk-server-adapter/animation";
import type { AnimationPlanV2 } from "@tcg/protocol";

import { projectCyberpunkAuthoritativeAnimationPlan } from "../../animation/sharedEvents";
import { getScenario, P1, P2 } from "./scenarios";

function plansForBothPlayers(label: string, result: CommandSuccess): readonly AnimationPlanV2[] {
  const authoritative = cyberpunkAnimationPlan(label, result.animationScript);
  expect(authoritative, `${label} authoritative animation`).not.toBeNull();
  const plans = [
    projectCyberpunkAuthoritativeAnimationPlan(authoritative!, String(P1), result.state),
    projectCyberpunkAuthoritativeAnimationPlan(authoritative!, String(P2), result.state),
  ];
  for (const [index, plan] of plans.entries()) {
    expect(plan.steps.length, `${label} player ${index + 1} visible steps`).toBeGreaterThan(0);
  }
  return plans;
}

function expectBothPlayersToReceive(
  label: string,
  result: CommandSuccess,
  predicate: (plan: AnimationPlanV2) => boolean,
): void {
  for (const [index, plan] of plansForBothPlayers(label, result).entries()) {
    expect(predicate(plan), `${label} player ${index + 1} expected animation`).toBe(true);
  }
}

describe("Cyberpunk V2 fixture animation coverage", () => {
  test("sell and unit play publish visible transfers and resource feedback to both players", () => {
    const sellEngine = getScenario("gearAttachToGoSoloLegend").build();
    const sell = sellEngine.sellCard(welcomeToNightCityRetailMantisBlades, { as: P1 });
    // Keep this assertion at the semantic endpoint: sold cards enter the
    // player's Eddie area, while the resource delta lands on the same zone.
    expectBothPlayersToReceive("sell-card", sell, (plan) =>
      plan.steps.some(
        (step) =>
          step.type === "entityTransfer" &&
          step.to.kind === "zone" &&
          step.to.id.endsWith("eddieArea"),
      ),
    );
    expectBothPlayersToReceive("sell-card-resource", sell, (plan) =>
      plan.steps.some(
        (step) =>
          step.type === "valueDelta" &&
          step.subject.kind === "zone" &&
          step.subject.id.endsWith("eddieArea"),
      ),
    );

    const bootlegEngine = getScenario("progBootlegBlackSapphireShowRetail").build();
    const effectSale = bootlegEngine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, {
      as: P1,
    });
    expectBothPlayersToReceive("sell-from-deck", effectSale, (plan) =>
      plan.steps.some(
        (step) =>
          step.type === "entityTransfer" &&
          step.from?.kind === "zone" &&
          step.from.id.endsWith("deck") &&
          step.to?.kind === "zone" &&
          step.to.id.endsWith("eddieArea"),
      ),
    );

    const unitEngine = getScenario("unitArmoredMinotaur").build();
    const play = unitEngine.playCard(embracingPowerRetailStarterDeckMinotaur, { as: P1 });
    expectBothPlayersToReceive("play-unit", play, (plan) =>
      plan.steps.some(
        (step) =>
          step.type === "entityTransfer" && step.to.kind === "zone" && step.to.id.endsWith("field"),
      ),
    );
  });

  test("gear attachments to a legend and a unit publish host-bound transfers to both players", () => {
    const legendEngine = getScenario("gearAttachToGoSoloLegend").build();
    const legendId = legendEngine.findCardId(theHeistRetailStarterDeckVCorporateExile, "field", P1);
    const legendAttach = legendEngine.attachGear(welcomeToNightCityRetailMantisBlades, legendId, {
      as: P1,
    });
    expectBothPlayersToReceive("attach-gear-to-legend", legendAttach, (plan) =>
      plan.steps.some(
        (step) =>
          step.type === "entityTransfer" && step.to.kind === "entity" && step.to.id === legendId,
      ),
    );

    const unitEngine = getScenario("gearSandevistan").build();
    unitEngine.playCard(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    const unitId = unitEngine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const unitAttach = unitEngine.attachGear(welcomeToNightCityRetailSandevistan, unitId, {
      as: P1,
    });
    expectBothPlayersToReceive("attach-gear-to-unit", unitAttach, (plan) =>
      plan.steps.some(
        (step) =>
          step.type === "entityTransfer" && step.to.kind === "entity" && step.to.id === unitId,
      ),
    );
  });

  test("targeted and no-target Programs remain visible to both players", () => {
    const targetedEngine = getScenario("progCorporateSurveillance").build();
    const play = targetedEngine.playCard(welcomeToNightCityRetailCorporateSurveillance, {
      as: P1,
    });
    expectBothPlayersToReceive("play-targeted-program", play, (plan) =>
      plan.steps.some((step) => step.type === "entityTransfer"),
    );
    const choice = targetedEngine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const targetId = choice?.type === "chooseTarget" ? choice.payload.eligibleIds?.[0] : undefined;
    expect(targetId).toBeDefined();
    const resolve = targetedEngine.resolveEffectTargetIds([targetId!], { as: P1 });
    expect(resolve).toBeDefined();
    expectBothPlayersToReceive("resolve-targeted-program", resolve!, (plan) =>
      plan.steps.some((step) => step.type === "effect"),
    );

    const noTargetEngine = getScenario("progCorporateSurveillanceNoTargets").build();
    const noTarget = noTargetEngine.playCard(welcomeToNightCityRetailCorporateSurveillance, {
      as: P1,
    });
    expect(noTargetEngine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expectBothPlayersToReceive("play-no-target-program", noTarget, (plan) =>
      plan.steps.some((step) => step.type === "entityTransfer"),
    );
  });

  test("Gig targeting and a defeating fight publish target, combat, and defeat motion to both players", () => {
    const gigEngine = getScenario("progAfterpartyAtLizzies").build();
    gigEngine.playCard(welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
    const gigChoice = gigEngine.getState().G.turnMetadata.pendingChoice;
    expect(gigChoice?.type).toBe("chooseTarget");
    const rivalD6 = gigEngine.getGigDice(P2).find((die) => die.dieType === "d6");
    const gigId = rivalD6?.id;
    expect(gigId).toBeDefined();
    const adjust = gigEngine.resolveAdjustGig(gigId!, 3, { as: P1 });
    expectBothPlayersToReceive("target-gig", adjust, (plan) =>
      plan.steps.some(
        (step) =>
          (step.type === "effect" && step.targets.some((target) => target.kind === "entity")) ||
          step.type === "randomization",
      ),
    );

    const fightEngine = getScenario("attackStep").build();
    const attackerId = fightEngine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const defenderId = fightEngine.findCardId(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      "field",
      P2,
    );
    const results = [
      fightEngine.attackUnit(attackerId, defenderId, { as: P1 }),
      fightEngine.resolveAttack({ as: P1 }),
      fightEngine.resolveAttack({ as: P2, pass: true }),
      fightEngine.resolveAttack({ as: P1 }),
      fightEngine.resolveAttack({ as: P1 }),
    ];
    const plans = results.flatMap((result, index) => plansForBothPlayers(`fight-${index}`, result));
    expect(plans.some((plan) => plan.steps.some((step) => step.type === "combat"))).toBe(true);
    expect(
      plans.some((plan) =>
        plan.steps.some(
          (step) =>
            step.type === "entityTransfer" &&
            step.to.kind === "zone" &&
            step.to.id.endsWith("trash"),
        ),
      ),
    ).toBe(true);
  });
});
