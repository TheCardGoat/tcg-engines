import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const letTheStormRageOnI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Let the Storm Rage On",
    text: "Deal 2 damage to chosen character. Draw a card.",
  },
  de: {
    name: "Ein Sturm zieht auf",
    text: "Füge einem Charakter deiner Wahl 2 Schaden zu. Ziehe 1 Karte.",
  },
  fr: {
    name: "Perdue dans l'hiver",
    text: "Choisissez un personnage et infligez-lui 2 dommages. Piochez une carte.",
  },
  it: {
    name: "Ecco Qua la Tempesta",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Infliggi 2 danni a un personaggio a tua scelta. Pesca una carta.",
  },
};
