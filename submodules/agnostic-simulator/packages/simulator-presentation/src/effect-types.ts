export interface DamageStrike {
  /** Simultaneous local contacts when no public source trajectory is supplied. */
  localImpacts?: boolean;
  key: number;
  fromX: number;
  fromY: number;
  targets: { x: number; y: number; amount: number }[];
}
export interface CardDeparture {
  key: number;
  instanceId: string;
  fromX: number;
  fromY: number;
  fromWidth: number;
  fromHeight: number;
  toX: number;
  toY: number;
  artUrl?: string;
  name: string | null;
}
