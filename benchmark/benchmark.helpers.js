const { Suite } = require('benchmark');
const { toStringBench, sortBenchs } = require('./benchmark.jsperf');
const colors = require('./console.colors');

function runBenchmark(name, defs) {
  const suite = new Suite();
  const benchs = [];
  suite
    .on('add', function (event) {
      benchs.push(event.target);
    })
    .on('complete', function () {
      console.log(`${colors.Bright}%s${colors.Reset}`, name);
      benchs.sort(sortBenchs);
      benchs.forEach((bench, i, benchs) => {
        let color = '';
        if (i === 0) {
          color = colors.Bright + colors.FgGreen;
        } else if (i === benchs.length - 1) {
          color = colors.FgRed;
        }
        console.log(`\t${color}%s${colors.Reset}`, toStringBench.call(bench));
      });
    })
    .on('start', function () {});
  for (const def of defs) {
    suite.add(def.name, def.func);
  }
  suite.run({ async: false });
}

module.exports = { runBenchmark };
