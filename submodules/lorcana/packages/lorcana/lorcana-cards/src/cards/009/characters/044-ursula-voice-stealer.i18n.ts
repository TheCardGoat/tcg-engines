import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulaVoiceStealerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula",
    version: "Voice Stealer",
    text: [
      {
        title: "SING FOR ME",
        description:
          "When you play this character, exert chosen opposing ready character. Then, you may play a song with cost equal to or less than the exerted character's cost for free.",
      },
    ],
  },
  de: {
    name: "Ursula",
    version: "Stimmendiebin",
    text: [
      {
        title: "SING FÜR MICH",
        description:
          "Wenn du diesen Charakter ausspielst, erschöpfe einen gegnerischen, bereiten Charakter deiner Wahl. Dann darfst du ein Lied, das maximal so viel wie der erschöpfte Charakter kostet, kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Ursula",
    version: "Voleuse de voix",
    text: [
      {
        title: "CHANTE POUR MOI",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage redressé adverse et épuisez-le. Ensuite, vous pouvez jouer gratuitement une chanson avec un coût égal ou inférieur au coût du personnage ainsi épuisé.",
      },
    ],
  },
  it: {
    name: "Ursula",
    version: "Ladra di Voci",
    text: [
      {
        title: "CANTA PER ME",
        description:
          "Quando giochi questo personaggio, impegna un personaggio avversario preparato a tua scelta. Poi, puoi giocare una canzone con costo pari o inferiore al costo del personaggio impegnato, gratis.",
      },
    ],
  },
};
