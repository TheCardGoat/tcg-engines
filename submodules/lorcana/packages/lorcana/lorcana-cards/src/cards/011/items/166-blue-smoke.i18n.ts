import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const blueSmokeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Blue Smoke",
    text: [
      {
        title: "THEATRICAL ENTRANCE",
        description:
          "If you have a character named Darkwing Duck in play, you pay 1 {I} less to play this item.",
      },
      {
        title: "CLOUD OF MYSTERY",
        description:
          "{E}, 1 {I}, Banish this item — Chosen character gains Ward until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Blauer Rauch",
    text: [
      {
        title: "THEATRALISCHER EINGANG",
        description:
          "Falls du einen Darkwing-Duck-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Gegenstand auszuspielen.",
      },
      {
        title: "MYSTERIÖSE WOLKE,",
        description:
          "1, Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Behütet. (Gegnerische Mitspielende können den Charakter nicht auswählen, außer um ihn herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Fumée bleue",
    text: [
      {
        title: "ENTRÉE THÉÂTRALE",
        description:
          "Jouer cet objet vous coûte 1 de moins si vous avez un personnage Myster Mask en jeu.",
      },
      {
        title: "NUAGE DE",
        description:
          "MYSTÈRE, 1, Bannissez cet objet — Choisissez un personnage qui gagne Hors d'atteinte jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Fumo Blu",
    text: [
      {
        title: "ENTRATA TEATRALE",
        description:
          "Se hai in gioco un personaggio chiamato Darkwing Duck, paga 1 in meno per giocare questo oggetto.",
      },
      {
        title: "NUVOLA DI MISTERO, 1,",
        description:
          "esilia questo oggetto — Un personaggio a tua scelta ottiene Protetto fino all'inizio del tuo prossimo turno. (Gli avversari non possono sceglierlo se non per sfidarlo.)",
      },
    ],
  },
};
