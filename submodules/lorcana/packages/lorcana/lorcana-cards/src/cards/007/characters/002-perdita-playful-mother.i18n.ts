import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const perditaPlayfulMotherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Perdita",
    version: "Playful Mother",
    text: [
      {
        title: "WHO'S NEXT?",
        description:
          "Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.",
      },
      {
        title: "DON'T BE AFRAID",
        description: "Your Puppy characters gain Ward.",
      },
    ],
  },
  de: {
    name: "Perdi",
    version: "Verspielte Mutter",
    text: [
      {
        title: "WER KOMMT ALS NÄCHSTES?",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 2 weniger für den nächsten Welpen, den du in diesem Zug ausspielst.",
      },
      {
        title: "HABT KEINE ANGST",
        description:
          "Deine Welpen erhalten Behütet. (Gegnerische Mitspielende können diese Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Perdita",
    version: "Mère joueuse",
    text: [
      {
        title: "À QUI LE TOUR?",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, le prochain personnage Chiot que vous jouez ce tour-ci vous coûte 2 de moins.",
      },
      {
        title: "N'AIE PAS PEUR",
        description:
          "Vos personnages Chiot gagnent Hors d'atteinte. (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Peggy",
    version: "Madre Giocosa",
    text: [
      {
        title: "A CHI TOCCA?",
        description:
          "Ogni volta che questo personaggio va all'avventura, paga 2 in meno per giocare il tuo prossimo personaggio Cucciolo per questo turno.",
      },
      {
        title: "NON AVER PAURA I",
        description:
          "tuoi personaggi Cucciolo ottengono Protetto. (Gli avversari non possono sceglierli se non per sfidarli.)",
      },
    ],
  },
};
