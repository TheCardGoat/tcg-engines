import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ednaModeFashionDesignerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Edna Mode",
    version: "Fashion Designer",
    text: [
      {
        title: "NO CAPES!",
        description:
          "When you play this character, you may return chosen item with cost 2 or less to its player's hand. If you do, its player draws a card.",
      },
      {
        title: "MAKING SUPERS FABULOUS",
        description: "Whenever this character quests, your Super characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Edna Mode",
    version: "Modedesignerin",
    text: [
      {
        title: "Kein Cape!",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einen Gegenstand deiner Wahl, der 2 oder weniger kostet, zurück auf die zugehörige Hand schicken. Wenn du dies tust, zieht die Person, die den Gegenstand im Spiel hatte, 1 Karte.",
      },
      {
        title: "Superhelden zum Strahlen bringen",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine Super in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Edna Mode",
    version: "Créatrice de mode",
    text: [
      {
        title: "Pas de capes!",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un objet coûtant 2 ou moins et le renvoyer dans la main de son propriétaire. Si vous le faites, son propriétaire pioche une carte.",
      },
      {
        title: "Rendre les Supers superbes",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos personnages Super gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Edna Mode",
    version: "Stilista",
    text: [
      {
        title: "Niente Mantello!",
        description:
          "Quando giochi questo personaggio, puoi far riprendere in mano al suo giocatore un oggetto a tua scelta con costo 2 o inferiore. Se lo fai, il suo giocatore pesca una carta.",
      },
      {
        title: "Rendere i Super Favolosi",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi personaggi Super ricevono +1 {L} per questo turno.",
      },
    ],
  },
};
