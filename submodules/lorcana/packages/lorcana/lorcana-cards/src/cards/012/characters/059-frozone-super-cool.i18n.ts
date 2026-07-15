import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const frozoneSuperCoolI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Frozone",
    version: "Super Cool",
    text: [
      {
        title: "Rush",
      },
      {
        title: "JUST CHILL",
        description:
          "When you play this character, if you have another Super character in play, you may exert chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Frozone",
    version: "Supercool",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Entspann dich",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen weiteren Super im Spiel hast, darfst du einen gegnerischen Charakter deiner Wahl erschöpfen.",
      },
    ],
  },
  fr: {
    name: "Frozone",
    version: "Super Cool",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Jette un froid",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un autre personnage Super en jeu, vous pouvez choisir un personnage adverse et l'épuiser.",
      },
    ],
  },
  it: {
    name: "Siberius",
    version: "Super Cool",
    text: [
      {
        title: "<Lesto>",
      },
      {
        title: "Raffredda gli Animi",
        description:
          "Quando giochi questo personaggio, se hai in gioco un altro personaggio Super, puoi impegnare un personaggio avversario a tua scelta.",
      },
    ],
  },
};
