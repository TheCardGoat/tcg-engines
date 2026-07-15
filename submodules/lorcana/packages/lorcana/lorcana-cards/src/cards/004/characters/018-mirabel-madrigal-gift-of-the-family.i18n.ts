import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mirabelMadrigalGiftOfTheFamilyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mirabel Madrigal",
    version: "Gift of the Family",
    text: [
      {
        title: "Support",
      },
      {
        title: "SAVING THE MIRACLE",
        description:
          "Whenever this character quests, your other Madrigal characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Mirabel Madrigal",
    version: "Gabe der Familie",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Rettung des Wunders",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine anderen Madrigal in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Mirabel Madrigal",
    version: "Don de la famille",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Sauver le Miracle",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages Madrigal gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mirabel Madrigal",
    version: "Dono della Famiglia",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Salvare il Miracolo",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi Madrigal ricevono +1 {L} per questo turno.",
      },
    ],
  },
};
