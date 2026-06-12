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
        title: "UNTERDRÜCKTE WUT,",
        description: "1 — Lege 1 Schadensmarker auf einen Charakter deiner Wahl.",
      },
      {
        title: "GEDANKENLOSER ZORN,",
        description:
          "Verbanne diesen Gegenstand — Gegnerische beschädigte Charaktere erhalten bis zu Beginn deines nächsten Zuges Impulsiv. (Sie können nicht erkunden und müssen herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Potion de malice",
    text: [
      {
        title: "COLÈRE CONTENUE,",
        description: "1 — Choisissez un personnage et placez 1 dommage sur lui.",
      },
      {
        title: "RAGE AVEUGLE,",
        description:
          "Bannissez cet objet — Chaque personnage adverse avec au moins un dommage sur lui gagne Combattant jusqu'au début de votre prochain tour. (Ces personnages ne peuvent pas être envoyés à l'aventure et doivent défier s'ils le peuvent.)",
      },
    ],
  },
  it: {
    name: "Pozione di Malizia",
    text: [
      {
        title: "COLLERA REPRESSA, 1",
        description: "— Metti 1 segnalino danno su un personaggio a tua scelta.",
      },
      {
        title: "RABBIA INCONTROLLATA,",
        description:
          "esilia questo oggetto — Ogni personaggio avversario danneggiato ottiene Attaccabrighe fino all'inizio del tuo prossimo turno. (Non può andare all'avventura e deve sfidare, se possibile.)",
      },
    ],
  },
};
