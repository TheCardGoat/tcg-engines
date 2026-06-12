import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenDivinerEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Diviner",
    text: [
      {
        title: "CONSULT THE SPELLBOOK",
        description:
          "{E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Wahrsagerin",
    text: [
      {
        title: "DAS ZAUBERBUCH BEFRAGEN",
        description:
          "— Schaue dir die obersten 4 Karten deines Decks an. Du darfst 1 Gegenstandskarte daraus aufdecken und auf deine Hand nehmen. Falls dieser Gegenstand 3 oder weniger kostet, darfst du ihn stattdessen kostenlos und erschöpft ausspielen. Lege die restlichen Karten in beliebiger Reihenfolge unter dein Deck.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Devineresse",
    text: [
      {
        title: "CONSULTE LE GRIMOIRE MAGIQUE",
        description:
          "— Regardez les 4 premières cartes de votre pioche. Vous pouvez révéler une carte Objet et l'ajouter à votre main. Si cet objet coûte 3 ou moins, vous pouvez le jouer gratuitement à la place, épuisé. Remettez le reste des cartes sous votre pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Regina",
    version: "Divinatrice",
    text: [
      {
        title: "CONSULTARE IL GRIMORIO",
        description:
          "— Guarda le prime 4 carte del tuo mazzo. Puoi rivelare una carta oggetto e aggiungerla alla tua mano. Se quell'oggetto costa 3 o meno, puoi invece giocarlo gratis ed entra in gioco impegnato. Metti il resto in fondo al tuo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
