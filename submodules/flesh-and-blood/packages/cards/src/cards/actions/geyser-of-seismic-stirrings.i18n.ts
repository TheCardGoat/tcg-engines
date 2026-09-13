import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { geyserOfSeismicStirrings } from "./geyser-of-seismic-stirrings.ts";

export const geyserOfSeismicStirringsI18n = defineFamilyI18n(geyserOfSeismicStirrings, {
  en: {
    name: "Geyser of Seismic Stirrings",
    text: (amount) => `Go again
This enters the arena with ${amount} energy counters. When it has none, destroy it.
At the beginning of your end phase, remove an energy counter from this and create a Seismic Surge token.`,
    typeText: "Guardian Action - Aura",
  },
});

export const {
  red: geyserOfSeismicStirringsRedI18n,
  yellow: geyserOfSeismicStirringsYellowI18n,
  blue: geyserOfSeismicStirringsBlueI18n,
} = geyserOfSeismicStirringsI18n.cards;
