import type { BasePlayerEffect } from "~/game-engine/engines/lorcana/src/abilities/player-effect";
import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "~/game-engine/engines/lorcana/src/lorcana-engine-types";

export type ScryDestination = {
  zone: LorcanaZone;
  filter?: LorcanaCardFilter;
  value?: number;
  position?: "top" | "bottom";
  shuffle?: boolean;
  remainder?: boolean;
  exerted?: boolean;
  order?: "any" | "random";
  reveal?: boolean;
  max?: number;
  min?: number;
  count?: number;
};

export type ScryParameters = {
  lookAt: number;
  destinations: ScryDestination[];
};

export type ScryEffect = BasePlayerEffect & {
  type: "scry";
  parameters: ScryParameters;
};

export const youMayRevealACharacterCardAndPutItIntoYourHand: ScryDestination = {
  zone: "hand",
  min: 0,
  max: 1,
  filter: {
    cardType: "character",
  },
};

export const putTheRestOnTheBottomOfYourDeckInAnyOrder: ScryDestination = {
  zone: "deck",
  position: "bottom",
  remainder: true,
};

export const putOneIntoYourHand: ScryDestination = {
  zone: "hand",
  count: 1,
};

export function scryEffect({
  lookAt,
  destinations,
  targets,
}: {
  lookAt: number;
  destinations: ScryDestination[];
  targets?: any[];
}): ScryEffect {
  return {
    type: "scry",
    parameters: {
      lookAt,
      destinations,
    },
    targets,
  };
}
