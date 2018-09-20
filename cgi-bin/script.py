# Olaf Angelo Banse Bueno - 2018
#!/usr/bin/python 
import os
import zipfile
import sys
import datetime
#import platform
import time
import xml.etree.ElementTree as XML
try:
    import httplib
    import urlparse
except ImportError:
    # for python3
    import http.client as httplib
    import urllib.parse as urlparse

Left = sys.argv[1]
Down = sys.argv[2]
Right = sys.argv[3]
Up = sys.argv[4]
CarFactor = sys.argv[5]
CarCount = sys.argv[6]
TruckFactor = sys.argv[7]
TruckCount = sys.argv[8]
BusFactor = sys.argv[9]
BusCount = sys.argv[10]
MotorcycleFactor = sys.argv[11]
MotorcycleCount = sys.argv[12]
BicycleFactor = sys.argv[13]
BicycleCount = sys.argv[14]
PedestrianFactor = sys.argv[15]
PedestrianCount = sys.argv[16]
TramFactor = sys.argv[17]
TramCount = sys.argv[18]
UrbanTrainFactor = sys.argv[19]
UrbanTrainCount = sys.argv[20]
TrainFactor = sys.argv[21]
TrainCount = sys.argv[22]
ShipFactor = sys.argv[23]
ShipCount = sys.argv[24]
Duration = sys.argv[25]
Polygons = sys.argv[26]
sessionID = sys.argv[27]

## generate osm.net.xml file
osmMapName = "map_" + sessionID + ".xml"
osmNetName = "osm_" + sessionID + ".net.xml"
conn = httplib.HTTPConnection("overpass-api.de")
req = "/api/map?bbox="+str(Left)+","+str(Down)+","+str(Right)+","+str(Up)
conn.request("GET", req)
r = conn.getresponse()
osmMap = open(os.path.join(os.getcwd(), "%s" % (osmMapName)), "w")
osmMap.write(r.read())
osmMap.close()
conn.close()
netconvertCMD = 'netconvert --osm ' + osmMapName + ' -o ' + osmNetName
os.system(netconvertCMD)

## generate osm.view.xml file
viewSettings = XML.Element('viewsettings')
viewItem1 = XML.SubElement(viewSettings, 'scheme')
viewItem2 = XML.SubElement(viewSettings, 'delay')
viewItem1.set('name','real world')
viewItem2.set('value','20')
xmlViewSettings = XML.tostring(viewSettings)
viewFileName = "osm_" + sessionID + ".view.xml"
viewFile = open(viewFileName, "w")
viewFile.write(xmlViewSettings)
viewFile.close()

## generate osm.poly.xml file
osmPolyName = "poly_" + sessionID + ".xml"
if Polygons == "true":
    polyconvertCMD = 'polyconvert --osm ' + osmNetName + ' -o ' + osmPolyName
    os.system(polyconvertCMD)

timeNow = datetime.datetime.now()

## generate info.txt file
infoFileName = "info_" + sessionID + ".txt"
infoFile = open(infoFileName, "wt")
infoText = "Generated on " + str(timeNow.strftime("%c")) + " by SUMO Scenario Generator"
infoFile.write(infoText)
infoFile.close()

## generate .ZIP
zipName = "SUMO-files" + "_" + sessionID + ".zip"
finalZip = zipfile.ZipFile(zipName, "w")
finalZip.write(infoFileName, arcname="info.txt")
finalZip.write(osmNetName, arcname="osm.net.xml")
finalZip.write(viewFileName, arcname="osm.view.xml")
if Polygons == "true":
    finalZip.write(osmPolyName, arcname="osm.poly.xml")
finalZip.close()

## delete files from the server directory (outside the .ZIP)
if os.path.exists(infoFileName):
 os.remove(infoFileName)
 os.remove(viewFileName)
 os.remove(osmMapName)
 os.remove(osmNetName)
 if Polygons == "true":
     os.remove(osmPolyName)
else:
 print("The file does not exist")

## NEED TEST
#finalURL = "final.php" + "?id=" + sessionID
#print "Content-type: text/html\n\n"
#print ("<script>window.location = '" + finalURL + "'</script>")