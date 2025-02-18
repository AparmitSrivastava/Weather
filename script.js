let valuesearch = document.getElementById("valuesearch")
let cityname = document.getElementById("city")
let temperature = document.getElementById("temperature")
let descr = document.querySelector(".description")
let cloud = document.getElementById("cloud")
let humid = document.getElementById("humid")
let press = document.getElementById("press")
let form  = document.getElementById("app")
let main = document.querySelector("main")


form.addEventListener("submit" , (e)=>{
    e.preventDefault();  //avoids refresh of the page
    if(valuesearch.value != ''){
        searchWeather();
    }           
})

let id = "9505fd1df737e20152fbd78cdb289b6a"
let url = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + id

const searchWeather = async() => {
    let x = await fetch(url + "&q=" + valuesearch.value)
    let data = await x.json();
    console.log(data);

    if(data.cod == 200){
        cityname.querySelector("figcaption").innerHTML = data.name;
        cityname.querySelector("img").src = 'https://flagsapi.com/'+data.sys.country+'/shiny/32.png'
        temperature.querySelector("img").src = 'https://openweathermap.com/img/wn/'+data.weather[0].icon +'@4x.png'
        temperature.querySelector("figcaption span").innerText = data.main.temp+ "°";
        descr.innerHTML = data.weather[0].description.replace(/\b\w/g, char => char.toUpperCase());
        cloud.innerText = data.clouds.all + "%";
        humid.innerText = data.main.humidity + "%"
        press.innerText = data.main.pressure + "Pa"
    }
    else{
        main.classList.add("error")
        setTimeout(()=>{
            main.classList.remove('error')
        },1000)
    }
    valuesearch.value = ''  //after the user has searched for info whether the search was success or not the iinput will clear to default
}

