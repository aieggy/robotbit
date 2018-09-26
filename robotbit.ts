/*
Copyright (C): 2010-2019, wuhan eggtoy Tech
author steven_chu
load dependency
*/

//% color="#006400" weight=20 icon="\uf1b9" block="robotbit"
namespace robotbit{

    const PCA9685_ADD = 0x41
    const MODE1 = 0x00

    const LED0_ON_L = 0x06

    const PRESCALE = 0xFE

    let initialized = false

	export enum enMusic {

        dadadum = 0,
        entertainer,
        prelude,
        ode,
        nyan,
        ringtone,
        funk,
        blues,

        birthday,
        wedding,
        funereal,
        punchline,
        baddy,
        chase,
        ba_ding,
        wawawawaa,
        jump_up,
        jump_down,
        power_up,
        power_down
    }

	export enum enPos {

        //% blockId="LeftState" block="左边状态"
        LeftState = 0,
        //% blockId="RightState" block="右边状态"
        RightState = 1
    }
	
	export enum enLineState {
        //% blockId="White" block="白线"
        White = 0,
        //% blockId="Black" block="黑线"
        Black = 1

    }
	
	export enum enAvoidState {
        //% blockId="OBSTACLE" block="有障碍物"
        OBSTACLE = 0,
        //% blockId="NOOBSTACLE" block="无障碍物"
        NOOBSTACLE = 1

    }
    
	
    export enum CarState {
        //% blockId="Car_Run" block="前行"
        Car_Run = 1,
        //% blockId="Car_Back" block="后退"
        Car_Back = 2,
        //% blockId="Car_Left" block="左转"
        Car_Left = 3,
        //% blockId="Car_Right" block="右转"
        Car_Right = 4,
        //% blockId="Car_Stop" block="停止"
        Car_Stop = 5,
        //% blockId="Car_SpinLeft" block="原地左旋"
        Car_SpinLeft = 6,
        //% blockId="Car_SpinRight" block="原地右旋"
        Car_SpinRight = 7
    }
	
	export enum MotorState {
        //% blockId="Motor_Run" block="电机前进"
        Motor_Run = 1,
        //% blockId="Motor_Back" block="电机后退"
        Motor_Back = 2,
        //% blockId="Motor_Stop" block="电机停止"
        Motor_Stop = 3
    }
	
	export enum enColor {

