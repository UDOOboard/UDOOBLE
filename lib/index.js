var Arduino = require('udoo-arduino-manager/lib');
var arduino = new Arduino('ttyACM0');
var bleno = require('bleno');
var DigitalService = require('./services/digitalService');

// arduino.digitalWrite(7, 1);

var primaryService = new DigitalService(bleno, arduino);

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
        bleno.setServices([primaryService], function(error){
            console.log('setServices: '  + (error ? 'error ' + error : 'success'));
        });
    }
});

bleno.on('accept', function(addr) {
    console.log('on -> accept ', addr);
});