var Arduino = require('udoo-arduino-manager/lib');
var arduino = new Arduino('ttyACM0');
var bleno = require('bleno');
var DigitalService = require('./services/digitalService');
var AnalogService = require('./services/analogService');
var ServoService = require('./services/servoService');

//arduino.digitalWrite(7, 1);

var primaryService = new DigitalService(arduino);
var analogSevice = new AnalogService(arduino);
var servoService = new ServoService(arduino);

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('Udoo-Neo-Ble', [primaryService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([primaryService, analogSevice, servoService], function(error){
            console.log('setServices: '  + (error ? 'error ' + error : 'success'));
        });
    }
});

bleno.on('accept', function(addr) {
    console.log('on -> accept ', addr);
});