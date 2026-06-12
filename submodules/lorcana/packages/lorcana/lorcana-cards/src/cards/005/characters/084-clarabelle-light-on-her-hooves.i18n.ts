import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const clarabelleLightOnHerHoovesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Clarabelle",
    version: "Light on Her Hooves",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "KEEP IN STEP",
        description:
          "At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
      },
    ],
  },
  de: {
    name: "Klarabella",
    version: "Mit leichten Hufen",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "IM TAKT BLEIBEN",
        description:
          "Am Ende deines Zuges, wenn eine gegnerische Person deiner Wahl mehr Karten auf der Hand hat als du, darfst du so viele Karten ziehen, bis ihr die selbe Anzahl an Handkarten habt.",
      },
    ],
  },
  fr: {
    name: "Clarabelle",
    version: "Au sabot léger",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "GARDER L'ALLURE",
        description:
          "À la fin de votre tour, choisissez un adversaire. S'il a plus de cartes en main que vous, vous pouvez piocher pour en avoir autant que lui.",
      },
    ],
  },
  it: {
    name: "Clarabella",
    version: "Zoccoli Leggiadri",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "STARE AL PASSO",
        description:
          "Alla fine del tuo turno, se un avversario a tua scelta ha più carte in mano di te, puoi pescare carte finché non ne hai lo stesso numero.",
      },
    ],
  },
};
