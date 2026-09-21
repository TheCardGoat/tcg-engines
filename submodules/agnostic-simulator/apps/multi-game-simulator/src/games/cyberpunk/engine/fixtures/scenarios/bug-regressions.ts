import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, P1, P2 } from "./shared";

/**
 * Screenshot-backed regression for the live match that appeared to freeze on
 * "Choosing a replacement" after V defeated Corpo Security. The engine is
 * intentionally stopped at Jackie Welles' optional defeat replacement so the
 * fixture exposes both the chooser controls and the rival's spectator copy.
 */
export const bugRegressionScenarios: Scenario[] = [
  {
    id: "regressionCardEffectSacrificialGearChoice",
    group: "core",
    label: "Regression · choose mandatory replacement Gear",
    description:
      "Wild in the Streets would defeat a Unit with two Deadman Transmitters. The simulator must let its controller choose which mandatory replacement applies, then resume the Program.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailFieldOperator,
              spent: true,
              hasLag: false,
              attachedGears: [
                c.welcomeToNightCityRetailDeadmanTransmitter,
                c.welcomeToNightCityRetailDeadmanTransmitter,
              ],
            },
          ],
        },
        { hand: [c.welcomeToNightCityRetailWildInTheStreets], eddies: 5 },
        {
          activePlayerId: P2,
          autoGainGig: false,
          seed: "regression:card-effect-sacrificial-gear-choice",
        },
      );

      engine.playCard(c.welcomeToNightCityRetailWildInTheStreets, { as: P2 });
      engine.resolveEffectTarget(c.welcomeToNightCityRetailFieldOperator, {
        as: P2,
        allowPendingChoice: true,
        reason: "The Unit's controller must choose between two mandatory replacements.",
      });

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "chooseSacrificialGear" || choice.chooserId !== P1) {
        throw new Error("Mandatory replacement fixture must stop at P1's Gear choice.");
      }
      return engine;
    },
  },
  {
    id: "regressionCardEffectRedirectDefeatChoice",
    group: "legend-passive",
    label: "Regression · Jackie replaces Program defeat",
    description:
      "Wild in the Streets would defeat P1's spent Field Operator. Jackie must offer the same replacement controls as combat and the Program must finish resolving after the choice.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: c.welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
          legendArea: [
            { card: c.welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
          ],
          eddies: 1,
        },
        {
          hand: [c.welcomeToNightCityRetailWildInTheStreets],
          eddies: 5,
        },
        {
          activePlayerId: P2,
          autoGainGig: false,
          seed: "regression:card-effect-redirect-defeat-choice",
        },
      );

      engine.playCard(c.welcomeToNightCityRetailWildInTheStreets, { as: P2 });
      engine.resolveEffectTarget(c.welcomeToNightCityRetailFieldOperator, {
        as: P2,
        allowPendingChoice: true,
        reason: "Jackie must decide whether to replace the Program's defeat effect.",
      });

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "redirectDefeat" || choice.chooserId !== P1) {
        throw new Error("Card-effect regression fixture must stop at P1's redirectDefeat choice.");
      }
      return engine;
    },
  },
  {
    id: "regressionRedirectDefeatChoice",
    group: "legend-passive",
    label: "Regression · Jackie defeat replacement",
    description:
      "V: Streetkid (10 power with Dying Night and Satori) has beaten Corpo Security. P1 owns a payable Jackie Welles: Mama's Favorite and must see Spend 1 Eddie / let the Unit be defeated controls; P2 only observes the replacement decision.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: true,
              hasLag: false,
            },
          ],
          legendArea: [
            {
              card: c.welcomeToNightCityRetailJackieWellesMamaSFavorite,
              faceDown: false,
            },
          ],
          eddies: 1,
          gigArea: [{ dieType: "d8", faceValue: 4 }],
        },
        {
          field: [
            {
              card: c.welcomeToNightCityRetailVStreetkid,
              spent: false,
              hasLag: false,
              attachedGears: [
                c.welcomeToNightCityRetailDyingNightVSPistol,
                c.welcomeToNightCityRetailSatoriSwordOfSaburo,
              ],
            },
          ],
          eddies: 2,
        },
        {
          activePlayerId: P2,
          autoGainGig: false,
          seed: "regression:redirect-defeat-choice",
        },
      );

      engine.attackUnit(
        c.welcomeToNightCityRetailVStreetkid,
        c.welcomeToNightCityRetailCorpoSecurity,
        { as: P2 },
      );
      // Dying Night offers the defender's d8, then asks for its new value.
      engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
        as: P2,
        allowPendingChoice: true,
        reason: "Dying Night still needs the selected Gig's new face value",
      });
      engine.resolveAdjustGig(4, { as: P2 });
      engine.resolveAttack({ as: P2 });
      engine.resolveAttack({ as: P1, pass: true });
      engine.resolveAttack({ as: P2 });

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "redirectDefeat" || choice.chooserId !== P1) {
        throw new Error("Regression fixture must stop at P1's redirectDefeat choice.");
      }
      return engine;
    },
  },
];
