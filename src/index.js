const port = 3000;
const express = require('express');
const app = express();
const mysql = require('mysql2');
const puppeteer = require('puppeteer');
const cors = require('cors');
app.use(cors())


//converter data to json como resposta á nossa aplicação
app.use(express.json());
//para obter os dados submetidos no post
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'))


app.get('/table/rating', (req,res) => {
  executaSQL1('select jobs.id_job, jobs.date, datas.name, datas.avg_rating from jobs inner join datas on jobs.id_job=datas.id_job where jobs.id_job=datas.id_job and jobs.date like "2023-01-24" order by datas.avg_rating desc',res);
  //executaSQL('SELECT id, name, avg_rating, reviews, address, description FROM datas where avg_rating between 1 and 5 order by avg_rating desc limit 5', res);
});

app.get('/table/ratingorder', (req,res) => {
  executaSQL1('select jobs.id_job, jobs.date, datas.name, datas.avg_rating from jobs inner join datas on jobs.id_job=datas.id_job where jobs.id_job=datas.id_job and jobs.date like "2023-01-15" order by datas.avg_rating desc',res);
});


//method results POST
app.post('/results', (req,res) => {

  //variavel de pesquisa 
  var name =req.body.name;
  
  console.log("/results", name);

  (async () => {
    let browser = null;
    try {
      browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      // Reset the viewport for more results in single page of google maps.
      await page.setViewport({ width: 1920, height: 1080 })
      // Visit maps.google.com
      await page.goto('https://maps.google.com')
      // Wait till the page loads and an input field with id searchboxinput is present
      await page.waitForSelector('#searchboxinput', { waitUntil: page.click('[aria-label="Aceitar tudo"]')})
      // Simulate user click
      await page.click('#searchboxinput')
      // Type our search query
      await page.type('#searchboxinput', name );
      ////INSERTSSS//
      //insert into pesquisa
      let id = 0; 
      executaSQL(`INSERT INTO pesquisa (id_pesquisa,name) VALUES ("${ id }","${ name }")`, res)
      console.log("add to database pesquisa")
      //insert into jobs
      let today = new Date();
      var scrapdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //+ element.avg_rating; 
      executaSQL(`INSERT INTO jobs (id_job,id_pesquisa,date) VALUES ("${ id }",(select max(id_pesquisa) from pesquisa),"${ scrapdate }")`, res)
      console.log("add to database jobs")
  
  
      // Simulate pressing Enter key
      await page.keyboard.press('Enter');
  
      // Wait for the page to load results.
      await page.waitForSelector('a[href^="https://www.google.com/maps/place/');
      // Scrooll to the final page
      await scrollTillTheEnd(page);  
      // Get our final structured data
      const finalData = await getData(page);
  
      //savedata to mysql database 
      finalData.forEach(element => {
        let id = 0;
        var id_scrap = id + 1 ;
        const name = element.name;
        const avg_rating = element.avg_rating;
        const reviews = element.reviews;
        const address = element.address;
        const description = element.description;
        const website = element.website;
        const category = element.category;
        const phone_num = element.phone_num;
        const extra_services = element.extra_services;
        const latitude = element.latitude;
        const longitude = element.longitude; 
        let today = new Date();
        var time = ""; //today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var scrapdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //+ element.avg_rating; 
    
        //add data to datas table
        executaSQL(`INSERT INTO datas (id,name,id_job,avg_rating,reviews,address,description,website,category,
        phone_num,extra_services,latitude,longitude,scrapdate) VALUES ("${ id }","${ name }",(select max(id_job) from jobs),"${ avg_rating }","${ reviews }","${ address }","${ description }",
        "${ website }","${ category }","${ phone_num }","${ extra_services }","${ latitude }","${ longitude }"),"${ scrapdate }")`, res) 
  })//foreach
    console.log("Added to table datas!")
    //console.log("Final data", finalData);
    res.json(finalData);
    browser.close();
    return finalData;

  } catch (error) {
    console.log(error)
  }

  })();
});//results post


