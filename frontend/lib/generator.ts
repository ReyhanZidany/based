
export const generateSVG = (name: string, role: string, project: string, issuer: string) => {
  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Clean Web3 Certificate Design
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" style="font-family: 'Courier New', monospace;">
  <!-- Background -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f0f0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#ffffff" />
  <rect x="20" y="20" width="760" height="560" fill="none" stroke="#000000" stroke-width="4" />
  
  <!-- Branding Tag (Top Left) -->
  <rect x="20" y="20" width="120" height="40" fill="#000000" />
  <text x="80" y="45" text-anchor="middle" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="1">BASED.ID</text>

  <!-- Main Content -->
  <text x="400" y="200" text-anchor="middle" font-size="16" fill="#666666" letter-spacing="2">THIS PROOF CERTIFIES THAT</text>
  
  <text x="400" y="260" text-anchor="middle" font-size="32" font-weight="bold" fill="#000000" text-decoration="underline">${name}</text>
  
  <text x="400" y="320" text-anchor="middle" font-size="16" fill="#666666" letter-spacing="2">HAS CONTRIBUTED AS</text>
  
  <text x="400" y="360" text-anchor="middle" font-size="40" font-weight="bold" fill="#0052FF">${role}</text>
  
  <text x="400" y="410" text-anchor="middle" font-size="16" fill="#666666" letter-spacing="2">FOR</text>
  
  <text x="400" y="450" text-anchor="middle" font-size="24" fill="#000000" font-weight="bold">${project}</text>

  <!-- Footer Metadata (Vertical List) -->
  <line x1="60" y1="500" x2="300" y2="500" stroke="#000000" stroke-width="2" />

  <!-- Item 1: ISSUER -->
  <text x="60" y="525" font-size="12" fill="#000000" font-weight="bold">ISSUER:</text>
  <text x="140" y="525" font-size="12" fill="#000000" font-family="monospace">${issuer}</text>

  <!-- Item 2: DATE -->
  <text x="60" y="545" font-size="12" fill="#000000" font-weight="bold">DATE:</text>
  <text x="140" y="545" font-size="12" fill="#000000">${date}</text>

  <!-- Item 3: NETWORK -->
  <text x="60" y="565" font-size="12" fill="#000000" font-weight="bold">NETWORK:</text>
  <text x="140" y="565" font-size="12" fill="#0052FF" font-weight="bold">BASE SEPOLIA</text>

</svg>`.trim();
};

export const generateTokenURI = (name: string, role: string, project: string, issuer: string) => {
  const svg = generateSVG(name, role, project, issuer);

  // Convert SVG to Base64
  const imageBase64 = Buffer.from(svg).toString('base64');
  const imageURI = `data:image/svg+xml;base64,${imageBase64}`;

  // Create Metadata JSON
  const metadata = {
    name: `${role} at ${project}`,
    description: `Verified ${role} contribution for ${project}. Issued on Based Reputation.`,
    image: imageURI,
    attributes: [
      { trait_type: "Role", value: role },
      { trait_type: "Project", value: project },
      { trait_type: "Contributor", value: name },
      { trait_type: "Issuer", value: issuer }
    ]
  };

  // Convert Metadata to Base64
  const jsonBase64 = Buffer.from(JSON.stringify(metadata)).toString('base64');
  return `data:application/json;base64,${jsonBase64}`;
};
