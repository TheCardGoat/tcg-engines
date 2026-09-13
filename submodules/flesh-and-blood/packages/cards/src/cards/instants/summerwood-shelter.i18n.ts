import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { summerwoodShelter } from "./summerwood-shelter.ts";

export const summerwoodShelterI18n = defineFamilyI18n(summerwoodShelter, {
  en: {
    name: "Summerwood Shelter",
    typeText: "Earth Instant",
    text: (amount) => `Target defending Earth or Elemental action card gains +${amount}{d}.`,
  },
});

export const {
  red: summerwoodShelterRedI18n,
  yellow: summerwoodShelterYellowI18n,
  blue: summerwoodShelterBlueI18n,
} = summerwoodShelterI18n.cards;
