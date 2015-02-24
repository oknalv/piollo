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

xml = et.parse('../config.xml')
config = xml.getroot()
imgFormat = config.find('imgFormat').text
width = int(config.find('width').text)
height = int(config.find('height').text)
effect = config.find('effect').text
timer = int(config.find('timer').text)
rotation = int(config.find('rotate').text)
hflip = bool(int(config.find('hflip').text))
vflip = bool(int(config.find('vflip').text))
colorpointColor = int(config.find('colorpointColor').text)
colorswapMode = int(config.find('colorswapMode').text)
brightness = int(config.find('brightness').text)
contrast = int(config.find('contrast').text)
saturation = int(config.find('saturation').text)
sharpness = int(config.find('sharpness').text)
posteriseSteps = int(config.find('posteriseSteps').text)
blurSize = int(config.find('blurSize').text)
watercolorEnableUV = bool(int(config.find('watercolorEnableUV').text))
watercolorU = int(config.find('watercolorU').text)
watercolorV = int(config.find('watercolorV').text)
filmStrength = int(config.find('filmStrength').text)
filmU = int(config.find('filmU').text)
filmV = int(config.find('filmV').text)

if imgFormat not in ["jpeg", "png", "gif", "bmp", "yuv", "rgb", "rgba", "bgr", "bgra", "raw"]:
    imgFormat = "jpeg"
if effect not in ["none", "negative", "solarize", "sketch", "denoise", "emboss", "oilpaint", "hatch", "gpen", "pastel", "watercolor", "film", "blur", "saturation", "colorswap", "washedout", "posterise", "colorpoint", "colorbalance", "cartoon", "deinterlace1", "deinterlace2"]:
    effect = "none"
if rotation not in [0,90,180,270]:
    rotation = 0
if colorpointColor not in [0,1,2,3]:
    colorpointColor = 0

with picamera.PiCamera() as cam:
    cam.resolution = (width, height)
    cam.image_effect = effect
    if effect == "colorpoint":
        cam.image_effect_params = colorpointColor
    if effect == "colorswap":
        cam.image_effect_params = colorswapMode
    if effect == "posterise":
        cam.image_effect_params = posteriseSteps
    if effect == "blur":
        cam.image_effect_params = blurSize
    if effect == "watercolor" and watercolorEnableUV:
        cam.image_effect_params = (watercolorU, watercolorV)
    if effect == "film":
        cam.image_effect_params = (filmStrength, filmU, filmV)
    cam.rotation = rotation
    cam.hflip = hflip
    cam.vflip = vflip
    cam.brightness = brightness
    cam.contrast = contrast
    cam.saturation = saturation
    cam.sharpness = sharpness
    time.sleep(timer)
    cam.capture("../pictures/pic" + curdate + "." + imgFormat, imgFormat)

print(curdate)
