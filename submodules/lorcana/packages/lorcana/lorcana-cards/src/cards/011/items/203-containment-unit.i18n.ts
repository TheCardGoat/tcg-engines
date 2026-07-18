import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const containmentUnitI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Containment Unit",
    text: [
      {
        title: "GOT YOU NOW",
        description:
          "When you play this item, choose a character. They can't challenge or quest while this item is in play.",
      },
      {
        title: "POWER SUPPLY",
        description: "At the start of your turn, choose and discard a card or banish this item.",
      },
    ],
  },
  de: {
    name: "Experimentkapsel",
    text: [
      {
        title: "Endlich hab ich dich",
        description:
          "Wenn du diesen Gegenstand ausspielst, wähle einen Charakter. Er kann nicht mehr erkunden oder herausfordern, solange dieser Gegenstand im Spiel ist.",
      },
      {
        title: "Stromversorgung",
        description:
          "Zu Beginn deines Zuges, wähle eine Karte aus deiner Hand und wirf sie ab oder verbanne diesen Gegenstand.",
      },
    ],
  },
  fr: {
    name: "Unité de confinement",
    text: [
      {
        title: "Je t'ai attrapé",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage. Il ne peut pas défier ou être envoyé à l'aventure tant que cet objet est en jeu.",
      },
      {
        title: "Source d'énergie",
        description: "Au début de votre tour, défaussez une carte ou bannissez cet objet.",
      },
    ],
  },
  it: {
    name: "Unità di Contenimento",
    text: [
      {
        title: "Adesso Ti Ho Preso",
        description:
          "Quando giochi questo oggetto, scegli un personaggio. Non può sfidare o andare all'avventura mentre questo oggetto è in gioco.",
      },
      {
        title: "Fonte di Energia",
        description: "All'inizio del tuo turno, scegli e scarta una carta o esilia questo oggetto.",
      },
    ],
  },
  es: {
    name: "Unidad de Contención",
    text: [
      {
        title: "TE TENGO AHORA",
        description:
          "Cuando juegues este objeto, elige un personaje. No pueden desafiar ni realizar misiones mientras este objeto esté en juego.",
      },
      {
        title: "FUENTE DE ENERGÍA",
        description: "Al comienzo de tu turno, elige y descarta una carta o destierra este objeto.",
      },
    ],
  },
};
