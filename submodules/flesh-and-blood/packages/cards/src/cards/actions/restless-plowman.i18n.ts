import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { restlessPlowman } from "./restless-plowman.ts";

export const restlessPlowmanI18n = defineFamilyI18n(restlessPlowman, {
  en: {
    name: "Restless Plowman",
    typeText: "Shadow Necromancer Action - Zombie Ally",
    text: "Action - {t}: Gain {r}. Go again\nDecay",
  },
});

export const { red: restlessPlowmanRedI18n } = restlessPlowmanI18n.cards;
