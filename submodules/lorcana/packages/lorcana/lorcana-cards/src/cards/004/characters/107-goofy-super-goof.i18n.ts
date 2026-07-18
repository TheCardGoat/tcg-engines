import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofySuperGoofI18n: Record<Languages, I18nProperties> = {
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
        title: "<Rasant>",
      },
      {
        title: "Super-Erdnuss-Kräfte",
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
        title: "<Charge>",
      },
      {
        title: "Pouvoir des Super Cacahuètes",
        description: "Chaque fois que ce personnage en défie un autre, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Superpippo",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Potere delle Super Arachidi",
        description:
          "Ogni volta che questo personaggio sfida un altro personaggio, ottieni 2 leggenda.",
      },
    ],
  },
  es: {
    name: "Mentecato",
    version: "Súper tonto",
    text: [
      {
        title: "Correr",
      },
      {
        title: "SÚPER PODERES DEL MANÍ",
        description: "Siempre que este personaje desafíe a otro personaje, gana 2 conocimientos.",
      },
    ],
  },
};
