export class Country {
    name: string;
    alpha3Code: string;
    capital: string;
    borders: string[];
    population: number;
    region: string;
    offlineBorders: Country[] = [];
    isStoredInOfflineMode: Boolean = false;
}