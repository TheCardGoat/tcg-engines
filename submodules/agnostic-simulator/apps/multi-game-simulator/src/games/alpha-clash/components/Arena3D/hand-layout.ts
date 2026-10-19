import { tabletopFanSlot } from "@tcg/simulator-presentation";
import { inspectionPose } from "@tcg/simulator-presentation/inspection-pose";
import { Vector3, type Camera } from "three";
import { CARD_RATIO, type PlacedCard } from "./layout";

export interface HandViewport {
  width: number;
  height: number;
  compact: boolean;
}

/** Screen pixels: hands do not inherit the table's perspective or world scale. */
export function handScreenSlot(
  index: number,
  count: number,
  rival: boolean,
  view: HandViewport,
  hovered = false,
) {
  const { width, height, compact } = view;
  const cardHeight = rival
    ? Math.min(compact ? 88 : 138, height * (compact ? 0.22 : 0.17))
    : Math.min(compact ? 108 : 210, height * (compact ? 0.27 : 0.255));
  const cardWidth = cardHeight * CARD_RATIO;
  const span = Math.min(width * (rival ? 0.42 : 0.59), rival ? 540 : 880);
  const fan = tabletopFanSlot(
    index,
    count,
    cardWidth,
    span,
    compact ? 8 : 17,
    rival ? 8 : 7,
    rival ? 0.5 : 0.78,
  );
  const scale = hovered && !rival ? 1.12 : 1;
  const h = cardHeight * scale;
  const w = h * CARD_RATIO;
  const centerX = width * (rival ? 0.54 : 0.46) + fan.x;
  const centerY = rival
    ? cardHeight * 0.12 - fan.drop
    : hovered
      ? height - h / 2
      : height - cardHeight * 0.29 + fan.drop;
  return {
    left: centerX - w / 2,
    top: centerY - h / 2,
    width: w,
    height: h,
    angle: hovered && !rival ? 0 : fan.angle * (rival ? -1 : 1),
  };
}

export function handScreenBounds(slot: ReturnType<typeof handScreenSlot>) {
  const radians = (slot.angle * Math.PI) / 180;
  const width =
    Math.abs(Math.cos(radians)) * slot.width + Math.abs(Math.sin(radians)) * slot.height;
  const height =
    Math.abs(Math.cos(radians)) * slot.height + Math.abs(Math.sin(radians)) * slot.width;
  return {
    left: slot.left + (slot.width - width) / 2,
    top: slot.top + (slot.height - height) / 2,
    width,
    height,
  };
}

/** Keep a lifted card reachable at its resting edge without scrolling the arena on focus. */
export function handHitBounds(
  visual: { left: number; top: number; width: number; height: number },
  resting: { left: number; top: number; width: number; height: number },
  view: Pick<HandViewport, "width" | "height">,
) {
  const left = Math.max(0, Math.min(visual.left, resting.left));
  const top = Math.max(0, Math.min(visual.top, resting.top));
  return {
    left,
    top,
    width: Math.max(
      0,
      Math.min(view.width, Math.max(visual.left + visual.width, resting.left + resting.width)) -
        left,
    ),
    height: Math.max(
      0,
      Math.min(view.height, Math.max(visual.top + visual.height, resting.top + resting.height)) -
        top,
    ),
  };
}

/** A camera-facing plane between the table and the close inspection plane. */
export function handPlacement(
  placed: PlacedCard,
  index: number,
  count: number,
  rival: boolean,
  view: HandViewport & { camera: Camera },
  hovered = false,
): PlacedCard {
  const slot = handScreenSlot(index, count, rival, view, hovered);
  const baseDistance = view.camera.position.length() * (hovered ? 0.55 : 0.6);
  const basePose = inspectionPose(view.camera, {
    distance: baseDistance,
    aspect: CARD_RATIO,
    viewportAspect: view.width / view.height,
    heightFraction: slot.height / view.height,
  });
  // The full card occupies local depth [-0.014, 0.06], including its cues.
  // Separate complete cards after scaling so a rear cue cannot pierce the
  // next card's back. Recompute its screen-sized pose at the new distance.
  const distance = baseDistance - index * basePose.scale * 0.08;
  const pose = inspectionPose(view.camera, {
    distance,
    aspect: CARD_RATIO,
    viewportAspect: view.width / view.height,
    heightFraction: slot.height / view.height,
  });
  const units = pose.scale / slot.width;
  const center = new Vector3(pose.x, pose.y, pose.z)
    .addScaledVector(
      new Vector3(1, 0, 0).applyQuaternion(view.camera.quaternion),
      (slot.left + slot.width / 2 - view.width / 2) * units,
    )
    .addScaledVector(
      new Vector3(0, 1, 0).applyQuaternion(view.camera.quaternion),
      (view.height / 2 - slot.top - slot.height / 2) * units,
    );
  return {
    ...placed,
    x: center.x,
    y: center.y,
    z: center.z,
    height: pose.scale / CARD_RATIO,
    angle: (-slot.angle * Math.PI) / 180,
    rotationX: pose.rotationX,
  };
}
