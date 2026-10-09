import { useMemo, useEffect } from "react";
import * as THREE from "three";
import { cambriaGeometry } from "./composition";
import type { BoardRect, GrandArchiveComposition, GrandArchiveTheme } from "./composition";

interface Tile {
  x: number;
  z: number;
  w: number;
  h: number;
  u: number;
  v: number;
  uw: number;
  vh: number;
}
function Artwork({ texture, tile, y = 0.025 }: { texture: THREE.Texture; tile: Tile; y?: number }) {
  const geometry = useMemo(() => {
    const value = new THREE.PlaneGeometry(tile.w, tile.h);
    const uv = value.getAttribute("uv");
    for (let index = 0; index < uv.count; index++) {
      uv.setXY(
        index,
        tile.u + uv.getX(index) * tile.uw,
        1 - tile.v - (1 - uv.getY(index)) * tile.vh,
      );
    }
    return value;
  }, [tile.w, tile.h, tile.u, tile.v, tile.uw, tile.vh]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[tile.x, y, tile.z]}>
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** Nine independently placed regions. Rail middles repeat; raster art never stretches. */
function Frame({
  texture,
  rect,
  cap,
  cut,
  y = 0.04,
}: {
  texture: THREE.Texture;
  rect: BoardRect;
  cap: number;
  cut: number;
  y?: number;
}) {
  const tiles = useMemo(() => {
    const result: Tile[] = [];
    const left = rect.x - rect.width / 2;
    const top = rect.y - rect.height / 2;
    for (const row of [0, 1])
      for (const column of [0, 1])
        result.push({
          x: left + (column ? rect.width - cap / 2 : cap / 2),
          z: top + (row ? rect.height - cap / 2 : cap / 2),
          w: cap,
          h: cap,
          u: column ? 1 - cut : 0,
          v: row ? 1 - cut : 0,
          uw: cut,
          vh: cut,
        });
    const sourceLength = 1 - 2 * cut;
    const segment = (cap * sourceLength) / cut;
    for (const row of [0, 1]) {
      for (let offset = cap; offset < rect.width - cap - 0.001; offset += segment) {
        const length = Math.min(segment, rect.width - cap - offset);
        result.push({
          x: left + offset + length / 2,
          z: top + (row ? rect.height - cap / 2 : cap / 2),
          w: length,
          h: cap,
          u: cut,
          v: row ? 1 - cut : 0,
          uw: (sourceLength * length) / segment,
          vh: cut,
        });
      }
    }
    for (const column of [0, 1]) {
      for (let offset = cap; offset < rect.height - cap - 0.001; offset += segment) {
        const length = Math.min(segment, rect.height - cap - offset);
        result.push({
          x: left + (column ? rect.width - cap / 2 : cap / 2),
          z: top + offset + length / 2,
          w: cap,
          h: length,
          u: column ? 1 - cut : 0,
          v: cut,
          uw: cut,
          vh: (sourceLength * length) / segment,
        });
      }
    }
    return result;
  }, [rect.x, rect.y, rect.width, rect.height, cap, cut]);
  return (
    <group>
      {tiles.map((tile, index) => (
        <Artwork key={index} texture={texture} tile={tile} y={y} />
      ))}
    </group>
  );
}
function Inset({
  rect,
  frame,
  theme,
  cap = 0.3,
  y = 0.065,
}: {
  rect: BoardRect;
  frame: THREE.Texture;
  theme: GrandArchiveTheme;
  cap?: number;
  y?: number;
}) {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[rect.x, y - 0.01, rect.y]}>
        <planeGeometry args={[rect.width - cap * 0.35, rect.height - cap * 0.35]} />
        <meshStandardMaterial color={theme.palette.recess} roughness={0.9} />
      </mesh>
      <Frame texture={frame} rect={rect} cap={cap} cut={theme.housingCut} y={y} />
    </group>
  );
}
export function ThemeTable({
  composition,
  theme,
  surface,
  frame,
  housing,
  ornament,
}: {
  composition: GrandArchiveComposition;
  theme: GrandArchiveTheme;
  surface?: THREE.Texture;
  frame?: THREE.Texture;
  housing?: THREE.Texture;
  ornament?: THREE.Texture;
}) {
  const { width, height, mode, slots } = composition;
  const variant = theme.variants[mode];
  const felt = useMemo(() => {
    if (!surface) return undefined;
    const value = surface.clone();
    value.wrapS = value.wrapT = THREE.RepeatWrapping;
    value.repeat.set(width / 12, height / 12);
    value.needsUpdate = true;
    return value;
  }, [surface, width, height]);
  useEffect(() => () => felt?.dispose(), [felt]);
  return (
    <group>
      <ambientLight intensity={1.4} />
      <directionalLight
        position={[-6, 12, -5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-width / 2}
        shadow-camera-right={width / 2}
        shadow-camera-top={height / 2}
        shadow-camera-bottom={-height / 2}
        shadow-normalBias={0.025}
      />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]}>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial color={theme.palette.backing} roughness={0.9} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[width - 0.55, height - 0.55]} />
        <meshStandardMaterial
          key={felt?.uuid ?? "loading-surface"}
          map={felt}
          color={felt ? theme.palette.surface : theme.palette.recess}
          emissive={theme.palette.recess}
          emissiveIntensity={theme.contract === "cambria-table-v1" ? 0.65 : 0}
          roughness={0.97}
        />
      </mesh>
      {theme.contract === "cambria-table-v1" ? (
        <CambriaFrame composition={composition} frame={frame} rail={housing} ornament={ornament} />
      ) : (
        <>
          {frame ? (
            <>
              <Frame
                texture={frame}
                rect={{ x: 0, y: 0, width: width - 0.12, height: height - 0.12 }}
                cap={variant.rim}
                cut={theme.frameCut}
              />
            </>
          ) : null}
          {housing ? (
            <>
              {/* One continuous right fitting connects the resource ends and deck recesses. */}
              <Inset
                rect={{
                  x: slots.action.x,
                  y: 0,
                  width: slots.action.width + 0.08,
                  height: height - 0.4,
                }}
                frame={housing}
                theme={theme}
                cap={Math.min(variant.rim * 0.55, 0.65)}
                y={0.02}
              />
              <Inset rect={slots.opponentMemory} frame={housing} theme={theme} cap={0.32} />
              <Inset rect={slots.selfMemory} frame={housing} theme={theme} cap={0.32} />
              <Inset rect={slots.opponentDeck} frame={housing} theme={theme} cap={0.34} />
              <Inset rect={slots.selfDeck} frame={housing} theme={theme} cap={0.34} />
              <Inset rect={slots.action} frame={housing} theme={theme} cap={0.34} />
              <Inset rect={slots.undo} frame={housing} theme={theme} cap={0.18} />
            </>
          ) : null}
          {ornament ? (
            <>
              <Artwork
                texture={ornament}
                y={0.065}
                tile={{
                  x: -width / 2 + variant.ornamentSize * 0.46,
                  z: -height / 2 + variant.ornamentSize * 0.48,
                  w: variant.ornamentSize,
                  h: variant.ornamentSize,
                  u: 0,
                  v: 0,
                  uw: 1,
                  vh: 1,
                }}
              />
              {mode === "wide" ? (
                <Artwork
                  texture={ornament}
                  y={0.065}
                  tile={{
                    x: -width / 2 + variant.ornamentSize * 0.46,
                    z: height / 2 - variant.ornamentSize * 0.48,
                    w: variant.ornamentSize,
                    h: variant.ornamentSize,
                    u: 0,
                    v: 0,
                    uw: 1,
                    vh: 1,
                  }}
                />
              ) : null}
            </>
          ) : null}
        </>
      )}
    </group>
  );
}

