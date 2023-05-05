module.exports = (grunt) => {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2,
                    // modifyVars: {
                    //     imgPath: '"http://mycdn.com/path/to/images"',
                    //     bgColor: 'red',
                    //     'base-color': '#fff'
                    // }
                },
                files: [
                    {
                        // target.css file: source.less file
                        dest: 'dist/style.css',
                        src: 'src/assets/less/app.less',
                    },
                    // {
                    //     expand: true,     // Enable dynamic expansion.
                    //     cwd: 'src/components/',      // Src matches are relative to this path.
                    //     src: ['**/*.less'], // Actual pattern(s) to match.
                    //     dest: 'build/esm',   // Destination path prefix.
                    //     ext: '.css',   // Dest filepaths will have this extension.
                    //     extDot: 'first'   // Extensions in filenames begin after the first dot
                    // },
                ],
            },
        },
        watch: {
            styles: {
                // Which files to watch (all .less files recursively in the less directory)
                files: ['src/**/*.less'],
                tasks: ['less'],
                options: {
                    livereload: {
                        host: 'localhost',
                        port: 10000,
                    },
                    spawn: false,
                    event: ['added', 'deleted', 'changed'],
                    atBegin: true, // This option will trigger the run of each specified task at startup of the watcher.
                },
            },
        },
        copy: {
            imgs: {
                expand: true,
                cwd: 'src/assets',
                src: ['imgs/**', 'icons/**'],
                dest: 'dist/assets',
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['less', 'copy']);
};
