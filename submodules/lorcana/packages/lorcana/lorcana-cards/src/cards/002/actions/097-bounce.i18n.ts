import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bounceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bounce",
    text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  },
  de: {
    name: "Herumspringen",
    text: "Wähle einen deiner Charaktere und nimm ihn zurück auf deine Hand, um einen Charakter deiner Wahl zurück auf die zugehörige Hand zu schicken.",
  },
  fr: {
    name: "Rebondir",
    text: "Choisissez l'un de vos personnages et renvoyez-le dans votre main pour renvoyer un personnage adverse dans la main de son propriétaire.",
  },
  it: {
    name: "Bounce",
    text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  },
};
