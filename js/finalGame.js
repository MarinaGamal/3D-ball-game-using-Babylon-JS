///<reference path="babylon.d.ts"/>

document.addEventListener("DOMContentLoaded", loadMenu, false);

//MENU CONSTANTS
var buttonX = [570, 570, 600, 600,100,100,550,550,545,545,540,540,455,455];
var buttonY = [500, 500, 200, 200,500,500,268,268,368,368,468,468,350,350];
var buttonWidth = [204, 235, 146, 169, 158, 180, 279, 320, 286, 332, 285, 331,447,515]; //0 -> about, 1 ->aboutH, 2-> play , 3-> playH, 4->back, 5->backH,6->first,7->firstH,8->second,9->secondH,10->third,11->thirdH 
var buttonHeight = [58, 66, 58, 63, 58, 65, 56, 69, 57, 69, 57, 67,57,67];
var mouseX;
var mouseY;
var menuCanvas;
var context;
var backImage = new Image();
var aboutImage = new Image();
var playImage = new Image();
var logoImage = new Image();
var selectLevelImage = new Image();
var creditsImage = new Image();
var instructionsImage_1 = new Image();
var instructionsImage_2 = new Image();
var instructionsImage_3 = new Image();
var instructionsButtonImage = new Image();
var aboutImage = new Image();
var firstLevelImage = new Image();
var secondLevelImage = new Image();
var thirdLevelImage = new Image();
var insideLevels = false;
var insideMenu = true;
var insideCredits = false;
var insideInstructions = false;
var animation = false;

//COMMON CONSTANTS
var xAxis = new BABYLON.Vector3(1, 0, 0);
var yAxis = new BABYLON.Vector3(0, 1, 0);
var zAxis = new BABYLON.Vector3(0, 0, 1);
var isUpArrowPressed = false;
var isRightArrowPressed = false;
var isLeftArrowPressed = false;
var isDownArrowPressed = false;
var isSpacePressed = false;
var gameSound;
var fallSound;
var score = 0;
var Level = 1;

//LEVEL 1 CONSTANTS
var firstLevel_zPosition = 150;
var firstLevel_currentPosition = 0;
var firstLevel_currentPosition_2 = 150;
var firstLevel_index = 6;
var firstLevel_hasFallen = false;
var firstLevel_hasPlayed = false;
var previousRand = 5;
var ballSpeed = 0.5;
var rotationSpeed = 0.085;
var yellowCylinder = 1;
var redCylinder = 2;
var cyanCylinder = 3;
var blueCylinder = 4;
var skyCylinder = 5;

//LEVEL 2 CONSTANTS
var secondLevel_boxes = [];
var secondLevel_currentPosition = 0;
var secondLevel_zPosition = -180;
var secondLevel_index = 0;
var secondLevel_hasPlayed = false;
var secondLevel_hasFallen = false;
var canJump = true;
var isMoving = false;
var hasRemoved = false;
var hasStarted = false;
var removeTimer = 4500;
var splashSound;
var jumpSound;
var landingSound;

//LEVEL 3 CONSTANTS
var thirdLevel_boxes = [];
var thirdLevel_hasPlayed = false;
var grounds = [];
var thirdLevel_currentPosition = 150;
var thirdLevel_currentPosition_2 = 150;
var groundEnd = -150;
var thirdLevel_index = 0;
var boxArrayStart = 0;
var boxCount = 0;
var count = 1;
var boxesIndex = 0;
var thirdLevel_hasFallen = false;
var thirdLevel_hasCollided = false;
var thirdLevel_ballSpeed = 1.5;
var lastblocks = 0;
var lane1 = 0;
var lane2;
var myblocks;
var diagonalLeftDanger;
var diagonalRightDanger;
var explosionSound;
var particleSystem;

//COMMON FUNCTIONS
document.addEventListener("keydown", function (event) {

    if (event.keyCode == '37') {
        isLeftArrowPressed = true;
    }

    if (event.keyCode == '39') {
        isRightArrowPressed = true;
    }

    if (event.keyCode == '38') {
        isUpArrowPressed = true;
    }

    if (event.keyCode == '40') {
        isDownArrowPressed = true;
    }

    if (event.keyCode == ' '.charCodeAt(0)) {
        isSpacePressed = true;
    }
});

document.addEventListener("keyup", function (event) {
    if (event.keyCode == '37') {
        isLeftArrowPressed = false;
    }

    if (event.keyCode == '39') {
        isRightArrowPressed = false;
    }

    if (event.keyCode == '40') {
        isDownArrowPressed = false;
    }

    if (event.keyCode == '38') {
        isUpArrowPressed = false;
    }

    if (event.keyCode == ' '.charCodeAt(0)) {
        isSpacePressed = false;
    }

});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

//MENU FUNCTIONS
function loseAnimation() {
    var elem = document.getElementById("wasted");
    var pos = 0;
    var pos_right = 570;
    var pos_top = 300;
    var id = setInterval(frame, 3);
    function frame() {
        if (pos == 200) {
            clearInterval(id);
        } else {
            pos++; 
            elem.style.fontSize= pos + 'px';
            elem.style.right =  (pos_right-pos)+'px';
            elem.style.top =  (pos_top-pos)+'px';
        }
    } 
}

function checkPos(mouseEvent) {
    if (mouseEvent.pageX || mouseEvent.pageY == 0) {
        mouseX = mouseEvent.pageX - this.offsetLeft;
        mouseY = mouseEvent.pageY - this.offsetTop;
    }

    else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
        mouseX = mouseEvent.offsetX;
        mouseY = mouseEvent.offsetY;
    }

    for (i = 0; i < buttonX.length; i++) {
        if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i] && mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
            if (i == 0 && insideMenu ) {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i], buttonHeight[i]);
                aboutImage.src = "images/aboutButtonHighlighted.PNG";
                context.drawImage(aboutImage, buttonX[i], buttonY[i]);

            }

            else if (i == 2 && insideMenu) {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i], buttonHeight[i]);
                playImage.src = "images/playButtonHighlighted.PNG";
                context.drawImage(playImage, buttonX[i], buttonY[i]);
            }

            else if (i == 4 && (insideLevels || insideCredits || insideInstructions))
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i], buttonHeight[i]);
                backImage.src = "images/backButtonHighlighted.PNG";
                context.drawImage(backImage, buttonX[i], buttonY[i]);
            }

            else if (i == 6 && insideLevels)
            {
                context.clearRect(buttonX[i],buttonY[i],buttonWidth[i],buttonHeight[i]);
                firstLevelImage.src = "images/firstLevelButtonHighlighted.PNG";
                context.drawImage(firstLevelImage, buttonX[i], buttonY[i]);

            }

            else if (i == 8 && insideLevels)
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i], buttonHeight[i]);
                secondLevelImage.src = "images/secondLevelButtonHighlighted.PNG";
                context.drawImage(secondLevelImage, buttonX[i], buttonY[i]);
            }

            else if (i == 10 && insideLevels)
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i], buttonHeight[i]);
                thirdLevelImage.src = "images/thirdLevelButtonHighlighted.PNG";
                context.drawImage(thirdLevelImage, buttonX[i], buttonY[i]);
            }

            else if (i == 12 && insideMenu)
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i], buttonHeight[i]);
                instructionsButtonImage.src = "images/instructionsButtonHighlighted.PNG";
                context.drawImage(instructionsButtonImage, buttonX[i], buttonY[i]);
            }
        }

        else {
            if (i == 0 && insideMenu) {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i + 1], buttonHeight[i + 1]);
                aboutImage.src = "images/aboutButton.PNG";
                context.drawImage(aboutImage, buttonX[i], buttonY[i]);

            }

            else if (i == 2 && insideMenu) {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i+1], buttonHeight[i+1]);
                playImage.src = "images/playButton.PNG";
                context.drawImage(playImage, buttonX[i], buttonY[i]);
            }

            else if (i == 4 && (insideLevels || insideCredits || insideInstructions))
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i+1], buttonHeight[i+1]);
                backImage.src = "images/backButton.PNG";
                context.drawImage(backImage, buttonX[i], buttonY[i]);
            }

            else if (i == 6 && insideLevels)
            {
                context.clearRect(buttonX[i],buttonY[i],buttonWidth[i+1],buttonHeight[i+1]);
                firstLevelImage.src = "images/firstLevelButton.PNG";
                context.drawImage(firstLevelImage, buttonX[i], buttonY[i]);

            }

            else if (i == 8 && insideLevels)
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i+1], buttonHeight[i+1]);
                secondLevelImage.src = "images/secondLevelButton.PNG";
                context.drawImage(secondLevelImage, buttonX[i], buttonY[i]);
            }

            else if (i == 10 && insideLevels)
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i+1], buttonHeight[i+1]);
                thirdLevelImage.src = "images/thirdLevelButton.PNG";
                context.drawImage(thirdLevelImage, buttonX[i], buttonY[i]);
            }

            else if (i == 12 && insideMenu)
            {
                context.clearRect(buttonX[i], buttonY[i], buttonWidth[i+1], buttonHeight[i+1]);
                instructionsButtonImage.src = "images/instructionsButton.PNG";
                context.drawImage(instructionsButtonImage, buttonX[i], buttonY[i]);
            }
        }
    }
}

