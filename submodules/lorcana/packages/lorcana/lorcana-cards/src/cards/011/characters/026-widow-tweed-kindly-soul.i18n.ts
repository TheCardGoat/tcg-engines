import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const widowTweedKindlySoulI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Widow Tweed",
    version: "Kindly Soul",
    text: [
      {
        title: "I'VE GOT YOU",
        description:
          "When you play this character, return a character card from your discard to your hand. If that character is named Tod, you may play him for free.",
      },
    ],
  },
  de: {
    name: "Witwe Tweed",
    version: "Freundliche Seele",
    text: [
      {
        title: "ICH HAB DICH",
        description:
          "Wenn du diesen Charakter ausspielst, nimm 1 Charakterkarte aus deinem Ablagestapel zurück auf deine Hand. Falls jene Karte eine Cap-Charakterkarte ist, darfst du sie kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Veuve Tartine",
    version: "Âme bienveillante",
    text: [
      {
        title: "JE TE TIENS",
        description:
          "Lorsque vous jouez ce personnage, renvoyez dans votre main une carte Personnage de votre défausse. Si ce personnage-là est nommé Rox, vous pouvez le jouer gratuitement.",
      },
    ],
  },
  it: {
    name: "Signora Tweed",
    version: "Anima Gentile",
    text: [
      {
        title: "CI PENSO IO",
        description:
          "Quando giochi questo personaggio, riprendi in mano una carta personaggio dai tuoi scarti. Se quel personaggio si chiama Red, puoi giocarlo gratis.",
      },
    ],
  },
};
