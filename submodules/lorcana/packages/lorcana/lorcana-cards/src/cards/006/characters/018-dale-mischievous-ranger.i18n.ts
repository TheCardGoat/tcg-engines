import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daleMischievousRangerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dale",
    version: "Mischievous Ranger",
    text: [
      {
        title: "NUTS ABOUT PRANKS",
        description:
          "When you play this character, you may put the top 3 cards of your deck into your discard to give chosen character -3 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Chap",
    version: "Schelmischer Ritter des Rechts",
    text: [
      {
        title: "ICH STEH AUF STREICHE",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du die obersten 3 Karten deines Decks auf deinen Ablagestapel legen, um einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -3 zu geben.",
      },
    ],
  },
  fr: {
    name: "Tac",
    version: "Ranger malicieux",
    text: [
      {
        title: "BLAGUEUR À LA NOIX",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez placer les trois premières cartes de votre pioche dans votre défausse pour choisir un personnage qui subit -3 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Ciop",
    version: "Agente Speciale Dispettoso",
    text: [
      {
        title: "MATTO PER GLI SCHERZI",
        description:
          "Quando giochi questo personaggio, puoi mettere le prime 3 carte del tuo mazzo nei tuoi scarti per dare a un personaggio a tua scelta -3 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
