import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const herculesYoungRescuerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hercules",
    version: "Young Rescuer",
    text: [
      {
        title: "HEROIC SACRIFICE",
        description:
          "When you play this character, you may discard your hand. If you do, return a card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Hercules",
    version: "Junger Retter",
    text: [
      {
        title: "Heroisches Opfer",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du alle Karten von deiner Hand abwerfen. Wenn du dies tust, nimm 1 Karte aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Hercule",
    version: "Jeune sauveur",
    text: [
      {
        title: "Sacrifice héroïque",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez défausser votre main. Si vous le faites, renvoyez dans votre main une carte de votre défausse.",
      },
    ],
  },
  it: {
    name: "Ercole",
    version: "Giovane Soccorritore",
    text: [
      {
        title: "Sacrificio Eroico",
        description:
          "Quando giochi questo personaggio, puoi scartare la tua mano. Se lo fai, riprendi in mano una carta dai tuoi scarti.",
      },
    ],
  },
};
