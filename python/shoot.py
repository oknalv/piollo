#!/usr/bin/python3

import picamera
import datetime
import time
import xml.etree.ElementTree as et

curdate = str(datetime.datetime.now())
curdate = curdate.replace("-", "")
curdate = curdate.replace(" ", "")
curdate = curdate.replace(".", "")
curdate = curdate.replace(":", "")

config = et.parse('../config.xml')
img = config.getroot().find('img')
frmt = img.find('format').text
width = int(img.find('width').text)
height = int(img.find('height').text)
effect = img.find('effect').text

if frmt not in ["jpeg", "png", "gif", "bmp", "yuv", "rgb", "rgba", "bgr", "bgra", "raw"]:
    frmt = "jpeg"
if effect not in ["none", "negative", "solarize", "sketch", "denoise", "emboss", "oilpaint", "hatch", "gpen", "pastel", "watercolor", "film", "blur", "saturation", "colorswap", "washedout", "posterise", "colorpoint", "colorbalance", "cartoon", "deinterlace1", "deinterlace2"]:
    effect = "none"

curdate += "." + frmt
with picamera.PiCamera() as cam:
    cam.resolution = (width, height)
    cam.image_effect = effect
    cam.capture("../pictures/pic"+curdate, frmt)

print(curdate)
