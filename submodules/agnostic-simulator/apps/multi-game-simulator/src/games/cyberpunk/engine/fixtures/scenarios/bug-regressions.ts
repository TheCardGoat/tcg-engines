import type { Scenario } from "./types";
import { c, CyberpunkTestEngine, P1, P2, scenarioSeed } from "./shared";

/**
 * Screenshot-backed regression for the live match that appeared to freeze on
 * "Choosing a replacement" after V defeated Corpo Security. The engine is
 * intentionally stopped at Jackie Welles' optional defeat replacement so the
 * fixture exposes both the chooser controls and the rival's spectator copy.
 */
export const bugRegressionScenarios: Scenario[] = [
  {
    id: "regressionDetonateDetachesGear",
    group: "core",
    label: "Regression · Detonate removes equipped Gear",
    description:
      "Defeat Mantis Blades and Kiroshi Optics with successive Detonates while Jackie Welles is active. Each Gear must leave its host without offering Jackie's Unit-only replacement.",
    build: () =>
      CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailDetonate, c.welcomeToNightCityRetailDetonate],
          eddies: 2,
        },
        {
          legendArea: [
            { card: c.welcomeToNightCityRetailJackieWellesMamaSFavorite, faceDown: false },
          ],
          eddies: 1,
          field: [
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              attachedGears: [
                c.welcomeToNightCityRetailMantisBlades,
                c.welcomeToNightCityRetailKiroshiOptics,
              ],
            },
          ],
        },
        { autoGainGig: false, seed: scenarioSeed("regressionDetonateDetachesGear") },
      ),
  },
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
      "V: Streetkid (10 power with Dying Night and Satori) has beaten one of two Corpo Security cards. P1 owns two payable Jackie Welles: Mama's Favorite cards; the prompt must identify the exact source and protected Unit while P2 observes the decision.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: c.welcomeToNightCityRetailCorpoSecurity,
              spent: true,
              hasLag: false,
            },
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
      engine.resolveAttack({ as: P2 });

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "redirectDefeat" || choice.chooserId !== P1) {
        throw new Error("Regression fixture must stop at P1's redirectDefeat choice.");
      }
      return engine;
    },
  },
  {
    id: "regressionCarnageTargetsFieldedLegend",
    group: "core",
    label: "Regression · Carnage targets a Go-Solo Legend on the field",
    description:
      "The rival paid a GO SOLO Legend onto the field last turn; CR 4.2.1 makes a Legend on the field a Unit too. Carnage At The Colosseum must offer it as a defeat target (and remove it from the game on defeat). Reported 2026-10-02: the legend could not be targeted.",
    build: () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [c.welcomeToNightCityRetailCarnageAtTheColosseum],
          field: [{ card: c.embracingPowerRetailStarterDeckMinotaur, spent: false }],
          eddies: 6,
        },
        {
          legendArea: [{ card: c.welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
          eddies: 9,
        },
        { seed: scenarioSeed("regressionCarnageTargetsFieldedLegend") },
      );

      // The rival's previous turn: go solo with Royce, then pass back.
      engine.completeTurn({ as: P1 });
      const royce = engine
        .getState()
        .G.players[P2].zones.legendArea.map((id) => engine.getState().G.cardIndex[id])
        .find((card) => card?.definitionId === c.welcomeToNightCityRetailRoycePsychoOnTheEdge.id);
      if (!royce) throw new Error("Fixture could not find the GO SOLO Legend instance.");
      const goSolo = engine.executeMove(
        "goSolo",
        { args: { cardId: royce.instanceId as string } },
        P2,
      );
      if (!goSolo.success) {
        throw new Error(
          `Fixture GO SOLO failed: ${goSolo.errorCode ?? "unknown"} — later steps would misdiagnose as a targeting defect.`,
        );
      }
      engine.completeTurn({ as: P2 });

      engine.playCard(c.welcomeToNightCityRetailCarnageAtTheColosseum, { as: P1 });
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "chooseTarget") {
        throw new Error("Regression fixture must stop at Carnage's defeat-target choice.");
      }
      return engine;
    },
  },
];
