import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { seekHorizon } from "./seek-horizon.ts";

export const seekHorizonI18n = defineFamilyI18n(seekHorizon, {
  en: {
    name: "Seek Horizon",
    text: "As an additional cost to play Seek Horizon, you may put a card from your hand on top of your deck. If you do, Seek Horizon gains go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: seekHorizonRedI18n,
  yellow: seekHorizonYellowI18n,
  blue: seekHorizonBlueI18n,
} = seekHorizonI18n.cards;
