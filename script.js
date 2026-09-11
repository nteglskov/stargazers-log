const list = document.getElementById('starred-list');
const status = document.getElementById('status');

function setStatus(message, isError = false) {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.setAttribute('role', isError ? 'alert' : 'status');
}

function createRepositoryItem(repo) {
  const item = document.createElement('li');
  item.className = 'starred-item';

  const header = document.createElement('div');
  header.className = 'repo-header';

  const link = document.createElement('a');
  link.className = 'repo-name';
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = repo.full_name;
  link.setAttribute('aria-label', `Open ${repo.full_name} on GitHub in a new tab`);

  const starTag = document.createElement('span');
  starTag.className = 'star-tag';
  starTag.textContent = `★ ${Number(repo.stargazers_count || 0).toLocaleString()}`;

  const description = document.createElement('p');
  description.className = 'repo-description';
  description.textContent = repo.description || 'No description provided.';

  const meta = document.createElement('div');
  meta.className = 'repo-meta';

  const language = document.createElement('span');
  language.className = 'repo-language';

  const languageDot = document.createElement('span');
  languageDot.className = 'language-dot';
  languageDot.style.background = getLanguageColor(repo.language);

  const languageText = document.createElement('span');
  languageText.textContent = repo.language || 'Unknown';

  language.append(languageDot, languageText);

  const date = document.createElement('span');
  const starDate = repo.starred_at ? new Date(repo.starred_at) : null;
  date.textContent = starDate && !Number.isNaN(starDate.getTime())
    ? `Starred on ${starDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}`
    : 'Starred recently';

  header.append(link, starTag);
  meta.append(language, date);
  item.append(header, description, meta);

  return item;
}

async function loadStarredRepos() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const repos = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      list.innerHTML = '';
      setStatus('No starred repositories yet.');
      const emptyItem = document.createElement('li');
      emptyItem.className = 'empty-state';
      emptyItem.textContent = 'No starred repositories yet.';
      list.appendChild(emptyItem);
      return;
    }

    const fragment = document.createDocumentFragment();
    repos.forEach((repo) => fragment.appendChild(createRepositoryItem(repo)));
    list.replaceChildren(fragment);
    setStatus(`${repos.length} starred repositories loaded.`);
  } catch (error) {
    list.innerHTML = '';
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-state';
    emptyItem.textContent = 'Unable to load starred repositories.';
    list.appendChild(emptyItem);
    setStatus('Unable to load starred repositories.', true);
    console.error('Failed to fetch repositories:', error);
  }
}

function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Shell: '#89e051',
    Vue: '#41b883'
  };

  return colors[language] || '#6e7781';
}

loadStarredRepos();
