import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sleepysFluteI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sleepy's Flute",
    text: [
      {
        title: "A SILLY SONG",
        description: "{E} — If you played a song this turn, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Schlafmütz‘ Flöte",
    text: [
      {
        title: "Gaudium im Unsinn",
        description:
          "{E} — Falls du in diesem Zug mindestens ein Lied ausgespielt hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Flûte de Dormeur",
    text: [
      {
        title: "Chanson Tyrolienne",
        description:
          "{E} — Gagnez 1 éclat de Lore si vous avez joué une chanson durant votre tour.",
      },
    ],
  },
  it: {
    name: "Sleepy's Flute",
    text: [
      {
        title: "A Silly Song",
        description: "{E} — If you played a song this turn, gain 1 lore.",
      },
    ],
  },
};