function checkClick(mouseEvent) {
    for (i = 0; i < buttonX.length; i++) {
        if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i] && mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
            
            if (i == 0 && insideMenu) {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
                menuCanvas.removeEventListener("mousemove", checkPos);
                menuCanvas.removeEventListener("mouseup", checkClick);
                insideMenu = false;
                insideLevels = false;
                insideInstructions = false;  
                insideCredits = true;
                loadCredits();
            }

            else if (i == 2 && insideMenu) 
            {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
                menuCanvas.removeEventListener("mousemove", checkPos);
                menuCanvas.removeEventListener("mouseup", checkClick);
                insideLevels = true;
                insideMenu = false;
                insideInstructions = false;  
                insideCredits = false;
                loadLevels();
                
            }
            
            else if (i == 4 && (insideCredits || insideLevels || insideInstructions))
            {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
                menuCanvas.removeEventListener("mousemove", checkPos);
                menuCanvas.removeEventListener("mouseup", checkClick);
                insideLevels = false;
                insideCredits = false;
                insideInstructions = false;  
                insideMenu = true;
                loadMenu();
                
            }

            else if (i == 6 && !insideMenu && insideLevels)
            {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
                menuCanvas.removeEventListener("mousemove", checkPos);
                menuCanvas.removeEventListener("mouseup", checkClick);
                insideLevels = false;
                insideCredits = false;
                insideMenu = false;  
                insideInstructions = false;  
                menuCanvas.hidden = true;
                startFirstLevel();                
            }

            else if (i == 8 && insideLevels)
            {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
                menuCanvas.removeEventListener("mousemove", checkPos);
                menuCanvas.removeEventListener("mouseup", checkClick);
                insideLevels = false;
                insideCredits = false;
                insideMenu = false;
                insideInstructions = false;  
                menuCanvas.hidden = true;
                startSecondLevel();
            }

            else if (i == 10 && insideLevels)
            {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
                menuCanvas.removeEventListener("mousemove", checkPos);
                menuCanvas.removeEventListener("mouseup", checkClick);
                insideLevels = false;
                insideCredits = false;
                insideMenu = false;
                insideInstructions = false; 
                menuCanvas.hidden = true;        
                startThirdLevel();  
            }

            else if (i == 12 && insideMenu)
            {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, menuCanvas.width, menuCanvas.height)
                menuCanvas.removeEventListener("mousemove", checkPos);
                menuCanvas.removeEventListener("mouseup", checkClick);
                insideLevels = false;
                insideCredits = false;
                insideMenu = false;
                insideInstructions = true;          
                loadInstructions();
            }
        }
    }
}

function loadMenu() {
    var scorePanel = document.getElementById("score");
    scorePanel.hidden = true;
    var loseMessage = document.getElementById("wasted");
    loseMessage.hidden = true;   
    animation = false;
    menuCanvas = document.getElementById("menuCanvas");
    context = menuCanvas.getContext("2d");
    menuCanvas.addEventListener("mousemove", checkPos);
    menuCanvas.addEventListener("mouseup", checkClick);
    logoImage.src = "images/logo.PNG";
    playImage.src = "images/playButton.PNG";
    aboutImage.src = "images/aboutButton.PNG";
    instructionsButtonImage.src = "images/instructionsButton.PNG";

    logoImage.onload = function (){
        context.drawImage(logoImage, 375, 25);
    }

    playImage.onload = function () {
        context.drawImage(playImage, 600, 200);
    }

    aboutImage.onload = function () {
        context.drawImage(aboutImage, 570, 500);
    }

    instructionsButtonImage.onload = function(){
        context.drawImage(instructionsButtonImage, 455, 350);
    }
}

function loadLevels() {
    menuCanvas.addEventListener("mousemove", checkPos);
    menuCanvas.addEventListener("mouseup", checkClick);

    firstLevelImage.src = "images/firstLevelButton.PNG";
    secondLevelImage.src = "images/secondLevelButton.PNG";
    thirdLevelImage.src = "images/thirdLevelButton.PNG";
    selectLevelImage.src = "images/selectLevelTitle.PNG";
    backImage.src = "images/backButton.PNG";
    selectLevelImage.src = "images/selectLevelTitle.PNG";

    backImage.onload = function () {
        context.drawImage(backImage, 100, 500);
    }

    selectLevelImage.onload = function () {
        context.drawImage(selectLevelImage, 480, 25);
    }

    firstLevelImage.onload = function () {
        context.drawImage(firstLevelImage, 550, 268);
    }

    secondLevelImage.onload = function () {
        context.drawImage(secondLevelImage, 545, 368);
    }

    thirdLevelImage.onload = function () {
        context.drawImage(thirdLevelImage, 540, 468);
    }
}

function loadCredits(){
    menuCanvas.addEventListener("mousemove", checkPos);
    menuCanvas.addEventListener("mouseup", checkClick);
    creditsImage.src = "images/creditsImage.PNG";
    backImage.src = "images/backButton.PNG";

    backImage.onload = function () {
        context.drawImage(backImage, 100, 500);
    }

    creditsImage.onload = function () {
        context.drawImage(creditsImage, 510, 100);
    }
}

function loadInstructions(){
    menuCanvas.addEventListener("mousemove", checkPos);
    menuCanvas.addEventListener("mouseup", checkClick);
    instructionsImage_1.src = "images/miniGame1.PNG";
    instructionsImage_2.src = "images/miniGame2.PNG";
    instructionsImage_3.src = "images/miniGame3.PNG";
    backImage.src = "images/backButton.PNG";

    backImage.onload = function () {
        context.drawImage(backImage, 100, 500);
    }

    instructionsImage_1.onload = function () {
        context.drawImage(instructionsImage_1, 0, 100);
    } 

    instructionsImage_2.onload = function () {
        context.drawImage(instructionsImage_2, 620, 100);
    } 

    instructionsImage_3.onload = function () {
        context.drawImage(instructionsImage_3, 320, 380);
    } 
}
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

