import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nothingWeWontDoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nothing We Won't Do",
    text: [
      {
        title: "Sing Together 8",
        description:
          "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
      },
      {
        title:
          "Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
      },
    ],
  },
  de: {
    name: "Für immer und immer",
    text: "Gemeinsam singen 8 (Du kannst beliebig viele deiner Charaktere oder Charaktere deiner Teammitglieder, die zusammen 8 oder mehr kosten,, damit sie dieses Lied kostenlos singen.) Mache alle deine Charaktere bereit. Sie erhalten in diesem Zug keinen Schaden durch Herausforderungen und können nicht mehr erkunden.",
  },
  fr: {
    name: "Il n'est rien de plus beau !",
    text: "À l'unisson 8 (Vous pouvez n'importe quel nombre de vos personnages ou de personnages de vos coéquipiers coûtant au total 8 ou plus pour chanter cette chanson gratuitement.) Redressez tous vos personnages. Pour le reste de ce tour, ils ne subissent aucun dommage lors des défis et ils ne peuvent pas être envoyés à l'aventure.",
  },
  it: {
    name: "È Questa la Vita",
    text: [
      {
        title: "Cantare Insieme 8",
        description:
          "(Un qualsiasi numero di personaggi tuoi o dei tuoi compagni di squadra con costo totale 8 o superiore può per cantare questa canzone gratis.) Prepara tutti i tuoi personaggi. Per il resto di questo turno, non subiscono danni dalle sfide e non possono andare all'avventura.",
      },
    ],
  },
};
