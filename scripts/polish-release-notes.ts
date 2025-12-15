import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OWNER = process.env.GITHUB_REPOSITORY?.split('/')[0] || '';
const REPO = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const TAG = process.env.TAG_NAME || '';

if (!OWNER || !REPO || !TAG) {
  console.error('Missing required environment variables (GITHUB_REPOSITORY, TAG_NAME)');
  process.exit(1);
}

async function main() {
  console.log(`Polishing release notes for ${OWNER}/${REPO} ${TAG}...`);

  // 1. Get Release
  const release = await octokit.repos.getReleaseByTag({
    owner: OWNER,
    repo: REPO,
    tag: TAG,
  });

  if (!release.data) {
    throw new Error('Release not found');
  }

  const originalBody = release.data.body || '';

  // 2. Generate polished notes with OpenAI
  const prompt = `
    You are a technical writer for the FlowLint project.
    Rewrite the following GitHub release notes to be more engaging, grouped by feature/impact, and easier to read.
    Highlight the business value of changes.
    Keep it concise but professional.
    Do NOT invent features. Use only the provided changelog.
    The changelog might contain "chore" or "ci" commits - you can summarize them as "Internal Improvements" or skip them if trivial.
    
    Original Changelog:
    ${originalBody}
  `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4o', // Or gpt-3.5-turbo if 4o not available
  });

  const polishedBody = completion.choices[0].message.content;

  if (!polishedBody) {
    console.warn('AI returned empty body, skipping update.');
    return;
  }

  // 3. Update Release
  await octokit.repos.updateRelease({
    owner: OWNER,
    repo: REPO,
    release_id: release.data.id,
    body: polishedBody,
  });

  console.log('Release notes updated successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});