//LEVEL 1 FUNCTIONS
function startFirstLevel() {
    var canvas = document.getElementById("renderCanvas");
    canvas.hidden = false;
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), scene);
    light.intensity = 2;
    var light_2 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, -5, 0), scene);
    var skyBox = firstLevel_createSkyBox(scene);
    var cylinderArray = [];
    var cloneCylinders = [];
    loadCylinders(scene, cylinderArray, cloneCylinders);
    var sphere = firstLevel_createBall(scene);
    var camera = new BABYLON.FollowCamera("camera", sphere.position, scene, sphere);
    camera.heightOffset = 5;
    camera.radius = 20;
    camera.rotationOffset = 180;
    camera.attachControl(canvas);
    camera.checkCollisions = true;
    var scorePanel = document.getElementById("score");
    scorePanel.hidden = false;
    scorePanel.innerHTML = "SCORE: " + score;
    firstLevel_loadSounds(scene);

    scene.registerBeforeRender(function(){
        if(firstLevel_hasFallen)
            {
                if(!animation)
                {
                    var loseMessage = document.getElementById("wasted");
                    loseMessage.hidden = false; 
                    loseAnimation();
                    animation = true;
                }

                setTimeout(function(){
                    engine.dispose();
                    insideMenu = true;
                    insideLevels = false;
                    insideInstructions = false;  
                    insideCredits = false;
                    firstLevel_reIntialize();
                    window.location.reload();                 
                },5000);
            }});
                
    engine.runRenderLoop(function () {
        scene.render();
        emitSphereRay(sphere, scene, camera,engine);
        moveBall(sphere, firstLevel_hasFallen);
        moveCylinders(cloneCylinders);
        firstLevel_createInfiniteScene(cylinderArray, sphere.position.z, cloneCylinders, scene, scorePanel);
        deleteCylinder(cloneCylinders, sphere.position.z);
    });
}

function firstLevel_createSkyBox(scene) {
    var hdrTexture = new BABYLON.CubeTexture("skybox/nebula", scene);
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.cameraExposure = 0.6;
    hdrSkyboxMaterial.cameraContrast = 1.6;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
    hdrSkybox.isPickable = false;
    return hdrSkybox;
}

function addCylinder(originalArray, cloneArray, scene) {
    var rand = getRandomInt(0, 5);
    while (rand == 0 || rand == previousRand) {
        rand = getRandomInt(0, 5);
    }

    previousRand = rand;
    var randomAngle;
    var cylinderClone = originalArray[rand].clone(originalArray[rand].name);
    cylinderClone.position = new BABYLON.Vector3(0, 0, firstLevel_zPosition);
    var previousCylinder = cloneArray[cloneArray.length - 1];
    var previousAngle = previousCylinder.angle;
    var previousName = previousCylinder.name;
    cylinderClone.rotation.y += previousAngle;
    cylinderClone.angle = previousAngle;
    if (previousName == "yellowCylinder") {
        if (rand == redCylinder || rand == cyanCylinder) {
            randomAngle = getRandomFloat(-0.9599310886, 0.9599310886);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == blueCylinder) {
            randomAngle = getRandomFloat(-1.8325957146, 1.8325957146);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == skyCylinder) {
            randomAngle = getRandomFloat(-1.2217304764, 1.2217304764);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

    }


    else if (previousName == "redCylinder") {
        if (rand == yellowCylinder) {
            randomAngle = getRandomFloat(-0.9599310886, 0.9599310886);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == cyanCylinder) {
            randomAngle = getRandomFloat(-1.1344640138, 1.1344640138);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == blueCylinder) {
            randomAngle = getRandomFloat(-1.9198621772, 1.9198621772);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == skyCylinder) {
            randomAngle = getRandomFloat(-1.3962634016, 1.3962634016);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }
    }


    else if (previousName == "cyanCylinder") {
        if (rand == yellowCylinder) {
            randomAngle = getRandomFloat(-0.872664626, 0.872664626);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == redCylinder) {
            randomAngle = getRandomFloat(-1.1344640138, 1.1344640138);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == blueCylinder) {
            randomAngle = getRandomFloat(-1.9198621772, 1.9198621772);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == skyCylinder) {
            randomAngle = getRandomFloat(-1.3962634016, 1.3962634016);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }
    }


    else if (previousName == "blueCylinder") {
        if (rand == yellowCylinder) {
            randomAngle = getRandomFloat(-1.745329252, 1.745329252);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == redCylinder || rand == cyanCylinder) {
            randomAngle = getRandomFloat(-2.0071286398, 2.0071286398);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == skyCylinder) {
            randomAngle = getRandomFloat(-2.181661565, 2.181661565);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }
    }

    else if (previousName == "skyCylinder") {
        if (rand == yellowCylinder) {
            randomAngle = getRandomFloat(-0.872664626, 0.872664626);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == redCylinder || rand == cyanCylinder) {
            randomAngle = getRandomFloat(-1.6580627894, 1.6580627894);
            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }

        else if (rand == blueCylinder) {
            randomAngle = getRandomFloat(-1.3962634016, 1.3962634016);

            cylinderClone.rotation.y += randomAngle;
            cylinderClone.angle += randomAngle;
        }
    }

    firstLevel_zPosition += 25;
    cloneArray.push(cylinderClone);
}

function deleteCylinder(cloneArray, num) {
    if (num >= firstLevel_currentPosition_2 + 50 && num <= firstLevel_currentPosition_2 + 55) {
        cloneArray[firstLevel_index].dispose();
        firstLevel_currentPosition_2 += 50;
        firstLevel_index += 1;
    }
}

function firstLevel_createInfiniteScene(cylinderArray, num, cloneCylinders, scene, scorePanel) {
    if (num >= firstLevel_currentPosition + 24.9 && num <= firstLevel_currentPosition + 27) {
        addCylinder(cylinderArray, cloneCylinders, scene);
        firstLevel_currentPosition += 25;
        score += 1;
        if(score == 50*Level)
        {
            ballSpeed += 0.15;
            Level++;
        }
        scorePanel.innerHTML = "SCORE: " + score;
    }
}

function moveCylinders(cloneCylinders) {
    if (isLeftArrowPressed)
        for (var i = 6; i < cloneCylinders.length; i++) {
            cloneCylinders[i].rotation.y += rotationSpeed;
            cloneCylinders[i].angle += rotationSpeed;
        }


    if (isRightArrowPressed)
        for (var i = 6; i < cloneCylinders.length; i++) {
            cloneCylinders[i].rotation.y -= rotationSpeed;
            cloneCylinders[i].angle -= rotationSpeed;
        }

}

function emitSphereRay(sphere, scene, camera) {
    var origin = sphere.position;
    var direction = new BABYLON.Vector3(0, -1, 0);
    var ray = new BABYLON.Ray(origin, direction, 1000);
    setTimeout(function () {
        var pickResult = scene.pickWithRay(ray);
        if (pickResult.pickedMesh)
            return;

        else {
            firstLevel_hasFallen = true;
            setTimeout(function () {
                camera.lockedTarget = null;
            }, 1000);
        }
    }, 3000);
}

function moveBall(sphere, hasFallen) {
    if (firstLevel_hasFallen) {
        sphere.position.y -= 1;
        sphere.rotation.x += 0.2;
        if (!firstLevel_hasPlayed) {
            gameSound.stop();
            fallSound.play();
            firstLevel_hasPlayed = true;
        }
    }


    else {
        sphere.moveWithCollisions(new BABYLON.Vector3(0, 0, ballSpeed));
        sphere.rotation.x += 0.2;
    }
}

function firstLevel_createBall(scene) {
    var ball = BABYLON.Mesh.CreateSphere("sphere", 30, 1.5, scene, false);
    var ballMaterial = new BABYLON.StandardMaterial("material", scene);
    ballMaterial.diffuseTexture = new BABYLON.Texture("images/earth.jpg", scene);
    ball.material = ballMaterial;
    ball.position.y -= 8;
    ball.position.z -= 9;
    ball.ellipsoid = new BABYLON.Vector3(1, 1.5, 1);
    ball.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0);
    ball.isPickable = false;
    ball.checkCollisions = true;
    return ball;
}

