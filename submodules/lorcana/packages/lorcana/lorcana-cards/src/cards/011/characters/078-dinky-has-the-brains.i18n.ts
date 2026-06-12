import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dinkyHasTheBrainsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dinky",
    version: "Has the Brains",
    text: [
      {
        title: "GET HIM!",
        description:
          "When you play this character, each opponent chooses one of their characters and deals 1 damage to them.",
      },
    ],
  },
  de: {
    name: "Dinky",
    version: "Der mit dem Verstand",
    text: [
      {
        title: "SCHNAPP IHN!",
        description:
          "Wenn du diesen Charakter ausspielst, wählen alle gegnerischen Mitspielenden je einen ihrer Charaktere und fügen diesem 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Dinky",
    version: "A le cerveau",
    text: [
      {
        title: "ATTRAPE-LE!",
        description:
          "Lorsque vous jouez ce personnage, chaque adversaire choisit l'un de ses personnages et lui inflige 1 dommage.",
      },
    ],
  },
  it: {
    name: "Cippi",
    version: "Quello con il Cervello",
    text: [
      {
        title: "PRENDILO!",
        description:
          "Quando giochi questo personaggio, ogni avversario sceglie uno dei suoi personaggi e gli infligge 1 danno.",
      },
    ],
  },
};
