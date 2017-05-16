var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function AnalogCharacteristic(arduinoManager, pin , UUID) {
    this.arduinoManager = arduinoManager;
    this.pin = pin;

    AnalogCharacteristic.super_.call(this, {
        uuid: 'D772'+UUID +'-79C6-452F-994C-9829DA1A4229',
        properties: ['read', 'write'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2901',
                value: 'Analog Read/Write'
            }),
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0xff]) // value
            })
        ]
    });
}

util.inherits(AnalogCharacteristic, BlenoCharacteristic);

AnalogCharacteristic.prototype.onReadRequest = function(offset, callback) {
    if(this.pin !== -1){
        this.arduinoManager.analogRead(this.pin, callback);
    }
};

AnalogCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    console.log("data ", data);
    console.log("offset ", offset);
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    } else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        console.log('data ', data);
        var value = data.readUInt16BE(0);
        console.log('pin ', this.pin);
        this.arduinoManager.analogWrite(this.pin , value);
        callback(this.RESULT_SUCCESS);
    }
};

AnalogCharacteristic.prototype.onSubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

AnalogCharacteristic.prototype.onUnsubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

module.exports = AnalogCharacteristic;
