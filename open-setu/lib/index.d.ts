import { Context } from "koishi";
export declare const name = "open-setu";
export declare const usage = "\napi\uFF1Ahttps://api.lolicon.app/setu/v2\n\n[\u610F\u89C1\u53CD\u9988](https://forum.koishi.xyz/t/topic/1727)\n";
export interface Config {
    sendImage?: boolean;
    sendTitle?: boolean;
    sendAuthor?: boolean;
    sendPid?: boolean;
    sendTags?: boolean;
    size: "original" | "regular" | "small";
}
export declare const Config: any;
export declare function apply(ctx: Context, config: Config): void;
