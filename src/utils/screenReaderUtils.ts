import screenshot from "screenshot-desktop";
import {ScreenRegion} from "../regions";
import sharp = require("sharp");
import {ScreenParameters} from "../ScreenParameters";

export const TFT_SCREEN_ID = '\\\\.\\DISPLAY2';
export interface ScreenOptions{
    height: number;
    width: number;
    left: number;
    top: number;
}

export async function captureFullScreen(): Promise<Buffer> {
    return await screenshot({ screen: TFT_SCREEN_ID });
}

export async function cropFromFull(region: ScreenRegion, img:Buffer): Promise<Buffer> {
    return await sharp(img)
        .extract({
            left: Math.floor(ScreenParameters.SCREEN_PARAMETERS.width * region.left),
            top: Math.floor(ScreenParameters.SCREEN_PARAMETERS.height * region.top),
            width: Math.floor(ScreenParameters.SCREEN_PARAMETERS.width * region.width),
            height: Math.floor(ScreenParameters.SCREEN_PARAMETERS.height * region.height),
        })
        .grayscale()
        .normalize()
        .png()
        .toBuffer();
}
