import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { devouringDoomwake } from "./devouring-doomwake.ts";

export const devouringDoomwakeI18n = defineFamilyI18n(devouringDoomwake, {
  en: {
    name: "Devouring Doomwake",
    typeText: "Shadow Brute Action - Attack",
    text: "When this hits, banish it and all defending cards.\nBlood Debt",
  },
});

export const { red: devouringDoomwakeRedI18n } = devouringDoomwakeI18n.cards;
