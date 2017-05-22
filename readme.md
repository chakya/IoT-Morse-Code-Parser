# IoT Control Panel Team 94 Charles Vincent
### Functionality:
IoT control panel that use firebase as the database the control led and motion sensor from beaglebone. The output of the motion sensor will be Classified  into long(>=3seconds) and short(<3 seconds) motion. The program will then translate long and short (Dash and dit) into it's corresponding alphabet based on morse code. 

#### Version Log:
##### v1 Update log:
- Basic functionality on translating morse code in to english alphabet from A-Z.
- Basic interface for the client
- User can enter data through motion sensor
- Motion detected will be printed in the server console
- Server can determine incoming signal is a long or short motion
- The long or short signal will also be printed on the client side
- Output message based on the combination of input received by the motion sensor.
- Start new morse code after 3 seconds of no motion
- Start a new word after 7 seconds of no motion


#### v2 Update log:
- Added numeric morse code 
- Added punctuation morse code
- Allowed client side to start and end the transmission
- Added SK prosign to end the transmission

### File Overview: 
 | File | Function |
| ------ | ------ |
| /app.js/ | For the server to run motion sensor and led|
| /firebaseWebApi.js |For client to send command and receive result. |


### Hardware structure

- Microcontroller : BeagleBone Black with Debian V8.7
- Power supply: Micro USB connected to computer
- Sensors: Motion sensor
- Cables: 5 male to female jumper wires
- Output : led light

### Libraries
- Node.js(pre-installed)
- Bonescript(pre-installed)
- Firebase-admin
- Firebase-tools

### Pin Set UP
##### LED light
- Connect the negative pin to the DGND (P8 02 )
- Connect the positive pin to the GPIO (P8 08)
##### Motion Sensor
- Connect the out pin to GPIO (P8 07) 
- Connect ground pin to  DGND (P8 01)
- Connect  VCC pin to sys_5 (P9 08)

## Limitation: 
- You need a working internet connection for it to work

## Known bugs:
- Depending on internet connection there might be a delay in transmitting the morse code



### How to set up

Set up the beaglebone. This includes installing drivers for respective OS.

Once connected. Ssh to the beaglebone by running
```sh
$	ssh root@192.168.7.2
```
Clone this repository into a directory in beaglebone black

Install all the dependencies by running this code on terminal
```sh
$	npm install
```
Run server.js. This will start the motion sensor
```sh
$   node app.js
```
Run firebase server. It will create a server listening to port 3001
```sh
$   firebase serve -o 192.168.7.2 -p 5000
```
Navigate to your server in your browser
```sh
191.168.7.2:5000
```
