import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/imperial-warhorn.generated.ts";

export const imperialWarhorn = definePitchFamily(fabPitchFamilies["imperial-warhorn"], {
  keywords: [legendary],
  abilities: () => ({
    actionResourceDestroyImperialWarhornChooseAnyNumberChoosesAllyAuraItemLandmarkPermanentDestroyPermanentChosenWayRoyalInsteadChoosePermanents:
      {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "sequence",
          steps: [
            {
              type: "choose-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["hero"],
                count: {
                  type: "all",
                },
              },
              outputBinding: "them",
            },
            {
              type: "choose-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "each",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Ally", "Aura", "Item", "Landmark"],
                  },
                },
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "each",
                zones: ["permanent"],
                filter: {
                  inObjectBinding: "it",
                },
                count: {
                  type: "all",
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "has-status",
                status: "hero-is-royal",
              },
              then: {
                type: "choose-card",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
            },
          ],
        },
      },
  }),
});

export const { red: imperialWarhornRed } = imperialWarhorn.cards;
