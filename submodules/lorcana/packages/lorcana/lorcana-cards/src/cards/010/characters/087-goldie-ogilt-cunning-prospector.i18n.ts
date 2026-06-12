import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goldieOgiltCunningProspectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goldie O'Gilt",
    version: "Cunning Prospector",
    text: [
      {
        title: "CLAIM JUMPER",
        description:
          "When you play this character, chosen opponent reveals their hand and discards a location card of your choice.",
      },
      {
        title: "STRIKE GOLD",
        description:
          "Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Glitzer Goldie",
    version: "Schlaue Schürferin",
    text: [
      {
        title: "ANSPRUCHSERHEBERIN",
        description:
          "Wenn du diesen Charakter ausspielst, zeigt einer der gegnerischen Mitspielenden deiner Wahl alle Handkarten für alle sichtbar vor und wirft eine Ortskarte deiner Wahl ab.",
      },
      {
        title: "GOLD SCHÜRFEN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du 1 Ortskarte aus einem gegnerischen Ablagestapel unter das zugehörige Deck legen, um 1 Legende zu sammeln.",
      },
    ],
  },
  fr: {
    name: "Goldie O'Gilt",
    version: "Prospectrice rusée",
    text: [
      {
        title: "PILLEUSE DE GISEMENT",
        description:
          "Lorsque vous jouez ce personnage, choisissez un adversaire qui révèle sa main et défausse une carte Lieu de votre choix.",
      },
      {
        title: "TROUVER UN FILON",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un joueur et placer une carte Lieu de sa défausse sous sa pioche pour gagner 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Doretta Doremì",
    version: "Cercatrice Astuta",
    text: [
      {
        title: "LADRA DI CONCESSIONI",
        description:
          "Quando giochi questo personaggio, un avversario a tua scelta rivela la sua mano e scarta una carta luogo a tua scelta.",
      },
      {
        title: "TROVARE L'ORO",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi mettere una carta luogo dagli scarti di un giocatore a tua scelta in fondo al suo mazzo per ottenere 1 leggenda.",
      },
    ],
  },
};
