//* Variables : 
    const pauseBetweenParagraph = 800; // Pause entre l'affichage de deux paragraphes (en millisecondes)

    let running = false; // Indique à notre programme s'il tourne
    let paragraphs = [];
    let activeParagraph = -1;
    
    // HTML elements
    let body;
    let startingBubble;
    let next;
    let haloContainer;
    let firstList;
    let submitButton;
    // Variables pour le scrolling (automatique ou utilisateur via la roulette de la souris)
    let currentScroll = 0, maxScroll = 0;
    let scrollTarget = 0;

    let fadeInterval;
    let gotoNext;
    let progress = 0;
    let chapter = 0;
//*/

window.onload = ()=>{
    body = document.querySelector("body");
    startingBubble = document.getElementById("start");
    haloContainer = new HaloContainer(body);
    submitButton = document.getElementById("submitEmail");
    submitButton.addEventListener('click', (event)=>{
        console.log(event);
        event.preventDefault();
        sendMail();
        });
    setInterval(update, 30);
    run();
};

window.addEventListener('wheel', (e)=>{
    const delta = (e.deltaY) / 2;
    
    if(body !== undefined){  
        currentScroll = constrain( (currentScroll + delta), 0, maxScroll);
        scrollTarget = currentScroll;
        updateScroll();
    }
});
window.addEventListener('click', ()=>{ 
    nextChapter();
});
window.addEventListener('keydown', (e)=>{
    const keyCode = e.keyCode;
    const key = e.key;
    // console.log("keyCode : " + keyCode + " - key : " + key);
    if(key === 'p' || key === 'P'){
        pause();
    }
    else if(key === 'ArrowUp'){
        defineScrollTarget(0);
    }
    else if(key === 'ArrowDown'){
        defineScrollTarget(maxScroll);
    }
    else if( key === ' '){
        nextChapter();
    }
});

const nextChapter = ()=>{
    if(gotoNext !== undefined){
        clearTimeout(gotoNext);
        gotoNext = undefined;
    }

    if(chapter == 1 && activeParagraph == 2){
        defineScrollTarget(window.innerHeight * 1.3);
        chapter++;
    }
    else if(chapter == 2 && activeParagraph == 5 && paragraphs[activeParagraph].isFinish){
        defineScrollTarget(window.innerHeight * 2.6);
        chapter++;
        activeParagraph++;
    }
    else if(chapter == 3 && activeParagraph == 9 && paragraphs[activeParagraph].isFinish){
        defineScrollTarget(window.innerHeight * 3.9);
        chapter++;
    }
};
// Fonctions utilitaires
const update = ()=>{
    if(running){
        haloContainer.update();
        haloContainer.render();
        updateTextManager();
        updateScroll();
    }
};
const updateTextManager = ()=>{
    if(chapter == 1){
        if(activeParagraph < 2){
            paragraphs[activeParagraph].update();
            
            if(paragraphs[activeParagraph].isFinish && next === undefined){
                next = setTimeout(()=>{
                    activeParagraph++;
                    next = undefined;
                }, 700);
            }
        }
        else if(gotoNext === undefined){
            gotoNext = setTimeout(() => {
                nextChapter();
            }, 3000);
        }
    }
    else if( ((chapter == 2 && activeParagraph >= 2) || (chapter == 3  && activeParagraph >= 5)) && notScrolling() ){
        if(!paragraphs[activeParagraph].isFinish){
            paragraphs[activeParagraph].update();
        }
        else if( (chapter == 2 && activeParagraph < 5) || (chapter == 3 && activeParagraph < 9) ){
            let currentItem = paragraphs[activeParagraph +1].html.parentElement;
            if(currentItem.style.animation !== "reveal-paragraph 2s linear forwards"){
                currentItem.style.animation = "reveal-paragraph 2s linear forwards";
                currentItem.pseudoStyle(":before", "animation", "reveal-circle 2s linear forwards");
                
                currentItem.addEventListener('animationend', (e)=>{
                    if(e.animationName === "reveal-paragraph"){
                        if(next === undefined){
                            next = setTimeout(()=>{
                                activeParagraph++;
                                next = undefined;
                            }, 700);
                        }
                    }
                });
            }
        }
        else if(gotoNext === undefined){
            gotoNext = setTimeout(() => {
                nextChapter();
            }, 3000);
        }
    }
};
const pause = () => running = !running;
const stop = () => running = false;
const run = () => running = true;

