export const mainOrActionAbility = (ability) => {
    return [
        {
            type: "main",
            ...ability,
        },
        {
            type: "action",
            ...ability,
        },
    ];
};
export const repairAbility = (value) => ({
    name: "Repair",
    text: `At the start of your turn, this unit recovers ${value} of HP.`,
    type: "static",
    abilityType: "repair",
    value,
});
export const blockerAbility = {
    name: "Blocker",
    text: "(Rest this Unit to change the attack target to it.)",
    type: "static",
    abilityType: "blocker",
};
//# sourceMappingURL=abilities.js.map