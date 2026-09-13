import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { skyFireLanterns } from "./sky-fire-lanterns.ts";

export const skyFireLanternsI18n = defineFamilyI18n(skyFireLanterns, {
  en: {
    name: "Sky Fire Lanterns",
    text: (color) =>
      `Reveal the top card of your deck. If it's ${color}, create a Runechant token.\nGo again`,
    typeText: "Runeblade Action",
  },
});

export const {
  red: skyFireLanternsRedI18n,
  yellow: skyFireLanternsYellowI18n,
  blue: skyFireLanternsBlueI18n,
} = skyFireLanternsI18n.cards;
