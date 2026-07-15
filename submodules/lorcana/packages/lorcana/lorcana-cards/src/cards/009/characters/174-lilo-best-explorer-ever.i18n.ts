import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liloBestExplorerEverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lilo",
    version: "Best Explorer Ever",
    text: [
      {
        title: "COME ON, PEOPLE, LET'S MOVE",
        description:
          "When you play this character, your other characters gain Challenger +2 this turn (They get +2 {S} while challenging.)",
      },
      {
        title: "GO GET 'EM",
        description:
          'Whenever this character quests, chosen Alien character gains Challenger +2 and "This character can challenge ready characters" this turn.',
      },
    ],
  },
  de: {
    name: "Lilo",
    version: "Beste Entdeckerin aller Zeiten",
    text: [
      {
        title: "Kommt schon, Jungs, Bewegung",
        description:
          "Wenn du diesen Charakter ausspielst, erhalten deine anderen Charaktere in diesem Zug <Herausfordern> +2. (Während sie herausfordern, erhalten sie +2 {S}.)",
      },
      {
        title: "Schnappt sie euch",
        description:
          'Jedes Mal, wenn dieser Charakter erkundet, erhält ein Alien deiner Wahl in diesem Zug <Herausfordern> +2 und "Dieser Charakter kann bereite Charaktere herausfordern".',
      },
    ],
  },
  fr: {
    name: "Lilo",
    version: "La meilleure exploratrice de tous les temps",
    text: [
      {
        title: "Au travail, mes amis, activez-vous",
        description:
          "Lorsque vous jouez ce personnage, vos autres personnages gagnent <Offensif> +2 pour le reste de ce tour.",
      },
      {
        title: "Vas-y, attrape-les",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, choisissez un personnage Alien qui gagne <Offensif> +2 et « Ce personnage peut défier des personnages redressés » pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lilo",
    version: "Migliore Esploratrice di Sempre",
    text: [
      {
        title: "Andiamo Ragazzi, Diamoci una Mossa",
        description:
          "Quando giochi questo personaggio, i tuoi altri personaggi ottengono <Sfidante> +2 per questo turno. (Ricevono +2 {S} mentre stanno sfidando.)",
      },
      {
        title: "Fagli Vedere chi Sei",
        description:
          'Ogni volta che questo personaggio va all\'avventura, un personaggio Alieno a tua scelta ottiene <Sfidante> +2 e "Questo personaggio può sfidare i personaggi preparati" per questo turno.',
      },
    ],
  },
};
