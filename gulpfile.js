const gulp=require("gulp");
const sass=require("gulp-sass");//需要安装gulp-sass npm install gulp-sass -D
const path=require("path");


const _path = {
    src:path.join(__dirname,'src/**/*.scss'),
    dist:path.join(__dirname,'dist'),
    outputStyle:'expended'
}


gulp.task("styles",()=>{
    return gulp.src(_path.src)
    .pipe(sass({outputStyle:_path.outpathStyle}).on("error",sass.logError))
    .pipe(gulp.dest(_path.dist))
})

gulp.task("watch",()=>{
    return gulp.watch(_path.src,['styles'])
})

gulp.task("default",['styles','watch'])