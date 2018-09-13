var gulp = require("gulp");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var autoprefix = require("gulp-autoprefixer");
var sequence = require("gulp-sequence");

// Fontes
var scssFiles = ["./src/scss/*.scss"];
var scssBootstrap = ["./node_modules/bootstrap/scss/bootstrap.scss"];
var jsFiles = ["./src/js/*.js"];
var jsBootstrap = ["./node_modules/bootstrap/dist/js/bootstrap.js"];
var JQuery = ["./node_modules/jquery/dist/jquery.js"];
var jsPopper = ["./node_modules/popper.js/dist/umd/popper.js"];
var imgFiles = ["./src/images/*"];
var iconFiles = ["./src/*.ico"];

// Destino
var cssDest = "./wwwroot/css";
var jsDest = "./wwwroot/js";
var imgDest = "./wwwroot/images";
var rootDest = "./wwwroot";
var fontDest = "./wwwroot/fonts";

var sassProdOptions = {
    sourcemap: true,
    includePaths: ["./node_modules/bootstrap/scss"],
    outputStyle: "compressed"
};

var sassDevOptions = {
    sourcemap: true,
    includePaths: ["./node_modules/bootstrap/scss"],
    outputStyle: "expanded"
};

// Funções Genéricas
function sassCompiler(src, name, dest) {
    gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(autoprefix({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(concat(name))
        .pipe(sass(sassDevOptions).on("error", sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(dest));
};

function sassMinify(src, name, dest) {
    gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(autoprefix({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(concat(name))
        .pipe(sass(sassProdOptions).on("error", sass.logError))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(dest));
};

function jsCompiler(src, name, dest) {
    gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(concat(name))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(dest));
};

function jsMinify(src, name, dest) {
    gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(concat(name))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(dest));
}

function copyFile(src, dest) {
    gulp.src(src)
        .pipe(gulp.dest(dest));
}

// Tarefas
gulp.task("sassDev", function() {
    var scss = sassCompiler(scssFiles, "style.css", cssDest);
    var bootstrap = sassCompiler(scssBootstrap, "bootstrap.css", cssDest);

    return scss, bootstrap;
});

gulp.task("sassProd", function() {
    var scss = sassMinify(scssFiles, "style.css", cssDest);
    var bootstrap = sassMinify(scssBootstrap, "bootstrap.css", cssDest);

    return scss, bootstrap;
});

gulp.task("jsDev", function() {
    var js = jsCompiler(jsFiles, "script.js", jsDest);
    var bootstrap = jsCompiler(jsBootstrap, "bootstrap.js", jsDest);
    var jquery = jsCompiler(JQuery, "jquery.js", jsDest);
    var popper = jsCompiler(jsPopper, "popper.js", jsDest);

    return js, bootstrap, jquery, popper;
});

gulp.task("jsProd", function() {
    var js = jsMinify(jsFiles, "script.js", jsDest);
    var bootstrap = jsMinify(jsBootstrap, "bootstrap.js", jsDest);
    var jquery = jsMinify(JQuery, "jquery.js", jsDest);
    var popper = jsMinify(jsPopper, "popper.js", jsDest);

    return js, bootstrap, jquery, popper;
});

gulp.task("copy", function() {
    var img = copyFile(imgFiles, imgDest);
    var icon = copyFile(iconFiles, rootDest);

    return img, icon;
});

// Tarefa 'watch'
gulp.task('watch', function() {
    gulp.watch([scssFiles, scssBootstrap], ["sassDev", "sassProd"]);
    gulp.watch([jsFiles, jsBootstrap, JQuery, jsPopper], ["jsDev", "jsProd"]);
    gulp.watch([imgFiles, iconFiles], ["copy"]);
});

// Tarefa default
gulp.task('default', sequence(["sassDev", "jsDev", "copy"], ["sassProd", "jsProd"], "watch"));