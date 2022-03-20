import fetch from 'node-fetch';
import { ProgrammaInfo } from 'RaiPlaySound';

export async function fetchProgrammaAsync(programma: string) {
    const response = await fetch(`https://www.raiplaysound.it/programmi/${programma}.json`);
    return await response.json() as Promise<ProgrammaInfo>;
}
