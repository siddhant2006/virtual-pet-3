var dog, happyDog, database, foodS, foodStock;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var gameSate, readState;
var bedImg, gardenImg, washRoomImg;


function preload()
{

  dogImg = loadImage("Dog.png");
  hdogImg = loadImage("happydog.png");

  bedImg = loadImage("BedRoom.png");
  gardenImg = loadImage("Garden.png");
  washRoomImg = loadImage("WashRoom.png");
}


function setup() {
	createCanvas(1000, 500);
  

  dog = createSprite(870, 250, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.2;


  database = firebase.database();

  var foodStockPos = database.ref('food');
  foodStockPos.on("value", readStock);

  foodObj = new Food();

  fedTime = database.ref('Feeding Time');
  fedTime.on("value", function(data){

    lastFed = data.val();
  });

  feed = createButton("Feed the Dog");
  feed.position(760, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(880, 95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameSate = data.val()
  });

}



//draw
function draw() {  
 background(46, 139, 87);

  
 currentTime = hour();
 if(currentTime ==(lastFed+1)){
   update("Playing");
   foodObj.garden();
 }else if(currentTime==(lastFed+2)){
   update("Sleeping");
   foodObj.bedroom();
 }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
   update("Bathing");
   foodObj.washroom();
 }else{
   update("Hungry");
   foodObj.display();
 }

 
  if(keyWentDown(UP_ARROW)){

    //writeStock(foodS);
    //dog.addImage(hdogImg);
    }


  foodObj.display();


  if(gameSate!= "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }


  drawSprites();

}




function addFoods(){

    foodS++;

    database.ref('/').update({
      food : foodS
    });
    
}


  function feedDog(){
    dog.addImage(hdogImg);

    foodObj.updateFoodStock(foodObj.getFoodStock()- 1);
    database.ref('/').update({
      food: foodObj.getFoodStock(),
      fedTime: hour()
    })
    }



//function for reading the values from DB
function readStock(data){

  foodS =  data.val();
  foodObj.updateFoodStock(foodS);
}


//function to write the values in the DB
 function writeStock(x){

    if(x <= 0){
      x = 0;
    }
    else{
      x = x-1;
    }

     database.ref('/').update({
       food:x       
     }) 
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

