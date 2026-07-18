import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const arthurKingVictoriousEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Arthur",
    version: "King Victorious",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "KNIGHTED BY THE KING",
        description:
          "When you play this character, chosen character gains Challenger +2 and Resist +2 and can challenge ready characters this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
      },
    ],
  },
  de: {
    name: "Arthur",
    version: "Siegreicher König",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Arthur-Charaktere auszuspielen.)",
      },
      {
        title: "Vom König zum Ritter geschlagen",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug <Herausfordern> +2, <Robust> +2 und kann in diesem Zug bereite Charaktere herausfordern. (Während der Charakter herausfordert, erhält er +2 {S}. Reduziere jeglichen Schaden, der ihm zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Arthur",
    version: "Roi victorieux",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Arthur.)",
      },
      {
        title: "Adoubé par le roi",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne, pour le reste de ce tour, <Offensif> +2, <Résistance> +2, et peut défier les personnages redressés. (Les dommages qui lui sont infligés sont réduits de 2 et lorsqu'il défie, ce personnage gagne +2 {S}.)",
      },
    ],
  },
  it: {
    name: "Artù",
    version: "Re Vittorioso",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Artù.)",
      },
      {
        title: "Nominato Cavaliere dal Re",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta ottiene <Sfidante> +2 e <Resistere> +2 e può sfidare i personaggi preparati per questo turno. (Riceve +2 {S} mentre sta sfidando. Il danno che gli viene inflitto è ridotto di 2.)",
      },
    ],
  },
  es: {
    name: "Arturo",
    version: "Rey victorioso",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "CABALLERO POR EL REY",
        description:
          "Cuando juegas con este personaje, el personaje elegido obtiene Retador +2 y Resistencia +2 y puede desafiar a los personajes listos este turno. (Obtienen +2 {S} mientras desafían. El daño que se les inflige se reduce en 2).",
      },
    ],
  },
};
