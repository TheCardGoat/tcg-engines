import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const boPeepCaringShepherdI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bo Peep",
    version: "Caring Shepherd",
    text: [
      {
        title: "SOMEBODY DO SOMETHING!",
        description:
          "Your characters named Woody gain Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      },
    ],
  },
  de: {
    name: "Porzellinchen",
    version: "Fürsorgliche Hirtin",
    text: [
      {
        title: "Warum hilft uns denn niemand?",
        description:
          "Deine Woody-Charaktere erhalten <Beschützen>. (Gegnerische Charaktere müssen beim Herausfordern deiner Charaktere zuerst deine Charaktere mit Beschützen wählen, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Bo, la bergère",
    version: "Bergère attentionnée",
    text: [
      {
        title: "Que quelqu'un fasse quelque chose!",
        description:
          "Vos personnages nommés Woody gagnent <Rempart>. (Lorsqu'il défie l'un de vos personnages, un personnage adverse doit, s'il le peut, choisir l'un de vos personnages avec Rempart.)",
      },
    ],
  },
  it: {
    name: "Bo Peep",
    version: "Pastorella Premurosa",
    text: [
      {
        title: "Fate Qualcosa, Aiuto!",
        description:
          "I tuoi personaggi chiamati Woody ottengono <Guardiano>. (Un personaggio avversario che sfida uno dei tuoi personaggi deve sceglierne uno con Guardiano, se possibile.)",
      },
    ],
  },
};
