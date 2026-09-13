import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conjuringFluorescence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Erpyb3AGgp",
  slug: "conjuring-fluorescence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Erpyb3AGgp:face:default",
      catalogId: "Erpyb3AGgp",
      name: "Conjuring Fluorescence",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Merlin Bonus] [Sheen 8+] Fast Activation (You may activate this card at fast speed.)\n\nMaterialize a regalia card from your material deck. (You still pay for its costs.)",
      abilities: [
        {
          id: "Erpyb3AGgp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] [Sheen 8+] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 8,
              },
            },
          ],
        },
        {
          id: "Erpyb3AGgp-a2",
          kind: "card-resolution",
          text: "Materialize a regalia card from your material deck. (You still pay for its costs.)",
          effect: {
            kind: "choose",
            selection: {
              id: "materialized-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "supertype",
                  oneOf: ["REGALIA"],
                },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: {
                kind: "bound",
                binding: "materialized-card",
              },
            },
          },
        },
      ],
    },
  },
};

export default conjuringFluorescence;
