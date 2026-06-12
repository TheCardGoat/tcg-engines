/**
 * MatchRuntime Query Operations
 */

import type { MatchState, PublishedGameEvent } from "./types";
import type {
  ViewRoleContext,
  FilteredMatchView,
  RuntimeFlowDefinition,
  MoveRecord,
  ZoneDefinitions,
} from "./match-runtime.types";
import type { MatchStaticResources } from "./static-resources";
import { filterMatchView } from "./view-filter";
import { buildZoneRegistry } from "./zone-registry";

export interface QueryContext<Moves extends MoveRecord = MoveRecord> {
  state: MatchState;
  config: {
    moves: Moves;
    zones?: ZoneDefinitions;
    flow?: RuntimeFlowDefinition;
    playerView?: (state: MatchState, roleCtx: ViewRoleContext) => FilteredMatchView;
  };
  staticResources: MatchStaticResources;
  gameEnded: boolean;
  gameEvents: PublishedGameEvent[];
}

export function getState(state: MatchState): MatchState {
  return state;
}

export function getCurrentStateID(state: MatchState): number {
  return state.ctx._stateID;
}

export function getFilteredView(ctx: QueryContext, roleCtx: ViewRoleContext): FilteredMatchView {
  if (ctx.config.playerView) {
    return ctx.config.playerView(ctx.state, roleCtx);
  }
  return filterMatchView(
    ctx.state,
    roleCtx,
    buildZoneRegistry(ctx.config.zones ?? {}, ctx.state.ctx.playerIds),
  );
}
