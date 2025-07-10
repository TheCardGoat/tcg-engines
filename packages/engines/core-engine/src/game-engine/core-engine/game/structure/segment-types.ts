import type { FnContext } from "../../game-configuration";
import type { TurnConfig } from "./turn";

export interface SegmentMap<G = unknown> {
  [segmentName: string]: SegmentConfig<G>;
}

export interface SegmentConfig<G = unknown> {
  start?: boolean;
  end?: boolean;
  next?: ((context: FnContext<G>) => string | undefined) | string;

  onBegin?: (context: FnContext<G>) => undefined | G;
  onEnd?: (context: FnContext<G>) => undefined | G;
  endIf?: (context: FnContext<G>) => boolean | undefined | { next: string };

  turn: TurnConfig<G>;
}
