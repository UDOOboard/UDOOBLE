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
        uuid: 'D7720BCF-79C6-452F-994C-9829DA1A4229',
        properties: ['read', 'write'],
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
    if (this.idx === 0) {
        this.digitalValue = [];
    }
    if (this.idx < this.modePins.length){
        if (this.modePins[this.idx] === 0) {
            var self = this;
            this.arduinoManager.digitalRead(this.idx, function (err, data) {
                if (!err) {
                    self.digitalValue[self.idx] = data;
                    self.idx++;
                    self.onReadRequest(offset, callback);
                } else {
                    callback(new Error('digital error read'));
                }
            });
        } else {
            this.idx++;
            this.onReadRequest(offset, callback);
        }
    }else{
        this.idx = 0;
        callback(null, this.digitalValue);
    }
};

InputCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    console.log("data ", data);
    console.log("offset ", offset);
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    } else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        console.log('data ', data);
        this.pin = (data.readUInt8(0) & 0xfc) >> 6;
        console.log('pin ', this.pin);
        callback(this.RESULT_SUCCESS);
    }
};

InputCharacteristic.prototype.onSubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

InputCharacteristic.prototype.onUnsubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

InputCharacteristic.prototype.setArduinoManger = function(arduinoManager) {
    this.arduinoManager = arduinoManager;
};


module.exports = InputCharacteristic;
