import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const potionOfMaliceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Potion of Malice",
    text: [
      {
        title: "SUPPRESSED ANGER",
        description: "{E}, 1 {I} — Put 1 damage counter on chosen character.",
      },
      {
        title: "MINDLESS RAGE",
        description:
          "{E}, Banish this item — Each opposing damaged character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Trank des Unheils",
    text: [
      {
        title: "Unterdrückte Wut",
        description: "{E}, 1 {I} — Lege 1 Schadensmarker auf einen Charakter deiner Wahl.",
      },
      {
        title: "Gedankenloser Zorn",
        description:
          "{E}, Verbanne diesen Gegenstand — Gegnerische beschädigte Charaktere erhalten bis zu Beginn deines nächsten Zuges <Impulsiv>. (Sie können nicht erkunden und müssen herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Potion de malice",
    text: [
      {
        title: "Colère contenue",
        description: "{E}, 1 {I} — Choisissez un personnage et placez 1 dommage sur lui.",
      },
      {
        title: "Rage aveugle",
        description:
          "{E}, Bannissez cet objet — Chaque personnage adverse avec au moins un dommage sur lui gagne <Combattant> jusqu'au début de votre prochain tour. (Ces personnages ne peuvent pas être envoyés à l'aventure et doivent défier s'ils le peuvent.)",
      },
    ],
  },
  it: {
    name: "Pozione di Malizia",
    text: [
      {
        title: "Collera Repressa",
        description: "{E}, 1 {I} — Metti 1 segnalino danno su un personaggio a tua scelta.",
      },
      {
        title: "Rabbia Incontrollata",
        description:
          "{E}, esilia questo oggetto — Ogni personaggio avversario danneggiato ottiene <Attaccabrighe> fino all'inizio del tuo prossimo turno. (Non può andare all'avventura e deve sfidare, se possibile.)",
      },
    ],
  },
  es: {
    name: "Poción de malicia",
    text: [
      {
        title: "Ira reprimida",
        description: "{E}, 1 {I}: pon 1 contador de daño en el personaje elegido.",
      },
      {
        title: "FURIA SIN MENTE",
        description:
          "{E}, destierra este objeto: cada personaje dañado del oponente obtiene Temerario hasta el comienzo de tu siguiente turno. (No pueden realizar misiones y deben desafiar si pueden).",
      },
    ],
  },
};
