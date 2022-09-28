# wawesome :zap:
Episode 2 of a number of experiments I have been doing to figure out the ease of coding and benefits of using an emscripten to compile C++ to Wasm.

---

### This script implements :

:zap: Setting target directories, exports and input files through a JSON file

:zap: Recompilation on modification

:clock3: Will add more features as I stumble upon more usecases

---

### How to use :

- Use `node .\wawesome.js setup` to setup required node modules for recompilation (and anything else that I might add in the future).
- Use `node .\wawesome.js start` to compile the code to wasm and start a http server 
(this is for current experimentation, will eventually start the server for whatever frontend framework we're using; could also make this a configurable command)
The script shall now look for code changes and recompile if it detects any.
