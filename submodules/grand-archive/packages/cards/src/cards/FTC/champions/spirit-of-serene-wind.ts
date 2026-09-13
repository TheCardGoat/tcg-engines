import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spiritOfSereneWind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "h973fdt8pt",
  slug: "spirit-of-serene-wind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "h973fdt8pt:face:default",
      catalogId: "h973fdt8pt",
      name: "Spirit of Serene Wind",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["SPIRIT"],
        subtypes: ["SPIRIT"],
      },
      elements: ["WIND"],
      stats: {
        level: 0,
        life: 15,
      },
      rulesText:
        "On Enter: Glimpse 6. Draw six cards. \n\nLineage Release — Recover 6. (Activate this ability by banishing this card from your champion's inner lineage.)",
      abilities: [
        {
          id: "h973fdt8pt-a1",
          kind: "triggered",
          text: "On Enter: Glimpse 6. Draw six cards.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "glimpse",
                amount: 6,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 6,
              },
            ],
          },
        },
        {
          id: "h973fdt8pt-a2",
          kind: "activated",
          text: "Lineage Release — Recover 6. (Activate this ability by banishing this card from your champion's inner lineage.)",
          keyword: {
            name: "lineage-release",
            cost: {
              kind: "banish-self",
            },
          },
          functionalZones: ["inner-lineage"],
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 6,
          },
        },
      ],
    },
  },
};

export default spiritOfSereneWind;
