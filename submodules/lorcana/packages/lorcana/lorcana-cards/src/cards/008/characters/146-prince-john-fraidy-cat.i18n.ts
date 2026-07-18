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
    text: "Hilfe! Hilfe! Jedes Mal, wenn eine gegnerische Person einen Charakter ausspielt, füge diesem Charakter 1 Schaden zu.",
  },
  fr: {
    name: "Prince Jean",
    version: "Poule mouillée",
    text: "À moi! À moi! Chaque fois que votre adversaire joue un personnage, infligez 1 dommage à ce personnage-ci.",
  },
  it: {
    name: "Principe Giovanni",
    version: "Pavido",
    text: "Aiuto! Aiuto! Ogni volta che un avversario gioca un personaggio, infliggi 1 danno a questo personaggio.",
  },
  es: {
    name: "Príncipe juan",
    version: "Gato asustadizo",
    text: [
      {
        title: "¡AYUDA!",
      },
      {
        title: "¡AYUDA!",
        description:
          "Siempre que un oponente juegue con un personaje, inflige 1 daño a este personaje.",
      },
    ],
  },
};
