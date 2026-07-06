import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanTinkerBellFastFriendsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan & Tinker Bell",
    version: "Fast Friends",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "YOU CAN FLY!",
        description: "Your characters gain Evasive.",
      },
    ],
  },
  de: {
    name: "Peter Pan & Naseweis",
    version: "Flinke Freunde",
    text: [
      {
        title:
          "<Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Peter Pan oder Naseweis auszuspielen.)",
      },
      {
        title: "Flieg' ins Glück",
        description:
          "Deine Charaktere erhalten <Wendig>. (Nur Charaktere mit Wendig können sie herausfordern.)",
      },
    ],
  },
  fr: {
    name: "Peter Pan & La Fée Clochette",
    version: "Amis rapides",
    text: [
      {
        title: "<Alter> 4 {I}",
      },
      {
        title: "Tu t'envoles!",
        description: "Vos personnages gagnent <Insaisissable>.",
      },
    ],
  },
  it: {
    name: "Peter Pan e Trilli",
    version: "Amici Per la Pelle",
    text: [
      {
        title:
          "<Trasformazione> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Peter Pan o Trilli.)",
      },
      {
        title: "Puoi Volar!",
        description:
          "I tuoi personaggi ottengono <Sfuggente>. (Solo altri personaggi con Sfuggente possono sfidarli.)",
      },
    ],
  },
};
