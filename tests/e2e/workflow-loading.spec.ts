import { test, expect } from '@playwright/test';

const sampleWorkflow = {
  "nodes": [
    {
      "parameters": {},
      "id": "19946453-625d-4f81-9b1d-0f9c2d76a47a",
      "name": "When clicking \"Execute Workflow\"",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        460,
        460
      ]
    },
    {
      "parameters": {
        "url": "https://example.com/api"
      },
      "id": "e2e9c18b-5777-4c4c-8f8e-8a2a7a4f7e5b",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [
        680,
        460
      ]
    }
  ],
  "connections": {
    "When clicking \"Execute Workflow\"": {
      "main": [
        [
          {
            "node": "HTTP Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
};

test('loads workflow JSON and shows findings', async ({ page }) => {
  await page.goto('/');

  // Get the textarea and fill it with sample workflow
  const textarea = page.locator('textarea[placeholder="Paste your n8n workflow JSON here..."]').filter({ visible: true });
  await textarea.fill(JSON.stringify(sampleWorkflow, null, 2));

  // Wait for the results to appear. 
  // We expect at least some findings for an HTTP Request without retry logic (R1).
  // On desktop, ResultsPanel is visible on the right.
  
  // Check if findings are displayed. We look for the "Findings" heading or similar.
  // In ResultsPanel.tsx (which I'll assume exists), there should be something like "Findings (X)"
  
  const resultsHeading = page.locator('h2:has-text("Analysis")');
  await expect(resultsHeading).toBeVisible();

  // Check if at least one finding card is present
  // Finding cards have "Node ID: ..."
  const findingCard = page.locator('text=Node ID: e2e9c18b-5777-4c4c-8f8e-8a2a7a4f7e5b').first();
  await expect(findingCard).toBeVisible();
});
