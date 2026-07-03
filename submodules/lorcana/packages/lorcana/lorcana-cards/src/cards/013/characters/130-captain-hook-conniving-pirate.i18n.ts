import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const captainHookConnivingPirateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Captain Hook",
    version: "Conniving Pirate",
    text: [
      {
        title: "Have At You",
        description: "Whenever this character challenges another character, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Käpt'n Hook",
    version: "Hinterhältiger Pirat",
    text: [
      {
        title: "Ich krieg dich",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Capitaine Crochet",
    version: "Pirate fourbe",
    text: [
      {
        title: "En garde",
        description: "Chaque fois que ce personnage en défie un autre, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Capitan Uncino",
    version: "Subdolo Pirata",
    text: [
      {
        title: "In Guardia",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, ottieni 1 leggenda.",
      },
    ],
  },
};
