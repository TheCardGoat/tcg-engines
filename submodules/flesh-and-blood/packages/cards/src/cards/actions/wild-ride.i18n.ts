import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { wildRide } from "./wild-ride.ts";

export const wildRideI18n = defineFamilyI18n(wildRide, {
  en: {
    name: "Wild Ride",
    text: "When this attacks, draw a card then discard a random card. If a card with 6 or more {p} is discarded this way, this gets go again.",
    typeText: "Brute Action - Attack",
  },
});

export const {
  red: wildRideRedI18n,
  yellow: wildRideYellowI18n,
  blue: wildRideBlueI18n,
} = wildRideI18n.cards;
