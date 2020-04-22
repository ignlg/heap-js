/**
 * Functions and ideas from jsPerf
 * https://github.com/bestiejs/benchmark.js/blob/master/benchmark.js
 */

module.exports = { formatNumber, toStringBench, sortBenchs };

/**
 * Converts a number to a more readable comma-separated string representation.
 *
 * @static
 * @memberOf Benchmark
 * @param {number} number The number to convert.
 * @returns {string} The more readable string representation.
 */
function formatNumber(number) {
  number = String(number).split('.');
  return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') + (number[1] ? '.' + number[1] : '');
}

/**
 * Displays relevant benchmark information when coerced to a string.
 *
 * @name toString
 * @memberOf Benchmark
 * @returns {string} A string representation of the benchmark instance.
 */
function toStringBench() {
  var bench = this,
    error = bench.error,
    hz = bench.hz,
    id = bench.id,
    stats = bench.stats,
    size = stats.sample.length,
    pm = '\xb1',
    result = bench.name || (_.isNaN(id) ? id : '<Test #' + id + '>');

  if (error) {
    var errorStr;
    if (!_.isObject(error)) {
      errorStr = String(error);
    } else if (!_.isError(Error)) {
      errorStr = join(error);
    } else {
      // Error#name and Error#message properties are non-enumerable.
      errorStr = join(_.assign({ name: error.name, message: error.message }, error));
    }
    result += ': ' + errorStr;
  } else {
    result +=
      ' x ' +
      formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) +
      ' ops/sec ' +
      pm +
      stats.rme.toFixed(2) +
      '% (' +
      size +
      ' run' +
      (size == 1 ? '' : 's') +
      ' sampled)';
  }
  return result;
}

function sortBenchs(a, b) {
  a = a.stats;
  b = b.stats;
  return a.mean + a.moe > b.mean + b.moe ? 1 : -1;
}
