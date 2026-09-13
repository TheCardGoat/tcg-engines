import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { dustRunnerOutlaw } from "./dust-runner-outlaw.ts";

export const dustRunnerOutlawI18n = defineFamilyI18n(dustRunnerOutlaw, {
  en: {
    name: "Dust Runner Outlaw",
    text: "Go again",
    typeText: "Draconic Ninja Action - Attack",
  },
});

export const {
  red: dustRunnerOutlawRedI18n,
  yellow: dustRunnerOutlawYellowI18n,
  blue: dustRunnerOutlawBlueI18n,
} = dustRunnerOutlawI18n.cards;
