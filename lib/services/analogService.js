var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var AnalogCharacteristic = require('../characteristics/analog/analogCharacteristic');

function AnalogService(arduinoManger) {
    this.arduinoManager = arduinoManger;

    AnalogService.super_.call(this, {
        uuid: 'D7728000-79C6-452F-994C-9829DA1A4229',
        characteristics: [
            new AnalogCharacteristic(arduinoManger, 0, '8010'),
            new AnalogCharacteristic(arduinoManger, 1, '8020'),
            new AnalogCharacteristic(arduinoManger, 2, '8030'),
            new AnalogCharacteristic(arduinoManger, 3, '8040'),
            new AnalogCharacteristic(arduinoManger, 4, '8050'),
            new AnalogCharacteristic(arduinoManger, 5, '8060')
        ]
    });
}

util.inherits(AnalogService, BlenoPrimaryService);

module.exports = AnalogService;
