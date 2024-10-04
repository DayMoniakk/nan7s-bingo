let currentLanguage: string = 'en';

export function loadLanguages(): void {
    const storedLanguage = localStorage.getItem('language');

    if (storedLanguage === null) {
        localStorage.setItem('language', currentLanguage);
    }

    setLanguage(storedLanguage || currentLanguage);
}

export function getCurrentLanguage(): string {
    return currentLanguage;
}

export function setLanguage(language: string): void {
    if (currentLanguage === language) return;

    localStorage.setItem('language', language);
    currentLanguage = language;

    document.dispatchEvent(new CustomEvent('languageChanged', {}));
}

export function setNextLanguage(): void {
    switch (currentLanguage) {
        case 'en':
            setLanguage('fr');
            break;
        case 'fr':
            setLanguage('en');
            break;
    }
}