const showMustGoOn = ()=>{ // Lance la présentation
    if(activeParagraph < 0){
        if(startingBubble !== undefined){
            activeParagraph = 0;
            setParagraphs();
            
            startingBubble.style.backgroundColor = "white";
            startingBubble.style.border = "none";
            
            if(fadeInterval === undefined){
                fadeInterval = setInterval(()=>{
                    startingBubble.style.background = "radial-gradient(at 50% 50%, transparent "+ progress +"%, white 100%)";
                    progress++;
                    
                    if(progress >= 100){
                        startingBubble.style.display = "none";
                        deleteFadeInterval();
                        chapter++;
                    }
                }, 5);
            }
        }
    }
};

const deleteFadeInterval = ()=>{
    if(fadeInterval !== undefined){
        clearInterval(fadeInterval);
        fadeInterval = undefined;
        progress = 0;
    }
};

const setParagraphs = ()=>{ // Définit le texte à afficher, et où l'afficher
    paragraphs.push( new Paragraph([
        new TextContainer("Bonjour "),
        new TextContainer("Ankama", "uppercase name"),
        new TextContainer(", je me présente...")
    ]));
    paragraphs.push( new Paragraph([
        // new TextContainer("Je m'appelle "),
        // new TextContainer("Steve Van Essche", "name"),
        // new TextContainer(" et je suis un aspirant développeur, actuellement en formation chez "),
        // new TextContainer("BeCode", "name"),
        // new TextContainer(".")
        new TextContainer("Je suis un jeune Tofu du nom de "),
        new TextContainer("Steve Van Essche", "name"),
        new TextContainer(" !<br>Développeur en devenir, je suis actuellement en formation chez "),
        new TextContainer("BeCode", "name"),
        new TextContainer(".")
    ]) );

    paragraphs.push( new Paragraph([
        new TextContainer("Je vous contacte car je suis "),
        new TextContainer("à la recherche d'un stage", "darken"),
        new TextContainer(", et "),
        new TextContainer("j'aimerai énormément réaliser mon stage chez vous", "darken"),
        new TextContainer(", et ce pour les raisons suivantes...")
    ]) );

    paragraphs.push(
        new Paragraph([
            new TextContainer("J'apprécie beaucoup ce que vous faites", "darken"),
            new TextContainer(" et je trouve que l'influence d'Ankama pousse la création française dans la bonne direction et encourage de nombreux créatifs.")
        ])
    );
    paragraphs.push(
        new Paragraph([
            new TextContainer("Mon souhait a toujours été de "),
            new TextContainer("travailler dans la conception de jeu vidéo", "darken"),
            new TextContainer(".<br>Même si pour l'instant j'en suis encore loin, mon objectif est toujours le même !")
        ])
    );
    paragraphs.push(
        new Paragraph([
            new TextContainer("J'ai vu que vous aviez dans vos cartons un "),
            new TextContainer("projet de launcher en Node.js", "darken"),
            new TextContainer(".<br>C'est la techno que j'apprends en ce moment et sur laquelle je compte me spécialiser.")
        ])
    );

    paragraphs.push(
        new Paragraph([
            new TextContainer("En tant que stagiaire, quelles sont "),
            new TextContainer("mes qualités ?", "darken")
        ])
    );
    paragraphs.push(
        new Paragraph([
            new TextContainer("Bien que je travaille volontier en équipe, je suis quelqu'un d'"),
            new TextContainer("autonome", "darken"),
            new TextContainer(".")
        ])
    );
    paragraphs.push(
        new Paragraph([
            new TextContainer("Je suis curieux et toujours partant pour en "),
            new TextContainer("apprendre d'avantage", "darken"),
            new TextContainer("!")
        ])
    );
    paragraphs.push(
        new Paragraph([
            new TextContainer("J'attache une grande importance à réaliser "),
            new TextContainer("un code propre, lisible et maintenable", "darken"),
            new TextContainer(".")
        ])
    );

    paragraphs[0].linkTo(".text-container");
    paragraphs[1].linkTo(".text-container");

    paragraphs[2].linkTo(".container.filled>div:first-child", true);
    paragraphs[3].linkTo("#why-you>li:first-child");
    paragraphs[4].linkTo("#why-you>li:nth-child(2)");
    paragraphs[5].linkTo("#why-you>li:last-child");

    paragraphs[6].linkTo(".container.empty>div:first-child", true);
    paragraphs[7].linkTo("#why-me>li:first-child");
    paragraphs[8].linkTo("#why-me>li:nth-child(2)");
    paragraphs[9].linkTo("#why-me>li:last-child");
};

