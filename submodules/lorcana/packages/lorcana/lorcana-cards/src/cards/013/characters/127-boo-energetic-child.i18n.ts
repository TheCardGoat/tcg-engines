import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const booEnergeticChildI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Boo",
    version: "Energetic Child",
    text: [
      {
        title: "Rush",
      },
      {
        title: "KID-TASTROPHE!",
        description:
          "Whenever this character challenges another character with 3 {S} or less, banish that character. (No damage is dealt in that challenge.)",
      },
    ],
  },
  de: {
    name: "Buh",
    version: "Energiegeladenes Kind",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Kind-tastrophe",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter mit 3 oder weniger {S} herausfordert, verbanne jenen Charakter. (Bevor der Schaden durch die Herausforderung berechnet wird.)",
      },
    ],
  },
  fr: {
    name: "Bouh",
    version: "Enfant énergique",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Kid-Tastrophe!",
        description:
          "Chaque fois que ce personnage défie un autre personnage ayant 3 {S} ou moins, bannissez le personnage défié. (Aucun dommage n'est infligé lors de ce défi.)",
      },
    ],
  },
  it: {
    name: "Boo",
    version: "Energetic Child",
    text: [
      {
        title: "<Rush> (This character can challenge the turn they're played.)",
      },
      {
        title: "Kid-Tastrophe!",
        description:
          "Whenever this character challenges another character with 3 {S} or less, banish that character. (No damage is dealt in that challenge.)",
      },
    ],
  },
  es: {
    name: "Abucheo",
    version: "Niño enérgico",
    text: [
      {
        title: "Correr",
      },
      {
        title: "¡TASTROFE INFANTIL!",
        description:
          "Siempre que este personaje desafíe a otro personaje con 3 {S} o menos, destierra a ese personaje. (No se inflige ningún daño en ese desafío).",
      },
    ],
  },
};
