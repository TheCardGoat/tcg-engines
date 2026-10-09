import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ancestralGuitarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ancestral Guitar",
    text: [
      {
        title: "Musical Legacy",
        description: "When you play this item, draw a card.",
      },
      {
        title: "From the Heart",
        description:
          "{E}, 1 {I} — Chosen character gains Singer and counts as having +2 cost to sing songs this turn.",
      },
    ],
  },
  de: {
    name: "Gitarre der Ahnen",
    text: [
      {
        title: "Musikalisches Vermächtnis",
        description: "Wenn du diesen Gegenstand ausspielst, ziehe 1 Karte.",
      },
      {
        title: "Von Herzen",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug <Singen> und die Kosten dieses Charakters gelten als +2 für das Singen von Liedern.",
      },
    ],
  },
  fr: {
    name: "Guitare ancestrale",
    text: [
      {
        title: "Héritage musical",
        description: "Lorsque vous jouez cet objet, piochez une carte.",
      },
      {
        title: "Avec le cœur",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui gagne <Mélomane> et est considéré comme ayant un coût de +2 pour chanter des chansons pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Chitarra Ancestrale",
    text: [
      {
        title: "Eredità Musicale",
        description: "Quando giochi questo oggetto, pesca una carta.",
      },
      {
        title: "Dal Cuore",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta ottiene <Melodioso> e conta come se avesse costo +2 per cantare le canzoni per questo turno.",
      },
    ],
  },
  es: {
    name: "Ancestral Guitar",
    text: [
      {
        title: "Musical Legacy",
        description: "When you play this item, draw a card.",
      },
      {
        title: "From the Heart",
        description:
          "{E}, 1 {I} — Chosen character gains Singer and counts as having +2 cost to sing songs this turn.",
      },
    ],
  },
};
