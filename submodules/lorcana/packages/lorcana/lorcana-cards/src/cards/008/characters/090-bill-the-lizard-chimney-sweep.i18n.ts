import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const billTheLizardChimneySweepI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bill the Lizard",
    version: "Chimney Sweep",
    text: [
      {
        title: "NOTHING TO IT",
        description: "While another character in play has damage, this character gains Evasive.",
      },
    ],
  },
  de: {
    name: "Bill, die Eidechse",
    version: "Schornsteinfeger",
    text: [
      {
        title: "Das schaffst du doch",
        description:
          "Solange mindestens ein anderer Charakter im Spiel beschädigt ist, erhält dieser Charakter <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Bill le Lézard",
    version: "Ramoneur",
    text: [
      {
        title: "C'est très facile à faire",
        description:
          "Tant qu'un autre personnage en jeu a au moins un dommage sur lui, ce personnage-ci gagne <Insaisissable>.",
      },
    ],
  },
  it: {
    name: "Biagio Lucertola",
    version: "Spazzacamino",
    text: [
      {
        title: "Roba da Ragazzi",
        description:
          "Mentre un altro personaggio in gioco ha danno, questo personaggio ottiene <Sfuggente>. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
  es: {
    name: "Bill el lagarto",
    version: "Deshollinador",
    text: [
      {
        title: "NADA DE ESO",
        description: "Mientras otro personaje en juego tenga daño, este personaje gana Evasión.",
      },
    ],
  },
};
