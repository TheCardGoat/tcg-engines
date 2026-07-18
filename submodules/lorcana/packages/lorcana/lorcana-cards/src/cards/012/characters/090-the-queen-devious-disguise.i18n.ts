import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenDeviousDisguiseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Devious Disguise",
    text: [
      {
        title: "EVIL SCHEME",
        description:
          "When you play this character, you may draw a card. If you do, each opponent gains 2 lore.",
      },
      {
        title: "JEALOUS HEART",
        description: "While an opponent has more lore than you, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Hinterhältige Verkleidung",
    text: [
      {
        title: "Verlockendes Angebot",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Karte ziehen. Wenn du dies tust, sammeln alle gegnerischen Mitspielenden je 2 Legenden.",
      },
      {
        title: "Eifersüchtiges Herz",
        description:
          "Solange mindestens eine gegnerische Person mehr Legenden als du hat, erhält dieser Charakter +2 {L}.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Déguisement sournois",
    text: [
      {
        title: "Plan maléfique",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez piocher une carte. Si vous le faites, chaque adversaire gagne 2 éclats de Lore.",
      },
      {
        title: "Cœur jaloux",
        description:
          "Tant qu'un adversaire a plus d'éclats de Lore que vous, ce personnage gagne +2 {L}.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "Subdolo Travestimento",
    text: [
      {
        title: "Piano Malvagio",
        description:
          "Quando giochi questo personaggio, puoi pescare una carta. Se lo fai, ogni avversario ottiene 2 leggenda.",
      },
      {
        title: "Cuore Invidioso",
        description:
          "Mentre un avversario ha più leggenda di te, questo personaggio riceve +2 {L}.",
      },
    ],
  },
  es: {
    name: "La reina",
    version: "Disfraz tortuoso",
    text: [
      {
        title: "ESQUEMA MALVADO",
        description:
          "Cuando juegas con este personaje, puedes robar una carta. Si lo haces, cada oponente gana 2 conocimientos.",
      },
      {
        title: "CORAZÓN CELOSO",
        description:
          "Mientras un oponente tenga más conocimiento que tú, este personaje obtiene +2 {L}.",
      },
    ],
  },
};
