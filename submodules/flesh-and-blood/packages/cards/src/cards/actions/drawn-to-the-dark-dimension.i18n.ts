import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { drawnToTheDarkDimension } from "./drawn-to-the-dark-dimension.ts";

export const drawnToTheDarkDimensionI18n = defineFamilyI18n(drawnToTheDarkDimension, {
  en: {
    name: "Drawn to the Dark Dimension",
    text: ({ attackTriggered }) =>
      attackTriggered
        ? "This costs {r} less to play for each Runechant you control.\nWhen this attacks, draw a card."
        : "Drawn to the Dark Dimension costs {r} less to play for each Runechant you control.\nDraw a card.",
    typeText: "Runeblade Action - Attack",
  },
});

export const {
  red: drawnToTheDarkDimensionRedI18n,
  yellow: drawnToTheDarkDimensionYellowI18n,
  blue: drawnToTheDarkDimensionBlueI18n,
} = drawnToTheDarkDimensionI18n.cards;
