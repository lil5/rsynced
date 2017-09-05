/**
 * execute rsync in Promise
 * @see https://github.com/mattijs/node-rsync#executecallback-stdouthandler-stderrhandler
 * @param {Object}    rsync config
 * @return {Promise}        then return code or cmd
 */
const exec = (rsync) => {
  return new Promise((resolve, reject) => {
    var child;

    function onQuit() {
      if (child) {
        child.kill();
      }

      reject(new Error('Unexpectedly exited'));
      unbind();
    };

    function onStop() {
      resolve(false);
      unbind();
    }

    function bind() {
      process.on('SIGINT', onStop);
      process.on('SIGTERM', onStop);
      process.on('exit', onQuit);
    }

    function unbind() {
      process.removeListener('SIGINT', onStop);
      process.removeListener('SIGTERM', onStop);
      process.removeListener('exit', onQuit);
    }

    var rtn = {};

    child = rsync.execute((error, code, cmd) => {
      if (error) {
        reject(error);
      } else {
        if (code) {
          rtn.code = code;
          resolve(rtn);
        } else if (cmd) {
          rtn.cmd = cmd;
          resolve(rtn);
        } else {
          reject(new Error('no error, code or cmd given'));
        }
      }

      unbind();
    }, (buffer) => {
      let cmdbuffer = buffer.toString();
      console.log(cmdbuffer);
      rtn.stdout = cmdbuffer;
    }, (buffer) => {
      let errbuffer = buffer.toString();
      console.log(errbuffer);
      rtn.stderr = errbuffer;
    });

    bind();
  });
};

module.exports = exec;
