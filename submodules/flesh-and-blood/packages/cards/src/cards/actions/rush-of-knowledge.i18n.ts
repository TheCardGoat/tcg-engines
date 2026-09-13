import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rushOfKnowledge } from "./rush-of-knowledge.ts";
const textByColor = {
  blue: "When this attacks, you may destroy a Ponder token you control. If you do, draw a card and gain 1 action point.\nPhantasm",
} as const;
export const rushOfKnowledgeI18n = defineFamilyI18n(rushOfKnowledge, {
  en: {
    name: "Rush of Knowledge",
    typeText: "Illusionist / Wizard Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { blue: rushOfKnowledgeBlueI18n } = rushOfKnowledgeI18n.cards;