function loadCylinders(scene, array, cloneArray) {
    var assetsManager = new BABYLON.AssetsManager(scene);
    var meshTask_1 = assetsManager.addMeshTask("cylinder_5", "", "models/", "cylinder5.babylon");
    var meshTask_2 = assetsManager.addMeshTask("cylinder_7", "", "models/", "cylinder7.babylon");
    var meshTask_3 = assetsManager.addMeshTask("cylinder_3", "", "models/", "cylinder3.babylon");
    var meshTask_4 = assetsManager.addMeshTask("cylinder_8", "", "models/", "cylinder8.babylon");
    var meshTask_5 = assetsManager.addMeshTask("cylinder_1", "", "models/", "cylinder1.babylon");
    var meshTask_6 = assetsManager.addMeshTask("cylinder_6", "", "models/", "cylinder6.babylon");

    meshTask_1.onSuccess = function (task) {
        var c = task.loadedMeshes[0];
        c.name = "pinkCylinder";
        c.checkCollisions = true;
        c.scaling.x = 5;
        c.scaling.y = 5;
        c.scaling.z = 5;
        c.rotate(xAxis, Math.PI / 2);
        c.angle = 0;
        array.push(c);
        cloneArray.push(c);
        c.position = new BABYLON.Vector3(0, 0, 0);

    }

    meshTask_2.onSuccess = function (task) {
        var c = task.loadedMeshes[0];
        c.name = "yellowCylinder";
        c.scaling.x = 5;
        c.scaling.y = 5;
        c.scaling.z = 5;
        c.checkCollisions = true;
        c.rotate(xAxis, Math.PI / 2);
        c.rotate(yAxis, -1.2777777778 * Math.PI);
        c.angle = 0;
        array.push(c);
        cloneArray.push(c);
        c.position = new BABYLON.Vector3(0, 0, 25);
    }

    meshTask_3.onSuccess = function (task) {
        var c = task.loadedMeshes[0];
        c.name = "redCylinder";
        c.scaling.x = 5;
        c.scaling.y = 5;
        c.scaling.z = 5;
        c.checkCollisions = true;
        c.rotate(xAxis, Math.PI / 2);
        c.rotate(yAxis, -0.75 * Math.PI);
        c.angle = 0;
        array.push(c);
        cloneArray.push(c);
        c.position = new BABYLON.Vector3(0, 0, 50);
    }

    meshTask_4.onSuccess = function (task) {
        var c = task.loadedMeshes[0];
        c.name = "cyanCylinder";
        c.scaling.x = 5;
        c.scaling.y = 5;
        c.scaling.z = 5;
        c.checkCollisions = true;
        c.rotate(xAxis, Math.PI / 2);
        c.rotate(yAxis, -1.19444444442 * Math.PI);
        c.angle = 0;
        array.push(c);
        cloneArray.push(c);
        c.position = new BABYLON.Vector3(0, 0, 75);
    }

    meshTask_5.onSuccess = function (task) {
        var c = task.loadedMeshes[0];
        c.name = "blueCylinder";
        c.scaling.x = 5;
        c.scaling.y = 5;
        c.scaling.z = 5;
        c.checkCollisions = true;
        c.rotate(xAxis, Math.PI / 2);
        c.rotate(yAxis, Math.PI);
        c.angle = 0;
        array.push(c);
        cloneArray.push(c);
        c.position = new BABYLON.Vector3(0, 0, 100);

    }

    meshTask_6.onSuccess = function (task) {
        var c = task.loadedMeshes[0];
        c.name = "skyCylinder";
        c.scaling.x = 5;
        c.scaling.y = 5;
        c.scaling.z = 5;
        c.checkCollisions = true;
        c.rotate(xAxis, Math.PI / 2);
        c.rotate(yAxis, -1.1388888889 * Math.PI);
        c.angle = 0;
        array.push(c);
        cloneArray.push(c);
        c.position = new BABYLON.Vector3(0, 0, 125);
    }

    assetsManager.useDefaultLoadingScreen = true;
    assetsManager.load();
}

function firstLevel_loadSounds(scene) {
    var assetsManager = new BABYLON.AssetsManager(scene);
    var task_1 = assetsManager.addBinaryFileTask("gameSound", "sounds/Pirates of the Caribbean - He's a Pirate (DJ AG Remix).mp3");
    var task_2 = assetsManager.addBinaryFileTask("fallSound", "sounds/fallSound.mp3");

    task_1.onSuccess = function (task) {
        gameSound = new BABYLON.Sound("gameSound", task.data, scene, null, { loop: true, autoplay: true });
    }

    task_2.onSuccess = function (task) {
        fallSound = new BABYLON.Sound("fallSound", task.data, scene, null, { loop: false });
    }

    assetsManager.load();
}

function firstLevel_reIntialize()
{
    firstLevel_zPosition = 150;
    firstLevel_currentPosition = 0;
    firstLevel_currentPosition_2 = 150;
    firstLevel_index = 6;
    firstLevel_hasFallen = false;
    previousRand = 5;
    ballSpeed = 0.5;
    score = 0;
    Level = 1;
    isUpArrowPressed = false;
    isRightArrowPressed = false;
    isLeftArrowPressed = false;
    isDownArrowPressed = false;
    isSpacePressed = false;
    firstLevel_hasPlayed = false;
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

//LEVEL 2 FUNCTIONS
function startSecondLevel() {
    menuCanvas.hidden = true;
    var canvas = document.getElementById("renderCanvas");
    canvas.hidden = false;
    var engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), scene);
    light.intensity = 2;
    var light_2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, -5, 0), scene);
    var skyBox = secondLevel_createSkyBox(scene);
    var ball = secondLevel_createBall(scene);
    var box = secondLevel_createBox(0, 0, scene);
    var box_2 = secondLevel_createBox(0, -60, scene);
    var box_3 = secondLevel_createBox(0, -120, scene);
    var camera = secondLevel_createFollowCamera(scene, ball);
    var scorePanel = document.getElementById("score");
    scorePanel.hidden = false;
    scorePanel.innerHTML = "SCORE: " + score;
    secondLevel_boxes.push(box);
    secondLevel_boxes.push(box_2);
    secondLevel_boxes.push(box_3);
    secondLevel_loadSounds(scene);

    scene.registerBeforeRender(function(){
        if(secondLevel_hasFallen)
            {
                if(!animation)
                {
                    var loseMessage = document.getElementById("wasted");
                    loseMessage.hidden = false; 
                    loseAnimation();
                    animation = true;
                }

                setTimeout(function(){
                    engine.dispose();
                    insideMenu = true;
                    insideLevels = false;
                    insideInstructions = false;  
                    insideCredits = false;
                    secondLevel_reIntialize();
                    window.location.reload();
                },8500);
            }});       

    engine.runRenderLoop(function () {
        scene.render();
        secondLevel_applyBallMovement(ball, scorePanel);
        secondLevel_createInfiniteScene(secondLevel_boxes, ball.position.z, scene, ball);
        deleteBoxes(secondLevel_boxes, ball.position.z);
    });
}

function secondLevel_createSkyBox(scene) {
    var hdrTexture = new BABYLON.CubeTexture("skybox/TropicalSunnyDay", scene);
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.cameraExposure = 0.6;
    hdrSkyboxMaterial.cameraContrast = 1.6;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
    hdrSkybox.isPickable = false;
    return hdrSkybox;
}

function secondLevel_createBall(scene) {
    var ball = BABYLON.Mesh.CreateSphere("sphere1", 300, 4, scene);
    ball.position = new BABYLON.Vector3(0, 12, 0);
    var ballMaterial = new BABYLON.StandardMaterial("ballMat", scene);
    ballMaterial.diffuseTexture = new BABYLON.Texture("images/4.png", scene);
    ball.material = ballMaterial;
    ball.checkCollisions = true;
    ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 }, scene);
    ball.zPosition = 0;
    ball.forwardVelocity = 0;
    return ball;
}

