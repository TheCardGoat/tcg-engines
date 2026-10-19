import { useEffect, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { ArenaZone } from "./zones";
import { zoneSurface } from "./zone-surface";

/** Engraved field marks stay below cards; readable counts and controls live in the HUD. */
export function SceneZone({
  zone,
  own,
  highlighted,
  priority = false,
  horizontalScale,
}: {
  zone: ArenaZone;
  own: boolean;
  highlighted: boolean;
  priority?: boolean;
  horizontalScale: number;
}) {
  const { width, height, inset, bevel, arm, z } = zoneSurface(zone);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const resolution = 2;
    canvas.width = Math.ceil(width * resolution);
    canvas.height = Math.ceil(height * resolution);
    const context = canvas.getContext("2d");
    if (context) {
      context.scale(resolution, resolution);
      const color = own ? "104, 213, 231" : "229, 103, 113";
      const outline = () => {
        context.beginPath();
        context.moveTo(inset + bevel, inset);
        context.lineTo(width - inset - bevel, inset);
        context.lineTo(width - inset, inset + bevel);
        context.lineTo(width - inset, height - inset - bevel);
        context.lineTo(width - inset - bevel, height - inset);
        context.lineTo(inset + bevel, height - inset);
        context.lineTo(inset, height - inset - bevel);
        context.lineTo(inset, inset + bevel);
        context.closePath();
      };
      outline();
      context.fillStyle = highlighted
        ? `rgba(${color}, 0.065)`
        : priority
          ? `rgba(${color}, 0.018)`
          : "rgba(3, 10, 17, 0.09)";
      context.fill();
      // A dark outer cut and a fine colored edge read as a mark in the table.
      context.strokeStyle = "rgba(0, 5, 10, 0.56)";
      context.lineWidth = 3;
      context.stroke();
      context.strokeStyle = `rgba(${color}, ${highlighted ? 0.76 : priority ? 0.3 : 0.15})`;
      context.lineWidth = highlighted ? 1.8 : 0.8;
      context.stroke();

      context.lineWidth = highlighted ? 2.3 : 1.4;
      context.strokeStyle = `rgba(${color}, ${highlighted ? 0.95 : priority ? 0.72 : 0.36})`;
      for (const [x, y, dx, dy] of [
        [inset, inset, 1, 1],
        [width - inset, inset, -1, 1],
        [inset, height - inset, 1, -1],
        [width - inset, height - inset, -1, -1],
      ]) {
        context.beginPath();
        context.moveTo(x + dx * arm, y);
        context.lineTo(x + dx * bevel, y);
        context.lineTo(x, y + dy * bevel);
        context.lineTo(x, y + dy * arm);
        context.stroke();
      }
      // Quiet engraved symbols identify empty destinations without persistent labels.
      if (zone.count === 0) {
        const symbols: Partial<Record<ArenaZone["zone"], string>> = {
          accessory: "M12 3 L21 7 V13 C21 19 16 23 12 25 C8 23 3 19 3 13 V7 Z",
          clashground: "M2 5 L9 2 L17 5 L24 2 V23 L17 26 L9 23 L2 26 Z M9 2 V23 M17 5 V26",
          clash: "M3 3 L18 18 M21 3 L6 18 M2 17 L7 22 M17 22 L22 17 M3 23 L7 19 M17 19 L21 23",
          resource: "M12 2 L23 13 L12 24 L1 13 Z",
        };
        const symbol = symbols[zone.zone];
        if (symbol) {
          context.save();
          context.translate(width / 2 - 18, height / 2 - 20);
          context.scale(1.5, 1.5);
          context.strokeStyle = `rgba(${color}, ${priority ? 0.26 : 0.14})`;
          context.lineWidth = 1;
          context.lineJoin = "round";
          context.stroke(new Path2D(symbol));
          context.restore();
        }
      }
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [width, height, inset, bevel, arm, own, highlighted, priority, zone.count, zone.zone]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[zone.x * (zone.scaleX ? horizontalScale : 1), zone.y, z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
