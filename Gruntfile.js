module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: {
            prod: {
                options: {
                    variables: {
                        'cssFileUrl': 'https://s3.amazonaws.com/knock-integration/prod/<%= pkg.version %>/knock-integration-<%= pkg.version %>.min.css',
                        'knockHost': 'http://knockrentals.com'
                    }
                }
            },
            stage: {
                options: {
                    variables: {
                        'cssFileUrl': 'https://s3.amazonaws.com/knock-integration/stage/<%= pkg.version %>/knock-integration-<%= pkg.version %>.min.css',
                        'knockHost': 'http://stage.knockrentals.com'
                    }
                }
            },
            dev: {
                options: {
                    variables: {
                        'cssFileUrl': './build/knock-integration-<%= pkg.version %>.min.css',
                        'knockHost': 'http://localhost:9000'
                    }
                }
            }
        },
        replace: {
            dist: {
                options: {
                    variables: {
                        'cssFileUrl': '<%= grunt.config.get("cssFileUrl") %>',
                        'knockHost': '<%= grunt.config.get("knockHost") %>'
                    },
                    force: true
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['build/knock-integration-<%= pkg.version %>.min.js'],
                        dest: 'build/'
                    }
                ]
            }
        },
        uglify: {
            build: {
                src: 'src/knock-integration.js',
                dest: 'build/knock-integration-<%= pkg.version %>.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build',
                    ext: '-<%= pkg.version %>.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-config');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build', ['config:prod', 'uglify', 'cssmin', 'replace']);
    grunt.registerTask('build:stage', ['config:stage', 'uglify', 'cssmin', 'replace']);
    grunt.registerTask('build:dev', ['config:dev', 'uglify', 'cssmin', 'replace']);
};
