import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessOutlaw } from "./restless-outlaw.ts";
const textByColor = {
  red: "When this dies, create a Corrupted Corpse in your banished zone.\nDecay",
} as const;
export const restlessOutlawI18n = defineFamilyI18n(restlessOutlaw, {
  en: {
    name: "Restless Outlaw",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { red: restlessOutlawRedI18n } = restlessOutlawI18n.cards;
