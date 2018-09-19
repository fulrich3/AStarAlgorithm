import Client from '../Client';

export default class HtmlButton {
    private client:Client;
    private title:string;
    private onClickFunction:Function;

    constructor(client:Client,title:string,onClickFunction:Function){
        this.client = client;
        this.title = title;
        this.onClickFunction = onClickFunction;

        // Create HTML Button
        let newButtonElement = document.createElement("button");
        newButtonElement.className = "htmlButton";
        newButtonElement.innerHTML = this.title;
        this.client.parentHtmlElement.appendChild(newButtonElement);

        // Add click event
        newButtonElement.addEventListener("click", (e) => {
            this.onClickFunction();
        });
    }
}