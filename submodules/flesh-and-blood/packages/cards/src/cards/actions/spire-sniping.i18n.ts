import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { spireSniping } from "./spire-sniping.ts";

export const spireSnipingI18n = defineFamilyI18n(spireSniping, {
  en: {
    name: "Spire Sniping",
    text: ({ textValue1 }) =>
      `When Spire Sniping is put or turned face up in arsenal, look at the top ${textValue1} cards of your deck, then put them back in any order.`,
    typeText: "Ranger Action - Arrow Attack",
  },
});

export const {
  red: spireSnipingRedI18n,
  yellow: spireSnipingYellowI18n,
  blue: spireSnipingBlueI18n,
} = spireSnipingI18n.cards;
