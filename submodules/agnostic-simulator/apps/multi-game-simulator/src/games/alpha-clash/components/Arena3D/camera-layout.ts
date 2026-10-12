import { PerspectiveCamera, Vector3, type Camera } from "three";
import { arenaRows, fieldCardHeight, CARD_RATIO } from "./layout";
import { handScreenBounds, handScreenSlot } from "./hand-layout";

/** Viewport-only camera contract. Game state must never enter this fit. */
export function fitArenaCamera(
  camera: PerspectiveCamera,
  size: { width: number; height: number },
  compact: boolean,
) {
  // Fit the playable table between the screen-space hands. Their old world
  // positions must not reserve empty table space now that they face the camera.
  camera.position.set(0, compact ? -350 : -360, 1900);
  camera.lookAt(0, compact ? -20 : -60, 0);
  camera.aspect = size.width / size.height;
  camera.fov = 40;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const horizontalScale = Math.min(1, size.width / size.height / 1.6);
  const rivalCount = 8;
  const ownCount = 8;
  const handView = { ...size, compact };
  const rivalBottom = Math.max(
    0,
    ...Array.from({ length: rivalCount }, (_, index) => {
      const bounds = handScreenBounds(handScreenSlot(index, rivalCount, true, handView));
      return bounds.top + bounds.height;
    }),
  );
  const ownTop = Math.min(
    size.height,
    ...Array.from(
      { length: ownCount },
      (_, index) => handScreenBounds(handScreenSlot(index, ownCount, false, handView)).top,
    ),
  );
  const handGap = Math.min(compact ? 20 : 28, Math.max(compact ? 12 : 18, size.height * 0.025));
  const topLimit = Math.max(0.4, 1 - (2 * (rivalBottom + handGap)) / size.height);
  // Empty hands must not let the resource rail push the frame below the viewport.
  const bottomLimit = Math.max(
    0.3,
    Math.min(
      (2 * (ownTop - handGap)) / size.height - 1,
      1 - (2 * (compact ? 80 : 100)) / size.height,
    ),
  );
  const sideLimit = 1 - (2 * (compact ? 16 : 24)) / size.width;
  // Fixed arena envelope, independent of cards, rail allocation, and opening beats.
  const top = arenaRows(compact, false);
  const bottom = arenaRows(compact, true);
  const halfWidth = Math.max(
    920 * horizontalScale,
    730 * horizontalScale + (fieldCardHeight(compact) * CARD_RATIO) / 2,
  );
  const worldCorners = [-halfWidth, halfWidth].flatMap((x) =>
    [top.railCenter + top.railHeight / 2, -bottom.railCenter - bottom.railHeight / 2].map(
      (y) => new Vector3(x, y, 24),
    ),
  );
  const corners = worldCorners.map((point) => point.clone().project(camera));
  // Fit the vertical span, then align its top edge below the opponent hand.
  // Fitting each edge around screen center would waste space on asymmetric rows.
  const fit = Math.max(
    ...corners.map((point) => Math.abs(point.x) / sideLimit),
    (Math.max(...corners.map((point) => point.y)) - Math.min(...corners.map((point) => point.y))) /
      (topLimit + bottomLimit),
  );
  camera.fov = (2 * Math.atan(Math.tan((40 * Math.PI) / 360) * fit) * 180) / Math.PI;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  {
    // Width fitting can leave a large top gap. Align the table's upper edge
    // to the hand reserve and leave the extra space toward the local hand.
    const upper = worldCorners.reduce((best, point) =>
      point.clone().project(camera).y > best.clone().project(camera).y ? point : best,
    );
    const upperY = ((1 - upper.clone().project(camera).y) * size.height) / 2;
    const depth = upper.clone().sub(camera.position).dot(camera.getWorldDirection(new Vector3()));
    const unitsPerPixel = (2 * Math.tan((camera.fov * Math.PI) / 360) * depth) / size.height;
    const shift = (upperY - rivalBottom - handGap) * unitsPerPixel;
    const up = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(up, -shift);
    camera.updateMatrixWorld();
  }
}

export function boardFrameSize(compact: boolean) {
  const top = arenaRows(compact, false);
  const bottom = arenaRows(compact, true);
  return {
    width: 1900,
    height: top.railCenter + top.railHeight / 2 + bottom.railCenter + bottom.railHeight / 2 + 320,
    y: -bottom.seatOffset / 2 - 45,
  };
}

/** Uniform cover scale for decoration only; gameplay coordinates do not change. */
export function boardFrameCover(camera: Camera, compact: boolean) {
  const frame = boardFrameSize(compact);
  const center = camera.getWorldPosition(new Vector3());
  return Math.max(
    1,
    ...[-1, 1].flatMap((x) =>
      [-1, 1].map((y) => {
        const ray = new Vector3(x, y, 0).unproject(camera).sub(center);
        const point = center.clone().addScaledVector(ray, (-8 - center.z) / ray.z);
        return Math.max(
          Math.abs(point.x) / (frame.width / 2),
          Math.abs(point.y - frame.y) / (frame.height / 2),
        );
      }),
    ),
  );
}
