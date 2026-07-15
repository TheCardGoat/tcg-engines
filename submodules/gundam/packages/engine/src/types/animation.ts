export interface PacketAnimation {
  id: string;
  type: string;
  /** Duration in ms */
  duration: number;
  /** Animation payload - game-specific shape */
  data: AnimationData;
  /** If set, this animation waits for the specified animation to complete */
  after?: string;
  /** Parallel group: animations in the same group play simultaneously */
  group?: string;
}

export type AnimationData =
  | CardMoveAnimation
  | CardFlipAnimation
  | DamageAnimation
  | ShakeAnimation
  | GenericAnimation;

export interface CardMoveAnimation {
  kind: "cardMove";
  cardId: string;
  fromZone: string;
  toZone: string;
  fromIndex?: number;
  toIndex?: number;
}

export interface CardFlipAnimation {
  kind: "cardFlip";
  cardId: string;
  faceDown: boolean;
}

export interface DamageAnimation {
  kind: "damage";
  targetId: string;
  amount: number;
  damageType: string;
}

export interface ShakeAnimation {
  kind: "shake";
  targetId: string;
  intensity: number;
}

export interface GenericAnimation {
  kind: "generic";
  name: string;
  params: Record<string, unknown>;
}
