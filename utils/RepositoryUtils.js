class RepositoryUtils {
  static transformRepositories(repos, userId) {
    return Array.isArray(repos)
      ? repos.map((repo) => {
          const isOrganizationRepo = repo.owner.type === "Organization";

          return {
            userId,
            repoId: repo.id,
            description: repo.description,
            name: repo.name,
            slug: repo.full_name,
            url: repo.html_url,
            username: repo.owner.login,
            isOrganizationRepo,
            isIncluded: false
          };
        })
      : [];
  }
}

module.exports = RepositoryUtils;
