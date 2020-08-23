
//Create variables here
var dog,dogimg, happyDog,database,foodStock,feed,addFood,fedTime,foodObj;
var addFramecount,readState,vaccine,vaccineIMG,bedroom,garden,washroom,currenttime;
var name, lastFed, FoodS;
var gameState;

function preload()
{
  //load images here
  dogimg = loadImage("dogImg.png");
  happyDog = loadImage("lazy.png");
  vaccineImg = loadImage("dogVaccination.png")
  bedroom=loadImage("BedRoom.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("washroom.png");
}

function setup() 
{
  database=firebase.database();
	createCanvas(1000,500);

  foodObj=new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
 
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data)
  {
    lastFed=data.val();
  })
  // console.log(lastFed);

  /*input=createInput("Name Pet: ");
  input.position(1050,150);
  var button=createButton("play");
  button.position(1200,150);
  var message=createElement('h2');
  button.mousePressed(function()
   { 
             input.hide();
         button.hide();
         name=input.value();
         */

         feed = createButton("Feed ");
         feed.position(650,95);
         feed.mousePressed(feedDog);
       // feed.mousePressed(goToDog);
         addFood=createButton("Add Food");
         addFood.position(800,95);
         addFood.mousePressed(addFoods);
       //  message.html("Meet your new pet bruno");
         
        var message=createElement('h2')
         message.html("Meet your new pet bruno")
         message.position(1050,135);
         vaccine=createSprite(140,380);
         vaccine.addImage(vaccineImg) ;
         vaccine.scale=0.3;
 

   dog=createSprite(800,250);
   dog.addImage(dogimg);
   dog.scale=0.3;

  readState=database.ref('gameState')
  readState.on("value",function(data)
  {
    gameState=data.val();
  })
}


function draw() 
{
 background(46,139,87);
  //add styles here

  if (foodObj.foodStock>=0 && World.frameCount<addFramecount+10)
  {
    console.log("foodStock");
    image(foodObj.image,700,250,50,50);
  }

  currenttime=hour();
  if (currenttime===(lastFed+1))
  {
    update("playing");
    foodObj.garden();
  }
  else if (currenttime===(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if (currenttime===(lastFed+3))
  {
    update("bathing");
    foodObj.washroom();
  }
  else
  {
    update("Hungry");
    foodObj.display();
  }


  if (gameState!="Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
    vaccine.remove();
  }
  else
  {
    feed.show();
    addFood.show();
    dog.addImage(dogimg);
    vaccine.addImage(vaccineImg);
  }

  drawSprites();

  
  fill("black");
  text("Food remaining: "+FoodS,350,40);
  console.log(FoodS);

  
  textSize(18);
  if(lastFed>=12)
  {
    if(lastFed===12)
    text("last feed : "+lastFed+" PM",350,80);
    else
    text("last feed : "+lastFed%12+" PM",350,80);
  }
  else if (lastFed===0)
  {
    text("Last Feed : 12 AM",350,80);
  }
  else
  {
    console.log(lastFed);
    text("Last Feed : ",+lastFed+" AM",350,80);
  }

}




function readStock(data)
{
 FoodS=data.val();
 console.log(FoodS);
 foodObj.updateFoodStock(FoodS);
}

/*
function writeStock(x)
{
.
  if (x<=0)
  {
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}
*/
function feedDog()
{
  FoodS--;
  dog.addImage(happyDog);
  addFramecount=World.frameCount;
 // foodObj.velocityX=5;
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
  
}

function addFoods()
{
  
  FoodS++;
  database.ref('/').update({
    Food:FoodS
  })
  foodObj.updateFoodStock(FoodS);
} 

function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}
