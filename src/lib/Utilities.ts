export function addTypedEventListener<T>(
    type: string,
    listener: (event: CustomEvent<T>) => void
) {
    document.addEventListener(type, listener as EventListener);
}

export function removeTypedEventListener<T>(
    type: string,
    listener: (event: CustomEvent<T>) => void
) {
    document.removeEventListener(type, listener as EventListener);
}
