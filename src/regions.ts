export interface ScreenRegion {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface TFTRegions {
    shop: Record<string, ScreenRegion>;
    gold: ScreenRegion;
}

export const TFT_REGIONS: TFTRegions = {
    gold: { left: 950, top: 880, width: 50, height: 30 },
    shop: {
        slot1: { left: 475, top: 1040, width: 150, height: 30 },
        slot2: { left: 675, top: 1040, width: 150, height: 30 },
        slot3: { left: 875, top: 1040, width: 150, height: 30 },
        slot4: { left: 1075, top: 1040, width: 150, height: 30 },
        slot5: { left: 1275, top: 1040, width: 150, height: 30 }
    }
};
