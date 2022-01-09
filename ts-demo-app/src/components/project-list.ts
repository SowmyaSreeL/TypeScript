/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../models/drag-drop.ts" />
namespace App {
    export class projectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
}