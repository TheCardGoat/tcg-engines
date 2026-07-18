import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const perditaPlayfulMotherP2ChallengeI18n: Record<Languages, I18nProperties> = {
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
        title: "Wer kommt als Nächstes?",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 2 {I} weniger für den nächsten Welpen, den du in diesem Zug ausspielst.",
      },
      {
        title: "Habt keine Angst",
        description:
          "Deine Welpen erhalten <Behütet>. (Gegnerische Mitspielende können diese Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Perdita",
    version: "Mère joueuse",
    text: [
      {
        title: "À qui le tour?",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, le prochain personnage Chiot que vous jouez ce tour-ci vous coûte 2 {I} de moins.",
      },
      {
        title: "N'aie pas peur",
        description:
          "Vos personnages Chiot gagnent <Hors d'atteinte>. (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Peggy",
    version: "Madre Giocosa",
    text: [
      {
        title: "A chi Tocca?",
        description:
          "Ogni volta che questo personaggio va all'avventura, paga 2 {I} in meno per giocare il tuo prossimo personaggio Cucciolo per questo turno.",
      },
      {
        title: "Non aver Paura",
        description:
          "I tuoi personaggi Cucciolo ottengono <Protetto>. (Gli avversari non possono sceglierli se non per sfidarli.)",
      },
    ],
  },
  es: {
    name: "Perdita",
    version: "Madre juguetona",
    text: [
      {
        title: "¿QUIÉN ES EL SIGUIENTE?",
        description:
          "Cada vez que este personaje realiza una misión, pagas 2 {I} menos por el próximo personaje Cachorro que juegues en este turno.",
      },
      {
        title: "NO TENGAS MIEDO",
        description: "Tus personajes Cachorro ganan Protección.",
      },
    ],
  },
};
