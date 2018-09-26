import HtmlPathfinderEditor from '../HtmlPathfinderEditor';

export default class HtmlButton {
    private htmlPathfinderEditor:HtmlPathfinderEditor;
    private title:string;
    private onClickFunction:Function;
    private element:HTMLButtonElement;
    private toggleMode = false;
    private toggleActive:boolean = false;

    constructor(htmlPathfinderEditor:HtmlPathfinderEditor,title:string,toggleMode:boolean,onClickFunction:Function){
        this.htmlPathfinderEditor = htmlPathfinderEditor;
        this.title = title;
        this.toggleMode = toggleMode;
        this.onClickFunction = onClickFunction;

        // Create HTML Button
        this.element = document.createElement("button");
        this.element.classList.add("htmlButton");
        this.element.innerHTML = this.title;
        this.htmlPathfinderEditor.getParentHtmlElement().appendChild(this.element);

        // Add click event
        this.element.addEventListener("click", (e) => {
            this.onClickFunction();
            this.htmlPathfinderEditor.deactivateButtons();

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