const path = require('path')
const SpritesmithPlugin = require('webpack-spritesmith')

module.exports = {
  context: path.join(__dirname, 'build'),
  entry: './entry.js',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.scss$/, use: [
          'style-loader',
          'css-loader',
          'scss-loader'
        ]
      },
      {
        test: /\.(gif|jpg|png|svg|jpeg)$/, use: [
          'file-loader?name=i/[hash].[ext]'
        ]
      }
    ]
  },
  resolve: {
    modules: ["node_modules", "spritesmith-generated"]
  },
  plugins: [
    new SpritesmithPlugin({
      logCreatedFiles: true,
      src: {
        cwd: path.resolve(__dirname, 'build/spriteorigin'),
        glob: '*'
      },
      target: {
        // image: path.resolve(__dirname, 'src/generated/sprite.[hash:6].png')
        image: path.resolve(__dirname, 'img/sprite.png'),
        css: [path.resolve(__dirname, 'build/css/sprite.css')]
      },
      // retina: '@2x', // 2倍图
      apiOptions: {
        cssImageRef: "../img/sprite.png",
        targetImage: '',
        generateSpriteName(fileName) {
          var parsed = path.parse(fileName);
          return parsed.name;
          // var dir = parsed.dir.split(path.sep);
          // var moduleName = dir[dir.length - 2];
          // console.log(fileName, moduleName)
          // return moduleName + '__' + parsed.name;
        }
      },
      spritesmithOptions: {
        padding: 20,
        exportOpts: { quality: 75 }
      },
      customTemplates: {
        'custom_format': data => {
          console.log(data)
          var spritesheetImageUrl = data.sprites[0].image;

          var sharedSelector = data.sprites
            .map(sprite => '.icon-' + sprite.name)
            .join(', ');

          var shared = dli(`
              ${sharedSelector} {
                  background: url(${spritesheetImageUrl})
              }
          `);

          var perImage = data.sprites
            .map(sprite => dli(`
                  .icon-${sprite.name} {
                      width: ${sprite.width}px;
                      height: ${sprite.height}px;
                      background-position: ${sprite.offset_x}px ${sprite.offset_y}px;
                  }
              `))
            .join('');

          return shared + '\n' + perImage;
        },
        'custom_handlebars': path.resolve(__dirname, 'build/css_template.handlebars')
      }
    })
  ]
}
