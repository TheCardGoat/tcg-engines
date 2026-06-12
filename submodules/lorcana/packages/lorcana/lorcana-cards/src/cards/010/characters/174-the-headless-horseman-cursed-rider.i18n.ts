import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theHeadlessHorsemanCursedRiderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Headless Horseman",
    version: "Cursed Rider",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "WITCHING HOUR",
        description:
          "When you play this character, each player draws 3 cards, then discards 3 cards at random. Choose an opposing character and deal 2 damage to them for each action card discarded this way.",
      },
    ],
  },
  de: {
    name: "Der kopflose Reiter",
    version: "Verfluchter Reiter",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "GEISTERSTUNDE",
        description:
          "Wenn du diesen Charakter ausspielst, ziehen alle Mitspielenden (auch du) je 3 Karten und werfen dann 3 zufällig ausgewählte Karten von ihrer Hand ab. Wähle danach einen gegnerischen Charakter und füge diesem für jede auf diese Weise abgeworfene Aktionskarte 2 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Le Cavalier sans tête",
    version: "Cavalier maudit",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "HEURE ANGOISSANTE",
        description:
          "Lorsque vous jouez ce personnage, chaque joueur pioche 3 cartes, puis se défausse de 3 cartes au hasard. Choisissez un personnage adverse et infligez-lui 2 dommages pour chaque carte Action défaussée ainsi.",
      },
    ],
  },
  it: {
    name: "Il Cavaliere Senza Testa",
    version: "Cavaliere Maledetto",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "L'ORA PIÙ PROPIZIA AGLI INCANTESIMI",
        description:
          "Quando giochi questo personaggio, ogni giocatore pesca 3 carte, poi scarta 3 carte a caso. Scegli un personaggio avversario e infliggigli 2 danni per ogni carta azione scartata in questo modo.",
      },
    ],
  },
};
