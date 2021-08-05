const fs = require("fs");
const path = require("path");
const through2 = require("through2");
var Vinyl = require("vinyl");

/* 图片格式 */
const IMG_TYPE = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "bmp",
    "tif",
    "pcx",
    "tga",
    "exif",
    "fpx",
    "svg",
    "psd",
    "cdr",
    "pcd",
    "dxf",
    "ufo",
    "eps",
    "ai",
    "raw",
    "WMF",
];

/* 终端 */
const CONFIG_TERMINAL = {
    wap: "wap",
    pc: "pc",
};

/* 尺寸单位 */
const CONFIG_SYMBOL = {
    default: "px",
    rem: "rem",
};

const setImgType = (src = "", typeList = []) => {
    if (!src.length) return;
    let type = "";
    typeList.forEach((t) => {
        if (src.lastIndexOf(t) > -1) {
            type = t;
        }
    });
    return `.${type}`;
};

const px2rem = (width = 0, symbol = CONFIG_SYMBOL.rem) => {
    var str = (width + "").replace(/px$/gi, "");
    var len = str.length;
    var ret = 0;
    if (len === 1 && +str === 0) ret = 0;
    else if (len === 1 && +str !== 0) ret = `0.0${str}${symbol}`;
    else if (len === 2) ret = `0.${str}${symbol}`;
    else if (len >= 3) ret = str.replace(/(?=\d{2}$)/, ".") + symbol;
    return ret;
};

const getPixel = ({ width = 0, terminal = CONFIG_TERMINAL.wap }) => {
    let ret = "";

    switch (terminal) {
        case CONFIG_TERMINAL.wap:
            ret = px2rem(width, CONFIG_SYMBOL.rem);
            break;
        case CONFIG_TERMINAL.pc:
            // ret = `${width}${CONFIG_SYMBOL.default}`
            ret = width;
        default:
            ret = width;
            break;
    }

    return ret;
};

/**
 * 获取移动端雪碧图
 * @param {Object} data 雪碧图详细参数列表
 * @param {Boolean} isSprite false:生成单独图片；true:生成雪碧图
 * @param {String} imgPath 雪碧图相对路径
 */
const getImg2CssWap = (data = {}, imgPath = "../img/", isSprite = false) => {
    let ret = [],
        spriteCls = [],
        spriteBI = "",
        isSpriteBI = false,
        cssText = "";

    data.sprites.forEach((sprite) => {
        const spriteName = sprite.name,
            widthSGL = getPixel({ width: sprite.px.width, terminal: CONFIG_TERMINAL.wap, symbol: CONFIG_SYMBOL.wap }),
            heightSGL = getPixel({ width: sprite.px.height, terminal: CONFIG_TERMINAL.wap, symbol: CONFIG_SYMBOL.wap }),
            widthTotal = getPixel({
                width: sprite.px.total_width,
                terminal: CONFIG_TERMINAL.wap,
                symbol: CONFIG_SYMBOL.wap,
            });

        // 雪碧图
        if (isSprite) {
            // 抽离类名
            spriteCls.push(`,.${spriteName}`);
            if (!isSpriteBI) {
                isSpriteBI = true;
                spriteBI = `{display:inline-block;background: url("${imgPath}${sprite.escaped_image}") no-repeat top center / ${widthTotal} auto;}\n`;
            }

            cssText = `.${spriteName}{
        width:${widthSGL};
        height:${heightSGL};
        background-position:${px2rem(sprite.px.offset_x)} ${px2rem(sprite.px.offset_y)};
      }\n`;
        }
        // 单独图片
        else {
            let source = sprite.source_image,
                imgName = source.substr(source.indexOf(spriteName));
            cssText = `.${spriteName}{
        display:inline-block;
        width:${widthSGL};
        height:${heightSGL};
        background: url("${imgPath}${imgName}") no-repeat top center / ${widthSGL} auto;
        background-size: contain;
      }\n`;
        }

        ret.push(cssText);
    });

    if (isSprite) {
        // 抽离类名
        ret.unshift(`${spriteCls.join("").substr(1)}${spriteBI}`);
    }

    return ret.join("");
};

/**
 * 获取PC端雪碧图
 * @param {Object} data 雪碧图详细参数列表
 * @param {Boolean} isSprite false:生成单独图片；true:生成雪碧图
 * @param {String} imgPath 雪碧图相对路径
 */
