# WaterMark.js

A lightweight WaterMarks for html background

# Usage

## install

```bash

npm i js-watermarks

```

## Example

默认调用

```js
new WaterMark()
```

或可传参

```js
new WaterMark(document.body, {
  msg: "内部文档，请勿外传", // 水印内容
  wmCls: ".jy_wm", // 水印主件类名
  width: "100", // canvas元素宽
  height: "100", // canvas元素高
  textAlign: "left", // 文字对齐
  textBaseline: "bottom", // 基准线
  font: "16px Microsoft Yahei", // 字体大小及样式
  fillStyle: "#000", // 自定义水印的颜色
  globalAlpha: 0.1, // 设置图形和图像透明度的值
  rotate: 16, // 文字旋转角度
  zIndex: 1000, // 元素堆叠顺序
  x: 50, // 文字位置x
  y: 50 // 文字位置y
})
```
