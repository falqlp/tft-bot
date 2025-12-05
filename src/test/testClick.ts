import { TFT_REGIONS } from "../regions";
import { humanRightClickRegion } from "../utils/mouseUtils";
import {ScreenParameters} from "../ScreenParameters";
import {listDisplays} from "../listDisplays";

async function testClick() {
    ScreenParameters.SCREEN_PARAMETERS = await listDisplays();
    await humanRightClickRegion(TFT_REGIONS.gold);
}
testClick().catch(console.error);