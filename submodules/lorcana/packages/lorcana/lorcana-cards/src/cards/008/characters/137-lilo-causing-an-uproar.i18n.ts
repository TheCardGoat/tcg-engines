import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liloCausingAnUproarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lilo",
    version: "Causing an Uproar",
    text: [
      {
        title: "STOMPIN' TIME!",
        description:
          "During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
      },
      {
        title: "RAAAWR!",
        description:
          "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Lilo",
    version: "Aufruhr-Auslöserin",
    text: [
      {
        title: "ZEIT, ZU STAMPFEN!",
        description:
          "Falls du in diesem Zug mindestens 3 Aktionen ausgespielt hast, darfst du diesen Charakter kostenlos ausspielen.",
      },
      {
        title: "ROOOAA!",
        description:
          "Wenn du diesen Charakter ausspielst, mache einen Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Lilo",
    version: "Faisant du raffut",
    text: [
      {
        title: "L'HEURE DU PIÉTINEMENT!",
        description:
          "Durant votre tour, vous pouvez jouer ce personnage gratuitement si vous avez joué 3 actions ou plus lors de ce tour.",
      },
      {
        title: "ROAAAR!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage et redressez-le. Ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lilo",
    version: "Che Scatena un Putiferio",
    text: [
      {
        title: "È TEMPO DI CALPESTARE!",
        description:
          "Durante il tuo turno, se hai giocato 3 o più azioni in questo turno, puoi giocare questo personaggio gratis.",
      },
      {
        title: "ROOOAR!",
        description:
          "Quando giochi questo personaggio, prepara un personaggio a tua scelta. Non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
};
