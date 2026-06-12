import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kuzcoTemporaryWhaleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kuzco",
    version: "Temporary Whale",
    text: [
      {
        title: "DON'T YOU SAY A WORD",
        description:
          "Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
      },
    ],
  },
  de: {
    name: "Kusco",
    version: "Vorübergehender Wal",
    text: [
      {
        title: "WEHE, DU SAGST JETZT WAS",
        description:
          "Einmal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, darfst du einen Charakter, Gegenstand oder Ort deiner Wahl, der 2 oder weniger kostet, zurück auf die zugehörige Hand schicken. Wer jenen im Spiel hatte, zieht 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Kuzco",
    version: "Provisoirement en baleine",
    text: [
      {
        title: "SANS COMMENTAIRE",
        description:
          "Une seule fois durant votre tour, lorsqu'une carte est placée dans votre réserve d'encre, vous pouvez choisir un personnage, un objet ou un lieu coûtant 2 ou moins et le renvoyer dans la main de son propriétaire. Ce joueur pioche ensuite une carte.",
      },
    ],
  },
  it: {
    name: "Kuzco",
    version: "Balena per Poco",
    text: [
      {
        title: "NON DIRE NULLA",
        description:
          "Una volta durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, puoi far riprendere in mano al suo giocatore un personaggio, un oggetto o un luogo a tua scelta con costo 2 o inferiore, poi quel giocatore pesca una carta.",
      },
    ],
  },
};
