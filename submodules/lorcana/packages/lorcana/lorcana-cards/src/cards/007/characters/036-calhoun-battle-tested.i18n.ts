import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const calhounBattletestedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Calhoun",
    version: "Battle-Tested",
    text: [
      {
        title: "TACTICAL ADVANTAGE",
        description:
          "When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Sergeant Calhoun",
    version: "Kampferprobt",
    text: [
      {
        title: "TAKTISCHER VORTEIL",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du eine Karte von deiner Hand auswählen und abwerfen, um einem gegnerischen Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -3 zu geben.",
      },
    ],
  },
  fr: {
    name: "Calhoun",
    version: "Aguerrie",
    text: [
      {
        title: "AVANTAGE TACTIQUE",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez défausser une carte pour choisir un personnage adverse qui subit -3 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Calhoun",
    version: "Testata in Battaglia",
    text: [
      {
        title: "VANTAGGIO TATTICO",
        description:
          "Quando giochi questo personaggio, puoi scegliere e scartare una carta per dare a un personaggio avversario a tua scelta -3 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
