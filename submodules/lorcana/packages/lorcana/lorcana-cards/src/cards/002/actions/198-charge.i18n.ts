import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chargeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Charge!",
    text: "Chosen character gains Challenger +2 and Resist +2 this turn. (They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)",
  },
  de: {
    name: "Zum Angriff!",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug Herausfordern +2 und Robust +2. (Während der Charakter herausfordert, erhält er +2. Reduziere jeglichen Schaden, der ihm zugefügt wird, um 2.)",
  },
  fr: {
    name: "Fonce !",
    text: "Choisissez un personnage, il gagne Offensif +2 et Résistance +2 pour le reste de ce tour. (Lorsqu'il défie, ce personnage gagne +2. Les dommages qui lui sont infligés sont réduits de 2.)",
  },
  it: {
    name: "Carica!",
    text: "Un personaggio a tua scelta ottiene Sfidante +2 e Resistere +2 per questo turno. (Riceve +2 mentre sta sfidando. Il danno che gli viene inflitto è ridotto di 2.)",
  },
};
