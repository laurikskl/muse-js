var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BehaviorSubject, merge, Subject, EMPTY } from 'rxjs';
import { filter, map, share, take, catchError } from 'rxjs/operators/index.js';
import { decodeEEGSamples, decodePPGSamples, parseAccelerometer, parseControl, parseGyroscope, parseTelemetry, } from './lib/muse-parse';
import { decodeResponse, encodeCommand, observableCharacteristic } from './lib/muse-utils';
export { zipSamples } from './lib/zip-samples';
export { zipSamplesPpg } from './lib/zip-samplesPpg';
export var MUSE_SERVICE = 0xfe8d;
var CONTROL_CHARACTERISTIC = '273e0001-4c4d-454d-96be-f03bac821358';
var TELEMETRY_CHARACTERISTIC = '273e000b-4c4d-454d-96be-f03bac821358';
var GYROSCOPE_CHARACTERISTIC = '273e0009-4c4d-454d-96be-f03bac821358';
var ACCELEROMETER_CHARACTERISTIC = '273e000a-4c4d-454d-96be-f03bac821358';
var PPG_CHARACTERISTICS = [
    '273e000f-4c4d-454d-96be-f03bac821358',
    '273e0010-4c4d-454d-96be-f03bac821358',
    '273e0011-4c4d-454d-96be-f03bac821358',
];
export var PPG_FREQUENCY = 64;
export var PPG_SAMPLES_PER_READING = 6;
var EEG_CHARACTERISTICS = [
    '273e0003-4c4d-454d-96be-f03bac821358',
    '273e0004-4c4d-454d-96be-f03bac821358',
    '273e0005-4c4d-454d-96be-f03bac821358',
    '273e0006-4c4d-454d-96be-f03bac821358',
    '273e0007-4c4d-454d-96be-f03bac821358',
];
export var EEG_FREQUENCY = 256;
export var EEG_SAMPLES_PER_READING = 12;
// These names match the characteristics defined in PPG_CHARACTERISTICS above
export var ppgChannelNames = ['ambient', 'infrared', 'red'];
// These names match the characteristics defined in EEG_CHARACTERISTICS above
export var channelNames = ['TP9', 'AF7', 'AF8', 'TP10', 'AUX'];
var MuseClient = /** @class */ (function () {
    function MuseClient() {
        this.enableAux = false;
        this.enablePpg = false;
        this.deviceName = '';
        this.connectionStatus = new BehaviorSubject(false);
        this.gatt = null;
        this.device = null;
        this.lastIndex = null;
        this.lastTimestamp = null;
    }
    MuseClient.prototype.connect = function (gatt) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!gatt) return [3 /*break*/, 1];
                        this.gatt = gatt;
                        return [3 /*break*/, 4];
                    case 1:
                        _a = this;
                        return [4 /*yield*/, navigator.bluetooth.requestDevice({
                                filters: [{ services: [MUSE_SERVICE] }],
                            })];
                    case 2:
                        _a.device = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.device.gatt.connect()];
                    case 3:
                        _b.gatt = _c.sent();
                        _c.label = 4;
                    case 4:
                        this.deviceName = this.gatt.device.name || null;
                        return [4 /*yield*/, this.initializeServicesAndCharacteristics()];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.onDisconnected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.connectionStatus.next(false);
                        _a = this;
                        return [4 /*yield*/, this.device.gatt.connect()];
                    case 1:
                        _a.gatt = _b.sent();
                        return [4 /*yield*/, this.initializeServicesAndCharacteristics()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.initializeServicesAndCharacteristics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var service, _a, _b, telemetryCharacteristic, _c, gyroscopeCharacteristic, _d, accelerometerCharacteristic, _e, ppgObservables, ppgChannelCount, _loop_1, this_1, ppgChannelIndex, eegObservables, channelCount, _loop_2, this_2, channelIndex;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!this.gatt) {
                            throw new Error('GATT server is not connected');
                        }
                        this.gatt.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
                        return [4 /*yield*/, this.gatt.getPrimaryService(MUSE_SERVICE)];
                    case 1:
                        service = _f.sent();
                        // Control
                        _a = this;
                        return [4 /*yield*/, service.getCharacteristic(CONTROL_CHARACTERISTIC)];
                    case 2:
                        // Control
                        _a.controlChar = _f.sent();
                        _b = this;
                        return [4 /*yield*/, observableCharacteristic(this.controlChar)];
                    case 3:
                        _b.rawControlData = (_f.sent()).pipe(map(function (data) { return decodeResponse(new Uint8Array(data.buffer)); }), share());
                        this.controlResponses = parseControl(this.rawControlData);
                        return [4 /*yield*/, service.getCharacteristic(TELEMETRY_CHARACTERISTIC)];
                    case 4:
                        telemetryCharacteristic = _f.sent();
                        _c = this;
                        return [4 /*yield*/, observableCharacteristic(telemetryCharacteristic)];
                    case 5:
                        _c.telemetryData = (_f.sent()).pipe(map(parseTelemetry));
                        return [4 /*yield*/, service.getCharacteristic(GYROSCOPE_CHARACTERISTIC)];
                    case 6:
                        gyroscopeCharacteristic = _f.sent();
                        _d = this;
                        return [4 /*yield*/, observableCharacteristic(gyroscopeCharacteristic)];
                    case 7:
                        _d.gyroscopeData = (_f.sent()).pipe(map(parseGyroscope));
                        return [4 /*yield*/, service.getCharacteristic(ACCELEROMETER_CHARACTERISTIC)];
                    case 8:
                        accelerometerCharacteristic = _f.sent();
                        _e = this;
                        return [4 /*yield*/, observableCharacteristic(accelerometerCharacteristic)];
                    case 9:
                        _e.accelerometerData = (_f.sent()).pipe(map(parseAccelerometer));
                        this.eventMarkers = new Subject();
                        if (!this.enablePpg) return [3 /*break*/, 14];
                        this.ppgCharacteristics = [];
                        ppgObservables = [];
                        ppgChannelCount = PPG_CHARACTERISTICS.length;
                        _loop_1 = function (ppgChannelIndex) {
                            var characteristicId, ppgChar, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        characteristicId = PPG_CHARACTERISTICS[ppgChannelIndex];
                                        return [4 /*yield*/, service.getCharacteristic(characteristicId)];
                                    case 1:
                                        ppgChar = _c.sent();
                                        _b = (_a = ppgObservables).push;
                                        return [4 /*yield*/, observableCharacteristic(ppgChar)];
                                    case 2:
                                        _b.apply(_a, [(_c.sent()).pipe(map(function (data) {
                                                var eventIndex = data.getUint16(0);
                                                return {
                                                    index: eventIndex,
                                                    ppgChannel: ppgChannelIndex,
                                                    samples: decodePPGSamples(new Uint8Array(data.buffer).subarray(2)),
                                                    timestamp: _this.getTimestamp(eventIndex, PPG_SAMPLES_PER_READING, PPG_FREQUENCY),
                                                };
                                            }))]);
                                        this_1.ppgCharacteristics.push(ppgChar);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        ppgChannelIndex = 0;
                        _f.label = 10;
                    case 10:
                        if (!(ppgChannelIndex < ppgChannelCount)) return [3 /*break*/, 13];
                        return [5 /*yield**/, _loop_1(ppgChannelIndex)];
                    case 11:
                        _f.sent();
                        _f.label = 12;
                    case 12:
                        ppgChannelIndex++;
                        return [3 /*break*/, 10];
                    case 13:
                        this.ppgReadings = merge.apply(void 0, ppgObservables);
                        _f.label = 14;
                    case 14:
                        // EEG
                        this.eegCharacteristics = [];
                        eegObservables = [];
                        channelCount = this.enableAux ? EEG_CHARACTERISTICS.length : 4;
                        _loop_2 = function (channelIndex) {
                            var characteristicId, eegChar, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        characteristicId = EEG_CHARACTERISTICS[channelIndex];
                                        return [4 /*yield*/, service.getCharacteristic(characteristicId)];
                                    case 1:
                                        eegChar = _c.sent();
                                        _b = (_a = eegObservables).push;
                                        return [4 /*yield*/, observableCharacteristic(eegChar)];
                                    case 2:
                                        _b.apply(_a, [(_c.sent()).pipe(map(function (data) {
                                                var eventIndex = data.getUint16(0);
                                                return {
                                                    electrode: channelIndex,
                                                    index: eventIndex,
                                                    samples: decodeEEGSamples(new Uint8Array(data.buffer).subarray(2)),
                                                    timestamp: _this.getTimestamp(eventIndex, EEG_SAMPLES_PER_READING, EEG_FREQUENCY),
                                                };
                                            }), catchError(function (error) {
                                                return EMPTY;
                                            }))]);
                                        this_2.eegCharacteristics.push(eegChar);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        channelIndex = 0;
                        _f.label = 15;
                    case 15:
                        if (!(channelIndex < channelCount)) return [3 /*break*/, 18];
                        return [5 /*yield**/, _loop_2(channelIndex)];
                    case 16:
                        _f.sent();
                        _f.label = 17;
                    case 17:
                        channelIndex++;
                        return [3 /*break*/, 15];
                    case 18:
                        this.eegReadings = merge.apply(void 0, eegObservables).pipe(catchError(function (error) {
                            return EMPTY;
                        }), share());
                        this.connectionStatus.next(true);
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.sendCommand = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controlChar.writeValue(encodeCommand(cmd))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var preset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pause()];
                    case 1:
                        _a.sent();
                        preset = 'p21';
                        if (this.enablePpg) {
                            preset = 'p50';
                        }
                        else if (this.enableAux) {
                            preset = 'p20';
                        }
                        return [4 /*yield*/, this.controlChar.writeValue(encodeCommand(preset))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.controlChar.writeValue(encodeCommand('s'))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.resume()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.pause = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand('h')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.resume = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendCommand('d')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.deviceInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resultListener;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultListener = this.controlResponses
                            .pipe(filter(function (r) { return !!r.fw; }), take(1))
                            .toPromise();
                        return [4 /*yield*/, this.sendCommand('v1')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, resultListener];
                }
            });
        });
    };
    MuseClient.prototype.injectMarker = function (value, timestamp) {
        if (timestamp === void 0) { timestamp = new Date().getTime(); }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventMarkers.next({ value: value, timestamp: timestamp })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MuseClient.prototype.disconnect = function () {
        if (this.gatt) {
            this.lastIndex = null;
            this.lastTimestamp = null;
            this.gatt.disconnect();
            this.connectionStatus.next(false);
        }
    };
    MuseClient.prototype.getTimestamp = function (eventIndex, samplesPerReading, frequency) {
        var READING_DELTA = 1000 * (1.0 / frequency) * samplesPerReading;
        if (this.lastIndex === null || this.lastTimestamp === null) {
            this.lastIndex = eventIndex;
            this.lastTimestamp = new Date().getTime() - READING_DELTA;
        }
        // Handle wrap around
        while (this.lastIndex - eventIndex > 0x1000) {
            eventIndex += 0x10000;
        }
        if (eventIndex === this.lastIndex) {
            return this.lastTimestamp;
        }
        if (eventIndex > this.lastIndex) {
            this.lastTimestamp += READING_DELTA * (eventIndex - this.lastIndex);
            this.lastIndex = eventIndex;
            return this.lastTimestamp;
        }
        else {
            return this.lastTimestamp - READING_DELTA * (this.lastIndex - eventIndex);
        }
    };
    return MuseClient;
}());
export { MuseClient };
//# sourceMappingURL=muse.js.map