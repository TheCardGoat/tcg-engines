/**
 * Coordinate frame for match-animation overlays. Endpoints are measured in
 * viewport space and the overlays portal to the document body.
 */
export interface AnimationSurfaceFrame {
  /** Portal target for overlay layers; null means document.body (viewport units). */
  readonly surface: HTMLDivElement | null;
  readonly rotated: boolean;
  /** Map a measured viewport rect into overlay coordinate space. */
  readonly mapRect: (rect: DOMRect) => DOMRect;
}

const viewportFrame: AnimationSurfaceFrame = {
  surface: null,
  rotated: false,
  mapRect: (rect) => rect,
};

export function useAnimationSurfaceFrame(): AnimationSurfaceFrame {
  return viewportFrame;
}
