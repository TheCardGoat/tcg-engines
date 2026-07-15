import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const liShangValiantLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Li Shang",
    version: "Valiant Leader",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "{I}",
      },
    ],
  },
  de: {
    name: "Li Shang",
    version: "Tapferer Anführer",
    text: "<Gestaltwandel> 4 {I} (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Li-Shang-Charaktere auszuspielen.)",
  },
  fr: {
    name: "Li Shang",
    version: "Meneur vaillant",
    text: "<Alter> 4 {I} (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Li Shang.)",
  },
  it: {
    name: "Li Shang",
    version: "Leader Valoroso",
    text: "<Trasformazione> 4 {I} (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Li Shang.)",
  },
};
