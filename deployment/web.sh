#!/bin/bash
git checkout develop
git pull
npm run build:test
scp -r ./dist/static dev:/usr/share/nginx/html/projectname/
scp ./dist/favicon.ico dev:/usr/share/nginx/html/projectname/
scp ./dist/element-icons.ttf dev:/usr/share/nginx/html/projectname/
scp ./dist/element-icons.woff dev:/usr/share/nginx/html/projectname/
scp ./dist/index.html dev:/usr/share/nginx/html/projectname/

# 下面是例子解决署脚本执行过程中，避免出现已经替换了index.html，正在部署静态资源，
# 此时用户正好进入网站，新的index.html却访问不到新的静态资源，网页白屏报错的问题。
# 因此解决方法是先上静态资源，再上页面
# scp -i ~/.ssh/id_rsa -r ./dist/static username@162.81.49.85:/usr/share/nginx/html/projectname/
# scp -i ~/.ssh/id_rsa ./dist/favicon.ico username@162.81.49.85:/usr/share/nginx/html/projectname/favicon.ico
# scp -i ~/.ssh/id_rsa ./dist/element-icons.ttf username@162.81.49.85:/usr/share/nginx/html/projectname/element-icons.ttf
# scp -i ~/.ssh/id_rsa ./dist/element-icons.woff username@162.81.49.85:/usr/share/nginx/html/projectname/element-icons.woff
# scp -i ~/.ssh/id_rsa ./dist/index.html username@162.81.49.85:/usr/share/nginx/html/projectname/index.html

