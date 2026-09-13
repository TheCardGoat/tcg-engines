import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aesanProtector: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "heq49UQGvQ",
  slug: "aesan-protector",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "heq49UQGvQ:face:default",
      catalogId: "heq49UQGvQ",
      name: "Aesan Protector",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 3,
        life: 4,
      },
      rulesText:
        "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)\n\nOn Enter: Return target ally you control to its owner's hand.",
      abilities: [
        {
          id: "heq49UQGvQ-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept (Whenever your champion is attacked while this ally is awake, you may redirect that attack to this ally.)",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "heq49UQGvQ-a2",
          kind: "triggered",
          text: "On Enter: Return target ally you control to its owner's hand.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            destination: {
              zone: "hand",
            },
          },
        },
      ],
    },
  },
};

export default aesanProtector;
