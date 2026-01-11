
export const generateSVG = (name: string, role: string, project: string) => {
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    // Clean Web3 Certificate Design
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" style="font-family: 'Courier New', monospace;">
  <!-- Background -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0052FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EBF0FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#ffffff" />
  <rect x="20" y="20" width="760" height="560" fill="none" stroke="#0052FF" stroke-width="2" rx="20" />
  
  <!-- Header -->
  <rect x="0" y="0" width="800" height="20" fill="#0052FF" />
  <circle cx="50" cy="80" r="30" fill="#0052FF" opacity="0.1" />
  <circle cx="750" cy="520" r="60" fill="#0052FF" opacity="0.05" />

  <!-- Logo/Brand -->
  <text x="400" y="100" text-anchor="middle" font-size="24" font-weight="bold" fill="#0052FF" letter-spacing="4">BASED REPUTATION</text>
  <rect x="350" y="115" width="100" height="2" fill="#000000" opacity="0.1" />

  <!-- Main Content -->
  <text x="400" y="200" text-anchor="middle" font-size="16" fill="#666666">THIS PROOF CERTIFIES THAT</text>
  
  <text x="400" y="260" text-anchor="middle" font-size="40" font-weight="bold" fill="#111111">${name}</text>
  
  <text x="400" y="320" text-anchor="middle" font-size="16" fill="#666666">HAS CONTRIBUTED AS</text>
  
  <text x="400" y="360" text-anchor="middle" font-size="28" font-weight="bold" fill="#0052FF">${role}</text>
  
  <text x="400" y="410" text-anchor="middle" font-size="16" fill="#666666">FOR</text>
  
  <text x="400" y="450" text-anchor="middle" font-size="24" fill="#111111">${project}</text>

  <!-- Footer -->
  <rect x="100" y="500" width="600" height="1" fill="#eeeeee" />
  
  <text x="150" y="540" font-size="12" fill="#999999">VERIFIED ONCHAIN</text>
  <text x="650" y="540" text-anchor="end" font-size="12" fill="#999999">${date}</text>
</svg>`.trim();
};

export const generateTokenURI = (name: string, role: string, project: string) => {
    const svg = generateSVG(name, role, project);

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
            { trait_type: "Contributor", value: name }
        ]
    };

    // Convert Metadata to Base64
    const jsonBase64 = Buffer.from(JSON.stringify(metadata)).toString('base64');
    return `data:application/json;base64,${jsonBase64}`;
};
