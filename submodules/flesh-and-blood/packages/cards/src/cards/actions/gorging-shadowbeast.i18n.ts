import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { gorgingShadowbeast } from "./gorging-shadowbeast.ts";

export const gorgingShadowbeastI18n = defineFamilyI18n(gorgingShadowbeast, {
  en: {
    name: "Gorging Shadowbeast",
    typeText: "Shadow Brute Action - Attack",
    text: "When this attacks, banish the top card of your deck.\nBlood Debt",
  },
});

export const {
  red: gorgingShadowbeastRedI18n,
  yellow: gorgingShadowbeastYellowI18n,
  blue: gorgingShadowbeastBlueI18n,
} = gorgingShadowbeastI18n.cards;
