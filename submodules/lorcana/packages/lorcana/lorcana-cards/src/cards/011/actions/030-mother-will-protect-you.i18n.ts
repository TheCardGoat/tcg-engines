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
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage qui ne peut pas être défié jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Sai che ti proteggo",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta non può essere sfidato fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Madre te protegerá",
    text: "El personaje elegido no puede ser desafiado hasta el comienzo de tu siguiente turno.",
  },
};
