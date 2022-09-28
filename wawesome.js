const { exec } = require('child_process');
const fs = require('fs');
let wasmdir, outputdir, inputfile, outputfile, exportedfuncs;

const setupConstants = () => {
    let wawesomeconsts = readJSON();
    wasmdir = wawesomeconsts?.directories?.wasmdir || './src';
    outputdir = wawesomeconsts?.directories?.outputdir || './build';
    inputfile = wawesomeconsts?.inputfile || 'hello.cpp';
    outputfile = wawesomeconsts?.outputfile || 'hello.js';
    exportedfuncs = wawesomeconsts?.exports?.funcs || [];
    exportedruntimefuncs = wawesomeconsts?.exports?.runtimefuncs || [];
    // console.log(outputdir, wasmdir, inputfile, outputfile, exportedfuncs, exportedruntimefuncs);
}

const readJSON = () => {
    if (!fs.existsSync('wawesome.json')){
        return
    }
    let rawdata = fs.readFileSync('wawesome.json');
    let jsonfile = JSON.parse(rawdata);
    return jsonfile;
}

const executeCommand = (command) => {
    console.log("exec", command);
    exec(command);
}

const setup = () => {
    executeCommand("npm install chokidar");
}

const start = () => {
    compileWasm()
    startServer()
    const chokidar = require('chokidar');

    // One-liner for current directory
    chokidar.watch(wasmdir).on('all', (event, path) => {
        // console.log(event, path);
        if(event=='change')
        {
            console.log("WASM source files modified, recompiling...")
            compileWasm()
        }
    });
}

const startServer = ()=> {
    executeCommand("python -m http.server 8080")
}

const compileWasm = () => {
    let command = "";
    command += 'emcc ';
    command += wasmdir + '/' + inputfile;
    command += ' -o ';
    command += outputdir + '/' + outputfile;
    command += ' -s WASM=1 -s ALLOW_MEMORY_GROWTH=1'

    command += ' -s EXPORTED_FUNCTIONS="['
    exportedfuncs.map( (func, index) => {
        command += '\'' + '_' + func + '\''
        if(index < exportedfuncs.length-1)
        {
            command += ', '
        }
    })
    command += ']"'

    command += ' -s EXTRA_EXPORTED_RUNTIME_METHODS="['
    exportedruntimefuncs.map( (func, index) => {
        command += '\'' + func + '\''
        if(index < exportedruntimefuncs.length-1)
        {
            command += ', '
        }
    })
    command += ']"'

    if (!fs.existsSync(outputdir)){
        fs.mkdirSync(outputdir);
    }

    executeCommand(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`${err}`);
            return;
          }
        
        console.log(`${stdout}`);
    })
    // exec('emcc particles.cpp -o particles.js -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS=\'["_initialize_particle_system", "_update_particle_system", "_malloc", "_main"]\' -s EXTRA_EXPORTED_RUNTIME_METHODS=\'["cwrap", "getValue", "setValue"]\'')
}

const main = () => {
    setupConstants();
    if(!process.argv[2])
    {
        console.log("usage : node ./wawesome.js [help|setup|start]");
    }
    if(process.argv[2] == "setup")
    {
        setup();
    }
    if(process.argv[2] == "start")
    {
        start();
    }
}

main()