import type {
  Abilities,
  Characteristics,
  LorcanitoCard,
} from "@lorcanito/lorcana-engine/cards/cardTypes";
import type {
  NumericComparison,
  StringComparison,
} from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";

export type TriggerTargetFilter = {
  filter: "trigger";
  value: "source" | "target";
};

export type TargetFilter =
  | {
      filter: "location";
      value: "source";
    }
  | {
      filter: "turn";
      value: "played" | "inkwell" | "challenge";
      targetFilter: [TargetFilter];
      comparison: NumericComparison;
    }
  | { filter: "was-challenged" }
  | { filter: "can"; value: "challenge" | "sing" | "sing_song" | "shift" }
  | {
      filter: "challenge";
      value: "attacker" | "defender";
    }
  | {
      filter: "sing";
      value: "singer" | "song";
    }
  | { filter: "source"; value: "self" | "trigger" | "target" | "other" }
  | TriggerTargetFilter
  | {
      // This is a dynamic filter, that is created and evaluated in runtime
      filter: "instanceId";
      value: string | string[];
    }
  | {
      // This is a dynamic filter, that is created and evaluated in runtime
      filter: "publicId";
      value: string | string[];
    }
  | {
      filter: "top-deck";
      value: "self" | "opponent";
    }
  | {
      filter: "attribute";
      value: "cost" | "strength";
      ignoreBonuses?: boolean;
      comparison: NumericComparison;
    }
  | {
      filter: "attribute";
      value: "inkwell";
      ignoreBonuses?: boolean;
      comparison: boolean;
    }
  | {
      filter: "attribute";
      value: "name" | "title";
      ignoreBonuses?: boolean;
      comparison: StringComparison;
    }
  | {
      filter: "attribute";
      value: "instanceId";
      ignoreBonuses?: boolean;
      comparison: StringComparison;
    }
  | {
      filter: "owner";
      value: "self" | "opponent" | string;
    }
  | {
      filter: "name-a-card";
      value?: "name";
      comparison?: StringComparison;
    }
  | {
      filter: "status";
      value:
        | "ready"
        | "exerted"
        | "dry"
        | "damaged"
        | "at-location"
        | "has-card-under";
      negate?: boolean;
    }
  | {
      filter: "status";
      value: "damage";
      comparison: NumericComparison;
      negate?: boolean;
    }
  | {
      filter: "zone";
      value: Zones | Array<Zones>;
    }
  | {
      filter: "ability";
      value: Abilities;
      negate?: boolean;
    }
  | {
      filter: "characteristics";
      value: Characteristics[];
      conjunction?: "and" | "or";
      negate?: boolean;
    }
  | {
      filter: "type";
      value: LorcanitoCard["type"] | Array<LorcanitoCard["type"]>;
      negate?: boolean;
    };

export const challengeOpponentsCardsFilter: TargetFilter[] = [
  { filter: "owner", value: "opponent" },
  { filter: "can", value: "challenge" },
  { filter: "type", value: ["character", "location"] },
  { filter: "zone", value: "play" },
];

export const readyCharacterOfYours: TargetFilter[] = [
  { filter: "owner", value: "self" },
  { filter: "type", value: ["character"] },
  { filter: "zone", value: "play" },
  { filter: "status", value: "ready" },
];

export const enterLocationCardsFilter: TargetFilter[] = [
  { filter: "owner", value: "self" },
  { filter: "type", value: "location" },
  { filter: "zone", value: "play" },
];

export const singASongFilter: TargetFilter[] = [
  { filter: "owner", value: "self" },
  { filter: "can", value: "sing_song" },
  { filter: "type", value: "character" },
  { filter: "zone", value: "play" },
];

export const canSingTogetherFilter: TargetFilter[] = [
  { filter: "owner", value: "self" },
  { filter: "can", value: "sing" },
  { filter: "type", value: "character" },
  { filter: "zone", value: "play" },
];

export const shiftCharFilter = (card?: LorcanitoCard) => {
  const filter: TargetFilter[] = [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
    { filter: "can", value: "shift" },
  ];

  return filter;
};

export function canSingFilter(song: LorcanitoCard): TargetFilter[] {
  if (
    !song ||
    song.type !== "action" ||
    !song.cost ||
    !song.characteristics?.includes("song")
  ) {
    return [];
  }

  //TODO: ADD singer ability to filter, this should be an OR filter
  return [
    { filter: "owner", value: "self" },
    { filter: "status", value: "ready" },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
    { filter: "status", value: "dry" },
    {
      filter: "attribute",
      value: "cost",
      comparison: { operator: "gte", value: song.cost },
    },
  ];
}

export type FilterId = "owner" | "zone" | "status" | "keyword" | "type";
