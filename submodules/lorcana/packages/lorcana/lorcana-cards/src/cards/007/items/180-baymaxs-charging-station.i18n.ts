import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const baymaxsChargingStationI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baymax's Charging Station",
    text: [
      {
        title: "ENERGY CONVERTER",
        description:
          "Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Baymax’ Ladestation",
    text: [
      {
        title: "Energiewandler",
        description:
          "Jedes Mal, wenn du mithilfe von <Gestaltwandel> eine Flutgestalt ausspielst, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Chargeur de Baymax",
    text: [
      {
        title: "Convertisseur d'énergie",
        description:
          "Chaque fois que vous jouez un personnage Floodborn en utilisant sa capacité <Alter>, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Stazione di Ricarica di Baymax",
    text: [
      {
        title: "Convertitore di Energia",
        description:
          "Ogni volta che giochi un personaggio Imbevuto, se hai usato <Trasformazione> per giocarlo, puoi pescare una carta.",
      },
    ],
  },
  es: {
    name: "Estación de carga de Baymax",
    text: [
      {
        title: "CONVERTIDOR DE ENERGÍA",
        description:
          "Siempre que juegues con un personaje Floodborn, si usaste Shift para jugarlo, puedes robar una carta.",
      },
    ],
  },
};
