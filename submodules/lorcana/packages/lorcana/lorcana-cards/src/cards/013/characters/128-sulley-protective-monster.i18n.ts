import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sulleyProtectiveMonsterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sulley",
    version: "Protective Monster",
    text: [
      {
        title: "Fearsome Glare",
        description: "When you play this character, you may exert all cards in your inkwell.",
      },
      {
        title: "Riled Up",
        description:
          "While all cards in your inkwell are exerted, this character gains <Rush>. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Sulley",
    version: "Beschützendes Monster",
    text: [
      {
        title: "Furchterregender Blick",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du alle Karten in deinem Tintenvorrat erschöpfen.",
      },
      {
        title: "Aufgebracht",
        description:
          "Solange alle Karten in deinem Tintenvorrat erschöpft sind, erhält dieser Charakter <Rasant>. (Er kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Sulli",
    version: "Monstre protecteur",
    text: [
      {
        title: "Regard effrayant",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez épuiser toutes les cartes dans votre réserve d'encre.",
      },
      {
        title: "Exaspéré",
        description:
          "Tant que toutes les cartes de votre réserve d'encre sont épuisées, ce personnage gagne <Charge>.",
      },
    ],
  },
  it: {
    name: "Sulley",
    version: "Mostro Protettivo",
    text: [
      {
        title: "Occhiataccia Spaventosa",
        description:
          "Quando giochi questo personaggio, puoi impegnare tutte le carte nel tuo calamaio.",
      },
      {
        title: "Agitato",
        description:
          "Mentre tutte le carte nel tuo calamaio sono impegnate, questo personaggio ottiene <Lesto>. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
  es: {
    name: "Sulley",
    version: "Monstruo protector",
    text: [
      {
        title: "Mirada temible",
        description:
          "Cuando juegas con este personaje, puedes ejercer todas las cartas en tu tintero.",
      },
      {
        title: "irritado",
        description:
          "Mientras todas las cartas en tu tintero están agotadas, este personaje gana <Rush>. (Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
