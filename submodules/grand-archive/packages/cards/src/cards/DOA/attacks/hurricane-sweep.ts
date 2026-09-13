import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const hurricaneSweep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4V6qKuM7xs",
  slug: "hurricane-sweep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4V6qKuM7xs:face:default",
      catalogId: "4V6qKuM7xs",
      name: "Hurricane Sweep",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)\n\nCleave (Attack all units a chosen opponent controls. This attack can't be intercepted.)",
      abilities: [
        {
          id: "4V6qKuM7xs-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Efficiency (This card costs LV less to activate. LV refers to your champion's level. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "efficiency",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "4V6qKuM7xs-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Cleave (Attack all units a chosen opponent controls. This attack can't be intercepted.)",
          keyword: {
            name: "cleave",
          },
        },
      ],
    },
  },
};

export default hurricaneSweep;
