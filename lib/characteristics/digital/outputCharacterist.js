var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function OutputCharacteristic(arduinoManager) {
    this.arduinoManager = arduinoManager;
    this.idVal = 0;

    OutputCharacteristic.super_.call(this, {
        uuid: 'D7720BCF-79C6-452F-994C-9829DA1A4229',
        properties: ['write'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2901',
                value: 'Digital OUTPUT'
            }),
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0xc, 0x1]) // pin 13 HIGH
            })
        ]
    });
}

util.inherits(OutputCharacteristic, BlenoCharacteristic);

OutputCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    console.log("data ", data);
    console.log("offset ", offset);
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    } else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        console.log('data ', data);
        var pin = (data.readUInt8(0) & 0xfc) >> 6;
        var value = data.readUInt8(0) & 0x01;
        console.log('pin ', pin);
        console.log('value ', value);

        console.log("operation write dig");
        this.arduinoManager.digitalWrite(pin, value, null)

        callback(this.RESULT_SUCCESS);
    }
};

OutputCharacteristic.prototype.onSubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

OutputCharacteristic.prototype.onUnsubscribe = function (offset, callback) {
    // callback(this.RESULT_SUCCESS, new Buffer([percent]));
};

module.exports = OutputCharacteristic;
