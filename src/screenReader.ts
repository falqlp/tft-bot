import screenshot from "screenshot-desktop";
import {ScreenRegion} from "./regions";
import sharp = require("sharp");

export const TFT_SCREEN_ID = '\\\\.\\DISPLAY2';

export async function captureFullScreen(): Promise<Buffer> {
    return await screenshot({ screen: TFT_SCREEN_ID });
}

export async function cropFromFull(region: ScreenRegion, img:Buffer): Promise<Buffer> {
    return await sharp(img)
        .extract({
            left: region.left,
            top: region.top,
            width: region.width,
            height: region.height,
        })
        .grayscale()
        .normalize()
        .png()
        .toBuffer();
}
