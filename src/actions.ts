import {Key, keyboard} from "@nut-tree-fork/nut-js";
import {ScreenRegion} from "./regions";
import {humanLeftClickRegion, humanToRegion} from "./utils/mouseUtils";

export async function roll(){
    await keyboard.type(Key.D)
}

export async function push(){
    await keyboard.type(Key.F)
}

export async function sell(region: ScreenRegion){
    await humanToRegion(region)
    await keyboard.type(Key.E)
}

export async function buy(region: ScreenRegion){
    await humanLeftClickRegion(region);
}