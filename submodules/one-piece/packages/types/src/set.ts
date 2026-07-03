export type OPSetType = "booster" | "starter" | "extra" | "promo";

export interface OPSet {
  id: string;
  name: string;
  type: OPSetType;
  releaseDate: string | null;
}
