import type { BoardZones, GundamitoCardType } from "../../../../shared-types";
import type { NumericComparison, StringComparison } from "./filterResolver";

// Forward declaration to break circular dependency
export type GundamitoCard = {
  type: GundamitoCardType;
  // Other properties will be properly typed in cardTypes.ts
};

export type TargetFilter =
  | {
      filter: "owner";
      value: "self" | "opponent";
    }
  | {
      filter: "zone";
      value: BoardZones;
    }
  | {
      filter: "attribute";
      value: "cost" | "level" | "ap" | "hp";
      comparison: NumericComparison;
    }
  | {
      filter: "attribute";
      value: "name" | "title";
      comparison: StringComparison;
    }
  | {
      filter: "paired-with";
      value: "source";
    }
  | {
      filter: "type";
      value: GundamitoCard["type"] | Array<GundamitoCard["type"]>;
    };
