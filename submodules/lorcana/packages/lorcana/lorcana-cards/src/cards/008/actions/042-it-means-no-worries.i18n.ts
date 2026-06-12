import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const itMeansNoWorriesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "It Means No Worries",
    text: [
      {
        title: "Sing Together 9",
        description:
          "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Die Sorgen bleiben dir immer fern",
    text: "Gemeinsam singen 9 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 9 oder mehr kosten,, damit sie dieses Lied kostenlos singen.) Nimm bis zu 3 Charakterkarten aus deinem Ablagestapel zurück auf deine Hand. Du zahlst 2 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
  },
  fr: {
    name: "Sans aucun souci",
    text: "À l'unisson 9 (Vous pouvez n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 9 ou plus pour chanter cette chanson gratuitement.) Renvoyez dans votre main jusqu'à 3 cartes Personnage de votre défausse. Le prochain personnage que vous jouez ce tour-ci vous coûte 2 de moins.",
  },
  it: {
    name: "Senza Pensieri",
    text: [
      {
        title: "Cantare Insieme 9",
        description:
          "(Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 9 o superiore può per cantare questa canzone gratis.) Riprendi in mano fino a 3 carte personaggio dai tuoi scarti. Paga 2 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
