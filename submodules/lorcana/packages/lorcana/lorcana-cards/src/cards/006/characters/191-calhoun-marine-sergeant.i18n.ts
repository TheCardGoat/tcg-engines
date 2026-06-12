import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const calhounMarineSergeantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Calhoun",
    version: "Marine Sergeant",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "LEVEL UP",
        description:
          "During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Sergeant Calhoun",
    version: "Marinefeldwebel",
    text: [
      {
        title: "Robust +1",
      },
      {
        title: "AUFLEVELN",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Calhoun",
    version: "Sergent",
    text: [
      {
        title: "Résistance +1",
      },
      {
        title: "NIVEAU SUPÉRIEUR",
        description:
          "Pendant votre tour, chaque fois que ce personnage en bannit un autre via un défi, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Calhoun",
    version: "Sergente Marine",
    text: [
      {
        title: "Resistere +1",
      },
      {
        title: "SALIRE DI LIVELLO",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, ottieni 2 leggenda.",
      },
    ],
  },
};
