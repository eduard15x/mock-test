console.log('Mock test initialized');

const messageElement = document.getElementById('message');

async function loadConfig() {
  try {
    // Fetch from Cloudflare Worker API (production)
    const response = await fetch('https://mock-test.devuard.com/api/config');
    if (response.ok) {
      const config = await response.json();
      messageElement.textContent = config.MOCK_KEY || 'MOCK_KEY not found';
      console.log('✓ Loaded config from Cloudflare Worker');
      return;
    }
  } catch (err) {
    console.warn('⚠ Cloudflare Worker not available:', err.message);
  }

  // Fallback: Try local .env file (development)
  try {
    const response = await fetch('/.env');
    if (response.ok) {
      const text = await response.text();
      const lines = text.split('\n');
      for (const line of lines) {
        if (line.startsWith('MOCK_KEY=')) {
          const value = line.split('=')[1].trim();
          messageElement.textContent = value;
          console.log('✓ Loaded config from .env file');
          return;
        }
      }
    }
  } catch (err) {
    console.warn('⚠ .env file not available:', err.message);
  }

  messageElement.textContent = 'MOCK_KEY not found';
  console.error('✗ Could not load MOCK_KEY from any source');
}

loadConfig();
