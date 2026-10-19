import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace, Vector3 } from "three";
import { inspectionPose } from "@tcg/simulator-presentation/inspection-pose";
import type { ArenaZone } from "./zones";

/** Board-depth counters let the camera-facing hand occlude them naturally. */
export function ResourceCounter({ zone, own }: { zone: ArenaZone; own: boolean }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const height = 18;
  const width = 56;
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width * 3;
    canvas.height = height * 3;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(3, 3);
      const backing = ctx.createLinearGradient(0, 0, width, height);
      backing.addColorStop(0, "#263c4a");
      backing.addColorStop(1, "#081521");
      ctx.fillStyle = backing;
      ctx.beginPath();
      ctx.roundRect(0.5, 0.5, width - 1, height - 1, 3);
      ctx.fill();
      ctx.strokeStyle = "#607c8c";
      ctx.lineWidth = 1;
      ctx.stroke();
      const color = own ? "#82dbe4" : "#b8a38a";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.save();
      ctx.translate(-1, 1);
      ctx.scale(0.8, 0.8);
      ctx.beginPath();
      ctx.moveTo(14, 3);
      ctx.lineTo(8, 10);
      ctx.lineTo(12, 10);
      ctx.lineTo(10, 15);
      ctx.lineTo(17, 8);
      ctx.lineTo(13, 8);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#e3ecee";
      ctx.font = "700 12px system-ui, sans-serif";
      ctx.fillText(String(zone.ready ?? 0), 25, height / 2);
      ctx.fillStyle = "#8c9da6";
      ctx.font = "600 9px system-ui, sans-serif";
      ctx.fillText(`/ ${zone.count}`, 44, height / 2);
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [width, height, own, zone.count, zone.ready]);
  useEffect(() => () => texture.dispose(), [texture]);
  const horizontalScale = Math.min(1, size.width / size.height / 1.6);
  // Sit on the outer rail edge, away from the Clash row, without reserving a column.
  const center = new Vector3(
    (zone.x + zone.width / 2 - 110) * (zone.scaleX ? horizontalScale : 1),
    zone.y + (own ? -1 : 1) * (zone.height / 2 - 3),
    0,
  );
  // Keep its projected border position while clearing resource-card edges.
  // The camera-facing hand remains closer and can still cover this badge.
  center.lerp(camera.position, 40 / camera.position.z);
  const distance = center.clone().sub(camera.position).dot(camera.getWorldDirection(new Vector3()));
  const pose = inspectionPose(camera, {
    distance,
    aspect: width / height,
    viewportAspect: size.width / size.height,
    heightFraction: height / size.height,
  });
  return (
    <mesh position={center} quaternion={camera.quaternion}>
      <planeGeometry args={[pose.scale, (pose.scale * height) / width]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
