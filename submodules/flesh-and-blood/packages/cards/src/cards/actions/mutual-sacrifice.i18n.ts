import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { mutualSacrifice } from "./mutual-sacrifice.ts";

export const mutualSacrificeI18n = defineFamilyI18n(mutualSacrifice, {
  en: {
    name: "Mutual Sacrifice",
    typeText: "Necromancer Action - Attack",
    text: "When this hits a hero, you may destroy an ally you control or discard an ally. If you do, they lose 2{h}.",
  },
});

export const {
  red: mutualSacrificeRedI18n,
  yellow: mutualSacrificeYellowI18n,
  blue: mutualSacrificeBlueI18n,
} = mutualSacrificeI18n.cards;
