class RepositoryUtils {
  static transformRepositories(repos, userId) {
    return Array.isArray(repos)
      ? repos.map((repo) => {
          return {
            userId,
            repoId: repo.id,
            description: repo.description,
            name: repo.name,
            slug: repo.full_name,
            url: repo.html_url,
            username: repo.owner.login,
          };
        })
      : [];
  }
}

module.exports = RepositoryUtils;
