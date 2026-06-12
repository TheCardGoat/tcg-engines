import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rayaFierceProtectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Raya",
    version: "Fierce Protector",
    text: [
      {
        title: "DON'T CROSS ME",
        description:
          "Whenever this character challenges another character, gain 1 lore for each other damaged character you have in play.",
      },
    ],
  },
  de: {
    name: "Raya",
    version: "Treue Beschützerin",
    text: [
      {
        title: "KOMM MIR NICHT IN DIE QUERE",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, sammelst du 1 Legende für jeden deiner anderen Charaktere, der beschädigt ist.",
      },
    ],
  },
  fr: {
    name: "Raya",
    version: "Protectrice acharnée",
    text: [
      {
        title: "NE ME CONTRARIEZ PAS",
        description:
          "Chaque fois que ce personnage en défie un autre, gagnez 1 éclat de Lore pour chaque autre personnage que vous avez en jeu ayant au moins un jeton Dommage.",
      },
    ],
  },
  it: {
    name: "Raya",
    version: "Protettrice Feroce",
    text: [
      {
        title: "NON PROVOCARMI",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, ottieni 1 leggenda per ogni altro personaggio danneggiato che hai in gioco.",
      },
    ],
  },
};
