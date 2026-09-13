import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { onTheHorizon } from "./on-the-horizon.ts";

export const onTheHorizonI18n = defineFamilyI18n(onTheHorizon, {
  en: {
    name: "On the Horizon",
    text: "When this defends, look at the top card of your deck.",
    typeText: "Generic Block",
  },
});

export const {
  red: onTheHorizonRedI18n,
  yellow: onTheHorizonYellowI18n,
  blue: onTheHorizonBlueI18n,
} = onTheHorizonI18n.cards;
