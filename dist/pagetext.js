

//cr image button
var div = document.createElement("div");
div.setAttribute("id","pressbutton");
div.style.width=0;
div.style.height=0;

//text paragraphs

const parts={
    "nosecone":"This is the nosecone.",
    "diffuser":"This is the diffuser.",
    "powertrain":"The powertrain systems underwent major architectural changes, leading to a 16% decrease in unsprung mass compared to previous years. By implementing a new gearset design, we were able to seamlessly incorporate a carbon fiber wheel. This not only reduced weight but also allowed for the motor to be embedded within the wheel, improving airflow into the side diffuser and enhancing overall performance.",
    "control arms":"This year, the control arms were designed with stiffness and a high minimum factor of safety in mind. We focused on integration with the car, mounting to the monocoque chassis with precision machined aluminum tabs, and designing for clearances with our powertrain. Parts were made from 4130 steel, using our CNC lathe, blowtorching, and welding to manufacture.",
    "dashboard":"This year, we've focused on improving ergonomics for our drivers and reliability for our engineers. Building upon feedback from our drivers, this is the first time we've incorporated switches for enhanced control to ensure intuitive accessibility, while heightened reliability guarantees seamless functionality. Our emphasis on mass reduction and streamlined integration is reflected by customizing PCBs to minimize weight and simplify wiring, resulting in a sleeker, more efficient dashboard design.",
    "steering":"This was the first year we designed a half front enclosure. With our smallest-ever custom daughter board going into the wheel, designing efficiently around the electronics, while maintaining structural, functional, and aesthetic integrity was the focus. We also experimented with SLS printed enclosures for the first time, allowing for a very smooth and detailed wheel with knurling details on the grips, button labels inset into the prints themselves, and a team logo. Driver feedback and input were a priority throughout the design process. Details like the tilt of buttons, tapering of grips to expand towards where the base of a palm would sit, and knurling grip patterns were tested and iterated on.",
    "seat":"This is the seat.",
    "chassis":"24e's chassis is CMR’s first ever carbon fiber chassis. There are three unique carbon fiber weaves along with 199 mounting points for all systems on the car. 24e's chassis has 167 separate machined aluminum inserts to serve as mounting points. Each insert consists of two flanged components installed with epoxy adhesive on either side of the chassis wall. Team members from every department worked countless hours on our CNC lathe to machine the over 330 individual pieces that comprise our chassis inserts. These inserts let the many systems on our car mount to the chassis, bolstering the compressive strength of the mounting point.",
}


function numloopadd(num){
    if((num+1)<Object.keys(parts).length){
        num=num+1;
        return num;
    }
    else{
        return 0;
    }
}
function numloopsub(num){
    if((num)>0){
        num=num-1;
        return num;
    }
    else{
        return (Object.keys(parts).length)-1;
    }
}


//spoken words
let icon = document.getElementById("speakerimg").getAttribute("alt");
let ttspart = document.getElementById("tts");
let spoken = new SpeechSynthesisUtterance();
spoken.lang = 'en-US';
spoken.rate = 1.2;

document.getElementById("tts").addEventListener("click", playsound);
function playsound(){
    icon = document.getElementById("speakerimg").getAttribute("alt");
    ttspart = document.getElementById("tts");
    console.log(icon);
    if (icon=="volume on button"){
        console.log("shhss");
        ttspart.innerHTML='<img id="speakerimg" src="public/volume off.svg" alt = "volume off button"/>';
        var texttospeak;
        spoken.text= document.getElementById("bodytxt").textContent;
        speechSynthesis.speak(spoken);
    }
    else{
        console.log("shpooart");

        ttspart.innerHTML='<img id="speakerimg" src="public/volume on.svg" alt = "volume on button"/>';
        speechSynthesis.cancel();
    }
}
spoken.onend = (event)=>  {
    console.log("shart");
    ttspart.innerHTML='<img id="speakerimg" src="public/volume on.svg" alt = "volume on button"/>';
};

