import { OrthographicCamera, PerspectiveCamera, Vector3, type Camera } from "three";

/** Camera distance is in game-owned world units; viewport fractions are game-independent. */
export interface InspectionLayout {
  distance: number;
  aspect: number;
  viewportAspect: number;
  heightFraction?: number;
  widthFraction?: number;
}
export const inspectionMotion = {
  enterSeconds: 0.78,
  returnSeconds: 0.62,
  enterArc: 0.095,
  returnArc: 0.062,
} as const;

/** Supports both perspective XY boards and orthographic XZ tables. No card identities or rules. */
export function inspectionPose(camera: Camera, layout: InspectionLayout) {
  const direction = camera.getWorldDirection(new Vector3());
  const center = camera.position.clone().addScaledVector(direction, layout.distance);
  const visibleHeight =
    camera instanceof OrthographicCamera
      ? (camera.top - camera.bottom) / camera.zoom
      : camera instanceof PerspectiveCamera
        ? 2 * Math.tan((camera.getEffectiveFOV() * Math.PI) / 360) * layout.distance
        : 2;
  const width =
    visibleHeight *
    Math.min(
      (layout.heightFraction ?? 0.72) * layout.aspect,
      layout.viewportAspect * (layout.widthFraction ?? 0.68),
    );
  return {
    x: center.x,
    y: center.y,
    z: center.z,
    turn: 0,
    scale: width,
    rotationX: camera.rotation.x,
  };
}

/** Lay out a group on the same camera-facing plane as an inspected card. */
export function inspectionSpreadPose(
  camera: Camera,
  layout: InspectionLayout & {
    count: number;
    index: number;
    columns: number;
    gapFraction?: number;
  },
) {
  const columns = Math.max(1, Math.min(layout.count, layout.columns));
  const rows = Math.max(1, Math.ceil(layout.count / columns));
  const gap = layout.gapFraction ?? 0.06;
  const gridWidth = columns + (columns - 1) * gap;
  const gridHeight = rows + (rows - 1) * gap;
  const pose = inspectionPose(camera, {
    ...layout,
    aspect: (layout.aspect * gridWidth) / gridHeight,
  });
  const width = pose.scale / gridWidth;
  const height = width / layout.aspect;
  const row = Math.floor(layout.index / columns);
  const rowCount = Math.min(columns, layout.count - row * columns);
  const x = ((layout.index % columns) - (rowCount - 1) / 2) * width * (1 + gap);
  const y = ((rows - 1) / 2 - row) * height * (1 + gap);
  const center = new Vector3(pose.x, pose.y, pose.z)
    .addScaledVector(new Vector3(1, 0, 0).applyQuaternion(camera.quaternion), x)
    .addScaledVector(new Vector3(0, 1, 0).applyQuaternion(camera.quaternion), y);
  return { ...pose, x: center.x, y: center.y, z: center.z, scale: width };
}
