import "./layers.css";
import { Canvas, events, useThree, type CanvasProps, type RootStore } from "@react-three/fiber";
import { useEffect } from "react";

// Async canvas creation may complete after its DOM event source has unmounted.
function tabletopEvents(store: RootStore) {
  const manager = events(store);
  return {
    ...manager,
    connect: (target: HTMLElement | null) => {
      if (target) manager.connect?.(target);
    },
  };
}

function RenderLifecycle({ onContextLost }: { onContextLost?: () => void }) {
  const canvas = useThree((state) => state.gl.domElement);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const lost = () => onContextLost?.();
    const resume = () => {
      if (!document.hidden) invalidate();
    };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", resume);
    document.addEventListener("visibilitychange", resume);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", resume);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [canvas, invalidate, onContextLost]);
  return null;
}

/** Match-lifetime canvas. Games supply camera, layout, lights and artwork.
 * Motion mutates scene refs and invalidates only while active; no React frame clock. */
export function TabletopCanvas({
  children,
  onContextLost,
  onCreated,
  ...props
}: Omit<CanvasProps, "frameloop"> & { onContextLost?: () => void }) {
  return (
    <Canvas
      events={tabletopEvents}
      dpr={[1, 1.75]}
      {...props}
      frameloop="demand"
      onCreated={(state) => {
        state.gl.domElement.setAttribute("aria-hidden", "true");
        onCreated?.(state);
      }}
    >
      <RenderLifecycle onContextLost={onContextLost} />
      {children}
    </Canvas>
  );
}
