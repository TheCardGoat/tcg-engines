import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { edgeOfTheirSeats } from "./edge-of-their-seats.ts";

export const edgeOfTheirSeatsI18n = defineFamilyI18n(edgeOfTheirSeats, {
  en: {
    name: "Edge of Their Seats",
    typeText: "Guardian Instant - Aura",
    text: (amount) =>
      `Suspense\nWhen this leaves the arena, your next attack this turn gets +${amount}{p}.`,
  },
});

export const {
  red: edgeOfTheirSeatsRedI18n,
  yellow: edgeOfTheirSeatsYellowI18n,
  blue: edgeOfTheirSeatsBlueI18n,
} = edgeOfTheirSeatsI18n.cards;
