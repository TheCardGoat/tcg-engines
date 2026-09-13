import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { impenetrableBelief } from "./impenetrable-belief.ts";

export const impenetrableBeliefI18n = defineFamilyI18n(impenetrableBelief, {
  en: {
    name: "Impenetrable Belief",
    typeText: "Light Action - Attack",
    text: "If 3 or more cards have been put into an opposing hero's banished zone this turn, Impenetrable Belief gains +2{d} while defending.",
  },
});

export const {
  red: impenetrableBeliefRedI18n,
  yellow: impenetrableBeliefYellowI18n,
  blue: impenetrableBeliefBlueI18n,
} = impenetrableBeliefI18n.cards;
