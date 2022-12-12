class DisplayContent {
constructor () {
	this.app = document.getElementById('app');
	this.container = this.createElement ('div', 'container');

	this.searchContainer = this.createElement ('div', 'search-container');

	this.searchLine = this.createElement('div' , 'search-line');
	this.searchInput = this.createElement('input' , 'search-input');
	this.searchLine.append(this.searchInput);
	
	this.searchList = this.createElement('ul', 'search-list');

	this.searchContainer.append(this.searchLine);
	this.searchContainer.append(this.searchList);
	
	this.savedReposContainer = this.createElement ('div', 'saved-repos-container');
	this.savedReposList = this.createElement('ul', 'saved-repos-list');
	this.savedReposContainer.append(this.savedReposList);
	
	this.container.append(this.searchContainer);
	this.container.append(this.savedReposContainer);
	this.app.append(this.container);
	this.savedRepos =[]
}

createElement (elTag, elClass) {
const el = document.createElement(elTag);
if (elClass) {
	el.classList.add(elClass);
}
return el;
}

createSearchRepo (repoData) {
const repoItem = this.createElement('li', 'search-list__repo-item');
repoItem.textContent = repoData.name;
this.searchList.append(repoItem);

repoItem.addEventListener('click', this.saveItem.bind(this, repoData));
}


saveItem(data) {
	if (!this.savedRepos.includes(data.id)) {
	this.savedRepos.push(data.id)

	const savedRepoItem = this.createElement('li', 'saved-repos-list__repo-item');
	let repoItemInner = this.createElement('div','repo-item__info');
	
   let repoItemName = this.createElement('div','repo-item__name');
	repoItemName.textContent = `Name : ${data.name}`;

	let repoItemOwner = this.createElement('div','repo-item__owner');
	repoItemOwner.textContent = `Owner : ${data.owner.login}`;

	let repoItemStars = this.createElement('div','repo-item__stars');
	repoItemStars.textContent = `Stars : ${data.stargazers_count}`;

	let close = this.createElement('div', 'repo-item__close');
	savedRepoItem.classList.add(`repo-id:${data.id}`);

	repoItemInner.append(repoItemName);
	repoItemInner.append(repoItemOwner);
	repoItemInner.append(repoItemStars);
	savedRepoItem.append(close);

	savedRepoItem.append(repoItemInner);
	
	this.savedReposList.append(savedRepoItem);
	this.searchInput.value = '';
	this.searchList.textContent = '';
	savedRepoItem.addEventListener('click', (e) => {
	if (e.target === close) {
		let numId = e.target.closest('li').classList[1];
		numId = Number(numId.slice(8));
		let a = this.savedRepos.filter(el => el != numId);
		this.savedRepos = a;
		e.target.closest('li').remove();
	}
})

}

}
}

class Action {
	constructor (displayedContent) {
		this._displayedContent = displayedContent;

		this._displayedContent.searchInput.addEventListener('keyup', this.debounce(this.searchRepos.bind(this), 500))
	}

	async searchRepos() {
		if (this._displayedContent.searchInput.value) {
			this.clearReposSearch()

			try {
				return await fetch(`https://api.github.com/search/repositories?q=${this._displayedContent.searchInput.value}&per_page=5`)
				.then((res) => {
					res.json().then(res => res.items.forEach(repo => this._displayedContent.createSearchRepo(repo))).catch(e => e)
				})
			} catch(e) {
				console.log(e)
			}
			

	}
		this.clearReposSearch()
	}
clearReposSearch() {
	this._displayedContent.searchList.textContent = '';
}

 debounce (fn, debounceTime) {
   let debounceTimer;
   return function () {
		const context = this;
		const args = arguments;
       clearTimeout (debounceTimer);
       debounceTimer = setTimeout(() => fn.apply(context,args), debounceTime);
   }
}

}

new Action (new DisplayContent())

