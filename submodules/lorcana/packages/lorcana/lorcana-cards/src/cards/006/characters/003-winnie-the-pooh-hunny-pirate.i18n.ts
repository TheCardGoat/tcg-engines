import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const winnieThePoohHunnyPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Winnie the Pooh",
    version: "Hunny Pirate",
    text: [
      {
        title: "Support",
      },
      {
        title: "WE'RE PIRATES, YOU SEE",
        description:
          "Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.",
      },
    ],
  },
  de: {
    name: "Winnie Puuh",
    version: "Honigpirat",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Wir sind Piraten, siehst du?",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 1 {I} weniger für den nächsten Piraten, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Winnie l'ourson",
    version: "Pirate miel sabords",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "On est des pirates, vous voyez",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, le prochain personnage Pirate que vous jouez ce tour-ci coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Winnie the Pooh",
    version: "Pirata del Miele",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Siamo dei Pirati, Sai?",
        description:
          "Ogni volta che questo personaggio va all'avventura, paga 1 {I} in meno per giocare il tuo prossimo personaggio Pirata per questo turno.",
      },
    ],
  },
};