/** Independent art layers, repeated straight sections, never a stretched board bitmap. */
function CambriaFrame({
  composition,
  frame,
  rail,
  ornament,
}: {
  composition: GrandArchiveComposition;
  frame?: THREE.Texture;
  rail?: THREE.Texture;
  ornament?: THREE.Texture;
}) {
  const { width, height, mode } = composition;
  const g = cambriaGeometry(width, height, mode);
  const parts: Tile[] = [];
  const fw = g.frameWidth;
  for (const bottom of [false, true])
    parts.push({
      x: 0,
      z: bottom ? g.frameBottom - fw * 0.09 : -height / 2 + fw * 0.09,
      w: fw,
      h: fw * 0.18,
      u: 0,
      v: bottom ? 0.82 : 0,
      uw: 1,
      vh: 0.18,
    });
  const sideTop = -height / 2 + fw * 0.18;
  const sideBottom = g.frameBottom - fw * 0.18;
  const leftPart = (v: number, length: number, top: number) =>
    parts.push({
      x: -fw / 2 + fw * 0.09,
      z: top + length / 2,
      w: fw * 0.18,
      h: length,
      u: 0,
      v,
      uw: 0.18,
      vh: length / fw,
    });
  leftPart(0.18, fw * 0.08, sideTop);
  leftPart(0.74, fw * 0.08, sideBottom - fw * 0.08);
  for (let z = sideTop + fw * 0.08; z < sideBottom - fw * 0.08 - 0.001; ) {
    const length = Math.min(fw * 0.35, sideBottom - fw * 0.08 - z);
    leftPart(0.3, length, z);
    z += length;
  }
  const railParts: Tile[] = [];
  const add = (v: number, vh: number, top: number) =>
    railParts.push({
      x: g.railLeft + g.railWidth / 2,
      z: top + (vh * g.railScale) / 2,
      w: g.railWidth,
      h: vh * g.railScale,
      u: 0,
      v,
      uw: 1,
      vh,
    });
  add(0, 0.14, g.top);
  add(0.35, 0.25, -g.railScale * 0.125);
  add(0.85, 0.15, g.bottom - g.railScale * 0.15);
  const well = (from: number, to: number, v: number, end: number) => {
    const cap = 0.045;
    add(v, cap, from);
    add(end - cap, cap, to - cap * g.railScale);
    for (let top = from + cap * g.railScale; top < to - cap * g.railScale - 0.001; ) {
      const slice = Math.min((end - v - 2 * cap) * g.railScale, to - cap * g.railScale - top);
      add(v + cap, slice / g.railScale, top);
      top += slice;
    }
  };
  well(g.top + g.railScale * 0.14, -g.railScale * 0.125, 0.14, 0.35);
  well(g.railScale * 0.125, g.bottom - g.railScale * 0.15, 0.6, 0.85);
  return (
    <group>
      {frame
        ? parts.map((tile, i) => (
            <Artwork key={`frame-${i}`} texture={frame} tile={tile} y={0.04} />
          ))
        : null}
      {rail
        ? railParts.map((tile, i) => (
            <Artwork key={`rail-${i}`} texture={rail} tile={tile} y={0.045} />
          ))
        : null}
      {ornament
        ? [0, 1, 2, 3].map((corner) => {
            const right = corner % 2 === 1;
            const bottom = corner > 1;
            const size = mode === "compact" ? (right ? 2.1 : 3.0) : right ? 3.5 : 4.8;
            return (
              <Artwork
                key={corner}
                texture={ornament}
                y={0.055}
                tile={{
                  x: (right ? 1 : -1) * (width / 2 - size * 0.5),
                  z: bottom ? g.frameBottom - size * 0.5 : -height / 2 + size * 0.5,
                  w: size,
                  h: size,
                  u: right ? 0.5 : 0,
                  v: bottom ? 0.5 : 0,
                  uw: 0.5,
                  vh: 0.5,
                }}
              />
            );
          })
        : null}
    </group>
  );
}
