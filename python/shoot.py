#!/usr/bin/python3

import picamera
import datetime
import xml.etree.ElementTree as et

curdate = str(datetime.datetime.now())
curdate = curdate.replace("-", "")
curdate = curdate.replace(" ", "")
curdate = curdate.replace(".", "")
curdate = curdate.replace(":", "")

config = et.parse('../config.xml')
img = config.getroot().find('img')
frmt = img.find('format').text

if frmt not in ["jpeg", "png", "gif", "bmp", "yuv", "rgb", "rgba", "bgr", "bgra", "raw"]:
    frmt = "jpeg"
    
curdate += "." + frmt
cam = picamera.PiCamera()

cam.capture("../pictures/pic"+curdate, frmt)

print(curdate)
