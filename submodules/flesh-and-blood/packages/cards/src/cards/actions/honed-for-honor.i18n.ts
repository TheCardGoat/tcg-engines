import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { honedForHonor } from "./honed-for-honor.ts";

export const honedForHonorI18n = defineFamilyI18n(honedForHonor, {
  en: {
    name: "Honed for Honor",
    typeText: "Warrior Action",
    text: "Sharpen target sword you control.\nIf it has 3 or more +1{p} counters, you may put an attack reaction card from your graveyard on top of your deck.\nGo again",
  },
});

export const { blue: honedForHonorBlueI18n } = honedForHonorI18n.cards;
