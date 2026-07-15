import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const boltSuperdogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bolt",
    version: "Superdog",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "MARK OF POWER",
        description:
          "Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
      },
      {
        title: "BOLT STARE",
        description: "{E} — Banish chosen Illusion character.",
      },
    ],
  },
  de: {
    name: "Bolt",
    version: "Superhund",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Bolt-Charaktere auszuspielen.)",
      },
      {
        title: "Das Zeichen meiner Kraft",
        description:
          "Jedes Mal, wenn du diesen Charakter bereit machst, sammelst du 1 Legende für jeden deiner anderen unbeschädigten Charaktere im Spiel.",
      },
      {
        title: "Bolt-Laserblick",
        description: "{E} — Verbanne eine Illusion deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Volt",
    version: "Superchien",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Volt.)",
      },
      {
        title: "La marque de mon pouvoir",
        description:
          "Chaque fois que vous redressez ce personnage, pour chacun de vos autres personnages sans dommage en jeu, gagnez 1 éclat de Lore.",
      },
      {
        title: "Yeux laser",
        description: "{E} — Choisissez un personnage Illusion et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Bolt",
    version: "Superdog",
    text: [
      {
        title:
          "<Shift> 3 (You may pay 3 {I} to play this on top of one of your characters named Bolt.)",
      },
      {
        title: "Mark of Power",
        description:
          "Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
      },
      {
        title: "Bolt Stare",
        description: "{E} — Banish chosen Illusion character.",
      },
    ],
  },
};
