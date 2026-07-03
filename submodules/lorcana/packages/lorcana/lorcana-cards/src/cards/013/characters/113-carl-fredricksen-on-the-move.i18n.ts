import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const carlFredricksenOnTheMoveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Carl Fredricksen",
    version: "On the Move",
    text: [
      {
        title: "MOVING PARTNER",
        description:
          "Whenever you play a location, you may move this character and up to 1 of your other characters to that location for free.",
      },
      {
        title: "ADVENTURE AWAITS",
        description:
          "Whenever this character quests while at a location, draw cards equal to that location's {}.",
      },
    ],
  },
  de: {
    name: "Carl Fredricksen",
    version: "Im Umzug",
    text: [
      {
        title: "Umzugspartner",
        description:
          "Jedes Mal, wenn du einen Ort ausspielst, darfst du diesen Charakter und bis zu einen deiner anderen Charaktere kostenlos zu jenem Ort bewegen.",
      },
      {
        title: "Das Abenteuer wartet",
        description:
          "Jedes Mal, wenn dieser Charakter an einem Ort erkundet, ziehe so viele Karten, wie der {L}-Wert des Ortes beträgt.",
      },
    ],
  },
  fr: {
    name: "Carl Fredricksen",
    version: "Qui déménage",
    text: [
      {
        title: "Partenaire de déménagement",
        description:
          "Chaque fois que vous jouez un lieu, vous pouvez déplacer ce personnage ainsi que jusqu'à 1 autre de vos personnages sur ce lieu gratuitement.",
      },
      {
        title: "L'aventure nous attend",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure sur un lieu, piochez autant de cartes que le {L} de ce lieu.",
      },
    ],
  },
  it: {
    name: "Carl Fredricksen",
    version: "In Viaggio",
    text: [
      {
        title: "Partner di Trasloco",
        description:
          "Ogni volta che giochi un luogo, puoi spostare questo personaggio e fino a 1 dei tuoi altri personaggi in quel luogo, gratis.",
      },
      {
        title: "L'Avventura ci Aspetta",
        description:
          "Ogni volta che questo personaggio va all'avventura mentre si trova in un luogo, pesca carte pari al {L} di quel luogo.",
      },
    ],
  },
};
