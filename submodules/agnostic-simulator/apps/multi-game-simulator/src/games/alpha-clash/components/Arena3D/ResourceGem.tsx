import { ColorGem } from "@tcg/simulator-ui";
import { RESOURCE_GEMS, resourceColorHex } from "./resource-colors";

/**
 * The printed resource gem for a color (rule 107.4a), from the assets repo.
 * Falls back to the shared inline diamond when a color has no printed gem.
 */
export function ResourceGem({ color, size = 16 }: { color: string; size?: number }) {
  const gem = RESOURCE_GEMS[color];
  if (gem)
    return (
      <img
        src={gem}
        alt=""
        draggable={false}
        style={{ width: size, height: size, display: "block", objectFit: "contain" }}
      />
    );
  return <ColorGem color={resourceColorHex(color)} label={color} size={size} />;
}
