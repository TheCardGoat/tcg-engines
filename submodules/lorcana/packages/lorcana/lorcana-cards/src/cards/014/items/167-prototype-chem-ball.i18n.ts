import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const prototypeChemBallI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prototype Chem Ball",
    text: [
      {
        title: "Destabilize",
        description: "{E}, 2 {I} — Banish this item.",
      },
      {
        title: "Enigma Burst",
        description:
          "During your turn, when this item is banished, you may get 1 ink drop. If you do, chosen character of yours gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1. You may remove an ink drop to pay 1 {I}.)",
      },
    ],
  },
  de: {
    name: "Chemieball-Prototyp",
    text: [
      {
        title: "Destabilisieren",
        description: "{E}, 2 {I} — Verbanne diesen Gegenstand.",
      },
      {
        title: "Rätselhafter Ausbruch",
        description:
          "Wenn dieser Gegenstand in deinem Zug verbannt wird, darfst du 1 Tintentropfen erschaffen. Wenn du dies tust, erhält ein Charakter deiner Wahl bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1. Ein Tintentropfen kann entfernt werden, um 1 {I} zu bezahlen.)",
      },
    ],
  },
  fr: {
    name: "Prototype de boule chimique",
    text: [
      {
        title: "Déstabilisation",
        description: "{E}, 2 {I} — Bannissez cet objet.",
      },
      {
        title: "Explosion énigmatique",
        description:
          "Durant votre tour, lorsque cet objet est banni, vous pouvez gagner 1 goutte d'encre. Si vous le faites, choisissez l'un de vos personnages qui gagne <Résistance> +1 jusqu'au début de votre prochain tour. (Les dommages qui lui sont infligés sont réduits de 1. Vous pouvez retirer l'une de vos gouttes d'encre pour payer 1 {I}.)",
      },
    ],
  },
  it: {
    name: "Sfera Chimica Prototipo",
    text: [
      {
        title: "Destabilizzare",
        description: "{E}, 2 {I} — Esilia questo oggetto.",
      },
      {
        title: "Lampo Enigmatico",
        description:
          "Durante il tuo turno, quando questo oggetto viene esiliato, puoi ricevere 1 goccia d'inchiostro. Se lo fai, un tuo personaggio a tua scelta ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno. (Il danno che gli viene inflitto è ridotto di 1. Puoi rimuovere una goccia d'inchiostro per pagare 1 {I}.)",
      },
    ],
  },
  es: {
    name: "Prototype Chem Ball",
    text: [
      {
        title: "Destabilize",
        description: "{E}, 2 {I} — Banish this item.",
      },
      {
        title: "Enigma Burst",
        description:
          "During your turn, when this item is banished, you may get 1 ink drop. If you do, chosen character of yours gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1. You may remove an ink drop to pay 1 {I}.)",
      },
    ],
  },
};
