import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const darkwingDuckDarkwarriorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Darkwing Duck",
    version: "Darkwarrior",
    text: [
      {
        title: "Challenger +2",
      },
      {
        title: "INSTA-ARMOR",
        description:
          "During your turn, whenever an item is banished, this character gains Resist +1 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Darkwing Duck",
    version: "Darkwarrior",
    text: [
      {
        title: "<Herausfordern> +2 (Während dieser Charakter herausfordert, erhält er +2 {S}.)",
      },
      {
        title: "Sofort-Rüstung",
        description:
          "Jedes Mal während deines Zuges, wenn ein Gegenstand verbannt wird, erhält dieser Charakter bis zu Beginn deines nächsten Zuges <Robust> +1. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Myster Mask",
    version: "Canard Vador",
    text: [
      {
        title: "<Offensif> +2",
      },
      {
        title: "Insta-armure",
        description:
          "Durant votre tour, chaque fois qu'un objet est banni, ce personnage gagne <Résistance> +1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Darkwing Duck",
    version: "Darkwarrior",
    text: [
      {
        title: "<Sfidante> +2",
      },
      {
        title: "Armatura Istantanea",
        description:
          "Durante il tuo turno, ogni volta che un oggetto viene esiliato, questo personaggio ottiene <Resistere> +1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Pato Ala Oscura",
    version: "Guerrero oscuro",
    text: [
      {
        title: "Retador +2",
      },
      {
        title: "ARMADURA INSTA",
        description:
          "Durante tu turno, cada vez que un objeto es desterrado, este personaje obtiene Resistencia +1 hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
