import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const syndromesRemoteI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Syndrome's Remote",
    text: [
      {
        title: "Zero-Point Energy",
        description: "{E}, 2 {I} — Chosen character can't challenge during their next turn.",
      },
      {
        title: "Learn From Their Losses",
        description:
          "Whenever a Robot character is banished, you may banish this item to discard your hand and draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Syndroms Fernbedienung",
    text: [
      {
        title: "Nullpunktenergie",
        description:
          "{E}, 2 {I} — Wähle einen Charakter. Er kann in seinem nächsten Zug nicht herausfordern.",
      },
      {
        title: "Aus ihren Verlusten lernen",
        description:
          "Jedes Mal, wenn ein Roboter verbannt wird, darfst du diesen Gegenstand verbannen, um alle Karten von deiner Hand abzuwerfen und dann 2 Karten zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Télécommande de Syndrome",
    text: [
      {
        title: "Énergie au point zéro",
        description:
          "{E}, 2 {I} — Choisissez un personnage qui ne peut pas défier durant son prochain tour.",
      },
      {
        title: "Apprendre de leurs échecs",
        description:
          "Chaque fois qu'un personnage Robot est banni, vous pouvez bannir cet objet pour défausser votre main et piocher 2 cartes.",
      },
    ],
  },
  it: {
    name: "Telecomando di Sindrome",
    text: [
      {
        title: "Energia dello Stato Fondamentale",
        description:
          "{E}, 2 {I} — Un personaggio a tua scelta non può sfidare durante il suo prossimo turno.",
      },
      {
        title: "Imparare dalle Sconfitte",
        description:
          "Ogni volta che un personaggio Robot viene esiliato, puoi esiliare questo oggetto per scartare la tua mano e pescare 2 carte.",
      },
    ],
  },
};
