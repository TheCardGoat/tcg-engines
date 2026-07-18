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
        title:
          "<Gestaltwandel> 5 {I} (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Der-kopflose-Reiter-Charaktere auszuspielen.)",
      },
      {
        title: "Geisterstunde",
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
        title:
          "<Alter> 5 {I} (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages nommé Le Cavalier sans tête.)",
      },
      {
        title: "Heure angoissante",
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
        title:
          "<Trasformazione> 5 {I} (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Il Cavaliere Senza Testa.)",
      },
      {
        title: "L'Ora più Propizia agli Incantesimi",
        description:
          "Quando giochi questo personaggio, ogni giocatore pesca 3 carte, poi scarta 3 carte a caso. Scegli un personaggio avversario e infliggigli 2 danni per ogni carta azione scartata in questo modo.",
      },
    ],
  },
  es: {
    name: "El jinete sin cabeza",
    version: "Jinete maldito",
    text: [
      {
        title: "Cambio 5 {I}",
      },
      {
        title: "HORA DE LAS BRUJAS",
        description:
          "Cuando juegas con este personaje, cada jugador roba 3 cartas y luego descarta 3 cartas al azar. Elige un personaje contrario y hazle 2 daños por cada carta de acción descartada de esta manera.",
      },
    ],
  },
};
