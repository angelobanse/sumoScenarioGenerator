<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Your ZIP is ready</title>
    <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico"/>

    <!-- Bootstrap v4.1.3 -->
    <link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="bootstrap/css/bootstrap-grid.min.css" type="text/css">
    <link rel="stylesheet" href="bootstrap/css/bootstrap-reboot.min.css" type="text/css">

    <!-- Font Awesome (Icons) v5.3.1 -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">

    <!-- Custom CSS (customizing Bootstrap and other stuff) -->
    <link rel="stylesheet" href="css/customStyle.css" type="text/css">
<style>
.alert{
    display: none;
}
</style>

</head>
<body style="background:#f8f9fa">
    
<?php
if($_GET["id"]==""){
        header("Location: index.html");
}
else {
$id = $_GET["id"];
$full_url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
$delete_from_url = 'final.php?id=' . $id;
$dir_url = str_replace($delete_from_url, '', $full_url);
$zipName = "SUMO-files_" . $id . ".zip";
$completeURL = $dir_url . "cgi-bin/" . $zipName;
}
?>

<div class="container-fluid">
    <br>
<div class="text-center">
        <img src="images/sumo-icon.png" alt="SUMO Logo" height=80px style="pointer-events: none;">
        <br><br>
        <h1>Your <i class="fas fa-file-archive"></i> (.zip) is ready</h1>
        <br>
        <br>
        <br>
</div>

<div class="row">

        <div class="col-sm-6 text-center">
                <h5>To download the ZIP file, press here:</h5>
                <br>
                <br>
                <a href="<?php echo $zipName ?>"><button type="button" class="btn btn-success btn-lg">Download <i class="fas fa-download"></i></button></a>
                <br>
                <br>
                <br>
                <br>
            </div>
    <div class="col-sm-6 text-center">
        <h5>If you want to share your .zip with others, use the following link:
        <br>
        <small>(this link is valid for 24 hrs)</small></h5>
        <br>
            <form class="input-group mb-3 justify-content-center">
                <div class="input-group-prepend">
                        <input type="text" class="form-control" name="selectArea" id="selectArea" value="<?php echo $completeURL ?>">
                </div>
                    <div class="input-group-append">
                            <button type="button" class="btn btn-info" onclick="selectFunction()">Copy <i class="fas fa-copy"></i></button>
                    </div>
                    
            </form>
            <div class="alert alert-success alert-dismissible">
                    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <strong>Copied!</strong> The link is now on your clipboard.
                  </div>
    </div>

</div>

<div class="text-center">
        <br>
        <br>
        <form action="index.html">
                <button type="submit" class="btn btn-primary"><i class="fas fa-long-arrow-alt-left"></i> back to SUMO Scenario Generator</button>
        </form>
  <br>
  <br>
</div>

</div>

<script>
function selectFunction(){
var copyText = document.getElementById("selectArea");
copyText.select();
document.execCommand("copy");
$('.alert').show()
}
</script>

<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="bootstrap/js/bootstrap.min.js"></script>

</body>
</html>
