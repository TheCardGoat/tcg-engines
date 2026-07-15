import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const helgaSinclairNoBackupNeededI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Helga Sinclair",
    version: "No Backup Needed",
    text: [
      {
        title: "CRISIS MANAGEMENT",
        description:
          "If 2 or more cards were put into your discard this turn, you pay 2 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Helga Sinclair",
    version: "Keine Unterstützung erforderlich",
    text: [
      {
        title: "Krisenmanagement",
        description:
          "Falls in diesem Zug mindestens 2 Karten auf deinen Ablagestapel gelegt wurden, zahlst du 2 {I} weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Helga Sinclair",
    version: "N'a pas besoin de renfort",
    text: [
      {
        title: "Gestion de crise",
        description:
          "Jouer ce personnage vous coûte 2 {I} de moins si 2 cartes ou plus ont été placées dans votre défausse ce tour-ci.",
      },
    ],
  },
  it: {
    name: "Helga Sinclair",
    version: "Senza Bisogno di Rinforzi",
    text: [
      {
        title: "Gestione delle Crisi",
        description:
          "Se 2 o più carte sono state messe nei tuoi scarti in questo turno, paga 2 {I} in meno per giocare questo personaggio.",
      },
    ],
  },
};
