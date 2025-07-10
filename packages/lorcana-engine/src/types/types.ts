export * from "@lorcanito/shared/lorcana-engine";

import type {
  HowType,
  GameEffect as OGGameEffect,
  Match as OGMatch,
  Zones,
} from "@lorcanito/shared/lorcana-engine";
import type { Ability, FloatingTriggeredAbility } from "../abilities/abilities";
import type {
  ContinuousEffect,
  ScryEffectPayload,
} from "../effects/effectTypes";
import type { CardModel } from "../store/models/CardModel";

export type ResolvingParam = {
  targets?: CardModel[];
  mode?: string;
  scry?: ScryEffectPayload;
  nameACard?: string;
  skip?: boolean;
  targetPlayer?: string;
  layerId?: string;
};

export type CardMovement = {
  card: CardModel;
  from: Zones;
  to: Zones;
  how?: HowType;
};

export type GameEffect = OGGameEffect<Ability>;

export type Match = OGMatch<
  Ability,
  ContinuousEffect,
  FloatingTriggeredAbility
>;
