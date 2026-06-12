import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const helgaSinclairPreparedForAnythingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Helga Sinclair",
    version: "Prepared for Anything",
    text: [
      {
        title: "Combat Training",
        description:
          "Whenever this character quests, deal 1 damage to chosen opposing character. If 2 or more cards were put into your discard this turn, deal 2 damage instead.",
      },
    ],
  },
  de: {
    name: "Helga Sinclair",
    version: "Auf alles vorbereitet",
    text: [
      {
        title: "Kampftraining",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, füge einem gegnerischen Charakter deiner Wahl 1 Schaden zu. Falls in diesem Zug mindestens 2 Karten auf deinen Ablagestapel gelegt wurden, füge dem gewählten Charakter stattdessen 2 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Helga Sinclair",
    version: "Prête à toute éventualité",
    text: [
      {
        title: "Entraînement au combat",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage adverse et infligez-lui 1 dommage. Si 2 cartes ou plus ont été placées dans votre défausse ce tour-ci, infligez-lui 2 dommages à la place.",
      },
    ],
  },
  it: {
    name: "Helga Sinclair",
    version: "Pronta a Tutto",
    text: [
      {
        title: "Addestramento Militare",
        description:
          "Ogni volta che questo personaggio va all'avventura, infliggi 1 danno a un personaggio avversario a tua scelta. Se 2 o più carte sono state messe nei tuoi scarti in questo turno, infliggi invece 2 danni.",
      },
    ],
  },
};
