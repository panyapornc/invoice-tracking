const { defineConfig } = require('@vue/cli-service')

var Folder = "/SiteAssets/App";
var publicPath = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_HOST + process.env.VUE_APP_SITE + Folder : "/";

var outputDir = "dist";
(process.env.VUE_APP_BUILD_PATH === 'dev' ? outputDir = 'dist/dev/app' : 0);
(process.env.VUE_APP_BUILD_PATH === 'ppe' ? outputDir = 'dist/ppe/app' : 0);
(process.env.VUE_APP_BUILD_PATH === 'prod' ? outputDir = 'dist/prod/app' : 0)

module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: publicPath,
	outputDir: outputDir,
	indexPath: 'MainPage.aspx',
})


