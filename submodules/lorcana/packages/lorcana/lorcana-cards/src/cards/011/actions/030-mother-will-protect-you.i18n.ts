import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const motherWillProtectYouI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mother Will Protect You",
    text: "Chosen character can't be challenged until the start of your next turn.",
  },
  de: {
    name: "Mutter wird dich beschützen",
    text: "Ein Charakter deiner Wahl kann bis zu Beginn deines nächsten Zuges nicht herausgefordert werden.",
  },
  fr: {
    name: "Maman te protégera",
    text: "Choisissez un personnage qui ne peut pas être défié jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Sai che ti proteggo",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta non può essere sfidato fino all'inizio del tuo prossimo turno.",
  },
};
