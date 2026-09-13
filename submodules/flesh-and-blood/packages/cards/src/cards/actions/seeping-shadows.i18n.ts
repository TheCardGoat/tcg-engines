import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { seepingShadows } from "./seeping-shadows.ts";

export const seepingShadowsI18n = defineFamilyI18n(seepingShadows, {
  en: {
    name: "Seeping Shadows",
    text: (maxCost) =>
      `You may play Seeping Shadows from your banished zone.\nThe next attack action card with cost ${maxCost}${maxCost === 0 ? "" : " or less"} you play this turns gains +1{p} and go again.\nGo again\nBlood Debt`,
    typeText: "Shadow Runeblade Action",
  },
});

export const {
  red: seepingShadowsRedI18n,
  yellow: seepingShadowsYellowI18n,
  blue: seepingShadowsBlueI18n,
} = seepingShadowsI18n.cards;
