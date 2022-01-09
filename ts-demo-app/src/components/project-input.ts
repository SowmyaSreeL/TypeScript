// <reference path="base-component.ts" />
// <reference path="../decorators/autobind.ts" />
// <reference path="../utils/validation.ts" />
// <reference path="../state/project.ts" />
// namespace App {
import {Component} from './base-component';
import { validate, validatable } from '../utils/validation';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project';
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputEle: HTMLInputElement;
    descInputEle: HTMLInputElement;
    peopleInputEle: HTMLInputElement;
    
    constructor() {
        super('#project-input', '#app', true, 'user-input');
        this.titleInputEle = this.element.querySelector('#title')! as HTMLInputElement;
        this.descInputEle = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputEle = this.element.querySelector('#people')! as HTMLInputElement;
        this.configure();
    }

    gatherUserInput(): [string, string, number] | void {
        const titleEntered = this.titleInputEle.value;
        const descEntered = this.descInputEle.value;
        const peopleEntered = this.peopleInputEle.value;

        const titleValidatable: validatable = {
            value: titleEntered,
            required: true,
        }
        const descValidatable: validatable = {
            value: descEntered,
            required: true,
            minLength: 5
        }
        const peopleValidatable: validatable = {
            value: peopleEntered,
            required: true,
            min: 1,
            max: 5
        }
        
        if(
            !validate(titleValidatable) ||
            !validate(descValidatable) ||
            !validate(peopleValidatable)
            ) {
            alert('Invalid input, please retuen again');
        }
        else {
            return [titleEntered, descEntered, parseInt(peopleEntered)];
        }
    }

    @autobind
    private submitHandler(e: Event) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)) { //check if we get the tuple or void
            const [title, desc, people] = userInput;
            projectState.addproject(title, desc, people);
            this.clearInputs();
        }
    }

    private clearInputs() {
        this.titleInputEle.value = '';
        this.descInputEle.value  = '';
        this.peopleInputEle.value = '';
    }

    renderContent(): void {
        
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
}
// }