const getImg2CssPC = (data = {}, isSprite = false, imgPath = "../img/") => {
    let ret = [],
        spriteCls = [],
        spriteBI = "",
        isSpriteBI = false,
        cssText = "";

    data.sprites.forEach((sprite) => {
        const spriteName = sprite.name,
            widthSGL = getPixel({ width: sprite.px.width, terminal: CONFIG_TERMINAL.pc, symbol: CONFIG_SYMBOL.pc }),
            heightSGL = getPixel({ width: sprite.px.height, terminal: CONFIG_TERMINAL.pc, symbol: CONFIG_SYMBOL.pc }),
            widthTotal = getPixel({
                width: sprite.px.total_width,
                terminal: CONFIG_TERMINAL.pc,
                symbol: CONFIG_SYMBOL.pc,
            });

        // 雪碧图
        if (isSprite) {
            // 抽离类名
            spriteCls.push(`,.${spriteName}`);
            if (!isSpriteBI) {
                isSpriteBI = true;
                spriteBI = `{display:inline-block;background: url("${imgPath}${sprite.escaped_image}") no-repeat top center / ${widthTotal} auto;}\n`;
            }

            cssText = `.${spriteName}{
        width:${widthSGL};
        height:${heightSGL};
        background-position:${sprite.px.offset_x} ${sprite.px.offset_y};
      }\n`;
        }
        // 单独图片
        else {
            let source = sprite.source_image,
                imgName = source.substr(source.indexOf(spriteName));
            cssText = `.${spriteName}{
        display:inline-block;
        width:${widthSGL};
        height:${heightSGL};
        background: url("${imgPath}${imgName}") no-repeat top center / ${widthSGL} auto;
        background-size: contain;
      }\n`;
        }

        ret.push(cssText);
    });

    if (isSprite) {
        // 抽离类名
        ret.unshift(`${spriteCls.join("").substr(1)}${spriteBI}`);
    }

    return ret.join("");
};

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
var isUnixHiddenPath = function (path) {
    return /(^|\/)\.[^\/\.]/g.test(path);
};

var through = through2.obj;
/**
 * 获取目录下所有图片的路径
 * @param {string} currentDirPath 图片root path
 * @param {string} extMatch 匹配图片
 */
const getFileName = function ({ currentDirPath, outputPath, extMatch, ignorePath = "" }) {
    let allPath = [];
    async function walkFiles(currentDirPath, extMatch) {
        files = fs.readdirSync(currentDirPath);
        files.forEach(function (file) {
            let filePath = path.join(currentDirPath, file),
                stat = fs.statSync(filePath),
                ext = path.extname(file).substr(1),
                ignore = (ignorePath && ignorePath.substring(1, ignorePath.length - 1).split(",")) || [],
                isIgnore = false;
            filePath = path.normalize(filePath).replace(/(\\)/g, "/");
            ignore.forEach((i) => {
                if (~filePath.indexOf(i)) {
                    isIgnore = true;
                }
            });
            if (stat.isFile() && ~extMatch.includes(ext) && !isUnixHiddenPath(file) && !isIgnore) {
                allPath.push(filePath);
            } else if (stat.isDirectory() && !isIgnore) {
                walkFiles(filePath, extMatch);
            }
        });
    }
    walkFiles(currentDirPath, extMatch);
    const len = currentDirPath.length;
    allPath = allPath.map((path) => {
        var url = path,
            index = url.indexOf(currentDirPath);
        index = index > -1 ? index + len : 0;
        url = url.substring(index);
        return url;
    });

    var retStream = through2.obj(null, function onEnd(originalFile, unused, cb) {
        cb();
    });
    var jsFile = new Vinyl({
        path: outputPath,
        contents: Buffer.from(JSON.stringify(allPath)),
    });
    retStream.push(jsFile);

    return retStream;

    // test
    // // return allPath;
    // var retStream = through2.obj(onData, onEnd);
    // retStream.js = fileStream;
    // const Stream = require("stream");
    // var s = new Stream.Transform({ objectMode: true });
    // s._transform = function (originalFile, unused, callback) {
    //     var file = originalFile.clone({ contents: false });
    //     console.info(file);
    //     console.info(originalFile.isBuffer());
    //     console.info(originalFile.isStream(), file.path);
    //     file.path = file.path.replace(/js$/, "json");
    //     callback(null, file);
    // };
};

module.exports = {
    IMG_TYPE,
    CONFIG_TERMINAL,
    CONFIG_SYMBOL,
    px2rem,
    getPixel,
    getImg2CssWap,
    getImg2CssPC,
    getFileName,
};
