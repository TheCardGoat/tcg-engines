import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace } from "three";
import { cardStatArtwork } from "./card-stat-artwork";
import { CARD_RATIO } from "./layout";

/** Shares the card's transform and depth, including inspection, engagement and hand motion. */
export function CardPrintedStats({
  attack,
  defense,
  health,
  contender,
  color,
  aspect,
  field = false,
}: {
  attack?: number;
  defense?: number;
  health?: number;
  contender: boolean;
  color: string;
  aspect: number;
  field?: boolean;
}) {
  const [map, setMap] = useState<CanvasTexture>();
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const image = new Image();
    let disposed = false;
    let texture: CanvasTexture | undefined;
    image.onload = () => {
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1114;
      canvas.getContext("2d")?.drawImage(image, 0, 0);
      texture = new CanvasTexture(canvas);
      texture.colorSpace = SRGBColorSpace;
      setMap(texture);
      invalidate();
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cardStatArtwork({ attack, defense, health, contender, color, field }))}`;
    return () => {
      disposed = true;
      texture?.dispose();
    };
  }, [attack, defense, health, contender, color, field, invalidate]);
  const width = Math.min(1, aspect / CARD_RATIO);
  return map ? (
    <mesh position={[0, 0, 0.006]}>
      <planeGeometry args={[width, width / aspect]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  ) : null;
}