function secondLevel_applyBallMovement(ball, scorePanel) {
    if (isUpArrowPressed && canJump) {
        ball.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(-3, 0, 0));
        ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, -5));
        ball.forwardVelocity = 5;
    }


    if (isDownArrowPressed && canJump) {
        ball.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(3, 0, 0));
        ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 5));
        ball.forwardVelocity = -5;
    }


    if (isLeftArrowPressed && canJump) {
        ball.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, -3));
        ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(5, 0, 0));
    }


    if (isRightArrowPressed && canJump) {
        ball.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 3));
        ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(-5, 0, 0));
    }


    if (isSpacePressed && canJump) {
        ball.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 20, -15 + ball.forwardVelocity), ball.position);
        ball.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(-3, 0, 0));
        ball.forwardVelocity = 0;
        canJump = false;
        hasStarted = true;
        jumpSound.play();
    }

    if (isMoving && !canJump && ball.position.y >= 11.95 && ball.position.y <= 12 && ball.position.z < ball.zPosition) {
        ball.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
        ball.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0));
        isMoving = false;
        canJump = true;
        ball.zPosition = ball.position.z - 0.475;
        ball.position.z -= 0.475;
        score += 1;
        scorePanel.innerHTML = "SCORE: " + score;
        if (score == 15*Level)
        {
            removeTimer -= 500;
            Level++;
        }

        landingSound.play();
    }

    if (ball.position.y >= 11.95 && ball.position.y <= 12)
        isMoving = true;

    if (ball.position.y < 10) {
        if (!secondLevel_hasPlayed) {
            fallSound.play();
            gameSound.stop();
            secondLevel_hasPlayed = true;
            secondLevel_hasFallen = true;
            setTimeout(function () {
                splashSound.play();
                ball.isVisible = false;
            }, 4500);
        }

    }
}

function secondLevel_createBox(xPosition, zPosition, scene) {
    var box = BABYLON.Mesh.CreateBox("staticBox", 20, scene);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.0 }, scene);
    box.position = new BABYLON.Vector3(xPosition, 0, zPosition);
    box.diffuseColor = new BABYLON.Color3(0, 0, 0);
    var boxmat = new BABYLON.StandardMaterial("M1", scene);
    boxmat.diffuseColor = new BABYLON.Color3.White;
    boxmat.ambientColor = new BABYLON.Color3.Red;
    boxmat.diffuseTexture = new BABYLON.Texture("images/9452.jpg", scene);
    box.material = boxmat;
    box.checkCollisions = true;
    return box;
}

function secondLevel_createMovingBox_X(xPosition, zPosition, scene, ball) {
    var box = BABYLON.Mesh.CreateBox("movingBox_X", 20, scene);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0.0 }, scene);
    box.position = new BABYLON.Vector3(xPosition, 0, zPosition);
    box.diffuseColor = new BABYLON.Color3(0, 0, 0);
    var boxmat = new BABYLON.StandardMaterial("M1", scene);
    boxmat.diffuseColor = new BABYLON.Color3.White;
    boxmat.ambientColor = new BABYLON.Color3.Red;
    boxmat.diffuseTexture = new BABYLON.Texture("images/9452.jpg", scene);
    box.material = boxmat;
    box.checkCollisions = true;
    var animationBox = new BABYLON.Animation("tutoAnimation", "position.x", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
    keys.push({
        frame: 0,
        value: 0
    });

    keys.push({
        frame: 10,
        value: 15
    });

    keys.push({
        frame: 20,
        value: 30
    });

    keys.push({
        frame: 30,
        value: 15
    });

    keys.push({
        frame: 40,
        value: 0
    });

    keys.push({
        frame: 50,
        value: -15
    });

    keys.push({
        frame: 60,
        value: -30
    });

    keys.push({
        frame: 70,
        value: -15
    });

    keys.push({
        frame: 80,
        value: 0
    });


    animationBox.setKeys(keys);
    box.animations.push(animationBox);
    var animation = scene.beginAnimation(box, 0, 80, true);
    ball.physicsImpostor.registerOnPhysicsCollide(box.physicsImpostor, function (main, collided) {
        animation.stop();
    });
    return box;
}

function secondLevel_createMovingBox_Y(xPosition, zPosition, scene, ball) {
    var box = BABYLON.Mesh.CreateBox("movingBox_Y", 20, scene);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0.0 }, scene);
    box.position = new BABYLON.Vector3(xPosition, 0, zPosition);
    box.diffuseColor = new BABYLON.Color3(0, 0, 0);
    var boxmat = new BABYLON.StandardMaterial("M1", scene);
    boxmat.diffuseColor = new BABYLON.Color3.White;
    boxmat.ambientColor = new BABYLON.Color3.Red;
    boxmat.diffuseTexture = new BABYLON.Texture("images/9452.jpg", scene);
    box.material = boxmat;
    box.checkCollisions = true;
    var animationBox = new BABYLON.Animation("tutoAnimation", "position.y", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
    keys.push({
        frame: 0,
        value: 10
    });

    keys.push({
        frame: 10,
        value: 25
    });

    keys.push({
        frame: 20,
        value: 40
    });

    keys.push({
        frame: 30,
        value: 25
    });

    keys.push({
        frame: 40,
        value: 10
    });

    keys.push({
        frame: 50,
        value: -5
    });

    keys.push({
        frame: 60,
        value: -20
    });

    keys.push({
        frame: 70,
        value: -5
    });

    keys.push({
        frame: 80,
        value: 10
    });

    animationBox.setKeys(keys);
    box.animations.push(animationBox);
    var animation = scene.beginAnimation(box, 0, 80, true);
    ball.physicsImpostor.registerOnPhysicsCollide(box.physicsImpostor, function (main, collided) {
        animation.stop();
    });
    return box;
}

function secondLevel_createMovingBox_Z(xPosition, zPosition, scene, ball) {
    var box = BABYLON.Mesh.CreateBox("movingBox_Z", 20, scene);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0.0 }, scene);
    box.position = new BABYLON.Vector3(xPosition, 0, zPosition);
    box.diffuseColor = new BABYLON.Color3(0, 0, 0);
    var boxmat = new BABYLON.StandardMaterial("M1", scene);
    boxmat.diffuseColor = new BABYLON.Color3.White;
    boxmat.ambientColor = new BABYLON.Color3.Red;
    boxmat.diffuseTexture = new BABYLON.Texture("images/9452.jpg", scene);
    box.material = boxmat;
    box.checkCollisions = true;
    var animationBox = new BABYLON.Animation("tutoAnimation", "position.z", 10, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
    keys.push({
        frame: 0,
        value: zPosition
    });

    keys.push({
        frame: 10,
        value: zPosition - 5
    });

    keys.push({
        frame: 20,
        value: zPosition - 10
    });

    keys.push({
        frame: 30,
        value: zPosition - 15
    });

    keys.push({
        frame: 40,
        value: zPosition
    });

    keys.push({
        frame: 50,
        value: zPosition + 5
    });

    keys.push({
        frame: 60,
        value: zPosition + 10
    });

    keys.push({
        frame: 70,
        value: zPosition + 15
    });

    keys.push({
        frame: 80,
        value: zPosition
    });

    animationBox.setKeys(keys);
    box.animations.push(animationBox);
    var animation = scene.beginAnimation(box, 0, 80, true);
    ball.physicsImpostor.registerOnPhysicsCollide(box.physicsImpostor, function (main, collided) {
        animation.stop();
    });
    return box;
}

