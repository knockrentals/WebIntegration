module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        deployBuckets: {
            prod: 'prod-knock-integration',
            stage: 'stage-knock-integration'
        },
        config: {
            prod: {
                options: {
                    variables: {
                        'cssFileUrl': 'https://s3.amazonaws.com/<%= deployBuckets.prod %>/knock-integration-<%= pkg.version %>.min.css',
                        'companyHost': 'https://knockrentals.com',
                        'schedulingHost': 'https://knockrentals.github.io/Prod-WebSchedule/#'
                    }
                }
            },
            stage: {
                options: {
                    variables: {
                        'cssFileUrl': 'https://s3.amazonaws.com/<%= deployBuckets.stage %>/knock-integration-<%= pkg.version %>.min.css',
                        'companyHost': 'https://stage.knockrentals.com',
                        'schedulingHost': 'https://knockrentals.github.io/Stage-WebSchedule/#'
                    }
                }
            }
        },
        replace: {
            dist: {
                options: {
                    variables: {
                        'cssFileUrl': '<%= grunt.config.get("cssFileUrl") %>',
                        'companyHost': '<%= grunt.config.get("companyHost") %>',
                        'schedulingHost': '<%= grunt.config.get("schedulingHost") %>'
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
        },
        aws: grunt.file.readJSON('aws-keys.json'),
        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>',
                secretAccessKey: '<%= aws.AWSSecretKey %>'
            },
            stage: {
                options: {
                    bucket: '<%= deployBuckets.stage %>'
                },
                files: [
                    {expand: true, cwd: 'build', src: ['**'], dest: ''}
                ]
            },
            prod: {
                options: {
                    bucket: '<%= deployBuckets.prod %>'
                },
                files: [
                    {expand: true, cwd: 'build', src: ['**'], dest: ''}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-config');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-aws-s3');

    grunt.registerTask('build', ['config:prod', 'uglify', 'cssmin', 'replace']);
    grunt.registerTask('build:stage', ['config:stage', 'uglify', 'cssmin', 'replace']);

    grunt.registerTask('deploy:stage', ['build:stage', 'aws_s3:stage']);
    grunt.registerTask('deploy:prod', ['build', 'aws_s3:prod']);
};
