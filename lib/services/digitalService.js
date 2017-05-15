var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var pinModeCharacteristic = require('../characteristics/digital/pinModeCharacteristic');
var outputCharacteristic = require('../characteristics/digital/outputCharacterist');
var inputCharacteristic = require('../characteristics/digital/inputCharacteristic');

function DigitalService(arduinoManger) {
    this.arduinoManager = arduinoManger;

    this.digitalPins = {
        mode : 1 //Default -> Output
    };

    DigitalService.super_.call(this, {
        uuid: 'D7720064-79C6-452F-994C-9829DA1A4229',
        characteristics: [
            new pinModeCharacteristic(arduinoManger, digitalPins),
            new outputCharacteristic(arduinoManger),
            new inputCharacteristic(arduinoManger, digitalPins)
        ]
    });
}

util.inherits(DigitalService, BlenoPrimaryService);

module.exports = DigitalService;
