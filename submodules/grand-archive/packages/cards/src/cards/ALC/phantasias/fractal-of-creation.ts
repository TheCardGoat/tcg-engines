import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfCreation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x7mnu1xhs5",
  slug: "fractal-of-creation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "x7mnu1xhs5:face:default",
      catalogId: "x7mnu1xhs5",
      name: "Fractal of Creation",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "FRACTAL"],
      },
      elements: ["NEOS"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)\n\nSacrifice Fractal of Creation: Summon a token copy of target token you control.",
      abilities: [
        {
          id: "x7mnu1xhs5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "x7mnu1xhs5-a2",
          kind: "activated",
          text: "Sacrifice Fractal of Creation: Summon a token copy of target token you control.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "copied-object",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "token",
                  value: true,
                },
              },
            },
          ],
          effect: {
            kind: "summon",
            copyOf: {
              kind: "bound",
              binding: "copied-object",
            },
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default fractalOfCreation;
