import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const perseRelentlessRaptor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nl1gxrpx8j",
  slug: "perse-relentless-raptor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nl1gxrpx8j:face:default",
      catalogId: "nl1gxrpx8j",
      name: "Perse, Relentless Raptor",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)\n\nREST: Suppress target ally, item, or weapon. Activate this ability only if Perse is distant.",
      abilities: [
        {
          id: "nl1gxrpx8j-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ranged 2 (As long as this unit is distant, its attacks get +2 POWER.)",
          keyword: {
            name: "ranged",
            value: 2,
          },
        },
        {
          id: "nl1gxrpx8j-a2",
          kind: "activated",
          text: "REST: Suppress target ally, item, or weapon. Activate this ability only if Perse is distant.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "ITEM", "WEAPON"],
                },
              },
            },
          ],
          condition: {
            kind: "object-state",
            subject: {
              kind: "source",
            },
            state: "distant",
          },
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default perseRelentlessRaptor;
