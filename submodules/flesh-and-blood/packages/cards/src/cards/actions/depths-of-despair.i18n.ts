import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { depthsOfDespair } from "./depths-of-despair.ts";

export const depthsOfDespairI18n = defineFamilyI18n(depthsOfDespair, {
  en: {
    name: "Depths of Despair",
    text: "When this defends, banish it when the combat chain closes.\nBlood Debt",
    typeText: "Shadow Action - Attack",
  },
});

export const {
  red: depthsOfDespairRedI18n,
  yellow: depthsOfDespairYellowI18n,
  blue: depthsOfDespairBlueI18n,
} = depthsOfDespairI18n.cards;
