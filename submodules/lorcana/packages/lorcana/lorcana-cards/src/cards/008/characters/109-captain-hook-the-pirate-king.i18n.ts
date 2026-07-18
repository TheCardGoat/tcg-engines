import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainHookThePirateKingI18n: Record<Languages, I18nProperties> = {
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
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Käpt'n-Hook-Charaktere auszuspielen.)",
      },
      {
        title: "Gebt ihnen den Rest!",
        description:
          "Einmal während deines Zuges, wenn ein gegnerischer Charakter Schaden erhält, erhalten deine Piraten in diesem Zug +2 {S} und <Robust> +2. (Reduziere jeglichen Schaden, der den Charakteren zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Capitaine Crochet",
    version: "Le roi des pirates",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Capitaine Crochet.)",
      },
      {
        title: "Donnez tout ce que vous avez!",
        description:
          "Une fois durant votre tour, lorsqu'un personnage adverse subit un dommage ou plus, vos personnages Pirate gagnent +2 {S} et <Résistance> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Capitan Uncino",
    version: "Il Re dei Pirati",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Capitan Uncino.)",
      },
      {
        title: "Dateci Dentro Fino all'Ultimo!",
        description:
          "Una volta durante il tuo turno, ogni volta che un personaggio avversario subisce danno, i tuoi personaggi Pirata ricevono +2 {S} e ottengono <Resistere> +2 per questo turno.",
      },
    ],
  },
  es: {
    name: "Capitán Garfio",
    version: "El rey pirata",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "¡DALES TODO LO QUE TIENES!",
        description:
          "Una vez durante tu turno, cada vez que un personaje contrario resulta dañado, tus personajes piratas obtienen +2 {S} y obtienen Resistencia +2 este turno.",
      },
    ],
  },
};
