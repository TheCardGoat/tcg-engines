import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const basilSecretInformerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Basil",
    version: "Secret Informer",
    text: [
      {
        title: "DRAW THEM OUT",
        description:
          "Whenever this character quests, opposing damaged characters gain Reckless during their next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Basil",
    version: "Geheimer Informant",
    text: [
      {
        title: "LOCKE SIE HERAUS",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten gegnerische beschädigte Charaktere in ihrem nächsten Zug Impulsiv. (Sie können nicht erkunden und müssen herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Basil",
    version: "Informateur secret",
    text: [
      {
        title: "LES APPÂTER",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, les personnages adverses avec au moins un dommage gagnent Combattant durant leur prochain tour. (Ils ne peuvent pas être envoyés à l'aventure et doivent défier s'il le peuvent.)",
      },
    ],
  },
  it: {
    name: "Basil",
    version: "Informatore Segreto",
    text: [
      {
        title: "ATTIRARLI ALLO SCOPERTO",
        description:
          "Ogni volta che questo personaggio va all'avventura, i personaggi danneggiati avversari ottengono Attaccabrighe durante il loro prossimo turno. (Non possono andare all'avventura e devono sfidare, se possibile.)",
      },
    ],
  },
};
