import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jafarLampThiefI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jafar",
    version: "Lamp Thief",
    text: [
      {
        title: "I AM YOUR MASTER NOW",
        description:
          "When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      },
    ],
  },
  de: {
    name: "Dschafar",
    version: "Lampendieb",
    text: [
      {
        title: "ICH BIN JETZT DEIN MEISTER",
        description:
          "Wenn du diesen Charakter ausspielst, schaue dir die obersten 2 Karten deines Decks an. Lege 1 davon auf dein Deck und die andere darunter.",
      },
    ],
  },
  fr: {
    name: "Jafar",
    version: "Voleur de lampe",
    text: [
      {
        title: "JE SUIS TON MAÎTRE, À PRÉSENT",
        description:
          "Lorsque vous jouez ce personnage, regardez les 2 premières cartes de votre pioche. Remettez l'une d'elles sur le dessus de votre pioche et l'autre en dessous.",
      },
    ],
  },
  it: {
    name: "Jafar",
    version: "Ladro della Lampada",
    text: [
      {
        title: "SONO IO IL TUO PADRONE ADESSO",
        description:
          "Quando giochi questo personaggio, guarda le prime 2 carte del tuo mazzo. Mettine una in cima al tuo mazzo e l'altra in fondo.",
      },
    ],
  },
};
