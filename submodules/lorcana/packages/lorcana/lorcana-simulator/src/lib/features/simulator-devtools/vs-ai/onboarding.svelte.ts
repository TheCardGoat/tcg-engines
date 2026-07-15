const ONBOARDING_STORAGE_KEY = "lorcana.simulator.vsAi.onboardingSeen";

export const ONBOARDING_STEPS = [
  {
    title: "Your cards",
    description: "Your cards are at the bottom. Play normally by dragging cards.",
  },
  {
    title: "AI opponent",
    description: "Your AI opponent plays at the top. Watch their moves in the event log.",
  },
  {
    title: "AI controls",
    description: "Control the AI using the buttons in the opponent's panel in the sidebar.",
  },
  {
    title: "Take over",
    description: "Take over the AI side to play both sides of the board, then release back.",
  },
] as const;

export class VsAiOnboardingState {
  shouldShow = $state(false);
  currentStep = $state(0);

  constructor() {
    if (typeof localStorage !== "undefined") {
      this.shouldShow = !localStorage.getItem(ONBOARDING_STORAGE_KEY);
    }
  }

  nextStep(): void {
    if (this.currentStep < ONBOARDING_STEPS.length - 1) {
      this.currentStep += 1;
    } else {
      this.dismiss();
    }
  }

  dismiss(): void {
    this.shouldShow = false;
    this.currentStep = 0;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    }
  }
}