function secondLevel_createHidingBox(xPosition, zPosition, scene, ball) {
    var box = BABYLON.Mesh.CreateBox("movingBox_Z", 20, scene);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0.0 }, scene);
    box.position = new BABYLON.Vector3(xPosition, 0, zPosition);
    box.diffuseColor = new BABYLON.Color3(0, 0, 0);
    var boxmat = new BABYLON.StandardMaterial("M1", scene);
    boxmat.diffuseColor = new BABYLON.Color3.White;
    boxmat.ambientColor = new BABYLON.Color3.Red;
    boxmat.diffuseTexture = new BABYLON.Texture("images/9452.jpg", scene);
    box.material = boxmat;
    box.checkCollisions = true;
    var animationBox = new BABYLON.Animation("tutoAnimation", "material.alpha", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
    keys.push({
        frame: 0,
        value: 1
    });

    keys.push({
        frame: 10,
        value: 1
    });

    keys.push({
        frame: 20,
        value: 1
    });

    keys.push({
        frame: 30,
        value: 1
    });

    keys.push({
        frame: 40,
        value: 1
    });

    keys.push({
        frame: 41,
        value: 0
    });

    keys.push({
        frame: 60,
        value: 0
    });

    keys.push({
        frame: 70,
        value: 0
    });

    keys.push({
        frame: 80,
        value: 0
    });

    animationBox.setKeys(keys);
    box.animations.push(animationBox);
    var animation = scene.beginAnimation(box, 0, 80, true);
    ball.physicsImpostor.registerOnPhysicsCollide(box.physicsImpostor, function (main, collided) {
        if (box.material.alpha == 0)
            setTimeout(function () {
                box.dispose();
            });

        else
            animation.stop();
    });
    return box;
}

function secondLevel_createInfiniteScene(boxes, num, scene, ball) {
    if (num <= secondLevel_currentPosition - 5 && num >= secondLevel_currentPosition - 10) {
        var rand = getRandomInt(secondLevel_zPosition - 5, secondLevel_zPosition + 10);
        var rand_2 = getRandomInt(0, 3);
        var box;
        if (rand_2 == 0)
            box = secondLevel_createBox(0, rand, scene);

        else if (rand_2 == 1)
            box = secondLevel_createMovingBox_X(0, rand, scene, ball);

        else if (rand_2 == 2)
            box = secondLevel_createMovingBox_Z(0, rand, scene, ball);

        else if (rand_2 == 3)
            box = secondLevel_createHidingBox(0, rand, scene, ball)

        secondLevel_currentPosition -= 20;
        secondLevel_zPosition -= 60;
        secondLevel_boxes.push(box);
    }
}

function deleteBoxes(boxes, num) {
    if (!hasRemoved && hasStarted) {
        hasRemoved = true;
        setTimeout(function () {
            secondLevel_boxes[secondLevel_index].dispose();
            secondLevel_index += 1;
            hasRemoved = false;
        }, removeTimer);
    }
}

function secondLevel_createFollowCamera(scene, ball) {
    var followObject = BABYLON.Mesh.CreateBox("followObject", 0.001, scene);
    followObject.position = ball.position;
    var camera = new BABYLON.FollowCamera("camera", ball.position, scene, followObject);
    camera.heightOffset = 20;
    camera.radius = 40;
    camera.rotationOffset = 0;
    camera.checkCollisions = true;
    return camera;
}

function secondLevel_loadSounds(scene) {
    var assetsManager = new BABYLON.AssetsManager(scene);
    var task_1 = assetsManager.addBinaryFileTask("landingSound", "sounds/landingSound.wav");
    var task_2 = assetsManager.addBinaryFileTask("jumpSound", "sounds/jumpSound.wav");
    var task_3 = assetsManager.addBinaryFileTask("gameSound", "sounds/LostWoods.mp3");
    var task_4 = assetsManager.addBinaryFileTask("fallSound", "sounds/fallSound.mp3");
    var task_5 = assetsManager.addBinaryFileTask("splashSound", "sounds/splashSound.mp3");

    task_1.onSuccess = function (task) {
        landingSound = new BABYLON.Sound("landingSound", task.data, scene, null, { loop: false });
    }

    task_2.onSuccess = function (task) {
        jumpSound = new BABYLON.Sound("jumpSound", task.data, scene, null, { loop: false });
    }

    task_3.onSuccess = function (task) {
        gameSound = new BABYLON.Sound("gameSound", task.data, scene, null, { loop: true, autoplay: true });
    }

    task_4.onSuccess = function (task) {
        fallSound = new BABYLON.Sound("fallSound", task.data, scene, null, { loop: false });
    }

    task_5.onSuccess = function (task) {
        splashSound = new BABYLON.Sound("splashSound", task.data, scene, null, { loop: false });
    }

    assetsManager.load();
}

function secondLevel_reIntialize()
{
    secondLevel_boxes = [];
    secondLevel_currentPosition = 0;
    secondLevel_zPosition = -180;
    secondLevel_index = 0;
    canJump = true;
    isMoving = false;
    hasRemoved = false;
    hasStarted = false;
    removeTimer = 4500;
    score = 0;
    Level = 1;
    isUpArrowPressed = false;
    isRightArrowPressed = false;
    isLeftArrowPressed = false;
    isDownArrowPressed = false;
    isSpacePressed = false;
    secondLevel_hasPlayed = false;
    secondLevel_hasFallen = false;
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

//LEVEL 3 FUNCTIONS
function startThirdLevel() 
{
	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);
	var scene = new BABYLON.Scene(engine);
	var light_1 = new BABYLON.HemisphericLight("L1", new BABYLON.Vector3(0, 5, 0), scene);

	var ground = createGround(groundEnd+150);
	grounds.push(ground);
	var ground2 = createSmallGround();
	var ball = thirdLevel_createBall(scene);
	var skyBox = thirdLevel_createSkyBox(scene);

    var camera = thirdLevel_createFollowCamera(scene,ball);
	scene.activeCamera = camera;
	camera.attachControl(canvas);
	var scorePanel = document.getElementById("score");
    scorePanel.hidden = false;
    scorePanel.innerHTML = "SCORE: " + score;
    loadBoxes(5, scene, groundEnd-30); 

	thirdLevel_loadSounds(scene);

    scene.registerBeforeRender(function(){
        if(thirdLevel_hasFallen)
            {
                if(!animation)
                {
                    var loseMessage = document.getElementById("wasted");
                    loseMessage.hidden = false; 
                    loseAnimation();
                    animation = true;
                }

                setTimeout(function(){
                    engine.dispose();
                    insideMenu = true;
                    insideLevels = false;
                    insideInstructions = false;  
                    insideCredits = false;
                    thirdLevel_reIntialize();
                    window.location.reload();                 
                },8500);    
            }

        if(thirdLevel_hasCollided)
            {
                if(!animation)
                {
                    var loseMessage = document.getElementById("wasted");
                    loseMessage.hidden = false; 
                    loseAnimation();
                    animation = true;
                }
    
                setTimeout(function(){
                    engine.dispose();
                    insideMenu = true;
                    insideLevels = false;
                    insideInstructions = false;  
                    insideCredits = false;
                    thirdLevel_reIntialize();
                    window.location.reload();                 
                },6000);
            }
        });

            

	engine.runRenderLoop(function () 
	{
		scene.render();
		thirdLevel_applyBallMovement(ball,scene);
		thirdLevel_emitSphereRay(ball,scene,camera);
		thirdLevel_createInfiniteScene(ball.position.z, scene,ball,scorePanel);
		deleteGround(ball.position.z);
	});
}

function thirdLevel_loadSounds(scene)
{
	var assetsManager = new BABYLON.AssetsManager(scene);
	var task_1 =  assetsManager.addBinaryFileTask("gameSound","sounds/DestroyerOfWorlds2.mp3");
	var task_2 =  assetsManager.addBinaryFileTask("fallSound","sounds/fallingBombSound.mp3");
	var task_3 =  assetsManager.addBinaryFileTask("explosionSound","sounds/bombSound.mp3");

	task_1.onSuccess = function(task)
	{
		gameSound = new BABYLON.Sound("gameSound", task.data, scene, null, { loop: true , autoplay:true });
	}

	task_2.onSuccess = function(task)
	{
		fallSound = new BABYLON.Sound("fallSound", task.data, scene, null, { loop: false });
	}

	task_3.onSuccess = function(task)
	{
		explosionSound = new BABYLON.Sound("explosionSound", task.data, scene, null, { loop: false });
	}

	assetsManager.useDefaultLoadingScreen = true;
    assetsManager.load();
}

