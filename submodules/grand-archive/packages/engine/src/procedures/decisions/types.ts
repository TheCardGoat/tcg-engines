import type { GrandArchiveCommandFor } from "../../commands/command-router.ts";
import type { GrandArchiveCommandTransition } from "../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../commands/handler-context.ts";
import type { GrandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveDecision } from "../../game/model.ts";

export type GrandArchiveDecisionKind = GrandArchiveDecision["kind"];

export type GrandArchiveDecisionFor<Kind extends GrandArchiveDecisionKind> = Extract<
  GrandArchiveDecision,
  { readonly kind: Kind }
>;

export interface GrandArchiveDecisionResumeContext<Kind extends GrandArchiveDecisionKind> {
  readonly match: GrandArchiveCommandHandlerContext;
  readonly decision: GrandArchiveDecisionFor<Kind>;
  readonly command: GrandArchiveCommandFor<"answer-decision">;
  readonly playerId: GrandArchivePlayerId;
}

export type GrandArchiveDecisionResolver<Kind extends GrandArchiveDecisionKind> = (
  context: GrandArchiveDecisionResumeContext<Kind>,
) => GrandArchiveCommandTransition;
