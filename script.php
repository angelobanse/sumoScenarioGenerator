<!-- Olaf Angelo Banse Bueno / 2018 -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PHP Backend</title>
</head>
<body>

<?php
if($_GET['1']==""){
    header("Location: index.html");
}
else {
$Left = $_GET['1'];
$Down = $_GET["2"];
$Right = $_GET['3'];
$Up = $_GET["4"];
$CarFactor = $_GET['5'];
$CarCount = $_GET['6'];
$TruckFactor = $_GET['7'];
$TruckCount = $_GET['8'];
$BusFactor = $_GET['9'];
$BusCount = $_GET['10'];
$MotorcycleFactor = $_GET['11'];
$MotorcycleCount = $_GET['12'];
$BicycleFactor = $_GET['13'];
$BicycleCount = $_GET['14'];
$PedestrianFactor = $_GET['15'];
$PedestrianCount = $_GET['16'];
$TramFactor = $_GET['17'];
$TramCount = $_GET['18'];
$UrbanTrainFactor = $_GET['19'];
$UrbanTrainCount = $_GET['20'];
$TrainFactor = $_GET['21'];
$TrainCount = $_GET['22'];
$ShipFactor = $_GET['23'];
$ShipCount = $_GET['24'];
$Duration = $_GET['25'];
$Polygons = $_GET['26'];

$sessionID = strval(rand(10, 99)) . dechex(time()) . strval(rand(10, 10000));

$cmd = "python script.py ".$Left." ".$Down." ".$Right." ".$Up." ".$CarFactor." ".$CarCount." ".$TruckFactor." ".$TruckCount
." ".$BusFactor." ".$BusCount." ".$MotorcycleFactor." ".$MotorcycleCount." ".$BicycleFactor." ".$BicycleCount
." ".$PedestrianFactor." ".$PedestrianCount." ".$TramFactor." ".$TramCount." ".$UrbanTrainFactor." ".$UrbanTrainCount
." ".$TrainFactor." ".$TrainCount." ".$ShipFactor." ".$ShipCount." ".$Duration." ".$Polygons." ".$sessionID;
shell_exec($cmd);
header("Location: final.php?id=".$sessionID);
}
?>
    
</body>
</html>