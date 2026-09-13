export const SIMULATOR_UI_CONNECTION_FIXTURE_STATES = [
  "connected",
  "reconnecting",
  "disconnected",
] as const;

export type SimulatorUiFixtureState = (typeof SIMULATOR_UI_CONNECTION_FIXTURE_STATES)[number];

export const INTERACTION_PROMPT_FIXTURE_IDS = [
  "ready-action",
  "source-inspection",
  "expanded-details",
  "binary",
  "options",
  "amount",
  "spatial-target",
  "drawer-target",
  "selected-target",
  "ordering",
  "partition",
  "direct-order",
  "optional-amount",
  "opponent",
] as const;

export type PromptFixtureId = (typeof INTERACTION_PROMPT_FIXTURE_IDS)[number];

export const SHARED_SIMULATOR_UI_FIXTURE_COUNT =
  SIMULATOR_UI_CONNECTION_FIXTURE_STATES.length + INTERACTION_PROMPT_FIXTURE_IDS.length;
