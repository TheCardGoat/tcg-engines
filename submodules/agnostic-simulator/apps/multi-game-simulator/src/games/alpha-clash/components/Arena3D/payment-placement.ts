import { Vector3, type Camera } from "three";
import { inspectionPose } from "@tcg/simulator-presentation/inspection-pose";
import { resolutionFocusPose } from "@tcg/simulator-presentation/targeted-resolution";
import { CARD_RATIO, type PlacedCard } from "./layout";

/** The persistent scene card lands exactly under the payment panel's caption. */
export function paymentPlacement(
  placed: PlacedCard,
  camera: Camera,
  width: number,
  height: number,
): PlacedCard {
  const rect = resolutionFocusPose(width, height);
  const pose = inspectionPose(camera, {
    distance: camera.position.length() * 0.43,
    aspect: CARD_RATIO,
    viewportAspect: width / height,
    heightFraction: rect.height / height,
  });
  const units = pose.scale / rect.width;
  const center = new Vector3(pose.x, pose.y, pose.z)
    .addScaledVector(
      new Vector3(1, 0, 0).applyQuaternion(camera.quaternion),
      (rect.left + rect.width / 2 - width / 2) * units,
    )
    .addScaledVector(
      new Vector3(0, 1, 0).applyQuaternion(camera.quaternion),
      (height / 2 - rect.top - rect.height / 2) * units,
    );
  return {
    ...placed,
    x: center.x,
    y: center.y,
    z: center.z,
    height: pose.scale / CARD_RATIO,
    angle: 0,
    rotationX: pose.rotationX,
    hand: false,
  };
}
