import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plutoDeterminedDefenderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pluto",
    version: "Determined Defender",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Bodyguard",
      },
      {
        title: "GUARD DOG",
        description: "At the start of your turn, remove up to 3 damage from this character.",
      },
    ],
  },
  de: {
    name: "Pluto",
    version: "Entschlossener Verteidiger",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "Beschützen",
      },
      {
        title: "WACHHUND",
        description: "Zu Beginn deines Zuges, entferne bis zu 3 Schaden von diesem Charakter.",
      },
    ],
  },
  fr: {
    name: "Pluto",
    version: "Protecteur déterminé",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "Rempart",
      },
      {
        title: "CHIEN DE GARDE",
        description: "Au début de votre tour, retirez jusqu'à 3 jetons Dommage de ce personnage.",
      },
    ],
  },
  it: {
    name: "Pluto",
    version: "Guardia Risoluta",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "Guardiano",
      },
      {
        title: "CANE DA GUARDIA",
        description: "All'inizio del tuo turno, rimuovi fino a 3 danni da questo personaggio.",
      },
    ],
  },
};
