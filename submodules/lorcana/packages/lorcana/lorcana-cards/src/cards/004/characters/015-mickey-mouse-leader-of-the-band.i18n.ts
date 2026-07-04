import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseLeaderOfTheBandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Leader of the Band",
    text: [
      {
        title: "Support",
      },
      {
        title: "STRIKE UP THE MUSIC",
        description: "When you play this character, chosen character gains Support this turn.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Dirigent",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Die Musik aufdrehen",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug <Unterstützen>.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Chef de la fanfare",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "En avant la musique!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne <Soutien> pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Direttore della Banda",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Attaccare il Pezzo",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene <Aiutante> per questo turno.",
      },
    ],
  },
};
