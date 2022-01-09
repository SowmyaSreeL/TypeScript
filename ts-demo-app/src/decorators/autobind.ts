namespace App {
    // autobind decorator
    export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) { // _ coz we're not using then anywhere in th definition
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
}