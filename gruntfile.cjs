module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    ts: {
      robot: {
        tsconfig: {
          tsconfig: './tsconfig.json',
          passThrough: true,
        },
        options: {
          rootDir: './',
          outDir: './dist'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.registerTask('default', [ 'ts' ]);
};