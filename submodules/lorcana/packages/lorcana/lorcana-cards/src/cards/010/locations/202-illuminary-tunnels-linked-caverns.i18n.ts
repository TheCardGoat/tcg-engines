import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const illuminaryTunnelsLinkedCavernsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Illuminary Tunnels",
    version: "Linked Caverns",
    text: [
      {
        title: "SUBTERRANEAN NETWORK",
        description:
          "While you have a character here, this location gets +1 {L} for each other location you have in play.",
      },
      {
        title: "LOCUS",
        description: "While you have a character here, you pay 1 {I} less to play locations.",
      },
    ],
  },
  de: {
    name: "Tunnel im Illuminarium",
    version: "Verbundene Höhlen",
    text: [
      {
        title: "UNTERIRDISCHES NETZWERK",
        description:
          "Solange du mindestens einen Charakter an diesem Ort hast, erhält dieser Ort +1 für jeden anderen Ort, den du im Spiel hast.",
      },
      {
        title: "LOCUS",
        description:
          "Solange du mindestens einen Charakter an diesem Ort hast, zahlst du 1 weniger, um Orte auszuspielen.",
      },
    ],
  },
  fr: {
    name: "Tunnels de l'Illuminarium",
    version: "Cavernes reliées",
    text: [
      {
        title: "RÉSEAU SOUTERRAIN",
        description:
          "Tant que vous avez un personnage sur ce lieu, ce lieu gagne +1 pour chaque autre lieu que vous avez en jeu.",
      },
      {
        title: "LOCUS",
        description:
          "Tant que vous avez un personnage sur ce lieu, jouer un lieu vous coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Tunnel dell'Illuminarium",
    version: "Rete di Caverne",
    text: [
      {
        title: "RETE SOTTERRANEA",
        description:
          "Mentre hai un personaggio in questo luogo, questo luogo riceve +1 per ogni altro luogo che hai in gioco.",
      },
      {
        title: "LOCUS",
        description:
          "Mentre hai un personaggio in questo luogo, paga 1 in meno per giocare i luoghi.",
      },
    ],
  },
};
