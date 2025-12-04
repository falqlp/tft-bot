import screenshot from "screenshot-desktop";
import {ScreenOptions, TFT_SCREEN_ID} from "./screenReader";

export async function listDisplays() {
    const displays = await screenshot.listDisplays();
    console.log("Écrans détectés :");
    console.log(displays);
    return displays.find(d => d.id === TFT_SCREEN_ID)! as unknown as ScreenOptions;
}

listDisplays().catch(console.error);
