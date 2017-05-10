var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var pinModeCharacteristic = require('../characteristics/digital/pinModeCharacteristic');
var outputCharacteristic = require('../characteristics/digital/outputCharacterist');
var inputCharacteristic = require('../characteristics/digital/inputCharacteristic');

function DigitalService(arduinoManger) {
    this.digitalPins = [{
        pin :0,
        value :0
    }];
    DigitalService.super_.call(this, {
        uuid: 'D772A064-79C6-452F-994C-9829DA1A4229',
        characteristics: [
            new pinModeCharacteristic(arduinoManger),
            new outputCharacteristic(arduinoManger),
            new inputCharacteristic(arduinoManger)
        ]
    });
}

util.inherits(DigitalService, BlenoPrimaryService);

module.exports = DigitalService;
