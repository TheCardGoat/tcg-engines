import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofySuperGoofEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Super Goof",
    text: [
      {
        title: "Rush",
      },
      {
        title: "SUPER PEANUT POWERS",
        description: "Whenever this character challenges another character, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Supergoof",
    text: [
      {
        title: "Rasant",
      },
      {
        title: "SUPER-ERDNUSS-KRÄFTE",
        description:
          "Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Super Dingo",
    text: [
      {
        title: "Charge",
      },
      {
        title: "POUVOIR DES SUPER CACAHUÈTES",
        description: "Chaque fois que ce personnage en défie un autre, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Superpippo",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "POTERE DELLE SUPER ARACHIDI",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, ottieni 2 leggenda.",
      },
    ],
  },
};
