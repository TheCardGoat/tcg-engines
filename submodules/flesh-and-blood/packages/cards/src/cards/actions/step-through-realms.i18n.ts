import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { stepThroughRealms } from "./step-through-realms.ts";

export const stepThroughRealmsI18n = defineFamilyI18n(stepThroughRealms, {
  en: {
    name: "Step through Realms",
    typeText: "Shadow Action",
    text: 'Your next Shadow attack this turn gets +4{p} and "When this hits, create a Gate to i\'Arathael token."\nGo again',
  },
});

export const {
  red: stepThroughRealmsRedI18n,
  yellow: stepThroughRealmsYellowI18n,
  blue: stepThroughRealmsBlueI18n,
} = stepThroughRealmsI18n.cards;
