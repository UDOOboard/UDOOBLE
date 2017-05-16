var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var ServoADCharacteristic = require('../characteristics/servo/servoADCharacteristic');
var ServoCharacteristic = require('../characteristics/servo/servoCharacteristic');

function AnalogService(arduinoManger) {
    this.arduinoManager = arduinoManger;

    AnalogService.super_.call(this, {
        uuid: 'D7729000-79C6-452F-994C-9829DA1A4229',
        characteristics: [
            new ServoADCharacteristic(arduinoManger),
            new ServoCharacteristic(arduinoManger)
        ]
    });
}

util.inherits(AnalogService, BlenoPrimaryService);

module.exports = AnalogService;
