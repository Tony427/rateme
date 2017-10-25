var _ = require('underscore');

var arrayAverage = (arr) => {
    return _.reduce(arr, (num1, num2) => {
        return num1 + num2;
    }, 0) / (arr.length === 0 ? 1 : arr.length);
}

module.exports = {arrayAverage};