const nextItem = ()=>{ // Passe à l'item suivant dans une liste
    if( paragraphs[activeParagraph].isFinish && ((chapter == 2 && activeParagraph < 5) || (chapter == 3 && activeParagraph < 9)) ){
        currentItem.addEventListener('animationend', (e)=>{
            if(e.animationName === "reveal-paragraph"){
                activeParagraph++;
            }
        });
    }
};

const defineScrollTarget = (newValue)=>{
    scrollTarget = newValue;
    if(maxScroll < scrollTarget){
        maxScroll = scrollTarget;
    }
};
const updateScroll = ()=>{ // Gère le scrolling de la page (qui passe par un déplacement du body plutôt que par un véritable scroll en fait)
    if(!notScrolling()){
        currentScroll = (currentScroll * 0.9 + scrollTarget * 0.1);
        if(Math.abs(currentScroll - scrollTarget) < 1){
            currentScroll = scrollTarget;
        }
    }

    body.style.top = -(currentScroll) + "px";
};
const notScrolling = ()=> (currentScroll == scrollTarget);

const sendMail = ()=>{
    let emailData = {};
    let elements = [
        document.getElementsByName("email_name")[0],
        document.getElementsByName("email_adress")[0],
        document.querySelector("input:checked"),
        document.getElementsByName("email_message")[0]
    ];
    const propertiesName = ["name", "adress", "agrement", "message"];
    let valid = true;
    let data = "";

    for(let i = 0; i < propertiesName.length; i++){
        if(elements[i] !== undefined && elements[i] !== null){
            if(elements[i].value == ""){
                valid = false;
                break;
            }
            else{
                emailData[propertiesName[i]] = elements[i].value;
                data += propertiesName[i] + "=" + emailData[propertiesName[i]];
                if(i < propertiesName.length - 1){
                    data += "&";
                }
            }
        }
    }

    if(valid){
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', '/sendmail?' + data, true);
        httpRequest.send();
    
        httpRequest.onreadystatechange = (event)=>{
            if(httpRequest.readyState == 4){
                if(httpRequest.status == 200){
                    console.log(event);
                }
                else{
                    console.log("Ohoh... We have a problem :(");
                }
            }
        };
    }
};


let lastScreenY;
window.addEventListener('touchmove', (e)=>{
    const screenY = e.touches[0].screenY;
    if(lastScreenY === undefined){
        lastScreenY = screenY;
    }
    const delta = (lastScreenY - screenY);
    
    console.log(delta);
    if(body !== undefined){  
        currentScroll = constrain( (currentScroll + delta), 0, maxScroll);
        scrollTarget = currentScroll;
        updateScroll();
    }
    lastScreenY = screenY;
});
window.addEventListener('touchend', (e)=>{
    lastScreenY = undefined;
});