const { series, parallel, src, dest, task } = require("gulp");
const spritesmith = require("gulp.spritesmith");
const { CONFIG_TERMINAL, getImg2CssWap, getImg2CssPC, getFileName } = require("./util");

// gulp雪碧图插件：根据图片导出图路径
const cssPath = `../img/`; // 生成css图片的路径
const CONFIG = {
    terminal: CONFIG_TERMINAL.wap, // pc or wap
    // 保存合并后对于css样式的地址
    get cssSpName() {
        return `${this.terminal}_css_sp.${this.cssExt}`;
    },
    get cssSingleName() {
        return `${this.terminal}_css_single.${this.cssExt}`;
    },
    // 保存合并后图片的地址
    get imgSpName() {
        return `${this.terminal}_ico_sp.png`;
    },
    get imgSingleName() {
        return `${this.terminal}_ico_single.png`;
    },
    get pathImgSp() {
        return `${this.imgRootPath}sp/`;
    },
    get pathImgSingle() {
        return `${this.imgRootPath}/`;
    },
    cssOutputName: "sprite.css", // css 总表
    imgOutputName: "sprite.js",
    jsImgName: "js.png",
    spriteImgGutter: 60, // 合并时两个图片的间距
    outputPath: "js",
    imgMatchExt: "{jpg,jpeg,png}" /* 匹配图片格式 */,
    imgMatchIgnore: "{sp/}",
    imgRootPath: "img/",
    cssExt: "css" /* css输出格式 */,
};

function genSpriteImg2Css() {
    var isSprite = true,
        path = `${cssPath}`;
    return src(`${CONFIG.pathImgSp}*.${CONFIG.imgMatchExt}`)
        .pipe(
            spritesmith({
                cssName: CONFIG.cssSpName,
                imgName: CONFIG.imgSpName,
                padding: CONFIG.spriteImgGutter,
                algorithm: "binary-tree", // 注释1
                cssTemplate: function (data) {
                    // 移动端
                    if (CONFIG.terminal == CONFIG_TERMINAL.wap) {
                        return getImg2CssWap(data, path, isSprite);
                    }
                    // PC端
                    else if (CONFIG.terminal == CONFIG_TERMINAL.pc) {
                        return getImg2CssPC(data, path, isSprite);
                    }
                },
            })
        )
        .pipe(dest(CONFIG.outputPath));
}

function genSingleImg2Css() {
    var isSprite = false,
        path = `${cssPath}`;
    return src(`${CONFIG.pathImgSingle}*.${CONFIG.imgMatchExt}`)
        .pipe(
            spritesmith({
                cssName: CONFIG.cssSingleName,
                imgName: CONFIG.imgSingleName,
                padding: CONFIG.spriteImgGutter,
                algorithm: "binary-tree", // 注释1
                cssTemplate: function (data) {
                    // 移动端
                    if (CONFIG.terminal == CONFIG_TERMINAL.wap) {
                        return getImg2CssWap(data, path, isSprite);
                    }
                    // PC端
                    else if (CONFIG.terminal == CONFIG_TERMINAL.pc) {
                        return getImg2CssPC(data, path, isSprite);
                    }
                },
            })
        )
        .pipe(dest(CONFIG.outputPath));
}

function spritejs() {
    return src(`${CONFIG.imgRootPath}*.${CONFIG.imgMatchExt}`)
        .pipe(
            getFileName({
                currentDirPath: CONFIG.imgRootPath,
                extMatch: CONFIG.imgMatchExt,
                outputPath: CONFIG.imgOutputName,
                ignorePath: CONFIG.imgMatchIgnore,
            })
        )
        .pipe(dest(CONFIG.outputPath));
}

// exports.genSpriteImg2Css = genSpriteImg2Css;
// exports.genSingleImg2Css = genSingleImg2Css;
// exports.spritejs = spritejs;
exports.default = series(genSpriteImg2Css, genSingleImg2Css, spritejs);