function thirdLevel_createSkyBox(scene)
{
	var hdrTexture = new BABYLON.CubeTexture("skybox/darkskies", scene);
	var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
	var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
	hdrSkyboxMaterial.backFaceCulling = false;
	hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
	hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	hdrSkyboxMaterial.microSurface = 1.0;
	hdrSkyboxMaterial.cameraExposure = 0.6;
	hdrSkyboxMaterial.cameraContrast = 1.6;
	hdrSkyboxMaterial.disableLighting = true;
	hdrSkybox.material = hdrSkyboxMaterial;
	hdrSkybox.infiniteDistance = true;
	hdrSkybox.isPickable = false;
	return hdrSkybox;
}

function createGround(zPosition,scene) 
{
	var ground = BABYLON.Mesh.CreateGround("ground1", 60, 300, 200, scene);
	var groundMaterial = new BABYLON.StandardMaterial("M1", scene);
	groundMaterial.diffuseColor = new BABYLON.Color3.White;
	groundMaterial.ambientColor = new BABYLON.Color3.Red;
	groundMaterial.diffuseTexture = new BABYLON.Texture("images/floor.jpg", scene);
	ground.material = groundMaterial;
	ground.position.z = zPosition;
	return ground;
}

function createSmallGround(zPosition,scene) 
{
	var ground = BABYLON.Mesh.CreateGround("ground1", 10, 30, 10, scene);
	var groundMaterial = new BABYLON.StandardMaterial("M1", scene);
	groundMaterial.diffuseColor = new BABYLON.Color3.White;
	groundMaterial.ambientColor = new BABYLON.Color3.Red;
	groundMaterial.diffuseTexture = new BABYLON.Texture("images/floor.jpg", scene);
	ground.material = groundMaterial;
	var xPosition = getRandomInt(-10,25);
	ground.position.x = xPosition;
	ground.position.z = zPosition;
	return ground;
}

function thirdLevel_emitSphereRay(sphere, scene, camera) {
    var origin = sphere.position;
    var direction = new BABYLON.Vector3(0, -1, 0);
    var ray = new BABYLON.Ray(origin, direction, 1000);
    var pickResult = scene.pickWithRay(ray);
    if (pickResult.pickedMesh)
        return;

    else 
	{
        thirdLevel_hasFallen = true;
        setTimeout(function () {
            camera.lockedTarget = null;
        }, 3000);
    }
}

function thirdLevel_createFollowCamera(scene,ball)
{
	var camera = new BABYLON.FollowCamera("follow", ball.position, scene);
	camera.lockedTarget = ball;
	camera.radius = 60;
	camera.heightOffset = 40; 
	camera.rotationOffset = 0; 
	camera.cameraAcceleration = 0.05;
	camera.maxCameraSpeed = 20;
	scene.activeCamera = camera;
	return camera;
}

function thirdLevel_createBall(scene)
{
    var ball = BABYLON.Mesh.CreateSphere("sphere1", 16, 4, scene);
	var ballMaterial = new BABYLON.StandardMaterial("ballMat", scene);
	ballMaterial.diffuseTexture = new BABYLON.Texture("images/nuclear.jpg", scene);
	ball.material = ballMaterial;
	ball.position.z = 120;
	ball.position.y = 2;
	ball.checkCollisions = true;
	ball.isPickable = false;
	ball.previousPosition = ball.position.z;
	return ball;
}

function thirdLevel_applyBallMovement(ball,scene) 
{
	if(ball.previousPosition < ball.position.z)
	{
		thirdLevel_hasCollided = true;
		
		if(!thirdLevel_hasPlayed)
		{
            gameSound.stop();
            Explosion(ball,scene);
            ball.dispose();
			explosionSound.play();
            thirdLevel_hasPlayed = true;
		}
	}

	if(thirdLevel_hasFallen)
	{
		ball.position.y -= 1;	
		ball.rotation.x -= 0.2;
		if(!thirdLevel_hasPlayed)
		{
			gameSound.stop();
			fallSound.play();
            thirdLevel_hasPlayed = true;
            setTimeout(function(){
                Explosion(ball,scene);
                ball.dispose();
            },4000);
		}
	}
		
	else if(thirdLevel_hasCollided)
		return;

	else
	{
		ball.moveWithCollisions(new BABYLON.Vector3(0, 0, -thirdLevel_ballSpeed));
		ball.previousPosition -= thirdLevel_ballSpeed;
		ball.rotation.x -= 0.2;
		if (isLeftArrowPressed)
		{
			ball.moveWithCollisions(new BABYLON.Vector3(1, 0, 0));
			ball.rotation.z -= 0.2;			
		}
			
		if (isRightArrowPressed)
		{
			ball.moveWithCollisions(new BABYLON.Vector3(-1, 0, 0));
			ball.rotation.z += 0.2;
		}
			
	}
}

function thirdLevel_createBox(xPosition,zPosition,scene) 
{
	var box = BABYLON.Mesh.CreateBox("box", 20, scene);
	box.position = new BABYLON.Vector3(xPosition,10,zPosition);
	box.diffuseColor = new BABYLON.Color3(0, 0, 0);
	var boxmat = new BABYLON.StandardMaterial("M1", scene);
	boxmat.diffuseColor = new BABYLON.Color3.White;
	boxmat.ambientColor = new BABYLON.Color3.Red;
	boxmat.diffuseTexture = new BABYLON.Texture("images/steel.jpg", scene);
	box.material = boxmat;
	box.checkCollisions = true;
	box.isPickable = false;
	return box;
}

function makeBox(x,z,scene)
{
    var rand = getRandomInt(0, 9);
    var box;
    if (rand == 0)
        box = thirdLevel_createMovingBox_Y(x, z, scene);

    else if (rand == 1)
        box = thirdLevel_createHidingBox(x, z, scene);

    else
        box = thirdLevel_createBox(x,z,scene);
		
    box.position.y = 5;
    box.scaling.y = 0.5;
	thirdLevel_boxes.push(box);
    return box;
}

function loadBoxes(rows, scene,groundEnd)
{
	boxCount = 0;
    for (var i = 0; i < rows; i++) {
        if (lastblocks == 2) {
            myblocks = 1;

            if ((lane1 == 0 && lane2 == 1) || (lane2 == 0 && lane1 == 1))
                lane1 = 0;
            else if ((lane1 == 1 && lane2 == 2) || (lane2 == 1 && lane1 == 2)) {
                lane1 = 2;
                
            }
            else if ((lane1 == 0 && lane2 == 2) || (lane2 == 0 && lane1 == 2))
                lane1 = (Math.floor(Math.random() * 2)) * 2;

            var mybox = makeBox((lane1 - 1) * 20, (groundEnd + 30) + (25 * i),scene);
            boxCount++;
            //if (diagonalLeftDanger && (lane1 != 1 && lane2 != 1)) diagonalLeftDanger = false;

          //  if (diagonalRightDanger && (lane1 != 1 && lane2 != 1)) diagonalRightDanger = false;
            
        }
        else {
            
                myblocks = 2;
        
                var mybox = makeBox((lane1 - 1) * 20, (groundEnd + 30) + (25 * i), scene);
                boxCount++;
                //console.log(lane1);
                do
                    lane2 = getRandomInt(0, 2);
                while (lane1 == lane2);

                var mybox2 = makeBox((lane2 - 1) * 20, (groundEnd + 30) + (25 * i), scene);
				boxCount++;
            
        }

     //   if (lane1 == 0 || lane2 == 0) diagonalLeftDanger = true;
      //  if (lane1 == 2 || lane2 == 2) diagonalRightDanger = true;


        lastblocks = myblocks;

    }

}

