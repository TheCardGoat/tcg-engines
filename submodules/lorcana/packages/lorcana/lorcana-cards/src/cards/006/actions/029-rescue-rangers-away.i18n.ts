import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rescueRangersAwayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rescue Rangers Away!",
    text: "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
  },
  de: {
    name: "Rettungstruppe! Auf geht’s!",
    text: "Zähle deine Charaktere im Spiel. Ein Charakter deiner Wahl verliert so viel wie diese Anzahl bis zu Beginn deines nächsten Zuges.",
  },
  fr: {
    name: "Rangers du risque à la rescousse !",
    text: "Comptez le nombre de personnages que vous avez en jeu, puis choisissez un personnage qui perd autant de jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Agenti Speciali all'Attacco!",
    text: "Conta il numero di personaggi che hai in gioco. Un personaggio a tua scelta perde pari a quel numero fino all'inizio del tuo prossimo turno.",
  },
};
