import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const darkwingDuckShadowySuperheroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Darkwing Duck",
    version: "Shadowy Superhero",
    text: [
      {
        title: "Preemptive Strike",
        description: "When you play this character, you may deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Darkwing Duck",
    version: "Schattenhafter Superheld",
    text: [
      {
        title: "Präventivschlag",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du einem Charakter deiner Wahl 1 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Myster Mask",
    version: "Super-héros de l'ombre",
    text: [
      {
        title: "Frappe préventive",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un personnage et lui infliger 1 dommage.",
      },
    ],
  },
  it: {
    name: "Darkwing Duck",
    version: "Supereroe Ombroso",
    text: [
      {
        title: "Colpo Preventivo",
        description:
          "Quando giochi questo personaggio, puoi infliggere 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
