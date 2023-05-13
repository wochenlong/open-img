"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.usage = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = "open-setu";
exports.usage = `
api：https://api.lolicon.app/setu/v2

[意见反馈](https://forum.koishi.xyz/t/topic/1727)
`;
exports.Config = koishi_1.Schema.intersect([
    koishi_1.Schema.object({}).description("基础类型"),
    koishi_1.Schema.object({
        sendImage: koishi_1.Schema.boolean().description("是否发送图片").default(false),
        sendTitle: koishi_1.Schema.boolean().description("是否发送标题").default(true),
        sendAuthor: koishi_1.Schema.boolean().description("是否发送作者").default(true),
        sendPid: koishi_1.Schema.boolean().description("是否发送PID").default(true),
        sendTags: koishi_1.Schema.boolean().description("是否发送标签").default(true),
    }).description("进阶设置"),
    koishi_1.Schema.object({
        size: koishi_1.Schema.union(["original", "regular", "small"])
            .role("radio")
            .description("发送图片的规格")
            .default("regular"),
    }).description("高级设置"),
]);
function apply(ctx, config) {
    async function getPivInfo(ctx, session) {
        const size = config.size || "regular"; // 默认为 regular
        const response = await ctx.http.get(`https://api.lolicon.app/setu/v2?size=${size}`);
        const data = response.data;
        if (data.length === 0) {
            await session.send("没有找到图片");
            return;
        }
        const title = data[0].title;
        const author = data[0].author;
        const tags = data[0].tags.join(", ");
        const r18 = data[0].r18;
        const width = data[0].width;
        const height = data[0].height;
        const pid = data[0].pid;
        const urls = data[0].urls;
        const smallUrl = urls.small;
        const regularUrl = urls.regular;
        const originalUrl = urls.original;
        let message = `图片链接：${urls[size]}  \nR18：${r18} \n分辨率： ${width}*${height} \n`;
        if (config.sendTitle)
            message += `标题: ${title} \n`;
        if (config.sendAuthor)
            message += `作者：${author}\n`;
        if (config.sendPid)
            message += `pid：${pid}\n`;
        if (config.sendTags)
            message += `tags: ${tags}\n`;
        await session.send(message);
        if (r18) {
            await session.send("监测到r18标签，已停止发送原图");
        }
        else {
            if (config.sendImage) {
                await session.send("原图比较大，美少女正在努力发送中");
                session.send((0, koishi_1.h)("image", { url: urls[size] }));
            }
        }
    }
    ctx.command("piv", "获取图片信息").action(async ({ session }) => {
        await getPivInfo(ctx, session);
    });
}
exports.apply = apply;
