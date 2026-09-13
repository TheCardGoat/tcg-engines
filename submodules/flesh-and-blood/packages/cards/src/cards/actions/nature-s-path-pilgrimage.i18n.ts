import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { natureSPathPilgrimage } from "./nature-s-path-pilgrimage.ts";

export const natureSPathPilgrimageI18n = defineFamilyI18n(natureSPathPilgrimage, {
  en: {
    name: "Nature's Path Pilgrimage",
    text: ({
      value1,
    }) => `Your next weapon attack this turn gains +${value1}{p} and "If this hits and you have no cards in your arsenal, reveal the top card of your deck. If it's an action card, put it face down into your arsenal."
Go again`,
    typeText: "Warrior Action",
  },
});

export const {
  red: natureSPathPilgrimageRedI18n,
  yellow: natureSPathPilgrimageYellowI18n,
  blue: natureSPathPilgrimageBlueI18n,
} = natureSPathPilgrimageI18n.cards;
