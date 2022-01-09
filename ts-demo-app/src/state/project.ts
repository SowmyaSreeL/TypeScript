namespace App {
    type Listener<T> = (items: T[]) => void;

    class State<T> {
        protected listeners: Listener<T>[] = [];
        addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn);
        }
    }

    export class ProjectState extends State<Project> {
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
    export const projectState = ProjectState.getInstance();
}