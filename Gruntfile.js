module.exports = function(grunt) {

  //load tasks
  grunt.loadTasks("./tasks");

  grunt.registerTask("content", "Load content from data files", ["state", "json", "csv", "markdown", "archieml"]);
  grunt.registerTask("template", "Build HTML from content/templates", ["content", "matchups", "build"]);
  grunt.registerTask("static", "Build all files", ["copy", "bundle", "less", "template"]);
  grunt.registerTask("default", ["clean", "static", "connect:dev", "watch"]);
  grunt.registerTask("quick", "Build without assets", ["clean", "bundle", "less", "template"]);

  //project-specific meta-tasks
  grunt.registerTask("close", "Generate spreadsheet for next round", ["content", "matchups", "advance"]);
};
