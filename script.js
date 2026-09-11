const list = document.getElementById('starred-list');

async function loadStarredRepos() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const repos = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      list.innerHTML = '<li class="empty-state">No starred repositories yet.</li>';
      return;
    }

    list.innerHTML = repos
      .map((repo) => {
        const languageColor = getLanguageColor(repo.language);
        return `
          <li class="starred-item">
            <div class="repo-header">
              <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noreferrer">
                ${repo.full_name}
              </a>
              <span class="star-tag">★ ${repo.stargazers_count.toLocaleString()}</span>
            </div>
            <p class="repo-description">${repo.description || 'No description provided.'}</p>
            <div class="repo-meta">
              <span class="repo-language"><span class="language-dot" style="background:${languageColor};"></span>${repo.language || 'Unknown'}</span>
              <span>Starred on ${new Date(repo.starred_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
          </li>
        `;
      })
      .join('');
  } catch (error) {
    list.innerHTML = '<li class="empty-state">Unable to load starred repositories.</li>';
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
