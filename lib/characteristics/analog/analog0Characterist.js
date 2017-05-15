var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function Analog0Characteristic(arduinoManager) {
    this.arduinoManager = arduinoManager;
    this.idVal = 0;
    this.pin = -1;

    Analog0Characteristic.super_.call(this, {
        uuid: 'D7726BCF-79C6-452F-994C-9829DA1A4229',
        properties: ['read', 'write'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2901',
                value: 'Analog Read/Write'
            }),
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0xc]) // pin 13
            })
        ]
    });
}

util.inherits(Analog0Characteristic, BlenoCharacteristic);

Analog0Characteristic.prototype.onReadRequest = function(offset, callback) {
    if(this.pin !== -1){
        this.arduinoManager.digitalRead(this.pin, callback);
    }
};

Analog0Characteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
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

Analog0Characteristic.prototype.onSubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

Analog0Characteristic.prototype.onUnsubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

Analog0Characteristic.prototype.setArduinoManger = function(arduinoManager) {
    this.arduinoManager = arduinoManager;
};


module.exports = Analog0Characteristic;
