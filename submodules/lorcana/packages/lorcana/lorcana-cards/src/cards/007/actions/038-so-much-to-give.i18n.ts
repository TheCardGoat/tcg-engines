import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const soMuchToGiveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "So Much to Give",
    text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  },
  de: {
    name: "So neu für mich",
    text: "Ziehe 1 Karte. Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Beschützen. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
  },
  fr: {
    name: "La vie nous a réunis",
    text: "Piochez une carte. Choisissez un personnage qui gagne Rempart jusqu'au début de votre prochain tour. (Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
  },
  it: {
    name: "La Vita Appartiene a Me",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Pesca una carta. Un personaggio a tua scelta ottiene Guardiano fino all'inizio del tuo prossimo turno. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
  },
};
