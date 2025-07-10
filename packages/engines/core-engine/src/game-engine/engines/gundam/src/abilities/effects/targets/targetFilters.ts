import type {
  BoardZones,
  GundamitoCard,
} from "../../../cards/definitions/cardTypes";
import type { NumericComparison, StringComparison } from "./filterResolver";

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
