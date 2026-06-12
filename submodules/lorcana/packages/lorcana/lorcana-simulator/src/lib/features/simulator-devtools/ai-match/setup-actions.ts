import { createAutomatedMatchSeed } from "./config.js";
import { validateAutomatedMatchConfig } from "./fixture.js";
import { saveAutomatedMatchConfig, type AutomatedMatchStorage } from "./storage.js";
import type { AutomatedMatchConfig, AutomatedMatchValidationErrors } from "./types.js";

export interface AutomatedMatchSimulationPreparation {
  errors: AutomatedMatchValidationErrors;
  nextConfig?: AutomatedMatchConfig;
}

export async function prepareAutomatedMatchSimulation(
  config: AutomatedMatchConfig,
): Promise<AutomatedMatchSimulationPreparation> {
  const errors = await validateAutomatedMatchConfig(config);
  if (errors.playerOneDeckText || errors.playerTwoDeckText) {
    return {
      errors,
    };
  }

  return {
    errors,
    nextConfig: {
      ...config,
      // Regenerate the match seed at simulate time so viewer reloads reproduce one run.
      seed: createAutomatedMatchSeed(),
    },
  };
}

export async function simulateAutomatedMatch(args: {
  config: AutomatedMatchConfig;
  navigate: (path: string) => Promise<void> | void;
  storage?: AutomatedMatchStorage;
  viewerPath: string;
}): Promise<AutomatedMatchSimulationPreparation> {
  const preparation = await prepareAutomatedMatchSimulation(args.config);
  if (!preparation.nextConfig) {
    return preparation;
  }

  saveAutomatedMatchConfig(preparation.nextConfig, args.storage);
  await args.navigate(args.viewerPath);
  return preparation;
}
