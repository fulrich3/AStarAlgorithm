import Client from '../Client';

export default class HtmlButton {
    private client:Client;
    private title:string;
    private onClickFunction:Function;
    private element:HTMLButtonElement;
    private toggleMode = false;
    private toggleActive:boolean = false;

    constructor(client:Client,title:string,toggleMode:boolean,onClickFunction:Function){
        this.client = client;
        this.title = title;
        this.toggleMode = toggleMode;
        this.onClickFunction = onClickFunction;

        // Create HTML Button
        this.element = document.createElement("button");
        this.element.classList.add("htmlButton");
        this.element.innerHTML = this.title;
        this.client.parentHtmlElement.appendChild(this.element);

        // Add click event
        this.element.addEventListener("click", (e) => {
            this.onClickFunction();
            this.client.deactivateButtons();

            if(this.toggleMode){
                if(this.toggleActive){
                    this.element.classList.remove("active");
                    this.toggleActive=false;
                }else{
                    this.element.classList.add("active");
                    this.toggleActive=true;
                }
            }
        });
    }

    // Activate button
    activate(){
        if(this.toggleMode && !this.toggleActive){
            this.element.classList.add("active");
            this.toggleActive=true;
        }
    }

    // Deactivate button
    deactivate(){
        if(this.toggleMode && this.toggleActive){
            this.element.classList.remove("active");
            this.toggleActive=false;
        }
    }
}