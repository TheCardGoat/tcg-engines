import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useDndMonitor,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
  type DropAnimation,
  type DropAnimationKeyframeResolver,
} from "@dnd-kit/core";
import { useMemo, useRef, useState, type ReactNode, type RefObject } from "react";

const DEFAULT_DROP_ANIMATION: DropAnimation = {
  duration: 220,
  easing: "cubic-bezier(0.18, 0.67, 0.32, 1.32)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: "0" },
    },
  }),
};

export interface PointerDragDropSurfaceProps<TSource> {
  readonly id: string;
  readonly children: ReactNode;
  readonly decodeSource: (id: string) => TSource | null;
  readonly renderOverlay: (source: TSource) => ReactNode;
  readonly collisionDetection?: CollisionDetection;
  readonly activationDistance?: number;
  readonly overlayClassName?: string;
  readonly dropAnimation?: DropAnimation | null;
  readonly onDragStart?: (source: TSource | null, event: DragStartEvent) => void;
  readonly onDragCancel?: () => void;
  readonly onDragEnd?: (
    source: TSource | null,
    overId: string | null,
    event: DragEndEvent,
  ) => boolean | void;
}

/**
 * Shared pointer, touch, and keyboard drag surface for simulator boards.
 *
 * Games retain ownership of encoded source/target shapes, collision policy,
 * legality, and move dispatch. The shared surface owns the browser interaction
 * mechanics and the physical drag-overlay treatment.
 */
export function PointerDragDropSurface<TSource>({
  id,
  children,
  decodeSource,
  renderOverlay,
  collisionDetection,
  activationDistance = 4,
  overlayClassName,
  dropAnimation = DEFAULT_DROP_ANIMATION,
  onDragStart,
  onDragCancel,
  onDragEnd,
}: PointerDragDropSurfaceProps<TSource>) {
  const [activeSource, setActiveSource] = useState<TSource | null>(null);
  const acceptedDropRef = useRef(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: activationDistance } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: DragStartEvent) => {
    acceptedDropRef.current = false;
    const source = decodeSource(String(event.active.id));
    setActiveSource(source);
    onDragStart?.(source, event);
  };

  const handleDragCancel = () => {
    setActiveSource(null);
    onDragCancel?.();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const source = decodeSource(String(event.active.id));
    const overId = event.over ? String(event.over.id) : null;
    acceptedDropRef.current = onDragEnd?.(source, overId, event) === true;
    setActiveSource(null);
  };

  return (
    <DndContext
      id={id}
      collisionDetection={collisionDetection}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
    >
      {children}
      <VelocityTiltOverlay
        source={activeSource}
        renderOverlay={renderOverlay}
        className={overlayClassName}
        dropAnimation={dropAnimation}
        acceptedDropRef={acceptedDropRef}
      />
    </DndContext>
  );
}

interface VelocityTiltOverlayProps<TSource> {
  readonly source: TSource | null;
  readonly renderOverlay: (source: TSource) => ReactNode;
  readonly className?: string;
  readonly dropAnimation: DropAnimation | null;
  readonly acceptedDropRef: RefObject<boolean>;
}

function VelocityTiltOverlay<TSource>({
  source,
  renderOverlay,
  className,
  dropAnimation,
  acceptedDropRef,
}: VelocityTiltOverlayProps<TSource>) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const last = useRef({ x: 0, time: 0 });
  const tilt = useRef(0);
  const resolvedDropAnimation = useMemo(
    () => dropAnimationForAcceptedHandoff(dropAnimation, acceptedDropRef),
    [acceptedDropRef, dropAnimation],
  );

  const applyTilt = (degrees: number) => {
    overlayRef.current?.style.setProperty("--drag-tilt", `${degrees.toFixed(2)}deg`);
  };

  useDndMonitor({
    onDragStart: () => {
      last.current = { x: 0, time: performance.now() };
      tilt.current = 0;
      applyTilt(0);
    },
    onDragMove: (event: DragMoveEvent) => {
      const now = performance.now();
      const deltaX = event.delta.x - last.current.x;
      const deltaTime = Math.max(1, now - last.current.time);
      const instantaneousTilt = (deltaX / deltaTime) * 35;
      const nextTilt = Math.max(-14, Math.min(14, tilt.current * 0.5 + instantaneousTilt * 0.5));
      tilt.current = nextTilt;
      last.current = { x: event.delta.x, time: now };
      applyTilt(nextTilt);
    },
    onDragEnd: () => {
      tilt.current = 0;
      applyTilt(0);
    },
    onDragCancel: () => {
      tilt.current = 0;
      applyTilt(0);
    },
  });

  return (
    <DragOverlay dropAnimation={resolvedDropAnimation}>
      {source ? (
        <div ref={overlayRef} className={className}>
          {renderOverlay(source)}
        </div>
      ) : null}
    </DragOverlay>
  );
}

const defaultDropKeyframes: DropAnimationKeyframeResolver = ({ transform }) => [
  { transform: cssTransform(transform.initial) },
  { transform: cssTransform(transform.final) },
];

function dropAnimationForAcceptedHandoff(
  dropAnimation: DropAnimation | null,
  acceptedDropRef: RefObject<boolean>,
): DropAnimation | null {
  if (!dropAnimation || typeof dropAnimation === "function") return dropAnimation;
  const resolveKeyframes = dropAnimation.keyframes ?? defaultDropKeyframes;

  return {
    ...dropAnimation,
    keyframes: (parameters) => {
      const keyframes = resolveKeyframes(parameters).filter(
        (keyframe) => keyframe !== undefined,
      ) as Keyframe[];
      const firstKeyframe = keyframes[0];
      if (!acceptedDropRef.current || firstKeyframe === undefined) return keyframes;
      return [firstKeyframe, firstKeyframe];
    },
  };
}

function cssTransform(transform: {
  readonly x: number;
  readonly y: number;
  readonly scaleX: number;
  readonly scaleY: number;
}): string {
  return `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`;
}