function thirdLevel_createInfiniteScene(num, scene,ball,scorePanel)
{
	var g;
    if (num <= thirdLevel_currentPosition - 75 && num >= thirdLevel_currentPosition - 80)
    {
		if(count == 0)
		{
			count = getRandomInt(1,4);
			g = createSmallGround(groundEnd-15);
			groundEnd -= 30;
			thirdLevel_currentPosition -= 30;
		}

		else
		{
			count--;
			g = createGround(groundEnd-150);
			groundEnd -= 300;
			thirdLevel_currentPosition -= 300;
			loadBoxes(7,scene,groundEnd);
		}

		grounds.push(g);
		score += 6;
		if(score == 60*Level)
		{
			thirdLevel_ballSpeed += 0.35; 
			Level++;
		}
		scorePanel.innerHTML = "SCORE: " + score;		
	}
}

function deleteGround(num)
{
    if (num <= thirdLevel_currentPosition_2 - 600 && num >= thirdLevel_currentPosition_2 - 605)
    {
        grounds[thirdLevel_index].dispose();
        thirdLevel_currentPosition_2 -= 600;
		thirdLevel_index += 1;
		for(var i = boxArrayStart ; i < boxArrayStart+boxCount ; i++)
			thirdLevel_boxes[i].dispose();

		boxArrayStart += boxCount;
    }
}

function thirdLevel_createMovingBox_Y(xPosition,zPosition,scene) 
{
    var box = BABYLON.Mesh.CreateBox("movingBox_Y", 20, scene);
	box.position = new BABYLON.Vector3(xPosition,0,zPosition);
	box.diffuseColor = new BABYLON.Color3(0, 0, 0);
	var boxmat = new BABYLON.StandardMaterial("M1", scene);
	boxmat.diffuseColor = new BABYLON.Color3.White;
	boxmat.ambientColor = new BABYLON.Color3.Red;
	boxmat.diffuseTexture = new BABYLON.Texture("images/steel.jpg", scene);
	box.material = boxmat;
	box.checkCollisions = true;
	box.isPickable = false;
    var animationBox = new BABYLON.Animation("tutoAnimation", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
    keys.push({
		frame: 0,
		value: 5
	});

	keys.push({
		frame: 10,
		value: 10
	});

	keys.push({
		frame: 20,
		value: 15
    });
    
    keys.push({
		frame: 30,
		value: 20
	});

    keys.push({
		frame: 40,
		value: 15
    });

    keys.push({
		frame: 50,
		value: 10
    });
    
    keys.push({
		frame: 60,
		value: 5
    });
    
    animationBox.setKeys(keys);
    box.animations.push(animationBox);
    scene.beginAnimation(box, 0, 60, true);
	return box;
}

function thirdLevel_createHidingBox(xPosition,zPosition,scene) 
{
    var box = BABYLON.Mesh.CreateBox("movingBox_Z", 20, scene);
	box.position = new BABYLON.Vector3(xPosition,0,zPosition);
	box.diffuseColor = new BABYLON.Color3(0, 0, 0);
	var boxmat = new BABYLON.StandardMaterial("M1", scene);
	boxmat.diffuseColor = new BABYLON.Color3.White;
	boxmat.ambientColor = new BABYLON.Color3.Red;
	boxmat.diffuseTexture = new BABYLON.Texture("images/steel.jpg", scene);
	box.material = boxmat;
	box.checkCollisions = true;
	box.isPickable = false;
    var animationBox = new BABYLON.Animation("tutoAnimation", "material.alpha", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = [];
    keys.push({
		frame: 0,
		value: 1
	});

	keys.push({
		frame: 10,
		value: 1
	});

	keys.push({
		frame: 20,
		value: 1
    });
    
    keys.push({
		frame: 30,
		value: 1
	});

    keys.push({
		frame: 40,
		value: 1
    });

    keys.push({
		frame: 41,
		value: 0
    });
    
    keys.push({
		frame: 60,
		value: 0
    });
    
    keys.push({
		frame: 70,
		value: 0
    });
    
    keys.push({
		frame: 80,
		value: 0
	});

    animationBox.setKeys(keys);
    box.animations.push(animationBox);
	scene.beginAnimation(box, 0, 80, true);
	var event1 = new BABYLON.AnimationEvent(0, function() { box.checkCollisions = true; }, false);
	var event2 = new BABYLON.AnimationEvent(10, function() { box.checkCollisions = true; }, false);
	var event3 = new BABYLON.AnimationEvent(20, function() { box.checkCollisions = true; }, false);
	var event4 = new BABYLON.AnimationEvent(30, function() { box.checkCollisions = true; }, false);
	var event5 = new BABYLON.AnimationEvent(40, function() { box.checkCollisions = true; }, false);
	var event6 = new BABYLON.AnimationEvent(41, function() { box.checkCollisions = false; }, false);
	var event7 = new BABYLON.AnimationEvent(60, function() { box.checkCollisions = false; }, false);
	var event8 = new BABYLON.AnimationEvent(70, function() { box.checkCollisions = false; }, false);
	var event9 = new BABYLON.AnimationEvent(80, function() { box.checkCollisions = false; }, false);
	animationBox.addEvent(event1);
	animationBox.addEvent(event2);
	animationBox.addEvent(event3);
	animationBox.addEvent(event4);
	animationBox.addEvent(event5);
	animationBox.addEvent(event6);
	animationBox.addEvent(event7);
	animationBox.addEvent(event8);
	animationBox.addEvent(event9);
	return box;
}

function Explosion(player,scene){
    particleSystem = new BABYLON.ParticleSystem("particles", 10000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);
    particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
    particleSystem.emitter = player.position;
    particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 0);
    particleSystem.color2 = new BABYLON.Color4(1, 200/255, 0, 0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 2;
    particleSystem.emitRate = 10000;
    particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 8);
    particleSystem.direction2 = new BABYLON.Vector3(7, -8, -8);
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.start();
}

function createRec() 
{
	var rec = BABYLON.Mesh.CreateBox("rec", 2, scene);
	rec.diffuseColor = new BABYLON.Color3(0, 0, 0);
	var recmat = new BABYLON.StandardMaterial("M1", scene);
	recmat.diffuseColor = new BABYLON.Color3.White;
	recmat.ambientColor = new BABYLON.Color3.Red;
	recmat.diffuseTexture = new BABYLON.Texture("images/boxpic.jpg", scene);
	rec.material = recmat;
	rec.scaling.y = 4;
	rec.scaling.x = 18;
	rec.scaling.z = 8;
	rec.checkCollisions = true;
	rec.frontVector = new BABYLON.Vector3(0, 0, 0);

	rec.position.x = 7;
	rec.position.y = 45;
	rec.position.z = -220;
	return rec;
}

function boxmovement() 
{
	var animationBox = new BABYLON.Animation("tutoAnimation", "position.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
		BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
	// Animation keys
	var keys = [];
	keys.push({
		frame: 0,
		value: 0
	});

	keys.push({
		frame: 20,
		value: 10
	});

	keys.push({
		frame: 100,
		value: -20
	});

	animationBox.setKeys(keys);
	rec.animations.push(animationBox);
	scene.beginAnimation(rec, 0, 100, true);
}

function thirdLevel_reIntialize()
{
    thirdLevel_boxes = [];
    thirdLevel_hasPlayed = false;
    grounds = [];
    thirdLevel_currentPosition = 150;
    thirdLevel_currentPosition_2 = 150;
    groundEnd = -150;
    thirdLevel_index = 0;
    boxArrayStart = 0;
    boxCount = 0;
    count = 1;
    boxesIndex = 0;
    thirdLevel_hasFallen = false;
    thirdLevel_hasCollided = false;
    thirdLevel_ballSpeed = 1.5;
    lastblocks = 0;
    lane1 = 0;
    score = 0;
    Level = 1;
    isRightArrowPressed = false;
    isLeftArrowPressed = false;
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////