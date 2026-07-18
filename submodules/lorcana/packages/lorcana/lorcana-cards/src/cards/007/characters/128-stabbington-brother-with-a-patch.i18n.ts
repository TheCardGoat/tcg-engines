import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stabbingtonBrotherWithAPatchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stabbington Brother",
    version: "With a Patch",
    text: [
      {
        title: "CRIME OF OPPORTUNITY",
        description: "When you play this character, chosen opponent loses 1 lore.",
      },
    ],
  },
  de: {
    name: "Stabbington-Bruder",
    version: "Mit Augenklappe",
    text: [
      {
        title: "Verbrechen der Gelegenheit",
        description:
          "Wenn du diesen Charakter ausspielst, verliert eine gegnerische Person deiner Wahl 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Un frère Stabbington",
    version: "Celui avec un cache-œil",
    text: [
      {
        title: "Opportunité crapuleuse",
        description:
          "Lorsque vous jouez ce personnage, choisissez un adversaire qui perd 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Fratello Stabbington",
    version: "Con la Benda",
    text: [
      {
        title: "L'Occasione Fa l'Uomo Ladro",
        description:
          "Quando giochi questo personaggio, un avversario a tua scelta perde 1 leggenda.",
      },
    ],
  },
  es: {
    name: "Hermano Stabbington",
    version: "Con un parche",
    text: [
      {
        title: "DELITO DE OPORTUNIDAD",
        description: "Cuando juegas con este personaje, el oponente elegido pierde 1 conocimiento.",
      },
    ],
  },
};