//method results GET 
app.get('/get', (req,res) => {

  console.log("/get");

  (async () => {
  let browser = null;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // Reset the viewport for more results in single page of google maps.
    await page.setViewport({ width: 1920, height: 1080 })
    // Visit maps.google.com
    await page.goto('https://maps.google.com')
    // Wait till the page loads and an input field with id searchboxinput is present
    await page.waitForSelector('#searchboxinput', { waitUntil: page.click('[aria-label="Aceitar tudo"]')})
    // Simulate user click
    await page.click('#searchboxinput')
    // Type our search query
    var name = 'pizzaria, roma'; ////our Search 
    // Type our search query
    await page.type('#searchboxinput', name );
    //insert into pesquisa
    let id = 0; 
    executaSQL(`INSERT INTO pesquisa (id_pesquisa,name) VALUES ("${ id }","${ name }")`, res)
    console.log("add to database pesquisa")
    //insert into jobs
    let today = new Date();
    var scrapdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //+ element.avg_rating; 
    executaSQL(`INSERT INTO jobs (id_job,id_pesquisa,date) VALUES ("${ id }",(select max(id_pesquisa) from pesquisa),"2023-01-15")`, res)
    console.log("add to database jobs")
    // Simulate pressing Enter key
    await page.keyboard.press('Enter');
    // Wait for the page to load results.
    await page.waitForSelector('a[href^="https://www.google.com/maps/place/');
    // Scrooll to the finla page
    await scrollTillTheEnd(page);  
    // Get our final structured data
    const finalData = await getData(page);

    //savedata to mysql database 
    finalData.forEach(element => {
      let id = 0;
      var id_scrap = id + 1 ;
      const name = element.name;
      const avg_rating = element.avg_rating;
      const reviews = element.reviews;
      const address = element.address;
      const description = element.description;
      const website = element.website;
      const category = element.category;
      const phone_num = element.phone_num;
      const extra_services = element.extra_services;
      const latitude = element.latitude;
      const longitude = element.longitude; 
      let today = new Date();
      var time = ""; //today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var scrapdate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //+ element.avg_rating; 
      
      //add data to datas table
      executaSQL(`INSERT INTO datas (id,name,id_job,avg_rating,reviews,address,description,website,category,
      phone_num,extra_services,latitude,longitude,scrapdate) VALUES ("${ id }","${ name }",(select max(id_job) from jobs),"${ avg_rating }","${ reviews }","${ address }","${ description }",
      "${ website }","${ category }","${ phone_num }","${ extra_services }","${ latitude }","${ longitude }","${ scrapdate }")`, res) 
})//foreach
    console.log("Added to datas table!")

    console.log("Final data", finalData);
    res.json(finalData);    
    browser.close();
    return finalData;

  } catch (error) {
    console.log(error)
  }

})();

});//results get

// These are class names of some of the specific elements in these cards
  // Scrapes the data from the page and them to de databases
  const getData = async(page)  => {
    let maps_data = await page.evaluate(() => {
      
    return Array.from(document.querySelectorAll(".Nv2PK")).map((el) => {
        const link = el.querySelector("a.hfpxzc").getAttribute("href");
        return {
        name: el.querySelector(".qBF1Pd")?.textContent.trim(),
        avg_rating: el.querySelector(".MW4etd")?.textContent.trim(),
        reviews: el.querySelector(".UY7F9")?.textContent.replace("(", "").replace(")", "").trim(),
        address: el.querySelector(".W4Efsd:last-child > .W4Efsd:nth-of-type(1) > span:last-child")?.textContent.replaceAll("·", "").trim(),
        description: el.querySelector(".W4Efsd:last-child > .W4Efsd:nth-of-type(2)")?.textContent.replace("·", "").trim(),
        website: el.querySelector("a.lcr4fd")?.getAttribute("href"),
        category: el.querySelector(".W4Efsd:last-child > .W4Efsd:nth-of-type(1) > span:first-child")?.textContent.replaceAll("·", "").trim(),
        timings: el.querySelector(".W4Efsd:last-child > .W4Efsd:nth-of-type(3) > span:first-child")?.textContent.replaceAll("·", "").trim(),
        phone_num: el.querySelector(".W4Efsd:last-child > .W4Efsd:nth-of-type(3) > span:last-child")?.textContent.replaceAll("·", "").trim(),
        extra_services: el.querySelector(".qty3Ue")?.textContent.replaceAll("·", "").replaceAll("  ", " ").trim(),
        latitude: link.split("!8m2!3d")[1].split("!4d")[0],
        longitude: link.split("!4d")[1].split("!16s")[0],
        link,
        dataId: link.split("1s")[1].split("!8m")[0],
        };
        
    });
    });
    return maps_data;
    } 

//Scrolls till the end of the page
const scrollTillTheEnd = async (page) => {
    let endOfPage = false;
    let count = 0;
    do {
        const { _count, _endOfPage } = await page.evaluate((opts) => {
        const { selectors: getData, count } = opts;
        const allListings = document.querySelectorAll('a[href^="https://www.google.com/maps/place/');
        const newItemsCount = (allListings ? allListings.length : 0) - count;
        
        if (allListings && allListings.length) {
          allListings[allListings.length - 1].scrollIntoView();
        }
  
        const _endOfPage = newItemsCount > 0;
  
        return {
          _count: allListings.length,
          _endOfPage
        };
      }, { selectors: getData, count });
      count = _count;
      endOfPage = _endOfPage;
  
      await page.waitForTimeout(3000);
  
    } while (endOfPage);
}

app.listen(port, () => console.log('Server running at http://127.0.0.1:3000/'));

//ligação à base de dados
function executaSQL(sqlQry, res){
  const connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "YOURUSERNAME", //change 
      password: "YOURPASSWORD", //change 
      database: "YOURDATABASE" //change 
  });

  connection.query(sqlQry, (error, results, fields) => {
   //res.json(results); //if want to post comment this res.json, error because from set heather that alread exist
  });
}

//ligação à base de dados
function executaSQL1(sqlQry, res){
  const connection = mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "YOURUSERNAME", //change 
      password: "YOURPASSWORD", //change 
      database: "YOURDATABASE" //change 
  });

  connection.query(sqlQry, (error, results, fields) => {
    res.json(results); //if want to post comment this res.json, error because from set heather that alread exist
  });
}
