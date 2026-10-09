export function cardStateChangeTransform(
  progress: number,
  rotationZ: number,
  rotationY: number,
): string {
  const lift = Math.sin(Math.PI * progress) * 42;
  const scale = 1 + Math.sin(Math.PI * progress) * 0.025;

  // Board orientation must be applied before the face flip. Otherwise a
  // tapped card's artwork turns 180° in-plane when the revealed face appears.
  return `translate3d(-50%, -50%, ${lift}px) rotateZ(${rotationZ}deg) rotateY(${rotationY}rad) scale(${scale})`;
}
