class Paragraph{ // Class qui contient un paragraphe
    constructor(arrTexts){
        this.html = null;
        this.parent = null;

        this.lineTexts = arrTexts;

        for(let i = 0; i < this.lineTexts.length; i++){
            let currentLine = this.lineTexts[i];
            currentLine.parent = this;
        }
    }

    linkTo(selector, clear = false) {
        this.html = document.createElement("p");
        this.parent = document.querySelector(selector);
        if(clear){ // Permet de récupérer et de supprimer le paragrpahe si l'élément en contient déjà un
            const oldParagraph = this.parent.querySelector('p');
            if(oldParagraph !== null){
                // On récupère la largeur et la hauteur pour que l'élément conserve sa taille malgré le retrait/l'ajout de texte
                const height = this.parent.offsetHeight;
                this.parent.removeChild(oldParagraph);
                this.parent.style.height = height + "px";
            }
        }
        this.parent.append(this.html);
    }

    update(){
        for(let i = 0; i < this.lineTexts.length; i++){
            let currentLine = this.lineTexts[i];

            if(!currentLine.finished){
                currentLine.update();
                break;
            }
        }

        this.renderText();
    }

    renderText(){
        this.html.innerHTML = "";
        for(let i = 0; i < this.lineTexts.length; i++){
            let currentLine = this.lineTexts[i];
            const content = currentLine.getContent();

            if(typeof content === "string"){
                this.html.innerHTML += content;
            }
            else{
                this.html.appendChild(content);
            }
        }
    }

    get isFinish(){
        let response = true;

        for(const line of this.lineTexts){
            if(!line.finished){
                response = false;
                break;
            }
        }
        return response;
    }
}

class TextContainer{ // Class qui contient un morceau d'une ligne de texte
    constructor(p_content, p_class = null){
        this.text = p_content; // Texte à afficher
        this.visibleText = ""; 
        this.class = p_class; // Class CSS à ajouter au texte

        this.parent = null;
        this.html = null;
        
        this.started = false;
        this.finished = false;
        this.progress = 0;
    }

    update(){
        if(!this.started){
            this.started = true;

            if(this.class != null){
                this.html = document.createElement("span");
                
                const arrClass = this.class.split(' ');

                for(let i = 0; i < arrClass.length; i++){
                    this.html.classList.add(arrClass[i]);
                }
            }
        }
        else{
            if(this.progress < this.text.length){
                this.visibleText += this.text[this.progress];
                this.progress++;
            }
            else if(!this.finished){
                this.finished = true;
            }
        }
    }

    getContent(){
        if(this.html !== null){
            this.html.innerHTML = this.visibleText;
            return this.html;
        }
        else{
            return this.visibleText;
        }
    }
}