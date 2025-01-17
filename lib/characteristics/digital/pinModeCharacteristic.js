var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

function PinModeCharacteristic(arduinoManager, digitalPins) {
    this.arduinoManager = arduinoManager;
    this.modePins = digitalPins;

    PinModeCharacteristic.super_.call(this, {
        uuid: 'D7720100-79C6-452F-994C-9829DA1A4229',
        properties: ['write'],
        descriptors: [
            new Descriptor({
                uuid: '2901',
                value: 'Digital Pin Mode'
            }),
            new Descriptor({
                uuid: '2904',
                value: new Buffer([0xc, 0x1]) // pin 13 Output
            })
        ]
    });
}

util.inherits(PinModeCharacteristic, Characteristic);

PinModeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        console.log('data ' , data);
        var pin = data.readUInt8(0) >> 2;
        var mode = data.readUInt8(0) & 0x1;
        console.log('pin ' , pin);
        console.log('mode ' , mode);
        this.modePins[pin] = mode;
        this.arduinoManager.setPinMode(pin, mode);
        callback(this.RESULT_SUCCESS);
    }
};

module.exports = PinModeCharacteristic;
