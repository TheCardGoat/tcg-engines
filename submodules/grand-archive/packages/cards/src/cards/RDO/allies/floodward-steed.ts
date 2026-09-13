import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const floodwardSteed: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b8CsivHOkC",
  slug: "floodward-steed",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b8CsivHOkC:face:default",
      catalogId: "b8CsivHOkC",
      name: "Floodward Steed",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "On Enter:  Put a bulwark counter on target ally. (If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
      abilities: [
        {
          id: "b8CsivHOkC-a1",
          kind: "triggered",
          text: "On Enter:  Put a bulwark counter on target ally. (If combat damage would be dealt to an ally with any bulwark counters on it, remove one and prevent that damage instead.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "bulwark",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default floodwardSteed;
