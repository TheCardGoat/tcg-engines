import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckResourcefulMiserI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "Resourceful Miser",
    text: [
      {
        title: "PUT IT TO GOOD USE",
        description: "You may exert 4 items of yours to play this character for free.",
      },
      {
        title: "FORTUNE HUNTER",
        description:
          "When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Einfallsreicher Geizhals",
    text: [
      {
        title: "SETZE ES SINNVOLL EIN",
        description:
          "Du darfst 4 deiner Gegenstände erschöpfen, um diesen Charakter kostenlos auszuspielen.",
      },
      {
        title: "VERMÖGENSJÄGER",
        description:
          "Wenn du diesen Charakter ausspielst, schaue dir die obersten 4 Karten deines Decks an. Du darfst 1 Gegenstandskarte daraus aufdecken und auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Avare plein de ressources",
    text: [
      {
        title: "METTRE À PROFIT",
        description: "Vous pouvez épuiser 4 de vos objets pour jouer ce personnage gratuitement.",
      },
      {
        title: "CHASSEUR DE TRÉSOR",
        description:
          "Lorsque vous jouez ce personnage, regardez les 4 cartes du dessus de votre pioche. Vous pouvez révéler une carte Objet parmi elles et la mettre dans votre main. Placez les autres cartes sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Taccagno Intraprendente",
    text: [
      {
        title: "FARNE BUON USO",
        description: "Puoi impegnare 4 tuoi oggetti per giocare questo personaggio gratis.",
      },
      {
        title: "CACCIATORE DI TESORI",
        description:
          "Quando giochi questo personaggio, guarda le prime 4 carte del tuo mazzo. Puoi rivelare una carta oggetto e aggiungerla alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
