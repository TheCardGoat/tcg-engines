import { createContext } from "react";

import type { EngineAdapter } from "./adapter.ts";
import type { GameStore } from "./store.ts";
import type { PendingController } from "./pending.ts";
import type { ViewerId } from "./types.ts";

export interface GundamGameContextValue {
  readonly adapter: EngineAdapter;
  readonly store: GameStore;
  readonly pending: PendingController;
  readonly viewerId: ViewerId;
}

/**
 * Shared React context for the Gundam game tree. Lives in a separate
 * module so providers in different layers (the standard local
 * `GundamGameProvider` and the live-match `LiveGundamGameProvider`)
 * can both populate it without circular imports between
 * `context.tsx` and `engine/live/LiveGundamGameProvider.tsx`.
 */
export const GundamGameContext = createContext<GundamGameContextValue | null>(null);
