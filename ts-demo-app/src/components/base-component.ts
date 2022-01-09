//Generic Component class
// namespace App {
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        templateEle: HTMLTemplateElement;
        hostEle: T;
        element: U
    
        constructor(templateId: string, hostId: string, insertAtBeginning: boolean, newEleId: string) {
            this.templateEle = document.querySelector(templateId)! as HTMLTemplateElement;
            this.hostEle = document.querySelector(hostId)! as T;
            const nodeToBeImported = document.importNode(this.templateEle.content, true);
            this.element = nodeToBeImported.firstElementChild as U;
            if(newEleId) {
                this.element.id = newEleId;
            }
            this.attach(insertAtBeginning)
        }
    
        private attach(insertAtBeginning: boolean) {
            this.hostEle.insertAdjacentElement(insertAtBeginning ? 'afterbegin' :'beforeend', this.element)
        }
    
        abstract configure():void;
        abstract renderContent(): void;
    }
// }