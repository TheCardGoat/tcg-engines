import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroogeMcduckRichestDuckInTheWorldEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scrooge McDuck",
    version: "Richest Duck in the World",
    text: [
      {
        title: "I'M GOING HOME!",
        description:
          "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
      },
      {
        title: "I DIDN'T GET RICH BY BEING STUPID",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may play an item for free.",
      },
    ],
  },
  de: {
    name: "Dagobert Duck",
    version: "Reichste Ente der Welt",
    text: [
      {
        title: "ICH GEHE NACH HAUSE!",
        description:
          "In deinem Zug erhält dieser Charakter Wendig. (Er kann Charaktere mit Wendig herausfordern.)",
      },
      {
        title: "ICH BIN JA NICHT REICH GEWORDEN, WEIL ICH DUMM BIN",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du einen Gegenstand kostenlos ausspielen.",
      },
    ],
  },
  fr: {
    name: "Balthazar Picsou",
    version: "Canard le plus riche du monde",
    text: [
      {
        title: "JE RENTRE CHEZ MOI",
        description:
          "Durant votre tour, ce personnage gagne Insaisissable. (Il peut défier les personnages avec Insaisissable.)",
      },
      {
        title: "JE NE SUIS PAS DEVENU RICHE EN ÉTANT STUPIDE",
        description:
          "Chaque fois que ce personnage en bannit un autre via un défi durant votre tour, vous pouvez jouer un objet gratuitement.",
      },
    ],
  },
  it: {
    name: "Paperon de' Paperoni",
    version: "Papero più Ricco del Mondo",
    text: [
      {
        title: "VADO A CASA!",
        description:
          "Durante il tuo turno, questo personaggio ottiene Sfuggente. (Può sfidare altri personaggi con Sfuggente.)",
      },
      {
        title: "NON SAREI DIVENTATO RICCO SE FOSSI STUPIDO",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, puoi giocare un oggetto gratis.",
      },
    ],
  },
};
