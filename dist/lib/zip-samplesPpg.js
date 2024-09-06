import { from } from 'rxjs';
import { concat, mergeMap } from 'rxjs/operators';
import { PPG_FREQUENCY } from './../muse';
export function zipSamplesPpg(ppgReadings) {
    var buffer = [];
    var lastTimestamp = null;
    return ppgReadings.pipe(mergeMap(function (reading) {
        if (reading.timestamp !== lastTimestamp) {
            lastTimestamp = reading.timestamp;
            if (buffer.length) {
                var result = from([buffer.slice()]);
                buffer.splice(0, buffer.length, reading);
                return result;
            }
        }
        buffer.push(reading);
        return from([]);
    }), concat(from([buffer])), mergeMap(function (readings) {
        var result = readings[0].samples.map(function (x, index) {
            var data = [NaN, NaN, NaN];
            for (var _i = 0, readings_1 = readings; _i < readings_1.length; _i++) {
                var reading = readings_1[_i];
                data[reading.ppgChannel] = reading.samples[index];
            }
            return {
                data: data,
                index: readings[0].index,
                timestamp: readings[0].timestamp + (index * 1000) / PPG_FREQUENCY,
            };
        });
        return from(result);
    }));
}
//# sourceMappingURL=zip-samplesPpg.js.map