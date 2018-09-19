import Map from '../Map';

export default class HtmlButton {
    private map:Map;
    private title:string;
    private onClickFunction:Function;

    constructor(map:Map,title:string,onClickFunction:Function){
        this.map = map;
        this.title = title;
        this.onClickFunction = onClickFunction;

        // Create HTML Button
        let newButtonElement = document.createElement("button");
        newButtonElement.className = "htmlButton";
        newButtonElement.innerHTML = this.title;
        this.map.parentHtmlElement.appendChild(newButtonElement);

        // Add click event
        newButtonElement.addEventListener("click", (e) => {
            this.onClickFunction();
        });

    }
}