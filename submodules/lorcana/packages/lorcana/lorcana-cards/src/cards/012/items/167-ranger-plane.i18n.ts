import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rangerPlaneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ranger Plane",
    text: [
      {
        title: "AIR SUPPORT",
        description:
          "Your characters gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
      },
      {
        title: "BIG LIFT",
        description: "{E} — Chosen character with 10 {S} or more gets +3 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Flugzeug der Ritter des Rechts",
    text: [
      {
        title: "Unterstützung aus der Luft",
        description:
          "Deine Charaktere erhalten <Unterstützen>. (Jedes Mal, wenn die Charaktere erkunden, darfst du ihre {S} in diesem Zug zur {S} eines anderen Charakters deiner Wahl addieren.)",
      },
      {
        title: "Großer Auftrieb",
        description:
          "{E} — Ein Charakter deiner Wahl mit 10 oder mehr {S} erhält in diesem Zug +3 {L}.",
      },
    ],
  },
  fr: {
    name: "Socissoplane",
    text: [
      {
        title: "Soutien aérien",
        description:
          "Vos personnages gagnent <Soutien>. (Lorsque ces personnages sont envoyés à l'aventure, vous pouvez ajouter leur {S} à celle d'un autre personnage au choix pour le reste de ce tour.)",
      },
      {
        title: "Grande portance",
        description:
          "{E} — Choisissez un personnage ayant 10 {S} ou plus qui gagne +3 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Aereo degli Agenti Speciali",
    text: [
      {
        title: "Supporto Aereo",
        description:
          "I tuoi personaggi ottengono <Aiutante> (Ogni volta che vanno all'avventura, puoi aggiungere la loro {S} alla {S} di un altro personaggio a tua scelta per questo turno.)",
      },
      {
        title: "Carico Pesante",
        description:
          "{E} — Un personaggio a tua scelta con 10 {S} o superiore riceve +3 {L} per questo turno.",
      },
    ],
  },
};
