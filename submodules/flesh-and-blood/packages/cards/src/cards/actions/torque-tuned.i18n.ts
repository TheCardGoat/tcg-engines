import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { torqueTuned } from "./torque-tuned.ts";

export const torqueTunedI18n = defineFamilyI18n(torqueTuned, {
  en: {
    name: "Torque Tuned",
    text: "If an item you control has been destroyed this turn, this gets overpower.\nGalvanize - When this defends, you may destroy an item you control. If you do, this gets +2{d}.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: torqueTunedRedI18n,
  yellow: torqueTunedYellowI18n,
  blue: torqueTunedBlueI18n,
} = torqueTunedI18n.cards;
