import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mowgliManCubI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mowgli",
    version: "Man Cub",
    text: [
      {
        title: "HAVE",
        description:
          "A BETTER LOOK When you play this character, chosen opponent reveals their hand and discards a non-character card of their choice.",
      },
    ],
  },
  de: {
    name: "Mogli",
    version: "Menschenkind",
    text: [
      {
        title: "Das muss ich genau sehen",
        description:
          "Wenn du diesen Charakter ausspielst, zeigt einer der gegnerischen Mitspielenden deiner Wahl alle Handkarten für alle sichtbar vor und wirft eine Karte, die keine Charakterkarte ist, ab.",
      },
    ],
  },
  fr: {
    name: "Mowgli",
    version: "Petit d'Homme",
    text: [
      {
        title: "Voir de plus près",
        description:
          "Lorsque vous jouez ce personnage, choisissez un adversaire qui révèle sa main et défausse une carte non-Personnage de son choix.",
      },
    ],
  },
  it: {
    name: "Mowgli",
    version: "Cucciolo d'Uomo",
    text: [
      {
        title: "Guardare Meglio",
        description:
          "Quando giochi questo personaggio, un avversario a tua scelta rivela la sua mano e scarta una carta non personaggio a sua scelta.",
      },
    ],
  },
};
