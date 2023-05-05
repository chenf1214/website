module.exports = {
    sourceMap: false,
    plugins: [
        [
            'postcss-preset-env',
            {
                // 其他选项
            },
        ],
        require('postcss-pxtorem')({
            rootValue: 16,
            propList: ['*'],
            exclude: /node_modules/i,
        }),
    ],
};
// require('postcss-modules')({
//     // scopeBehaviour: 'global', // can be 'global' or 'local',
//     generateScopedName: function (name, filename, css) {
//         // var path = require('path');
//         // var i = css.indexOf('.' + name);
//         // var line = css.substr(0, i).split(/[\r\n]/).length;
//         // var file = path.basename(filename, '.css');
//         return 'ee-contacts-picker-' + name;
//     },
//     // getJSON: function (cssFileName, json, outputFileName) {
//     //     console.log('cssFileName ===>', cssFileName, outputFileName);
//     //     return;
//     // },
//     resolve: function (file, importer) {
//         console.log('importer ===>', file, importer);
//         return path.resolve(path.dirname(importer), file.replace(/^@/, process.cwd()));
//     },
// }),
