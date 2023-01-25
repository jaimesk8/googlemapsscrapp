//read the enter key to press the button
$(document).keypress(function(e){
    if (e.which == 13){
        $("#getdata").click();
    }
});

//read de key after the search box
$("#search").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#postid").click();
    }
});


//get element - fetch data to tables on client side 
const getBtn = document.getElementById('getdata');
getBtn.addEventListener('click', getInfo);

//get element
const postBtn = document.getElementById('postid');
postBtn.addEventListener('click', postInfo)


//function get data 
function getInfo(e){
    //prevent to refesh the page
    e.preventDefault()

        const feedDisplay = document.querySelector("#data-output") //getelement by id
        const feedDisplay1 = document.querySelector("#data-output1") //getelement by id
        const feedDisplay2 = document.querySelector("#data-output2") //getelement by id
        const feedDisplay3 = document.querySelector("#data-output3") //getelement by id
        // Here the value is stored in variable. 

        //table rating 
        fetch('http://127.0.0.1:3000/table/rating')
        .then(response => {return response.json()})
        .then(data => {
                data.forEach(element => {
                const article = `<tr>   <td>` + element.id_job + `</td>
                                        <td>` + element.date.substring(0,10) + `</td>
                                        <td>` + element.name + `</td>
                                        <td>` + element.avg_rating + `</td>
                                </tr>`;
                    //inject this into the div
                    feedDisplay.insertAdjacentHTML("beforeend", article)
                })// data
                console.log(data)
            })  //then data
        .catch(err => console.log(err)) 

        //table rating 
        fetch('http://127.0.0.1:3000/table/ratingorder')
        .then(response => {return response.json()})
        .then(data => {
                data.forEach(element => {
                const article = `<tr>   <td>` + element.id_job + `</td>
                                        <td>` + element.date.substring(0,10) + `</td>
                                        <td>` + element.name + `</td>
                                        <td>` + element.avg_rating + `</td>
                                </tr>`;
                    //inject this into the div
                    feedDisplay1.insertAdjacentHTML("beforeend", article)
                    
                })// data
                console.log(data)
            })  //then data
        .catch(err => console.log(err)) 
}//get info 


function postInfo(e){
    //prevent to refesh the page
e.preventDefault()
//remove the load 
spinner.removeAttribute('hidden');

const feedDisplay = document.querySelector("#data-output") //getelement by id
// Here the value is stored in variable. 
var x = $("#search").val();
console.log(x)
// document.getElementById("feed").innerHTML = x;
//fetch post options    
const options = {
    method: "POST",
    body: JSON.stringify({
    name: x
    }),
    headers: { "Content-Type": "application/json" }
    };


fetch('http://127.0.0.1:3000/results',options)//,options)
.then(response => {return response.json()})
.then(data => {
        data.forEach(element => {
        const article = `<div><h3>` + element.name + `</h3>
                                <p>` + element.avg_rating + `</p>
                                <p>` + element.reviews + `</p>
                                <p>` + element.address + `</p>
                                <p>` + element.description + `</p>
                                <p>` + element.website + `</p>
                                <p>` + element.category + `</p>
                                <p>` + element.timings + `</p>
                                <p>` + element.phone_num + `</p>
                                <p>` + element.extra_services + `</p>
                                <p>` + element.latitude + `</p>
                                <p>` + element.longitude + `</p>
                                </div>`;
            //inject this into the div
            feedDisplay.insertAdjacentHTML("beforeend", article)
            spinner.setAttribute('hidden', '');
            console.log(data)
        })// data
    })  //then data
.catch(err => console.log(err)) 

}//post info 


