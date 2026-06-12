import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const restoringAtlantisEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Restoring Atlantis",
    text: "Your characters can't be challenged until the start of your next turn.",
  },
  de: {
    name: "Wiederherstellung von Atlantis",
    text: "Deine Charaktere können bis zu Beginn deines nächsten Zuges nicht herausgefordert werden.",
  },
  fr: {
    name: "Reconstruire l’Atlantide",
    text: "Vos personnages ne peuvent pas être défiés jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Ricostruire Atlantide",
    text: [
      {
        title: "I",
        description:
          "tuoi personaggi non possono essere sfidati fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
