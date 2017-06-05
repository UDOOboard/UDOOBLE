var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function InputCharacteristic(arduinoManager, digitalPins) {
    this.arduinoManager = arduinoManager;
    this.idx = 0;
    this.digitalValue = [];
    this.modePins = digitalPins;

    InputCharacteristic.super_.call(this, {
        uuid: 'D7720300-79C6-452F-994C-9829DA1A4229',
        properties: ['read'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2901',
                value: 'Digital INPUT'
            }),
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0xc]) // pin 13
            })
        ]
    });
}

util.inherits(InputCharacteristic, BlenoCharacteristic);

InputCharacteristic.prototype.onReadRequest = function (offset, callback) {
    console.log('read BLE');
    if (this.idx === 0) {
        this.digitalValue = [];
    }

    var keys = Object.keys(this.modePins);
    if (this.idx < keys.length) {
        var mode = this.modePins[keys[this.idx]];
        if (mode !== undefined && mode === 0) {
            var pin = parseInt(keys[this.idx]);
            var self = this;
            this.arduinoManager.digitalRead(pin, function (err, data) {
                if (!err && data) {
                    self.digitalValue[pin] = data.value;
                    self.idx++;
                    self.onReadRequest(offset, callback);
                } else {
                    callback(this.RESULT_UNLIKELY_ERROR);
                }
            });
        } else {
            this.idx++;
            this.onReadRequest(offset, callback);
        }
    } else {
        //7 byte -> quad 53 bit
        var buf = Buffer.alloc(7);
        var size = this.digitalValue.length;
        var it = Math.ceil(size / 8);
        for (var i = 0; i < it; i++) {
            var b = 0x00;
            for (var j = 0; j < 8; j++){
                b += (this.digitalValue[j + (8 * i)] & 0xff) << j;
            }

            console.log('value i ' + i + ' value ' + b);
            buf.writeUInt8(b, i);
        }
        callback(this.RESULT_SUCCESS, buf);
    }
    this.idx = 0;
};

InputCharacteristic.prototype.onSubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

InputCharacteristic.prototype.onUnsubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

module.exports = InputCharacteristic;
