import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hiroHamadaTeamLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hiro Hamada",
    version: "Team Leader",
    text: [
      {
        title: "I NEED TO UPGRADE ALL OF YOU",
        description: "Your other Inventor characters gain Resist +1.",
      },
      {
        title: "SHAPE THE FUTURE 2",
        description:
          "{I} — Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      },
    ],
  },
  de: {
    name: "Hiro Hamada",
    version: "Teamleiter",
    text: [
      {
        title: "Ich muss jeden Einzelnen von euch upgraden",
        description:
          "Deine anderen Erfinder erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
      {
        title: "Forme die Zukunft",
        description:
          "2 {I} — Schaue dir die oberste Karte deines Decks an. Lege sie anschließend entweder auf dein Deck oder darunter.",
      },
    ],
  },
  fr: {
    name: "Hiro Hamada",
    version: "Leader de l’équipe",
    text: [
      {
        title: "Je vais tous vous mettre à jour",
        description: "Vos autres personnages Inventeur gagnent <Résistance> +1.",
      },
      {
        title: "Façonner l'avenir",
        description:
          "2 {I} — Regardez la carte du dessus de votre pioche. Remettez-la soit sur le dessus de votre pioche, soit en dessous.",
      },
    ],
  },
  it: {
    name: "Hiro Hamada",
    version: "Capo del Team",
    text: [
      {
        title: "Avrete Tutti Bisogno di un Upgrade",
        description: "I tuoi altri personaggi Inventore ottengono <Resistere> +1.",
      },
      {
        title: "Plasmare il Futuro",
        description:
          "2 {I} — Guarda la prima carta del tuo mazzo. Mettila in cima o in fondo al tuo mazzo.",
      },
    ],
  },
};
