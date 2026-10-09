import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { ResolvingEntityStage } from "./ResolvingEntityStage";

export const RESOLUTION_EXIT_MS = 240;

/** The game supplies authorized entities and resolution order; this component owns display lifetime. */
export interface PendingResolutionCard {
  readonly entity: SimulatorEntity;
  readonly anchorId: string;
  readonly label: string;
  /** The game maps the source controller relative to the viewer. */
  readonly side?: "left" | "right";
}

export interface PendingResolutionCardsProps {
  readonly current: PendingResolutionCard | null;
  /** Keep plan-referenced anchors available for incoming and outgoing card flights. */
  readonly retained?: readonly PendingResolutionCard[];
  readonly host?: HTMLElement | null;
  readonly elevated?: boolean;
  readonly showLabel?: boolean;
  readonly className?: string;
  readonly ghostClassName?: string;
  readonly entityClassName?: string;
  readonly labelClassName?: string;
  readonly testId?: string;
}

export function PendingResolutionCards({
  current,
  retained = [],
  host,
  elevated = false,
  showLabel,
  className,
  ghostClassName,
  entityClassName,
  labelClassName,
  testId = "pending-resolution-card",
}: PendingResolutionCardsProps) {
  const previous = useRef<PendingResolutionCard | null>(null);
  const [exit, setExit] = useState<PendingResolutionCard | null>(null);
  useLayoutEffect(() => {
    if (current) {
      previous.current = current;
      setExit(null);
      return;
    }
    const last = previous.current;
    previous.current = null;
    if (!last || !elevated) {
      setExit(null);
      return;
    }
    setExit(last);
    const timer = window.setTimeout(() => setExit(null), RESOLUTION_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [current, elevated]);

  const visible = current ?? exit;
  const seen = new Set(visible ? [visible.anchorId] : []);
  const ghosts = retained.filter((card) => {
    if (seen.has(card.anchorId)) return false;
    seen.add(card.anchorId);
    return true;
  });
  const stage = (card: PendingResolutionCard, ghost: boolean) => (
    <ResolvingEntityStage
      key={card.anchorId}
      entity={card.entity}
      anchorId={card.anchorId}
      label={card.label}
      side={card.side}
      active={!ghost}
      elevated={elevated}
      exiting={!ghost && !current}
      showLabel={showLabel}
      className={[className, ghost && ghostClassName].filter(Boolean).join(" ")}
      entityClassName={entityClassName}
      labelClassName={labelClassName}
      testId={ghost ? `${testId}-ghost` : testId}
    />
  );
  const content = (
    <>
      {visible && stage(visible, false)}
      {ghosts.map((card) => stage(card, true))}
    </>
  );
  return host ? createPortal(content, host) : content;
}
