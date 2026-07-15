export type SimulatorSupportActionId = "reportBug" | "shareFeedback";

export interface SimulatorSupportAction {
  id: SimulatorSupportActionId;
  labelKey: string;
  descriptionKey: string;
}

export const SIMULATOR_SUPPORT_ACTIONS = [
  {
    id: "reportBug",
    labelKey: "sim.support.reportBugLabel",
    descriptionKey: "sim.support.reportBugDescription",
  },
  {
    id: "shareFeedback",
    labelKey: "sim.support.shareFeedbackLabel",
    descriptionKey: "sim.support.shareFeedbackDescription",
  },
] satisfies readonly SimulatorSupportAction[];
