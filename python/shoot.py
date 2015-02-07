#!/usr/bin/python3

import picamera
import datetime

curdate=str(datetime.datetime.now())
curdate=curdate.replace("-","")
curdate=curdate.replace(" ","")
curdate=curdate.replace(".","")
curdate=curdate.replace(":","")
curdate+=".jpg"
cam=picamera.PiCamera()

cam.capture("../pictures/pic"+curdate)

print(curdate)
