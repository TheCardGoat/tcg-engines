import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const naniHeistMastermindI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nani",
    version: "Heist Mastermind",
    text: [
      {
        title: "STICK TO THE PLAN",
        description: "{E} — Another chosen character gains Resist +2 this turn.",
      },
      {
        title: "IT'S UP TO YOU, LILO",
        description:
          "Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
    ],
  },
  de: {
    name: "Nani",
    version: "Diebisches Superhirn",
    text: [
      {
        title: "Halte dich an den Plan",
        description:
          "{E} — Ein anderer Charakter deiner Wahl erhält in diesem Zug <Robust> +2. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
      },
      {
        title: "Es liegt an dir, Lilo",
        description:
          "Deine Lilo-Charaktere erhalten <Unterstützen>. (Jedes Mal, wenn die Charaktere erkunden, darfst du ihre {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
    ],
  },
  fr: {
    name: "Nani",
    version: "Cerveau du vol",
    text: [
      {
        title: "S'en tenir au plan",
        description:
          "{E} — Choisissez un autre personnage qui gagne <Résistance> +2 pour le reste de ce tour.",
      },
      {
        title: "À toi de jouer, Lilo",
        description:
          "Vos personnages nommés Lilo gagnent <Soutien>. (Lorsque ces personnages sont envoyés à l'aventure, vous pouvez ajouter leur {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
    ],
  },
  it: {
    name: "Nani",
    version: "Ideatrice del Colpo",
    text: [
      {
        title: "Attieniti al Piano",
        description:
          "{E} — Un altro personaggio a tua scelta ottiene <Resistere> +2 per questo turno.",
      },
      {
        title: "Tocca a Te, Lilo",
        description:
          "I tuoi personaggi chiamati Lilo ottengono <Aiutante>. (Ogni volta che vanno all'avventura, puoi aggiungere la loro {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
    ],
  },
};
