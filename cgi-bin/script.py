#!/usr/bin/python 
import os
import webbrowser
import zipfile
import sys
import datetime
import platform
import time
import random
from math import pi
import requests #Available under "pip install requests"
import xml.etree.ElementTree as XML

sessionID = hex(int(time.time())) + str(int(random.randint(1,1001)*pi))

left = 13.5282
down = 52.4264
right = 13.5377
up = 52.4306

url = "https://overpass-api.de/api/map?bbox="+str(left)+","+str(down)+","+str(right)+","+str(up)
r = requests.get(url, allow_redirects=True)
open('map','wb').write(r.content)

os.rename('map','map.xml')
os.system('netconvert --osm map.xml -o osm.net.xml')

timeNow = datetime.datetime.now()

## generate info.txt file
infoFileName = "info.txt"
infoFile = open(infoFileName, "wt")
infoText = "Generated on " + str(timeNow.strftime("%c")) + " by SUMO Scenario Generator"
infoFile.write(infoText)
infoFile.close()

## generate osm.view.xml file
viewSettings = XML.Element('viewsettings')
viewItem1 = XML.SubElement(viewSettings, 'scheme')
viewItem2 = XML.SubElement(viewSettings, 'delay')
viewItem1.set('name','real world')
viewItem2.set('value','20')
xmlViewSettings = XML.tostring(viewSettings)
viewFile = open("osm.view.xml", "w")
viewFile.write(xmlViewSettings)

## generate .ZIP
zipName = "SUMO files"
finalZip = zipfile.ZipFile(zipName + ".zip","w")
finalZip.write("info.txt")
finalZip.write("osm.net.xml")
finalZip.write("osm.view.xml")
finalZip.close()

## delete files from the server directory (outside the .ZIP)
if os.path.exists("info.txt"):
 os.remove("info.txt")
 os.remove("map.xml")
 os.remove("osm.net.xml")
else:
 print("The file does not exist")

## NEED TEST
finalURL = "final.php"
print "Content-type: text/html\n\n"
print ("<script>window.location = '" + finalURL + "'</script>")