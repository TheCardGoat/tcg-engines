import type { AnimationRef } from "@tcg/protocol/animations";
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";

import { useOptionalAnimationRuntime } from "../provider/contexts";
import { animationRefKey, type AnimationNodeRecord } from "../lib/node-registry";

export function useAnimationNode(
  animationRef: AnimationRef,
  metadata: Omit<AnimationNodeRecord, "key" | "ref" | "node">,
) {
  const runtime = useOptionalAnimationRuntime();
  const registry = runtime?.registry;
  const instanceId = useId();
  const refKey = animationRefKey(animationRef);
  const animationRefRef = useRef(animationRef);
  animationRefRef.current = animationRef;
  const metadataRef = useRef(metadata);
  metadataRef.current = metadata;
  const [node, setNode] = useState<HTMLElement | null>(null);

  // Geometry must be registered before the transfer driver's layout effect
  // resolves source and destination nodes. A passive effect is one frame too
  // late during presence changes and makes a valid shared-layout pair look
  // like a missing endpoint.
  useLayoutEffect(() => {
    if (!node || !registry) return;
    return registry.register({
      key: instanceId,
      ref: animationRefRef.current,
      node,
      ...metadataRef.current,
    });
  }, [
    instanceId,
    metadata.density,
    metadata.entity?.id,
    metadata.presence,
    metadata.zoneId,
    node,
    refKey,
    registry,
  ]);

  return useCallback((nextNode: HTMLElement | null) => setNode(nextNode), []);
}
