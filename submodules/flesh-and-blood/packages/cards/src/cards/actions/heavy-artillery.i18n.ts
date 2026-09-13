import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { heavyArtillery } from "./heavy-artillery.ts";

export const heavyArtilleryI18n = defineFamilyI18n(heavyArtillery, {
  en: {
    name: "Heavy Artillery",
    text: "Evo Upgrade - The defending hero can't defend this with attack action cards with cost less than X, where X is the number of Evos you have equipped.",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: heavyArtilleryRedI18n,
  yellow: heavyArtilleryYellowI18n,
  blue: heavyArtilleryBlueI18n,
} = heavyArtilleryI18n.cards;
