import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { cutFromTheSameCloth } from "./cut-from-the-same-cloth.ts";

export const cutFromTheSameClothI18n = defineFamilyI18n(cutFromTheSameCloth, {
  en: {
    name: "Cut from the Same Cloth",
    text: (bonus) =>
      `Target opposing hero reveals their hand. If an attack reaction card is revealed this way, mark them.\nYour next dagger attack this turn gets +${bonus}{p}.\nGo again`,
    typeText: "Assassin / Warrior Action",
  },
});

export const {
  red: cutFromTheSameClothRedI18n,
  yellow: cutFromTheSameClothYellowI18n,
  blue: cutFromTheSameClothBlueI18n,
} = cutFromTheSameClothI18n.cards;
