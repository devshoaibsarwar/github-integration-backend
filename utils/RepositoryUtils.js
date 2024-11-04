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
            isIncluded: false,
          };
        })
      : [];
  }

  static separatePullsAndIssuesByUniqueAuthors(pulls) {
    const authorCounts = {};

    pulls.forEach((pull) => {
      const authorName = pull.user.login;

      if (authorCounts[authorName]) {
        authorCounts[authorName].count += 1;
      } else {
        authorCounts[authorName] = {
          count: 1,
          id: pull.user.id
        };
      }
    });

    return authorCounts;
  }

  static separateCommitsByUniqueAuthors(commits) {
    const authorCounts = {};

    commits.forEach((commit) => {
      const authorName = commit.author?.login || commit.commit.author.name;

      if (authorCounts[authorName]) {
        authorCounts[authorName].count += 1;
      } else {
        authorCounts[authorName] = {
          count: 1,
          id: commit.author?.id || commit.commit.author.email
        };
      }
    });

    return authorCounts;
  }
}

module.exports = RepositoryUtils;
