import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sherwoodForestOutlawHideawayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sherwood Forest",
    version: "Outlaw Hideaway",
    text: [
      {
        title: "FOREST HOME",
        description: "Your characters named Robin Hood may move here for free.",
      },
      {
        title: "FAMILIAR TERRAIN",
        description:
          'Characters gain Ward and "{E}, 1 {I} — Deal 2 damage to chosen damaged character" while here.',
      },
    ],
  },
  de: {
    name: "Sherwood Forest",
    version: "Versteck der Gesetzlosen",
    text: [
      {
        title: "WALDHEIMAT",
        description: "Deine Robin-Hood-Charaktere können sich kostenlos zu diesem Ort bewegen.",
      },
      {
        title: "VERTRAUTES",
        description:
          'GELÄNDE Charaktere an diesem Ort erhalten Behütet und: ", 1 — Füge einem beschädigten Charakter deiner Wahl 2 Schaden zu." (Gegnerische Mitspielende können die Charaktere nicht auswählen, außer um sie herauszufordern.)',
      },
    ],
  },
  fr: {
    name: "Forêt de Sherwood",
    version: "Cachette des hors-la-loi",
    text: [
      {
        title: "REFUGE FORESTIER",
        description:
          "Vos personnages Robin des Bois peuvent être déplacés gratuitement sur ce lieu.",
      },
      {
        title: "TERRAIN FAMILIER",
        description:
          'Les personnages sur ce lieu gagnent Hors d\'atteinte et ", 1 — Choisissez un personnage ayant au moins un dommage sur lui et infligez-lui 2 dommages." (Les adversaires ne peuvent pas choisir ces personnages, hormis pour un défi.)',
      },
    ],
  },
  it: {
    name: "Foresta di Sherwood",
    version: "Nascondiglio dei Fuorilegge",
    text: [
      {
        title: "CASA NELLA FORESTA I",
        description:
          "tuoi personaggi chiamati Robin Hood possono spostarsi in questo luogo gratis.",
      },
      {
        title: "TERRENO FAMILIARE I",
        description:
          'personaggi ottengono Protetto e ", 1 — Infliggi 2 danni a un personaggio danneggiato a tua scelta" mentre si trovano in questo luogo. (Gli avversari non possono sceglierli se non per sfidarli.)',
      },
    ],
  },
};
