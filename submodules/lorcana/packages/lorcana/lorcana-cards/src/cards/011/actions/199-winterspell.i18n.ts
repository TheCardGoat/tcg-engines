import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const winterspellI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Winterspell",
    text: "Chosen location of yours can't be challenged until the start of your next turn. Draw a card.",
  },
  de: {
    name: "Winterzauber",
    text: "Wähle einen deiner Orte. Jener kann bis zu Beginn deines nächsten Zuges nicht herausgefordert werden. Ziehe 1 Karte.",
  },
  fr: {
    name: "Givresort",
    text: "Choisissez l'un de vos lieux qui ne peut pas être défié jusqu'au début de votre prochain tour. Piochez une carte.",
  },
  it: {
    name: "Incanto d'Inverno",
    text: "Un tuo luogo a tua scelta non può essere sfidato fino all'inizio del tuo prossimo turno. Pesca una carta.",
  },
};
