import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const celiaMaeFriendlyReceptionistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Celia Mae",
    version: "Friendly Receptionist",
    text: [
      {
        title: "PLEASE HOLD",
        description:
          "When you play this character, you may pay 1 {I} to ready chosen character of yours. They can't quest or challenge for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Celia Mae",
    version: "Freundliche Rezeptionistin",
    text: [
      {
        title: "Moment bitte",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 {I} bezahlen, um einen deiner Charaktere zu wählen und bereit zu machen. Er kann in diesem Zug nicht mehr erkunden oder herausfordern.",
      },
    ],
  },
  fr: {
    name: "Celia Boa",
    version: "Réceptionniste sympathique",
    text: [
      {
        title: "Ne quittez pas",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez payer 1 {I} pour choisir l'un de vos personnages et le redresser. Il ne peut ni être envoyé à l'aventure ni défier pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Celia Mae",
    version: "Amichevole Centralinista",
    text: [
      {
        title: "Attenda in Linea",
        description:
          "Quando giochi questo personaggio, puoi pagare 1 {I} per preparare un tuo personaggio a tua scelta. Non può andare all'avventura o sfidare per il resto di questo turno.",
      },
    ],
  },
  es: {
    name: "Celia Mae",
    version: "Recepcionista amigable",
    text: [
      {
        title: "POR FAVOR ESPERA",
        description:
          "Cuando juegas con este personaje, puedes pagar 1 {I} para preparar tu personaje elegido. No pueden realizar misiones ni desafíos durante el resto de este turno.",
      },
    ],
  },
};
