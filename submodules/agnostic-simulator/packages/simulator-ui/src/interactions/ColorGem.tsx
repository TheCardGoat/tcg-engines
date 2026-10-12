/** Small color gem: a game-agnostic miniature marking what a resource can generate. */
export function ColorGem({
  color,
  label,
  size = 13,
}: {
  color: string;
  label: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      role="img"
      aria-label={label}
      aria-hidden={undefined}
    >
      <rect
        x={4.4}
        y={4.4}
        width={7.2}
        height={7.2}
        transform="rotate(45 8 8)"
        fill={color}
        stroke="#0b1219"
        strokeWidth={1.6}
      />
    </svg>
  );
}
