import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daisyDuckParanormalInvestigatorP3ChallengeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Daisy Duck",
    version: "Paranormal Investigator",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "Support",
      },
      {
        title: "STRANGE HAPPENINGS",
        description: "While this character is exerted, cards enter opponents' inkwells exerted.",
      },
    ],
  },
  de: {
    name: "Daisy Duck",
    version: "Paranormale Ermittlerin",
    text: [
      {
        title:
          "<Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Daisy-Duck-Charaktere auszuspielen.)",
      },
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Merkwürdige Geschehnisse",
        description:
          "Solange dieser Charakter erschöpft ist, betreten gegnerische Karten ihre Tintenvorräte erschöpft.",
      },
    ],
  },
  fr: {
    name: "Daisy",
    version: "Investigatrice du paranormal",
    text: [
      {
        title:
          "<Alter> 4 {I} (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages nommé Daisy.)",
      },
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Étranges phénomènes",
        description:
          "Tant que ce personnage est épuisé, les cartes entrent épuisées dans la réserve d'encre de vos adversaires.",
      },
    ],
  },
  it: {
    name: "Paperina",
    version: "Investigatrice del Paranormale",
    text: [
      {
        title:
          "<Trasformazione> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Paperina.)",
      },
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Strani Fenomeni",
        description:
          "Mentre questo personaggio è impegnato, le carte entrano nei calamai degli avversari impegnate.",
      },
    ],
  },
};
