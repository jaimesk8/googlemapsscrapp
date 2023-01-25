"use strict";

//read the enter key to press the button
$(document).keypress(function (e) {
  if (e.which == 13) {
    $("#getdata").click();
  }
}); //read de key after the search box

$("#search").keyup(function (event) {
  if (event.keyCode === 13) {
    $("#postid").click();
  }
}); //get element - fetch data to tables on client side 

var getBtn = document.getElementById('getdata');
getBtn.addEventListener('click', getInfo); //get element

var postBtn = document.getElementById('postid');
postBtn.addEventListener('click', postInfo); //function get data 

function getInfo(e) {
  //prevent to refesh the page
  e.preventDefault();
  var feedDisplay = document.querySelector("#data-output"); //getelement by id

  var feedDisplay1 = document.querySelector("#data-output1"); //getelement by id

  var feedDisplay2 = document.querySelector("#data-output2"); //getelement by id

  var feedDisplay3 = document.querySelector("#data-output3"); //getelement by id
  // Here the value is stored in variable. 
  //table rating 

  fetch('http://127.0.0.1:3000/table/rating').then(function (response) {
    return response.json();
  }).then(function (data) {
    data.forEach(function (element) {
      var article = "<tr>   <td>" + element.id_job + "</td>\n                                        <td>" + element.date.substring(0, 10) + "</td>\n                                        <td>" + element.name + "</td>\n                                        <td>" + element.avg_rating + "</td>\n                                </tr>"; //inject this into the div

      feedDisplay.insertAdjacentHTML("beforeend", article);
    }); // data

    console.log(data);
  }) //then data
  ["catch"](function (err) {
    return console.log(err);
  }); //table rating 

  fetch('http://127.0.0.1:3000/table/ratingorder').then(function (response) {
    return response.json();
  }).then(function (data) {
    data.forEach(function (element) {
      var article = "<tr>   <td>" + element.id_job + "</td>\n                                        <td>" + element.date.substring(0, 10) + "</td>\n                                        <td>" + element.name + "</td>\n                                        <td>" + element.avg_rating + "</td>\n                                </tr>"; //inject this into the div

      feedDisplay1.insertAdjacentHTML("beforeend", article);
    }); // data

    console.log(data);
  }) //then data
  ["catch"](function (err) {
    return console.log(err);
  });
} //get info 


function postInfo(e) {
  //prevent to refesh the page
  e.preventDefault(); //remove the load 

  spinner.removeAttribute('hidden');
  var feedDisplay = document.querySelector("#data-output"); //getelement by id
  // Here the value is stored in variable. 

  var x = $("#search").val();
  console.log(x); // document.getElementById("feed").innerHTML = x;
  //fetch post options    

  var options = {
    method: "POST",
    body: JSON.stringify({
      name: x
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
  fetch('http://127.0.0.1:3000/results', options) //,options)
  .then(function (response) {
    return response.json();
  }).then(function (data) {
    data.forEach(function (element) {
      var article = "<div><h3>" + element.name + "</h3>\n                                <p>" + element.avg_rating + "</p>\n                                <p>" + element.reviews + "</p>\n                                <p>" + element.address + "</p>\n                                <p>" + element.description + "</p>\n                                <p>" + element.website + "</p>\n                                <p>" + element.category + "</p>\n                                <p>" + element.timings + "</p>\n                                <p>" + element.phone_num + "</p>\n                                <p>" + element.extra_services + "</p>\n                                <p>" + element.latitude + "</p>\n                                <p>" + element.longitude + "</p>\n                                </div>"; //inject this into the div

      feedDisplay.insertAdjacentHTML("beforeend", article);
      spinner.setAttribute('hidden', '');
      console.log(data);
    }); // data
  }) //then data
  ["catch"](function (err) {
    return console.log(err);
  });
} //post info