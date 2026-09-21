import { FabInstantYieldAutomationControl } from "./FabInstantYieldAutomation";
import { FabOptionalTriggerAutomationControl } from "./FabOptionalTriggerAutomation";

/**
 * The paired per-card automation controls (optional-trigger behavior and
 * Instant auto-yield). Each control renders nothing unless the engine
 * published an automation entry for that instance, so mounting this on any
 * own-card slot is safe — the icons appear exactly for the cards the engine
 * considers automatable.
 */
export function FabCardAutomationCluster({
  instanceId,
  cardName,
  canonicalId,
}: {
  readonly instanceId: string;
  readonly cardName: string;
  readonly canonicalId?: string;
}) {
  return (
    <span className="fab-card-automation-cluster">
      <FabOptionalTriggerAutomationControl
        instanceId={instanceId}
        cardName={cardName}
        canonicalId={canonicalId}
      />
      <FabInstantYieldAutomationControl instanceId={instanceId} cardName={cardName} />
    </span>
  );
}
