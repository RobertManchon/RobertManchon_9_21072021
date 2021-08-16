import $ from 'jquery';
global.$ = global.jQuery = $;

import {localStorageMock} from "./src/__mocks__/localStorage";
export function setLocalStorage (user) {
	Object.defineProperty(window, 'localStorage', { value: localStorageMock })
	window.localStorage.setItem('user', JSON.stringify({ type: user, email: 'johndoe@email.com' }))
}
/*A la suite d'un problème lors du test sur le bug de tri de date j’ai une erreur qui indique que le localstorage n’est pas définit.
Solution trouvée:
	Définir un local storage correspondant à l'utilisateur et pour ne pas avoir à le refaire a chaque fois
création de  cette fonction dans setup-jest.js qu'il suffit d'importer ensuite dans les tests.*/
