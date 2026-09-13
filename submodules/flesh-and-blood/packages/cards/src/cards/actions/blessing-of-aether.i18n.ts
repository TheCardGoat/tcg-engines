import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { blessingOfAether } from "./blessing-of-aether.ts";

export const blessingOfAetherI18n = defineFamilyI18n(blessingOfAether, {
  en: {
    name: "Blessing of Aether",
    text: (_parameter, color) =>
      `At the start of your turn, destroy this then if the next card you play this turn has an arcane damage effect, instead it deals that much arcane damage plus ${color === "red" ? 3 : color === "yellow" ? 2 : 1}.`,
    typeText: "Wizard Action - Aura",
  },
});

export const {
  red: blessingOfAetherRedI18n,
  yellow: blessingOfAetherYellowI18n,
  blue: blessingOfAetherBlueI18n,
} = blessingOfAetherI18n.cards;
