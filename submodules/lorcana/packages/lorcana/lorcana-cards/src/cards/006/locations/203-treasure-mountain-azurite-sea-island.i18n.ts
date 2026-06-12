import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const treasureMountainAzuriteSeaIslandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Treasure Mountain",
    version: "Azurite Sea Island",
    text: [
      {
        title: "SECRET WEAPON",
        description:
          "At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
      },
    ],
  },
  de: {
    name: "Der Schatzberg",
    version: "Insel im Azurblauen Meer",
    text: [
      {
        title: "GEHEIMWAFFE",
        description:
          "Zu Beginn deines Zuges, zähle deine Charaktere an diesem Ort. Füge einem Charakter oder einem Ort deiner Wahl dieselbe Anzahl Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Montagne au trésor",
    version: "Île de la mer Azurite",
    text: [
      {
        title: "ARME SECRÈTE",
        description:
          "Au début de votre tour, choisissez un personnage ou un lieu et infligez-lui autant de dommages qu'il y a de personnages sur ce lieu.",
      },
    ],
  },
  it: {
    name: "Montagna del Tesoro",
    version: "Isola del Mare di Azzurrite",
    text: [
      {
        title: "ARMA SEGRETA",
        description:
          "All'inizio del tuo turno, infliggi danno a un personaggio o a un luogo a tua scelta pari al numero di personaggi in questo luogo.",
      },
    ],
  },
};
