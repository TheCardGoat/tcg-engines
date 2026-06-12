import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainHookThePirateKingEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Hook",
    version: "The Pirate King",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "GIVE 'EM ALL YOU GOT!",
        description:
          "Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn.",
      },
    ],
  },
  de: {
    name: "Käpt'n Hook",
    version: "König der Piraten",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "GEBT IHNEN DEN REST!",
        description:
          "Einmal während deines Zuges, wenn ein gegnerischer Charakter beschädigt wird, erhalten deine Piraten in diesem Zug +2 und Robust +2. (Reduziere jeglichen Schaden, der den Charakteren zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Capitaine Crochet",
    version: "Le roi des pirates",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "DONNEZ TOUT CE QUE VOUS AVEZ!",
        description:
          "Une fois durant votre tour, lorsqu'un personnage adverse subit un dommage ou plus, vos personnages Pirate gagnent +2 et Résistance +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Capitan Uncino",
    version: "Il Re dei Pirati",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "DATECI DENTRO FINO ALL'ULTIMO!",
        description:
          "Una volta durante il tuo turno, ogni volta che un personaggio avversario viene danneggiato, i tuoi personaggi Pirata ricevono +2 e ottengono Resistere +2 per questo turno.",
      },
    ],
  },
};
