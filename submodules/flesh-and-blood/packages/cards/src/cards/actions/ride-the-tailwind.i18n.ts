import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { rideTheTailwind } from "./ride-the-tailwind.ts";

export const rideTheTailwindI18n = defineFamilyI18n(rideTheTailwind, {
  en: {
    name: "Ride the Tailwind",
    text: "When Ride the Tailwind hits, the next attack action card with 2 or less base {p} you play this combat chain gains go again.\nGo again",
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: rideTheTailwindRedI18n,
  yellow: rideTheTailwindYellowI18n,
  blue: rideTheTailwindBlueI18n,
} = rideTheTailwindI18n.cards;