		//% blockId="OFF" block="灭"
		OFF = 0,
		//% blockId="Red" block="红色"
		Red,
		//% blockId="Green" block="绿色"
		Green,
		//% blockId="Blue" block="蓝色"
		Blue,
		//% blockId="White" block="白色"
		White,
		//% blockId="Cyan" block="青色"
		Cyan,
		//% blockId="Pinkish" block="品红"
		Pinkish,
		//% blockId="Green" block="黄色"
		Yellow,

	}

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }


    function Car_run(speed1: number, speed2: number) {

        speed1 = speed1 * 16; // map 350 to 4096
        speed2 = speed2 * 16;
        if (speed1 >= 4096) {
            speed1 = 4095
        }
        if (speed1 <= 350) {
            speed1 = 350
        }
        if (speed2 >= 4096) {
            speed2 = 4095
        }
        if (speed2 <= 350) {
            speed2 = 350
        }

		setPwm(12, 0, 0);
        setPwm(13, 0, speed1);
        
        setPwm(14, 0, 0);
		setPwm(15, 0, speed2);
    }

    function Car_back(speed1: number, speed2: number) {

        speed1 = speed1 * 16; // map 350 to 4096
        speed2 = speed2 * 16;
        if (speed1 >= 4096) {
            speed1 = 4095
        }
        if (speed1 <= 350) {
            speed1 = 350
        }
        if (speed2 >= 4096) {
            speed2 = 4095
        }
        if (speed2 <= 350) {
            speed2 = 350
        }

		setPwm(12, 0, speed1);
        setPwm(13, 0, 0);
                
        setPwm(14, 0, speed2);
		setPwm(15, 0, 0);
    }

    function Car_left(speed1: number, speed2: number) {

        speed1 = speed1 * 16; // map 350 to 4096
        speed2 = speed2 * 16;
        if (speed1 >= 4096) {
            speed1 = 4095
        }
        if (speed1 <= 350) {
            speed1 = 350
        }
        if (speed2 >= 4096) {
            speed2 = 4095
        }
        if (speed2 <= 350) {
            speed2 = 350
        }
        
        setPwm(12, 0, 0);
        setPwm(13, 0, speed1);

		setPwm(14, 0, 0);
		setPwm(15, 0, 0);
    }

    function Car_right(speed1: number, speed2: number) {

        speed1 = speed1 * 16; // map 350 to 4096
        speed2 = speed2 * 16;
        if (speed1 >= 4096) {
            speed1 = 4095
        }
        if (speed1 <= 350) {
            speed1 = 350
        }
        if (speed2 >= 4096) {
            speed2 = 4095
        }
        if (speed2 <= 350) {
            speed2 = 350
        }
        
        setPwm(12, 0, speed1);
        setPwm(13, 0, 0);

		setPwm(14, 0, 0);
		setPwm(15, 0, 0);
    }

    function Car_stop() {
       
        setPwm(12, 0, 0);
        setPwm(13, 0, 0);

        setPwm(15, 0, 0);
        setPwm(14, 0, 0);
    }

    function Car_spinleft(speed1: number, speed2: number) {

        speed1 = speed1 * 16; // map 350 to 4096
        speed2 = speed2 * 16;
        if (speed1 >= 4096) {
            speed1 = 4095
        }
        if (speed1 <= 350) {
            speed1 = 350
        }
        if (speed2 >= 4096) {
            speed2 = 4095
        }
        if (speed2 <= 350) {
            speed2 = 350
        }        
        
        setPwm(12, 0, 0);
        setPwm(13, 0, speed1);

        setPwm(14, 0, speed2);
        setPwm(15, 0, 0);
    } 

    function Car_spinright(speed1: number, speed2: number) {

        speed1 = speed1 * 16; // map 350 to 4096
        speed2 = speed2 * 16;
        if (speed1 >= 4096) {
            speed1 = 4095
        }
        if (speed1 <= 350) {
            speed1 = 350
        }
        if (speed2 >= 4096) {
            speed2 = 4095
        }
        if (speed2 <= 350) {
            speed2 = 350
        }    
            
        setPwm(12, 0, speed1);
        setPwm(13, 0, 0);

        setPwm(14, 0, 0);
        setPwm(15, 0, speed2);
    }
	
	function Ultrasonic(Trig: DigitalPin, Echo: DigitalPin): number {

        // send pulse
        pins.setPull(Trig, PinPullMode.PullNone);
        pins.digitalWritePin(Trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(Trig, 1);
        control.waitMicros(15);
        pins.digitalWritePin(Trig, 0);

        // read pulse
        let d = pins.pulseIn(Echo, PulseValue.High, 23200);
        return d / 58;
    }

    //% blockId=CarCtrl block="CarCtrl|%index|time %time"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrl(index: CarState, time: number): void {
        switch (index) {
            case CarState.Car_Run: Car_run(255, 255); break;
            case CarState.Car_Back: Car_back(255, 255); break;
            case CarState.Car_Left: Car_left(255, 255); break;
            case CarState.Car_Right: Car_right(255, 255); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(255, 255); break;
            case CarState.Car_SpinRight: Car_spinright(255, 255); break;
        }
        basic.pause(time*1000);
        Car_stop();
    }
	
	//% blockId=CarCtrlSpeed block="CarCtrlSpeed|%index|speed %speed|time %time"
    //% weight=92
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrlSpeed(index: CarState, speed: number, time:number): void {
        switch (index) {
            case CarState.Car_Run: Car_run(speed,speed); break;
            case CarState.Car_Back: Car_back(speed,speed); break;
            case CarState.Car_Left: Car_left(speed,speed); break;
            case CarState.Car_Right: Car_right(speed,speed); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(speed,speed); break;
            case CarState.Car_SpinRight: Car_spinright(speed,speed); break;
        }
        basic.pause(time*1000);
        Car_stop();
    }
	
	//% blockId=MotorControl_Car block="MotorControl_Car|stateL %stateL|speedL %speedL|stateR %stateR|speedR %speedR"
    //% weight=92
    //% blockGap=10
    //% speedL.min=0 speedL.max=255
	//% speedR.min=0 speedR.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
	export function MotorControl_Car(stateL: MotorState, speedL:number, stateR: MotorState, speedR: number):void{
		speedL = speedL * 16; // map 350 to 4096
        speedR = speedR * 16;
        if (speedL >= 4096) {
            speedL = 4095
        }
        if (speedL <= 350) {
            speedL = 350
        }
        if (speedR >= 4096) {
            speedR = 4095
        }
        if (speedR <= 350) {
            speedR = 350
        }

        if(stateL == MotorState.Motor_Run)
        {
            setPwm(13, 0, speedL);
            setPwm(12, 0, 0);
        }
        else if(stateL == MotorState.Motor_Back)
        {
            setPwm(13, 0, 0);
            setPwm(12, 0, speedL);	
        }
        else
        {
            setPwm(12, 0, 0);
            setPwm(13, 0, 0);	
        }
		
        if(stateR == MotorState.Motor_Run)
        {
            setPwm(15, 0, speedR);
            setPwm(14, 0, 0);
        }
        else if(stateR == MotorState.Motor_Back)
        {
            setPwm(15, 0, 0);
            setPwm(14, 0, speedR);
        }
        else
        {
            setPwm(14, 0, 0);
            setPwm(15, 0, 0);
        }
	}
	
    //% blockId=m_RGB_Car_BigLight block="Motor value|%value"
    //% weight=101
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_BigLight(value: enColor): void {

        switch (value) {
            case enColor.OFF: {
                setPwm(0, 0, 0);
                setPwm(1, 0, 0);
                setPwm(2, 0, 0);
                break;
            }
            case enColor.Red: {
                setPwm(0, 0, 4095);
                setPwm(1, 0, 0);
                setPwm(2, 0, 0);
                break;
            }
            case enColor.Green: {
                setPwm(0, 0, 0);
                setPwm(1, 0, 4095);
                setPwm(2, 0, 0);
                break;
            }
            case enColor.Blue: {
                setPwm(0, 0, 0);
                setPwm(1, 0, 0);
                setPwm(2, 0, 4095);
                break;
            }
            case enColor.White: {
                setPwm(0, 0, 4095);
                setPwm(1, 0, 4095);
                setPwm(2, 0, 4095);
                break;
            }
            case enColor.Cyan: {
                setPwm(0, 0, 0);
                setPwm(1, 0, 4095);
                setPwm(2, 0, 4095);
                break;
            }
            case enColor.Pinkish: {
                setPwm(0, 0, 4095);
                setPwm(1, 0, 0);
                setPwm(2, 0, 4095);
                break;
            }
            case enColor.Yellow: {
                setPwm(0, 0, 4095);
                setPwm(1, 0, 4095);
                setPwm(2, 0, 0);
                break;
            }
        }
    }
	
	//% blockId=Get_Line_Sensor block="Get_Line_Sensor|direct %direct"
    //% weight=94
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Get_Line_Sensor(direct: enPos): number {
        let lineSensorValue=0;
		
        if(direct == enPos.LeftState){
			lineSensorValue = pins.analogReadPin(AnalogPin.P2);
        }
        else if(direct == enPos.RightState){
            lineSensorValue = pins.analogReadPin(AnalogPin.P1);
        }
		
        return lineSensorValue;
    }
	
	//% blockId=Line_Sensor block="Line_Sensor|direct %direct|value %value"
    //% weight=94
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Line_Sensor(direct: enPos, value: enLineState): boolean {

        let temp: boolean = false;
		
        setPwm(7, 0, 4095);
        basic.pause(1);
        switch (direct) {
            case enPos.LeftState: {
                if (pins.analogReadPin(AnalogPin.P2) < 500) {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                }
                else {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                }
                break;
            }

            case enPos.RightState: {
                if (pins.analogReadPin(AnalogPin.P1) < 500) {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                }
                else {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                }
                break;
            }
        }
        basic.pause(1);
        return temp;
    }
	
    //% blockId=Get_Avoid_Sensor block="Get_Avoid_Sensor"
    //% weight=95
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Get_Avoid_Sensor(): number{
        let UltrasonicValue = 0;
		
        UltrasonicValue = Ultrasonic(DigitalPin.P14, DigitalPin.P15);
		
        return UltrasonicValue;
    }
	
	//% blockId=Avoid_Sensor block="Avoid_Sensor|value %value"
    //% weight=95
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Avoid_Sensor(value: enAvoidState): boolean {

        let temp: boolean = false;
		let UltrasonicValue = 0;
		
		UltrasonicValue = Ultrasonic(DigitalPin.P14, DigitalPin.P15);
		
        switch (value) {
            case enAvoidState.OBSTACLE: {
                if (UltrasonicValue < 10) {
                    temp = true;
                }
                else {                 
                    temp = false;
                }
                break;
            }

            case enAvoidState.NOOBSTACLE: {
                if (UltrasonicValue > 10) {
                    temp = true;
                }
                else {
                    temp = false;
                }
                break;
            }
        }
        return temp;
    }

	//% blockId=Music_Car block="Music_Car|%index"
    //% weight=97
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Music_Car(index: enMusic): void {
        pins.analogSetPitchPin(AnalogPin.P12);
        switch (index) {
            case enMusic.dadadum: music.beginMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.Once); break;
            case enMusic.birthday: music.beginMelody(music.builtInMelody(Melodies.Birthday), MelodyOptions.Once); break;
            case enMusic.entertainer: music.beginMelody(music.builtInMelody(Melodies.Entertainer), MelodyOptions.Once); break;
            case enMusic.prelude: music.beginMelody(music.builtInMelody(Melodies.Prelude), MelodyOptions.Once); break;
            case enMusic.ode: music.beginMelody(music.builtInMelody(Melodies.Ode), MelodyOptions.Once); break;
            case enMusic.nyan: music.beginMelody(music.builtInMelody(Melodies.Nyan), MelodyOptions.Once); break;
            case enMusic.ringtone: music.beginMelody(music.builtInMelody(Melodies.Ringtone), MelodyOptions.Once); break;
            case enMusic.funk: music.beginMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.Once); break;
            case enMusic.blues: music.beginMelody(music.builtInMelody(Melodies.Blues), MelodyOptions.Once); break;
            case enMusic.wedding: music.beginMelody(music.builtInMelody(Melodies.Wedding), MelodyOptions.Once); break;
            case enMusic.funereal: music.beginMelody(music.builtInMelody(Melodies.Funeral), MelodyOptions.Once); break;
            case enMusic.punchline: music.beginMelody(music.builtInMelody(Melodies.Punchline), MelodyOptions.Once); break;
            case enMusic.baddy: music.beginMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.Once); break;
            case enMusic.chase: music.beginMelody(music.builtInMelody(Melodies.Chase), MelodyOptions.Once); break;
            case enMusic.ba_ding: music.beginMelody(music.builtInMelody(Melodies.BaDing), MelodyOptions.Once); break;
            case enMusic.wawawawaa: music.beginMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.Once); break;
            case enMusic.jump_up: music.beginMelody(music.builtInMelody(Melodies.JumpUp), MelodyOptions.Once); break;
            case enMusic.jump_down: music.beginMelody(music.builtInMelody(Melodies.JumpDown), MelodyOptions.Once); break;
            case enMusic.power_up: music.beginMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.Once); break;
            case enMusic.power_down: music.beginMelody(music.builtInMelody(Melodies.PowerDown), MelodyOptions.Once); break;
        }
    }	
}
