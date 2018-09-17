import sys
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

infoFileName = "ejemplo.txt"
infoFile = open(infoFileName, "wt")
infoText = "Generated on " + str(Left) + " by SUMO Scenario Generator"+ str(Down) + str(Duration) + str(Polygons)   + str(TramFactor) + str(CarFactor)  
infoFile.write(infoText)
infoFile.close()