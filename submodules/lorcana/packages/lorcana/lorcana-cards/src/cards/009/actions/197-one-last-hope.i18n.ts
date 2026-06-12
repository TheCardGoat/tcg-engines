import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const oneLastHopeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "One Last Hope",
    text: "Chosen character gains Resist +2 until the start of your next turn. If a Hero character is chosen, they can also challenge ready characters this turn.",
  },
  de: {
    name: "Bleibt nur eine Hoffnung",
    text: "Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Robust +2. Wenn du einen Held oder eine Heldin wählst, kann dieser Charakter in diesem Zug bereite Charaktere herausfordern. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
  },
  fr: {
    name: "Il me reste un espoir",
    text: "Choisissez un personnage qui gagne Résistance +2 jusqu'au début de votre prochain tour. Si c'est un personnage Héros, il peut aussi défier des personnages redressés pour le reste de ce tour.",
  },
  it: {
    name: "L'Ultima Speranza",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta ottiene Resistere +2 fino all'inizio del tuo prossimo turno. Se quel personaggio è un Eroe, può anche sfidare i personaggi preparati per questo turno.",
  },
};
