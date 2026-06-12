import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rcRemotecontrolledCarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "RC",
    version: "Remote-Controlled Car",
    text: [
      {
        title: "LOW BATTERIES",
        description:
          "This character can't quest or challenge unless you pay 1 {I}. (You pay this cost each time.)",
      },
    ],
  },
  de: {
    name: "RC Turbo",
    version: "Ferngesteuertes Auto",
    text: [
      {
        title: "Niedriger Akkustand",
        description:
          "Dieser Charakter kann nicht erkunden oder herausfordern, außer du zahlst 1 {I}. (Du zahlst diese Kosten jedes Mal.)",
      },
    ],
  },
  fr: {
    name: "Karting",
    version: "Voiture télécommandée",
    text: [
      {
        title: "Batterie faible",
        description:
          "Ce personnage ne peut ni être envoyé à l'aventure ni défier, sauf si vous payez 1 {I}. (Vous payez ce coût à chaque fois.)",
      },
    ],
  },
  it: {
    name: "R.C.",
    version: "Macchinina Radiocomandata",
    text: [
      {
        title: "Batterie Scariche",
        description:
          "Questo personaggio non può andare all'avventura o sfidare a meno che tu non paghi 1 {I}. (Paga questo costo ogni volta.)",
      },
    ],
  },
};
