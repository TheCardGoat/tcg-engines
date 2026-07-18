import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cheshireCatFromTheShadowsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cheshire Cat",
    version: "From the Shadows",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Evasive",
      },
      {
        title: "WICKED SMILE",
        description: "{E} — Banish chosen damaged character.",
      },
    ],
  },
  de: {
    name: "Grinsekatze",
    version: "Aus den Schatten",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Grinsekatze-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Fieses Grinsen",
        description: "{E} — Verbanne einen beschädigten Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Chat du Cheshire",
    version: "Sorti de l'ombre",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Chat du Cheshire.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Sourire malaisant",
        description: "{E} — Choisissez un personnage blessé et banissez-le.",
      },
    ],
  },
  it: {
    name: "Cheshire Cat",
    version: "From the Shadows",
    text: [
      {
        title:
          "<Shift> 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)",
      },
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "Wicked Smile",
        description: "{E} — Banish chosen damaged character.",
      },
    ],
  },
  es: {
    name: "Gato de cheshire",
    version: "De las sombras",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Evasivo",
      },
      {
        title: "SONRISA MALVADA",
        description: "{E}: destierra al personaje dañado elegido.",
      },
    ],
  },
};
