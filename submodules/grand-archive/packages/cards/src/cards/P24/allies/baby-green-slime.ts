import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const babyGreenSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cqadnk9iz0",
  slug: "baby-green-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cqadnk9iz0:face:default",
      catalogId: "cqadnk9iz0",
      name: "Baby Green Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\nOn Enter: Suppress target item or weapon. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
      abilities: [
        {
          id: "cqadnk9iz0-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
          id: "cqadnk9iz0-a2",
          kind: "triggered",
          text: "On Enter: Suppress target item or weapon. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
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
                  oneOf: ["ITEM", "WEAPON"],
                },
              },
            },
          ],
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

export default babyGreenSlime;
