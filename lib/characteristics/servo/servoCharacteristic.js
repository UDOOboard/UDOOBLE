var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function ServoCharacteristic(arduinoManager, pin, UUID) {
    this.arduinoManager = arduinoManager;
    this.pin = pin;

    ServoCharacteristic.super_.call(this, {
        uuid: 'D7729200-79C6-452F-994C-9829DA1A4229',
        properties: ['write'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2901',
                value: 'Servo Write'
            }),
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0x0, 0x3, 0x0, 0x0, 0x5, 0xA]) // Servo 3 write 90 degrees
            })
        ]
    });
}

util.inherits(ServoCharacteristic, BlenoCharacteristic);

ServoCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    } else if (data.length !== 3) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        var pin = (data.readUInt8(0) & 0xfc) >> 6;
        var degrees = data.readUInt16BE(1);
        console.log('pin ', pin);
        console.log('enable ', degrees);
        if (degrees > 360) degrees = 360;
        if (degrees < 0) degrees = 0;
        this.arduinoManager.servoWrite(pin, degrees);
        callback(this.RESULT_SUCCESS);
    }
};

module.exports = ServoCharacteristic;