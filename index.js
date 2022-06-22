const PSD = require('psd');
const psdPath = `D:/Program Files/qq/Tecent FileRecv/bad.psd`;
const psd = PSD.fromFile(psdPath);
psd.parse();

console.log(psd.tree().export());
console.log(psd.tree().childrenAtPath('A/B/C')[0].export());

// You can also use promises syntax for opening and parsing
PSD.open(psdPath)

  .then(function (psd) {
    psd.image.export();
    return psd.image.saveAsPng('./output.png');
  })
  .then(function () {
    console.log('Finished!');
  });
