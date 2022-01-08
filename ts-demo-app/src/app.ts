enum ProjectStatus {
    Active,
    Finished
}

interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus) {}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;
    constructor() {
        super();
    }
    static getInstance() {
        if(this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance
        }
    }
    
    addproject(title: string, description: string, noOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, noOfPeople, ProjectStatus.Active)
        this.projects.push(newProject);
        this.updateListenere()
    }

    moveProject(projId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj  => prj.id === projId);
        if(project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListenere()
        }
    }

    private updateListenere() {
        for(const listenerFn of this.listeners) {
            listenerFn(this.projects.slice()) // copy of array when any of the array changes
        }
    }
}
const projectState = ProjectState.getInstance();

//Validator
interface validatable {
    value: string | number;
    required?: boolean; // ? or boolean | undefined bothe are same
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number
}

function validate(validateInp: validatable) {
    let isValid = true;
    if(validateInp.required) {
        isValid = isValid && validateInp.value.toString().trim().length !== 0;
    }
    if(validateInp.minLength != null && typeof validateInp.value === 'string') {
        isValid = isValid && validateInp.value.length >= validateInp.minLength;
    }
    if(validateInp.maxLength != null && typeof validateInp.value === 'string') {
        isValid = isValid && validateInp.value.length <= validateInp.maxLength;
    }
    if(validateInp.min != null && typeof validateInp.min === 'number') {
        isValid = isValid && validateInp.value >= validateInp.min;
    }
    if(validateInp.max != null && typeof validateInp.min === 'number') {
        isValid = isValid && validateInp.value <= validateInp.max;
    }
    return isValid;
}

// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) { // _ coz we're not using then anywhere in th definition
    const originalMethod = descriptor.value;
    const adjustedMethod : PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjustedMethod;
}

//Generic Component class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEle: HTMLTemplateElement;
    hostEle: T;
    element: U

    constructor(templateId: string, hostId: string, insertAtBeginning: boolean, newEleId: string) {
        console.log(templateId,hostId)
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

class ProjectItem extends Component <HTMLUListElement, HTMLLIElement> implements Draggable {
    project : Project;

    get persons() {
        if(this.project.people === 1) {
            return '1 person'
        }
        else {
            return `${this.project.people} persons`;
        }
    }

    constructor(hostId: string, project: Project) {
        super('#single-project', '#'+hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    dragEndHandler(event: DragEvent): void {
        console.log(event)
    }

    configure(): void {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent(): void {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }
}

class projectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[]
    constructor(private type: 'active' | 'finished') {
        super('#project-list', '#app', false, `${type}-projects`)
        this.assignedProjects = [];
        this.configure()
        this.renderContent();
    }

    @autobind
    dragOverHandler(e: DragEvent): void {
        if(e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
            e.preventDefault();
            const ulEle = this.element.querySelector('ul')!;
            ulEle.classList.add('droppable');
        }
    }

    @autobind
    dropHandler(e: DragEvent): void {
        const projId = e.dataTransfer!.getData('text/plain');
        projectState.moveProject(projId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
        const ulEle = this.element.querySelector('ul')!;
        ulEle.classList.remove('droppable');
    }

    renderProjects() {
        const listEle = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEle.innerHTML = '';
        for(const proItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, proItem)
        }
    }

    configure(): void {
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
        projectState.addListener((projects: Project[]) => {
            const relevantProjs = projects.filter((proj) => {
                if(this.type === 'active') {
                    return proj.status === ProjectStatus.Active;
                }
                return proj.status === ProjectStatus.Finished
            });
            this.assignedProjects = relevantProjs;
            this.renderProjects();
        })
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInp = new ProjectInput();
const activeProjects = new projectList('active');
const finishedProjects = new projectList('finished');


