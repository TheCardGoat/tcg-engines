import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorUserSettingsContextValue } from "./types";

export const EMPTY_SIMULATOR_USER_SETTINGS_CONTEXT: SimulatorUserSettingsContextValue = {
  userSettings: null,
};

export const [SimulatorUserSettingsContextProvider, useSimulatorUserSettings] =
  createRequiredSimulatorContext<SimulatorUserSettingsContextValue>(
    EMPTY_SIMULATOR_USER_SETTINGS_CONTEXT,
  );
