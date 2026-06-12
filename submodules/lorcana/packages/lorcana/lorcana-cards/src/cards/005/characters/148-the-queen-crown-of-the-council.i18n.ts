import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenCrownOfTheCouncilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Crown of the Council",
    text: [
      {
        title: "Ward",
      },
      {
        title: "GATHERER OF THE WICKED",
        description:
          "When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Die Krone des Rats",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "VERSAMMLERIN DER ÜBELTÄTER",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du dir die obersten 3 Karten deines Decks anschauen. Du darfst beliebig viele Die-Königin-Charakterkarten daraus aufdecken und auf deine Hand nehmen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "À la tête du Conseil",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "RÉUNIR LES VILAINS",
        description:
          "Lorsque vous jouez ce personnage, regardez les 3 cartes du dessus de votre pioche. Vous pouvez révéler et placer dans votre main autant de cartes Personnage La Reine que vous souhaitez. Remettez le reste des cartes sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "A Capo del Consiglio",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "ADUNATRICE DI CATTIVI",
        description:
          "Quando giochi questo personaggio, guarda le prime 3 carte del tuo mazzo. Puoi rivelare un qualsiasi numero di carte personaggio chiamate Regina e aggiungerle alla tua mano. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
