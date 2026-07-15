import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const safeAndSoundI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Safe and Sound",
    text: "Chosen character of yours can't be challenged until the start of your next turn.",
  },
  de: {
    name: "Gesund und munter",
    text: "Wähle einen deiner Charaktere. Jener kann bis zu Beginn deines nächsten Zuges nicht herausgefordert werden.",
  },
  fr: {
    name: "Sain et sauf",
    text: "Choisissez l'un de vos personnages qui ne pourra pas être défié jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Al Sicuro",
    text: "Un tuo personaggio a tua scelta non può essere sfidato fino all'inizio del tuo prossimo turno.",
  },
};
