var util = require('util');
var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function ServoADCharacteristic(arduinoManager, pin , UUID) {
    this.arduinoManager = arduinoManager;
    this.pin = pin;

    ServoADCharacteristic.super_.call(this, {
        uuid: 'D7729100-79C6-452F-994C-9829DA1A4229',
        properties: ['write'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2901',
                value: 'Servo Attach/Detach'
            }),
            new BlenoDescriptor({
                uuid: '2904',
                value: new Buffer([0x3, 0x1]) // Servo 13 Attach
            })
        ]
    });
}

util.inherits(ServoADCharacteristic, BlenoCharacteristic);

ServoADCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    } else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        var pin = (data.readUInt8(0) & 0xfc) >> 6;
        var enable = data.readUInt8(0) & 0x1;
        console.log('pin ' , pin);
        console.log('enable ' , !!enable);
        if(!!enable){
            this.arduinoManager.servoAttach(pin);
        }else{
            this.arduinoManager.servoDetach(pin)
        }
        callback(this.RESULT_SUCCESS);
    }
};

module.exports = ServoADCharacteristic;
