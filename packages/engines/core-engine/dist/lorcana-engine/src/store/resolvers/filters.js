export const challengeOpponentsCardsFilter = [
    { filter: "owner", value: "opponent" },
    { filter: "can", value: "challenge" },
    { filter: "type", value: ["character", "location"] },
    { filter: "zone", value: "play" },
];
export const readyCharacterOfYours = [
    { filter: "owner", value: "self" },
    { filter: "type", value: ["character"] },
    { filter: "zone", value: "play" },
    { filter: "status", value: "ready" },
];
export const enterLocationCardsFilter = [
    { filter: "owner", value: "self" },
    { filter: "type", value: "location" },
    { filter: "zone", value: "play" },
];
export const singASongFilter = [
    { filter: "owner", value: "self" },
    { filter: "can", value: "sing_song" },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
];
export const canSingTogetherFilter = [
    { filter: "owner", value: "self" },
    { filter: "can", value: "sing" },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
];
export const shiftCharFilter = (card) => {
    const filter = [
        { filter: "zone", value: "play" },
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
        { filter: "can", value: "shift" },
    ];
    return filter;
};
export function canSingFilter(song) {
    if (!song ||
        song.type !== "action" ||
        !song.cost ||
        !song.characteristics?.includes("song")) {
        return [];
    }
    //TODO: ADD singer ability to filter, this should be an OR filter
    return [
        { filter: "owner", value: "self" },
        { filter: "status", value: "ready" },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "status", value: "dry" },
        {
            filter: "attribute",
            value: "cost",
            comparison: { operator: "gte", value: song.cost },
        },
    ];
}
//# sourceMappingURL=filters.js.map