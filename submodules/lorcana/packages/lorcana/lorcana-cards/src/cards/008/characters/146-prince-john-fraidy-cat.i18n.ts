import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeJohnFraidycatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince John",
    version: "Fraidy-Cat",
    text: [
      {
        title: "HELP!",
      },
      {
        title: "HELP!",
        description: "Whenever an opponent plays a character, deal 1 damage to this character.",
      },
    ],
  },
  de: {
    name: "Prinz John",
    version: "Angstkatze",
    text: [
      {
        title: "HILFE!",
      },
      {
        title: "HILFE!",
        description:
          "Jedes Mal, wenn eine gegnerische Person einen Charakter ausspielt, füge diesem Charakter 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Prince Jean",
    version: "Poule mouillée",
    text: [
      {
        title: "À MOI!",
      },
      {
        title: "À MOI!",
        description:
          "Chaque fois que votre adversaire joue un personnage, infligez 1 dommage à ce personnage-ci.",
      },
    ],
  },
  it: {
    name: "Principe Giovanni",
    version: "Pavido",
    text: [
      {
        title: "AIUTO!",
      },
      {
        title: "AIUTO!",
        description:
          "Ogni volta che un avversario gioca un personaggio, infliggi 1 danno a questo personaggio.",
      },
    ],
  },
};
