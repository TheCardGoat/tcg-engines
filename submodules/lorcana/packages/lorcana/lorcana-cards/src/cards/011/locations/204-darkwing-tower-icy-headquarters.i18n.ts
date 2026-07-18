import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const darkwingTowerIcyHeadquartersI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Darkwing Tower",
    version: "Icy Headquarters",
    text: [
      {
        title: "EVIL VANQUISHED",
        description:
          "During your turn, whenever an opposing Villain character is banished, you may ready a character here. If you do, they can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Darkwings Turm",
    version: "Vereistes Hauptquartier",
    text: [
      {
        title: "Das Böse bezwungen",
        description:
          "Jedes Mal während deines Zuges, wenn ein gegnerischer Schurke verbannt wird, darfst du einen Charakter an diesem Ort bereit machen. Wenn du dies tust, kann jener in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "Tour de Myster Mask",
    version: "Quartier général glacé",
    text: [
      {
        title: "Le mal est vaincu",
        description:
          "Durant votre tour, chaque fois qu'un personnage adverse Méchant est banni, vous pouvez redresser un personnage sur ce lieu. Si vous le faites, ce personnage ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Torre Darkwing",
    version: "Quartier Generale Ghiacciato",
    text: [
      {
        title: "Il Male Sconfitto",
        description:
          "Durante il tuo turno, ogni volta che un personaggio Cattivo avversario viene esiliato, puoi preparare un personaggio in questo luogo. Se lo fai, non può andare all'avventura per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Torre Ala Oscura",
    version: "Sede helada",
    text: [
      {
        title: "MAL VENCIDO",
        description:
          "Durante tu turno, siempre que un personaje villano contrario sea desterrado, puedes preparar un personaje aquí. Si lo haces, no podrán realizar misiones durante el resto de este turno.",
      },
    ],
  },
};
