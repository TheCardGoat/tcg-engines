import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deliveryDroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ziHdB4vzQH",
  slug: "delivery-droid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ziHdB4vzQH:face:default",
      catalogId: "ziHdB4vzQH",
      name: "Delivery Droid",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "On Death: Summon a Powercell token.",
      abilities: [
        {
          id: "ziHdB4vzQH-a1",
          kind: "triggered",
          text: "On Death: Summon a Powercell token.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "summon",
            object: "Powercell",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default deliveryDroid;
