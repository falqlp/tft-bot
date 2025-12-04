export interface ScreenRegion {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface TFTRegions {
    shop: Record<string, ScreenRegion>;
    gold: ScreenRegion;
    xp: ScreenRegion;
    lvl: ScreenRegion;
    round: ScreenRegion;
}

export const TFT_REGIONS: TFTRegions = {
    gold: {
        left: 0.495,
        top: 0.815,
        width: 0.026,
        height: 0.028
    },
    xp: {
        left: 0.21,
        top: 0.815,
        width: 0.022,
        height: 0.028
    },
    lvl: {
        left: 0.167,
        top: 0.815,
        width: 0.022,
        height: 0.028
    },
    round: {
        left: 0.40,
        top: 0.01,
        width: 0.022,
        height: 0.028
    },

    shop: {
        slot1: { left: 0.250, top: 0.963, width: 0.078, height: 0.028 },
        slot2: { left: 0.355, top: 0.963, width: 0.078, height: 0.028 },
        slot3: { left: 0.460, top: 0.963, width: 0.078, height: 0.028 },
        slot4: { left: 0.566, top: 0.963, width: 0.078, height: 0.028 },
        slot5: { left: 0.671, top: 0.963, width: 0.078, height: 0.028 }
    }
};

