import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rollyChubbyPuppyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rolly",
    version: "Chubby Puppy",
    text: [
      {
        title: "Support",
      },
      {
        title: "ADORABLE ANTICS",
        description:
          "When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Rolly",
    version: "Pummeliger Welpe",
    text: [
      {
        title:
          "<Unterstützen> (Jedes Mal, wenn dieser Charakter erkundet, darfst du seine {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Entzückende Possen",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Charakterkarte aus deinem Ablagestapel verdeckt und erschöpft in deinen Tintenvorrat legen.",
      },
    ],
  },
  fr: {
    name: "Rolly",
    version: "Chiot potelé",
    text: [
      {
        title:
          "<Soutien> (Lorsque ce personnage est envoyé à l'aventure, vous pouvez ajouter sa {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Adorables cabrioles",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez placer une carte Personnage de votre défausse dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Rolly",
    version: "Cucciolo Cicciottello",
    text: [
      {
        title:
          "<Aiutante> (Ogni volta che questo personaggio va all'avventura, puoi aggiungere la sua {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Scenate Adorabili",
        description:
          "Quando giochi questo personaggio, puoi aggiungere al tuo calamaio una carta personaggio dai tuoi scarti, a faccia in giù e impegnata.",
      },
    ],
  },
};
