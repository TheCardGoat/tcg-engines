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
        title: "VERBRECHEN DER GELEGENHEIT",
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
        title: "OPPORTUNITÉ CRAPULEUSE",
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
        title: "L'OCCASIONE FA L'UOMO LADRO",
        description:
          "Quando giochi questo personaggio, un avversario a tua scelta perde 1 leggenda.",
      },
    ],
  },
};
