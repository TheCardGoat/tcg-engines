import { useMemo, type ReactNode } from "react";

import { ZoneTransferAnimator } from "../components/ZoneTransferAnimator";
import type { SimulatorAnimationEvent } from "./events";
import { SimulatorPrimitiveAnimator } from "./SimulatorPrimitiveAnimator";
import { toZoneTransferAnimationStep } from "./zoneTransferEvent";

export interface SimulatorAnimationLayerProps {
  events?: readonly SimulatorAnimationEvent[] | null;
  children: ReactNode;
  onComplete?: (event: SimulatorAnimationEvent) => void;
}

export function SimulatorAnimationLayer({
  events = null,
  children,
  onComplete,
}: SimulatorAnimationLayerProps) {
  const eventList = useMemo(() => (events ? [...events] : []), [events]);
  const eventByStepId = useMemo(() => {
    const byId = new Map<string, SimulatorAnimationEvent>();
    eventList.forEach((event) => byId.set(event.id, event));
    return byId;
  }, [eventList]);
  const transferSteps = useMemo(
    () => eventList.flatMap((event) => toZoneTransferAnimationStep(event) ?? []),
    [eventList],
  );

  return (
    <SimulatorPrimitiveAnimator events={eventList} onComplete={onComplete}>
      <ZoneTransferAnimator
        steps={transferSteps}
        onComplete={(step) => {
          const event = eventByStepId.get(step.id);
          if (event) {
            onComplete?.(event);
          }
        }}
      >
        {children}
      </ZoneTransferAnimator>
    </SimulatorPrimitiveAnimator>
  );
}
