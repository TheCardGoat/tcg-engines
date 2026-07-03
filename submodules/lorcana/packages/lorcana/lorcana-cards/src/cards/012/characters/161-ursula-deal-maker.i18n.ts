import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulaDealMakerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula",
    version: "Deal Maker",
    text: [
      {
        title: "QUITE THE BARGAIN",
        description:
          "When you play this character and whenever she quests, another chosen character gets +1 {L} this turn.",
      },
      {
        title: "BY THE WAY",
        description:
          "At the end of your turn, if this character is exerted, put chosen character of yours into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Ursula",
    version: "Vertrags-Erstellerin",
    text: [
      {
        title: "Ein echtes Schnäppchen",
        description:
          "Wenn du diesen Charakter ausspielst und jedes Mal, wenn er erkundet, erhält ein anderer Charakter deiner Wahl in diesem Zug +1 {L}.",
      },
      {
        title: "Nebenbei bemerkt",
        description:
          "Am Ende deines Zuges, falls dieser Charakter erschöpft ist, wähle einen deiner Charaktere und lege ihn verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Ursula",
    version: "Conclut un marché",
    text: [
      {
        title: "Une bonne affaire",
        description:
          "Lorsque vous jouez ce personnage et chaque fois qu'il est envoyé à l'aventure, choisissez un autre personnage qui gagne +1 {L} pour le reste de ce tour.",
      },
      {
        title: "À propos",
        description:
          "À la fin de votre tour, si ce personnage est épuisé, choisissez l'un de vos personnages et placez-le dans votre réserve d'encre, face cachée et épuisé.",
      },
    ],
  },
  it: {
    name: "Ursula",
    version: "Affarista",
    text: [
      {
        title: "Che Bell'Affare",
        description:
          "Quando giochi questo personaggio e ogni volta che va all'avventura, un altro personaggio a tua scelta riceve +1 {L} per questo turno.",
      },
      {
        title: "A Proposito",
        description:
          "Alla fine del tuo turno, se questo personaggio è impegnato, aggiungi un tuo personaggio a tua scelta al tuo calamaio, a faccia in giù e impegnato.",
      },
    ],
  },
};
