/**
 * Grand Archive Token Definitions
 *
 * Special tokens and generated cards used in Grand Archive gameplay
 */
/**
 * Spirit Ally Token
 * Created by various champion abilities
 */
export const spiritAllyToken = {
    id: "TOKEN-SPIRIT-001",
    name: "Spirit Ally",
    type: "ally",
    set: "TOKEN",
    number: 1,
    rarity: "common",
    element: "norm",
    power: 1,
    life: 1,
    subtypes: ["Spirit"],
    text: "A manifestation of spiritual energy.",
    implemented: true,
};
/**
 * Astracrux Token
 * Created by Astracrux-related effects
 */
export const astracruxToken = {
    id: "TOKEN-ASTRACRUX-001",
    name: "Astracrux Token",
    type: "ally",
    set: "TOKEN",
    number: 2,
    rarity: "common",
    element: "astracrux",
    power: 2,
    life: 2,
    subtypes: ["Astracrux", "Construct"],
    text: "A crystalline construct of pure Astracrux energy.",
    implemented: true,
};
/**
 * Export all tokens
 */
export const TOKEN_CARDS = {
    [spiritAllyToken.id]: spiritAllyToken,
    [astracruxToken.id]: astracruxToken,
};
//# sourceMappingURL=tokens.js.map