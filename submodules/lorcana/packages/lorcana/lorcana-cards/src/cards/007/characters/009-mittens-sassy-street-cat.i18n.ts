import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mittensSassyStreetCatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mittens",
    version: "Sassy Street Cat",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "NO THANKS NECESSARY",
        description:
          "Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Mittens",
    version: "Freche Straßenkatze",
    text: [
      {
        title:
          "<Beschützen> (Du darfst diesen Charakter erschöpft ausspielen. Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
      {
        title: "Nichts zu danken",
        description:
          "Einmal während deines Zuges, wenn eine Karte in deinen Tintenvorrat gelegt wird, erhalten deine anderen Charaktere mit <Beschützen> in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Mitaine",
    version: "Chatte de gouttière insolente",
    text: [
      {
        title:
          "<Rempart> (Ce personnage peut entrer en jeu épuisé. Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
      {
        title: "Ne me remercie pas",
        description:
          "Une seule fois durant votre tour, lorsqu'une carte est placée dans votre réserve d'encre, vos autres personnages avec <Rempart> gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Mittens",
    version: "Insolente Gatta di Strada",
    text: [
      {
        title: "<Guardiano>",
      },
      {
        title: "Non Serve Ringraziare",
        description:
          "Una volta durante il tuo turno, ogni volta che una carta viene aggiunta al tuo calamaio, i tuoi altri personaggi con <Guardiano> ricevono +1 {L} per questo turno.",
      },
    ],
  },
  es: {
    name: "Guantes de boxeo",
    version: "Gato callejero descarado",
    text: [
      {
        title: "Guardaespaldas",
      },
      {
        title: "NO ES NECESARIO AGRADECER",
        description:
          "Una vez durante tu turno, cada vez que se pone una carta en tu tintero, tus otros personajes con Bodyguard obtienen +1 {L} este turno.",
      },
    ],
  },
};
