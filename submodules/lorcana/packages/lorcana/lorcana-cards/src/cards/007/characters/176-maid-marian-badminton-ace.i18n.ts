import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maidMarianBadmintonAceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maid Marian",
    version: "Badminton Ace",
    text: [
      {
        title: "GOOD SHOT",
        description:
          "During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
      },
      {
        title: "FAIR PLAY",
        description: "Your characters named Lady Kluck gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Maid Marian",
    version: "Badminton-Ass",
    text: [
      {
        title: "Ein guter Schlag",
        description:
          "Jedes Mal, wenn einer deiner Verbündeten im Zug einer gegnerischen Person Schaden erhält, füge einem gegnerischen Charakter deiner Wahl 1 Schaden zu.",
      },
      {
        title: "Faires Spiel",
        description:
          "Deine Lady-Gluck-Charaktere erhalten <Robust> +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Belle Marianne",
    version: "As du badminton",
    text: [
      {
        title: "Fort bien joué",
        description:
          "Durant le tour d'un adversaire, chaque fois que l'un de vos personnages Allié subit des dommages, choisissez un personnage adverse et infligez-lui 1 dommage.",
      },
      {
        title: "Esprit sportif",
        description: "Vos personnages Dame Gertrude gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Lady Marian",
    version: "Asso del Volano",
    text: [
      {
        title: "Bel Colpo",
        description:
          "Durante il turno di un avversario, ogni volta che uno dei tuoi personaggi Alleato subisce danno, infliggi 1 danno a un personaggio avversario a tua scelta.",
      },
      {
        title: "Fair Play",
        description: "I tuoi personaggi chiamati Lady Cocca ottengono <Resistere> +1.",
      },
    ],
  },
  es: {
    name: "Criada mariana",
    version: "As del bádminton",
    text: [
      {
        title: "BUEN TIRO",
        description:
          "Durante el turno de un oponente, siempre que uno de tus personajes aliados resulte dañado, inflige 1 daño al personaje contrario elegido.",
      },
      {
        title: "JUEGO JUSTO",
        description: "Tus personajes llamados Lady Kluck obtienen Resistencia +1.",
      },
    ],
  },
};
