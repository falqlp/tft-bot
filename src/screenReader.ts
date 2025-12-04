import screenshot from "screenshot-desktop";
import {ScreenRegion} from "./regions";
import sharp = require("sharp");

export const TFT_SCREEN_ID = '\\\\.\\DISPLAY2';
export interface ScreenOptions{
    height: number;
    width: number;
}

export async function captureFullScreen(): Promise<Buffer> {
    return await screenshot({ screen: TFT_SCREEN_ID });
}

export async function cropFromFull(region: ScreenRegion, img:Buffer, screenOption:ScreenOptions): Promise<Buffer> {
    return await sharp(img)
        .extract({
            left: Math.floor(screenOption.width * region.left),
            top: Math.floor(screenOption.height * region.top),
            width: Math.floor(screenOption.width * region.width),
            height: Math.floor(screenOption.height * region.height),
        })
        .grayscale()
        .normalize()
        .png()
        .toBuffer();
}
