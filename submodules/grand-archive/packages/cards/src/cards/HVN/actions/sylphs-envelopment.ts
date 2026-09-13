import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sylphsEnvelopment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c7d7xdy3y9",
  slug: "sylphs-envelopment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c7d7xdy3y9:face:default",
      catalogId: "c7d7xdy3y9",
      name: "Sylph's Envelopment",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Banish target ally you control, then return it to the field under its owner's control rested. If that ally is a phantasia, it enters the field with an additional buff counter on it.",
      abilities: [
        {
          id: "c7d7xdy3y9-a1",
          kind: "card-resolution",
          text: "Banish target ally you control, then return it to the field under its owner's control rested. If that ally is a phantasia, it enters the field with an additional buff counter on it.",
          targets: [
            {
              id: "target-ally",
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
            kind: "sequence",
            effects: [
              {
                kind: "banish-object",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
                from: "banishment",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "set-object-state",
                subject: {
                  kind: "bound",
                  binding: "target-ally",
                },
                state: "rested",
                value: true,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-ally",
                  },
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-ally",
                  },
                  counter: "buff",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default sylphsEnvelopment;
