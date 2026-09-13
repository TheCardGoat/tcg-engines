import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rotaryRam } from "./rotary-ram.ts";

export const rotaryRamI18n = defineFamilyI18n(rotaryRam, {
  en: {
    name: "Rotary Ram",
    text: ({ value1 }) =>
      `The next Mechanologist attack action card you play this turn gains +${value1}{p}.\nIf you have boosted this turn, put Rotary Ram on the bottom of your deck.\nGo again`,
    typeText: "Mechanologist Action",
  },
});

export const {
  red: rotaryRamRedI18n,
  yellow: rotaryRamYellowI18n,
  blue: rotaryRamBlueI18n,
} = rotaryRamI18n.cards;
