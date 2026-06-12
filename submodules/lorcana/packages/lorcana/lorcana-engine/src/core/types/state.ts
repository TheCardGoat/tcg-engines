/** Minimal zone config shape (legacy; zones module removed) */
export interface CardZoneConfig {
  visibility?: string;
  ordered?: boolean;
  [k: string]: unknown;
}
